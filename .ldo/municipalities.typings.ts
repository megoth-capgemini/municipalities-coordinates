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
  identifier: number;
  prefLabel: string;
  status: string;
  lat: string;
  long: string;
}
