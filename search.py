from rdflib import Graph, SKOS, DC, Namespace

INDEX_DIR = ".whoosh"
INDEX_NAME = "municipalities"

SCHEMA = Namespace("https://schema.org/")
AMV = Namespace("https://w3id.org/amv#")

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


def get_graph():
    return g


def get_municipalities():
    return municipalities


from whoosh.index import create_in, open_dir, FileIndex
from whoosh.fields import Schema, TEXT, NUMERIC

schema = Schema(url=TEXT(stored=True),
                name=TEXT(stored=True),
                id=NUMERIC(stored=True),
                lat=NUMERIC(stored=True),
                long=NUMERIC(stored=True))

from whoosh.qparser import QueryParser
from whoosh.query import FuzzyTerm


class MyFuzzyTerm(FuzzyTerm):
    def __init__(self, fieldname, text, boost=1.0, maxdist=1, prefixlength=1, constantscore=True):
        super(MyFuzzyTerm, self).__init__(fieldname, text, boost, maxdist, prefixlength, constantscore)


def create_index():
    return create_in(INDEX_DIR, schema, indexname=INDEX_NAME)


def open_index():
    return open_dir(INDEX_DIR, schema=schema, indexname=INDEX_NAME)


def serialize(graph: Graph, format: str):
    return graph.serialize(format=format,
                           context={
                               "amv": str(AMV),
                               "dc": str(DC),
                               "kommunenummer": "https://register.geonorge.no/sosi-kodelister/inndelinger/inndelingsbase/kommunenummer/",
                               "schema": str(SCHEMA),
                               "skos": str(SKOS),
                           })


from geopy import distance


def search_municipality_coords(lat: float, long: float):
    print(f"Searching for {lat}, {long}")
    return sorted([{
        "id": municipality["id"],
        "name": municipality["name"],
        "lat": municipality["lat"],
        "long": municipality["long"],
        "url": municipality["url"],
        "score": float(distance.distance((lat, long), (municipality["lat"], municipality["long"])).kilometers),
    } for municipality in municipalities], key=lambda d: d["score"])[:5]


def search_municipality_name(index: FileIndex, query_string):
    print(f"Searching for {query_string}")
    query = QueryParser("name", index.schema, termclass=MyFuzzyTerm).parse(query_string)
    return [{
        "id": row.get("id"),
        "name": row.get("name"),
        "lat": row.get("lat"),
        "long": row.get("long"),
        "url": row.get("url"),
        "score": row.score,
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
