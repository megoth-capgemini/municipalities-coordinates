import { ContextDefinition } from "jsonld";

/**
 * =============================================================================
 * Typescript Typings for serviceMunicipality
 * =============================================================================
 */

/**
 * Municipality Type
 */
export interface Municipality {
  "@id"?: string;
  "@context"?: ContextDefinition;
  type: string;
  identifier: string;
  description: string;
  latitude: string;
  longitude: string;
  accuracy: string;
}

/**
 * MunicipalityCollection Type
 */
export interface MunicipalityCollection {
  "@id"?: string;
  "@context"?: ContextDefinition;
  type: string;
  first: Municipality;
}
