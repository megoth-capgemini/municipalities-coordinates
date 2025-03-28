import { ContextDefinition } from "jsonld";

/**
 * =============================================================================
 * Typescript Typings for stedsnavn
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
