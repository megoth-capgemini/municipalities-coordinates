# Norwegian Municipalities

This is a simple service that provides a list of Norwegian municipalities and metadata describing their name,
municipality id, and coordinates. You can search for municipalities by their name using the `/name` API endpoint, and
you can search by distance from a location using the `/coords` API endpoint.

The service is deployed to Vercel on [nomun.vercel.app](https://nomun.vercel.app/) using Vercel's support
for [Python with Vercel Functions](https://vercel.com/docs/functions/runtimes/python). It
uses [Whoosh](https://whoosh.readthedocs.io/) to handle fuzzy search by names,
and [geopy](https://geopy.readthedocs.io/) to handle distance calculation. It
uses [FastAPI](https://fastapi.tiangolo.com/) to handle the APIs,
and [Vite](https://vite.dev/) + [React](https://react.dev/) to handle the front-end functionality.

To develop locally we recommend using [Poetry](https://python-poetry.org/) for the Python functionality,
and [Node](https://nodejs.org/en) for the JavaScript functionality.

## Developing the service

To set up the Python environment, run:

```poetry install```

Next, to start the APIs, run:

```poetry run python main.py```

The APIs should now be ready locally (by default it should be exposed on port `8000`).

To set up the webapp, you need to install the dependencies first:

```npm install```

To start the development server for the webapp:

```npm run dev```

By default the APIs will be available on port 8000. If you use a different port, change it in `.env.local`.

## Deploying the service

Everything should be ready for deployment on a Vercel domain (i.e. dependencies are listed in `requirements.txt`, and
`vercel.json` describes everything needed to configure it).

If you make changes to the search index or the webapp, you need to build them manually before deploying it to Vercel (
see [Building the search index](#building-the-search-index) and [Building the webapp](#building-the-webapp)).

## Aggregating the data

The list of municipalities are fetched by taking the list of municipalities from `kommunenummer.ttl` and combining them
with the aggregated results from [Kartverkets stedsnavn API](https://api.kartverket.no/stedsnavn/v1/#/). This requires
a lot of requests, so please be aware of how much you use it.

To start the script, run:

```npm run generate-file```

The data is managed using [Linked Data Objects (LDO)](https://ldo.js.org/), so if the data model changes, you'll need
to update the ShEx-shapes used. These are located in `shapes/stedsnavn.shex`.

## Building the search index

To build the search index (this must be done manually, as Vercel doesn't allow us to write the index as part of the
deployment), run:

```poetry run python build-search.py```

This will update the `.whoosh` directory, and will be read when deployed.

## Building the webapp

To build the webapp, run the following:

```npm run build-web```

## Generating SHACL file

We use [SHACLC](https://w3c.github.io/shacl/shacl-compact-syntax/) to describe the SHACL shapes used in the service.
To generate the normal SHACL syntax, you can use `build-shacl.py`:

```poetry run python build-shacl.py```