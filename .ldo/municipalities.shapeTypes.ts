import { ShapeType } from "@ldo/ldo";
import { municipalitiesSchema } from "./municipalities.schema";
import { municipalitiesContext } from "./municipalities.context";
import { Municipality } from "./municipalities.typings";

/**
 * =============================================================================
 * LDO ShapeTypes municipalities
 * =============================================================================
 */

/**
 * Municipality ShapeType
 */
export const MunicipalityShapeType: ShapeType<Municipality> = {
  schema: municipalitiesSchema,
  shape: "https://ldo.js.org/#Municipality",
  context: municipalitiesContext,
};
