import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rdflib import Graph, URIRef, RDF, SKOS, DC, Literal
from starlette.requests import Request
from starlette.responses import JSONResponse, HTMLResponse, PlainTextResponse
from starlette.staticfiles import StaticFiles
from whoosh.searching import Results

from search import search_municipality_name, search_municipality_coords, open_index, get_graph, \
    serialize, SCHEMA, AMV

FORMAT_JSONLD = "application/ld+json"
FORMAT_RDFXML = "application/rdf+xml"
FORMAT_TURTLE = "text/turtle"

app = FastAPI()
index = open_index()
webapp = open("./dist/index.html", "r").read()


def parse_format(accept: str):
    formats = list(filter(lambda f: accept.find(f) != -1, [FORMAT_JSONLD, FORMAT_RDFXML, FORMAT_TURTLE]))
    is_ld_request = len(formats) > 0
    return formats[0] if is_ld_request else FORMAT_JSONLD, is_ld_request


def search_response(request: Request, results):
    media_format = request.headers.get("Accept")
    requested_format, is_ld_request = parse_format(media_format)
    return PlainTextResponse(content=get_linked_response(results, requested_format),
                             media_type=requested_format) if is_ld_request else JSONResponse([{
        "id": result["id"],
        "name": result["name"],
        "lat": result["lat"],
        "long": result["long"],
        "url": result["url"],
        "score": result["score"],
    } for result in results])


@app.get("/")
def read_frontpage():
    return HTMLResponse(content=webapp)


@app.get("/graph")
def read_graph(request: Request):
    requested_format, is_ld_request = parse_format(request.headers.get("Accept"))
    return PlainTextResponse(serialize(graph=get_graph(), format=requested_format), media_type=requested_format)


@app.get("/coords/{lat}/{long}")
def search_municipality_by_coords(request: Request, lat: float, long: float):
    results = search_municipality_coords(lat, long)
    return search_response(request, results)


from urllib.parse import unquote


@app.get("/name/{query}")
def search_municipality_by_name(request: Request, query: str):
    decoded_query = unquote(query)
    results = search_municipality_name(index, query_string=decoded_query)
    return search_response(request, results)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/", StaticFiles(directory="./dist"), name="public")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


def get_linked_response(results: Results, format: str):
    graph = Graph()

    for result in results:
        municipality = URIRef(result.get("url"))
        graph.add((municipality, RDF.type, SKOS.Concept))
        graph.add((municipality, DC.identifier, (Literal(result["id"]))))
        graph.add((municipality, SKOS.prefLabel, (Literal(result["name"]))))
        graph.add((municipality, SCHEMA.latitude, (Literal(result["lat"]))))
        graph.add((municipality, SCHEMA.longitude, (Literal(result["long"]))))
        graph.add((municipality, AMV.accuracy, (Literal(result["score"]))))

    return graph.serialize(format=format,
                           context={
                               "amv": str(AMV),
                               "dc": str(DC),
                               "kommunenummer": "https://register.geonorge.no/sosi-kodelister/inndelinger/inndelingsbase/kommunenummer/",
                               "schema": str(SCHEMA),
                               "skos": str(SKOS),
                           })
