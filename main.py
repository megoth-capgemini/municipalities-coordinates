import uvicorn
from fastapi import FastAPI
from rdflib import Graph, URIRef, Literal, Namespace
from rdflib.namespace import RDF, SKOS, DC
from starlette.requests import Request
from starlette.responses import PlainTextResponse, JSONResponse
from whoosh.searching import Results

from search import get_searcher, search_municipality_name

FORMAT_JSONLD = "application/ld+json"
FORMAT_RDFXML = "application/rdf+xml"
FORMAT_TURTLE = "text/turtle"

SCHEMA = Namespace("https://schema.org/")
AMV = Namespace("https://w3id.org/amv#")

app = FastAPI()
searcher = get_searcher()


def search_linked_response(request: Request, results: Results):
    graph = Graph()

    for result in results:
        municipality = URIRef(result.get("municipality"))
        identifier = Literal(result.get("id"))
        name = Literal(result.get("name"))
        lat = Literal(result.get("lat"))
        long = Literal(result.get("long"))
        score = Literal(result.score)
        graph.add((municipality, RDF.type, SKOS.Concept))
        graph.add((municipality, DC.identifier, identifier))
        graph.add((municipality, SKOS.prefLabel, name))
        graph.add((municipality, SCHEMA.latitude, lat))
        graph.add((municipality, SCHEMA.longitude, long))
        graph.add((municipality, AMV.accuracy, score))

    media_format = request.headers.get("Accept")
    return PlainTextResponse(graph.serialize(format=media_format,
                                             context={
                                                 "amv": str(AMV),
                                                 "dc": str(DC),
                                                 "kommunenummer": "https://register.geonorge.no/sosi-kodelister/inndelinger/inndelingsbase/kommunenummer/",
                                                 "schema": str(SCHEMA),
                                                 "skos": str(SKOS),
                                             }), media_type=media_format)


@app.get("/name/{query}")
def search_municipality(request: Request, query: str):
    results = search_municipality_name(searcher, query)

    media_format = request.headers.get("Accept")
    if media_format == FORMAT_JSONLD or media_format == FORMAT_RDFXML or media_format == FORMAT_TURTLE:
        return search_linked_response(request, results)

    return JSONResponse([{
        "id": result.get("id"),
        "name": result.get("name"),
        "lat": result.get("lat"),
        "long": result.get("long"),
        "url": result.get("municipality"),
        "score": result.score,
    } for result in results])


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
