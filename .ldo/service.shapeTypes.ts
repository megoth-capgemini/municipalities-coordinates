import { ShapeType } from "@ldo/ldo";
import { serviceSchema } from "./service.schema";
import { serviceContext } from "./service.context";
import { Municipality, MunicipalityCollection } from "./service.typings";

/**
 * =============================================================================
 * LDO ShapeTypes service
 * =============================================================================
 */

/**
 * Municipality ShapeType
 */
export const MunicipalityShapeType: ShapeType<Municipality> = {
  schema: serviceSchema,
  shape: "https://nomun.no/shapes#Municipality",
  context: serviceContext,
};

/**
 * MunicipalityCollection ShapeType
 */
export const MunicipalityCollectionShapeType: ShapeType<MunicipalityCollection> =
  {
    schema: serviceSchema,
    shape: "https://nomun.no/shapes#MunicipalityCollection",
    context: serviceContext,
  };
