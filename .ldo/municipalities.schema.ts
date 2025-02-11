import { Schema } from "shexj";

/**
 * =============================================================================
 * municipalitiesSchema: ShexJ Schema for municipalities
 * =============================================================================
 */
export const municipalitiesSchema: Schema = {
  type: "Schema",
  shapes: [
    {
      id: "https://ldo.js.org/#Municipality",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://purl.org/dc/terms/identifier",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#integer",
              },
            },
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/2004/02/skos/core#prefLabel",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
            },
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/ns/adms#status",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
            },
          ],
        },
      },
    },
  ],
};
