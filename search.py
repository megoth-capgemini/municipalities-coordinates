from rdflib import Graph, URIRef, RDF, SKOS, DC, Literal, Namespace
from starlette.requests import Request
from starlette.responses import PlainTextResponse
from whoosh.searching import Searcher, Results

SCHEMA = Namespace("https://schema.org/")
AMV = Namespace("https://w3id.org/amv#")

g = Graph()
g.parse('kommunenummer-koordinater.ttl')

from whoosh.index import create_in
from whoosh.fields import Schema, TEXT, NUMERIC

schema = Schema(url=TEXT(stored=True),
                name=TEXT(stored=True),
                id=NUMERIC(stored=True),
                lat=NUMERIC(stored=True),
                long=NUMERIC(stored=True))
ix = create_in(".swhoosh", schema)
writer = ix.writer()
municipalities = g.query("""
        PREFIX dc: <http://purl.org/dc/terms/>
        PREFIX schema: <https://schema.org/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        
        SELECT ?url ?name ?id ?lat ?long
        WHERE {
            ?url rdf:type skos:Concept .
            ?url skos:prefLabel ?name . 
            ?url dc:identifier ?id . 
            ?url schema:latitude ?lat . 
            ?url schema:longitude ?long . 
        }
        """)
for municipality in municipalities:
    writer.add_document(url=str(municipality.url),
                        name=str(municipality.name),
                        id=int(municipality.id),
                        lat=float(municipality.lat),
                        long=float(municipality.long))
writer.commit()

from whoosh.qparser import QueryParser
from whoosh.query import FuzzyTerm


class MyFuzzyTerm(FuzzyTerm):
    def __init__(self, fieldname, text, boost=1.0, maxdist=1, prefixlength=1, constantscore=True):
        super(MyFuzzyTerm, self).__init__(fieldname, text, boost, maxdist, prefixlength, constantscore)


def get_linked_response(request: Request, results: Results):
    graph = Graph()

    for result in results:
        municipality = URIRef(result.get("url"))
        graph.add((municipality, RDF.type, SKOS.Concept))
        graph.add((municipality, DC.identifier, (Literal(result["id"]))))
        graph.add((municipality, SKOS.prefLabel, (Literal(result["name"]))))
        graph.add((municipality, SCHEMA.latitude, (Literal(result["lat"]))))
        graph.add((municipality, SCHEMA.longitude, (Literal(result["long"]))))
        graph.add((municipality, AMV.accuracy, (Literal(result["score"]))))

    media_format = request.headers.get("Accept")
    return PlainTextResponse(graph.serialize(format=media_format,
                                             context={
                                                 "amv": str(AMV),
                                                 "dc": str(DC),
                                                 "kommunenummer": "https://register.geonorge.no/sosi-kodelister/inndelinger/inndelingsbase/kommunenummer/",
                                                 "schema": str(SCHEMA),
                                                 "skos": str(SKOS),
                                             }), media_type=media_format)


def get_searcher():
    return ix.searcher()


from geopy import distance


def search_municipality_coords(lat: float, long: float):
    return sorted([{
        "id": municipality["id"],
        "name": municipality["name"],
        "lat": municipality["lat"],
        "long": municipality["long"],
        "url": municipality["url"],
        "score": float(distance.distance((lat, long), (municipality["lat"], municipality["long"])).kilometers),
    } for municipality in municipalities], key=lambda d: d["score"])[:5]


def search_municipality_name(searcher: Searcher, query_string):
    query = QueryParser("name", ix.schema, termclass=MyFuzzyTerm).parse(query_string)
    return [{
        "id": result.get("id"),
        "name": result.get("name"),
        "lat": result.get("lat"),
        "long": result.get("long"),
        "url": result.get("url"),
        "score": result.score,
    } for result in searcher.search(query)]


if __name__ == "__main__":
    with get_searcher() as searcher:
        while True:
            query_input = input("Search for municipality: ")
            if query_input == "":
                break
            print(f"Searching for {query_input}")
            results = search_municipality_name(searcher, query_input)
            for result in results:
                print(result)
            print("---")
