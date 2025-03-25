import { LdoJsonldContext } from "@ldo/jsonld-dataset-proxy";

/**
 * =============================================================================
 * serviceContext: JSONLD Context for service
 * =============================================================================
 */
export const serviceContext: LdoJsonldContext = {
  type: {
    "@id": "@type",
    "@type": [
      "http://data.europa.eu/m8g/PublicOrganisation",
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#List",
    ],
  },
  identifier: {
    "@id": "http://purl.org/dc/terms/identifier",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  description: {
    "@id": "http://purl.org/dc/terms/description",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  latitude: {
    "@id": "https://schema.org/latitude",
    "@type": "http://www.w3.org/2001/XMLSchema#float",
  },
  longitude: {
    "@id": "https://schema.org/longitude",
    "@type": "http://www.w3.org/2001/XMLSchema#float",
  },
  accuracy: {
    "@id": "https://w3id.org/amv#accuracy",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  first: {
    "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#first",
    "@type": "@id",
  },
  rest: {
    "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest",
    "@type": ["@id", "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil"],
  },
};
