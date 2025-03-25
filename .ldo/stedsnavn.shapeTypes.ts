import { ShapeType } from "@ldo/ldo";
import { stedsnavnSchema } from "./stedsnavn.schema";
import { stedsnavnContext } from "./stedsnavn.context";
import { Municipality } from "./stedsnavn.typings";

/**
 * =============================================================================
 * LDO ShapeTypes stedsnavn
 * =============================================================================
 */

/**
 * Municipality ShapeType
 */
export const MunicipalityShapeType: ShapeType<Municipality> = {
  schema: stedsnavnSchema,
  shape: "https://nomun.no/shapes#Municipality",
  context: stedsnavnContext,
};
