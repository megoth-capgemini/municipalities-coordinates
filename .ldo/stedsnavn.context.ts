import { LdoJsonldContext } from "@ldo/jsonld-dataset-proxy";

/**
 * =============================================================================
 * stedsnavnContext: JSONLD Context for stedsnavn
 * =============================================================================
 */
export const stedsnavnContext: LdoJsonldContext = {
  type: {
    "@id": "@type",
    "@type": "http://www.w3.org/2004/02/skos/core#Concept",
  },
  identifier: {
    "@id": "http://purl.org/dc/terms/identifier",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  description: {
    "@id": "http://purl.org/dc/terms/description",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  status: {
    "@id": "http://www.w3.org/ns/adms#status",
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
};
