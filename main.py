import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, HTMLResponse
from starlette.staticfiles import StaticFiles

from search import search_municipality_name, get_linked_response, search_municipality_coords, open_index

FORMAT_JSONLD = "application/ld+json"
FORMAT_RDFXML = "application/rdf+xml"
FORMAT_TURTLE = "text/turtle"

app = FastAPI()
index = open_index()
frontpage = open("./dist/index.html", "r").read()


def search_response(request: Request, results):
    media_format = request.headers.get("Accept")
    if media_format == FORMAT_JSONLD or media_format == FORMAT_RDFXML or media_format == FORMAT_TURTLE:
        return get_linked_response(request, results)

    return JSONResponse([{
        "id": result["id"],
        "name": result["name"],
        "lat": result["lat"],
        "long": result["long"],
        "url": result["url"],
        "score": result["score"],
    } for result in results])


@app.get("/")
def read_frontpage():
    return HTMLResponse(content=frontpage)


@app.get("/coords/{lat}/{long}")
def search_municipality_by_coords(request: Request, lat: float, long: float):
    results = search_municipality_coords(lat, long)
    return search_response(request, results)


@app.get("/name/{query}")
def search_municipality_by_name(request: Request, query: str):
    results = search_municipality_name(index, query)
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
