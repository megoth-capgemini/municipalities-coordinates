import { ShapeType } from "@ldo/ldo";
import { serviceMunicipalitySchema } from "./serviceMunicipality.schema";
import { serviceMunicipalityContext } from "./serviceMunicipality.context";
import {
  Municipality,
  MunicipalityCollection,
} from "./serviceMunicipality.typings";

/**
 * =============================================================================
 * LDO ShapeTypes serviceMunicipality
 * =============================================================================
 */

/**
 * Municipality ShapeType
 */
export const MunicipalityShapeType: ShapeType<Municipality> = {
  schema: serviceMunicipalitySchema,
  shape: "https://ldo.js.org/#Municipality",
  context: serviceMunicipalityContext,
};

/**
 * MunicipalityCollection ShapeType
 */
export const MunicipalityCollectionShapeType: ShapeType<MunicipalityCollection> =
  {
    schema: serviceMunicipalitySchema,
    shape: "https://ldo.js.org/#MunicipalityCollection",
    context: serviceMunicipalityContext,
  };
