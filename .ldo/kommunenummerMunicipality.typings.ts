import { ContextDefinition } from "jsonld";

/**
 * =============================================================================
 * Typescript Typings for kommunenummerMunicipality
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
  status: string;
  latitude: string;
  longitude: string;
}
