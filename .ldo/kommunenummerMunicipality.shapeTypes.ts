import { ShapeType } from "@ldo/ldo";
import { kommunenummerMunicipalitySchema } from "./kommunenummerMunicipality.schema";
import { kommunenummerMunicipalityContext } from "./kommunenummerMunicipality.context";
import { Municipality } from "./kommunenummerMunicipality.typings";

/**
 * =============================================================================
 * LDO ShapeTypes kommunenummerMunicipality
 * =============================================================================
 */

/**
 * Municipality ShapeType
 */
export const MunicipalityShapeType: ShapeType<Municipality> = {
  schema: kommunenummerMunicipalitySchema,
  shape: "https://ldo.js.org/#Municipality",
  context: kommunenummerMunicipalityContext,
};
