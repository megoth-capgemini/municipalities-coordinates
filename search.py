from geopy import distance
from rdflib import Graph, Namespace, URIRef, Literal
from rdflib.namespace import DCTERMS, RDF
from whoosh.fields import Schema, TEXT, NUMERIC
from whoosh.index import create_in, open_dir, FileIndex
from whoosh.qparser import QueryParser
from whoosh.query import FuzzyTerm
from whoosh.searching import Results

INDEX_DIR = ".whoosh"
INDEX_NAME = "municipalities"

AMV = Namespace("https://w3id.org/amv#")
CPOV = Namespace("http://data.europa.eu/m8g/")
MUNICIPALITY_URL = Namespace("https://register.geonorge.no/sosi-kodelister/inndelinger/inndelingsbase/kommunenummer/")
SCHEMA = Namespace("https://schema.org/")

g = Graph()
g.parse('kommunenummer-koordinater.ttl')
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

schema = Schema(url=TEXT(stored=True),
                name=TEXT(stored=True),
                id=TEXT(stored=True),
                lat=NUMERIC(stored=True),
                long=NUMERIC(stored=True))


class MyFuzzyTerm(FuzzyTerm):
    def __init__(self, fieldname, text, boost=1.0, maxdist=1, prefixlength=1, constantaccuracy=True):
        super(MyFuzzyTerm, self).__init__(fieldname, text, boost, maxdist, prefixlength, constantaccuracy)


def get_graph():
    return g


def get_municipalities():
    return municipalities


def create_index():
    return create_in(INDEX_DIR, schema, indexname=INDEX_NAME)


def open_index():
    return open_dir(INDEX_DIR, schema=schema, indexname=INDEX_NAME)


def get_linked_response(results: Results, base_url: str):
    graph = Graph()
    base = URIRef(base_url)
    graph.add((base, RDF.type, RDF.List))

    for i, result in enumerate(results):
        municipality = URIRef(result.get("url"))
        graph.add((base, RDF.first, municipality))
        if i < len(results) - 1:
            # adding new base as next part in list
            new_base = URIRef(f"{base_url}#{i}")
            graph.add((new_base, RDF.type, RDF.List))
            graph.add((base, RDF.rest, new_base))
            base = new_base
        else:
            # ending list
            graph.add((base, RDF.rest, RDF.nil))
        # adding data on municipality
        graph.add((municipality, RDF.type, CPOV.PublicOrganisation))
        graph.add((municipality, DCTERMS.identifier, (Literal(result["id"]))))
        graph.add((municipality, DCTERMS.description, (Literal(result["name"]))))
        graph.add((municipality, SCHEMA.latitude, (Literal(result["lat"]))))
        graph.add((municipality, SCHEMA.longitude, (Literal(result["long"]))))
        graph.add((municipality, AMV.accuracy, (Literal(result["accuracy"]))))

    return graph


def serialize(graph: Graph, media_format: str):
    return graph.serialize(format=media_format,
                           context={
                               "amv": str(AMV),
                               "dc": str(DCTERMS),
                               "kommunenummer": str(MUNICIPALITY_URL),
                               "cpov": str(CPOV),
                               "rdf": str(RDF),
                               "schema": str(SCHEMA),
                           })


def search_municipality_coords(lat: float, long: float):
    print(f"Searching for {lat}, {long}")
    return sorted([{
        "id": municipality["id"],
        "name": municipality["name"],
        "lat": municipality["lat"],
        "long": municipality["long"],
        "url": municipality["url"],
        "accuracy": float(distance.distance((lat, long), (municipality["lat"], municipality["long"])).kilometers) * -1,
    } for municipality in municipalities], key=lambda d: d["accuracy"] * -1)[:5]


def search_municipality_name(index: FileIndex, query_string):
    print(f"Searching for {query_string}")
    query = QueryParser("name", index.schema, termclass=MyFuzzyTerm).parse(query_string)
    return [{
        "id": row.get("id"),
        "name": row.get("name"),
        "lat": row.get("lat"),
        "long": row.get("long"),
        "url": row.get("url"),
        "accuracy": row.score,
    } for row in index.searcher().search(query)]


if __name__ == "__main__":
    with open_index().searcher() as searcher:
        while True:
            query_input = input("Search for municipality: ")
            if query_input == "":
                break
            print(f"Searching for {query_input}")
            results = search_municipality_name(open_index(), query_input)
            for result in results:
                print(result)
            print("---")
