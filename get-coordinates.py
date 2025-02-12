from rdflib import Graph

g = Graph()
g.parse('kommunenummer-koordinater.ttl')

from whoosh.index import create_in
from whoosh.fields import Schema, TEXT, NUMERIC

schema = Schema(name=TEXT(stored=True), id=NUMERIC(stored=True), lat=NUMERIC(stored=True), long=NUMERIC(stored=True))
ix = create_in(".swhoosh", schema)
writer = ix.writer()
for municipality in g.query(
        """
        PREFIX dc: <http://purl.org/dc/terms/>
        PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        
        SELECT ?name ?id ?lat ?long
        WHERE {
            ?municipality rdf:type skos:Concept .
            ?municipality skos:prefLabel ?name . 
            ?municipality dc:identifier ?id . 
            ?municipality geo:lat ?lat . 
            ?municipality geo:long ?long . 
        }
        """):
    writer.add_document(name=str(municipality.name),
                        id=int(str(municipality.id)),
                        lat=float(str(municipality.lat)),
                        long=float(str(municipality.long)))
writer.commit()

from whoosh.qparser import QueryParser
from whoosh.query import FuzzyTerm


class MyFuzzyTerm(FuzzyTerm):
    def __init__(self, fieldname, text, boost=1.0, maxdist=2, prefixlength=1, constantscore=True):
        super(MyFuzzyTerm, self).__init__(fieldname, text, boost, maxdist, prefixlength, constantscore)


def search(query):
    print(f"Searching for {query}")
    with ix.searcher() as searcher:
        query = QueryParser("name", ix.schema, termclass=MyFuzzyTerm).parse(query)
        results = searcher.search(query)
        for result in results:
            print(result)
    print("---")

# print("---")
# search("Osl")
# search("Svalbard")
# search("Herøy")
# search("Våler")

while True:
    query = input("Search for municipality: ")
    if query == "":
        break
    search(query)