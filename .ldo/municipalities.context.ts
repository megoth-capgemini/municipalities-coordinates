import { LdoJsonldContext } from "@ldo/jsonld-dataset-proxy";

/**
 * =============================================================================
 * municipalitiesContext: JSONLD Context for municipalities
 * =============================================================================
 */
export const municipalitiesContext: LdoJsonldContext = {
  identifier: {
    "@id": "http://purl.org/dc/terms/identifier",
    "@type": "http://www.w3.org/2001/XMLSchema#integer",
  },
  prefLabel: {
    "@id": "http://www.w3.org/2004/02/skos/core#prefLabel",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  status: {
    "@id": "http://www.w3.org/ns/adms#status",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  lat: {
    "@id": "http://www.w3.org/2003/01/geo/wgs84_pos#lat",
    "@type": "http://www.w3.org/2001/XMLSchema#float",
  },
  long: {
    "@id": "http://www.w3.org/2003/01/geo/wgs84_pos#long",
    "@type": "http://www.w3.org/2001/XMLSchema#float",
  },
};
