from rdflib import Graph
from whoosh.searching import Searcher

g = Graph()
g.parse('kommunenummer-koordinater.ttl')

from whoosh.index import create_in
from whoosh.fields import Schema, TEXT, NUMERIC

schema = Schema(municipality=TEXT(stored=True),
                name=TEXT(stored=True),
                id=NUMERIC(stored=True),
                lat=NUMERIC(stored=True),
                long=NUMERIC(stored=True))
ix = create_in(".swhoosh", schema)
writer = ix.writer()
for municipality in g.query(
        """
        PREFIX dc: <http://purl.org/dc/terms/>
        PREFIX schema: <https://schema.org/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        
        SELECT ?municipality ?name ?id ?lat ?long
        WHERE {
            ?municipality rdf:type skos:Concept .
            ?municipality skos:prefLabel ?name . 
            ?municipality dc:identifier ?id . 
            ?municipality schema:latitude ?lat . 
            ?municipality schema:longitude ?long . 
        }
        """):
    writer.add_document(municipality=str(municipality.municipality),
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


def get_searcher():
    return ix.searcher()


def search_municipality_name(searcher: Searcher, query_string):
    query = QueryParser("name", ix.schema, termclass=MyFuzzyTerm).parse(query_string)
    return searcher.search(query)


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
