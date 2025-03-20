import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, HTMLResponse, PlainTextResponse
from starlette.staticfiles import StaticFiles
from urllib.parse import unquote
from search import search_municipality_name, search_municipality_coords, open_index, get_graph, \
    serialize, get_linked_response

FORMAT_JSONLD = "application/ld+json"
FORMAT_RDFXML = "application/rdf+xml"
FORMAT_TURTLE = "text/turtle"
MEDIA_FORMATS = [FORMAT_JSONLD, FORMAT_RDFXML, FORMAT_TURTLE]

app = FastAPI()
index = open_index()
webapp = open("./dist/index.html", "r").read()


def parse_format(accept: str):
    formats = list(filter(lambda f: accept.find(f) != -1, MEDIA_FORMATS))
    is_ld_request = len(formats) > 0
    return formats[0] if is_ld_request else FORMAT_JSONLD, is_ld_request


def search_response(request: Request, results):
    media_format = request.headers.get("Accept")
    requested_format, is_ld_request = parse_format(media_format)
    if not is_ld_request:
        return JSONResponse([{
            "id": result["id"],
            "name": result["name"],
            "lat": result["lat"],
            "long": result["long"],
            "url": result["url"],
            "score": result["score"],
        } for result in results])
    graph = get_linked_response(results, str(request.url))
    serialization = serialize(graph, requested_format)
    return PlainTextResponse(content=serialization, media_type=requested_format)


@app.get("/")
def read_frontpage():
    return HTMLResponse(content=webapp)


@app.get("/graph")
def read_graph(request: Request):
    requested_format, is_ld_request = parse_format(request.headers.get("Accept"))
    return PlainTextResponse(serialize(graph=get_graph(), media_format=requested_format), media_type=requested_format)


@app.get("/coords/{lat}/{long}")
def search_municipality_by_coords(request: Request, lat: float, long: float):
    results = search_municipality_coords(lat, long)
    return search_response(request, results)


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
