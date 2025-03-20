import { ContextDefinition } from "jsonld";

/**
 * =============================================================================
 * Typescript Typings for municipalities
 * =============================================================================
 */

/**
 * Municipality Type
 */
export interface Municipality {
  "@id"?: string;
  "@context"?: ContextDefinition;
  identifier: string;
  prefLabel: string;
  status: string;
  latitude: string;
  longitude: string;
}
