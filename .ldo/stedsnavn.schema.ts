import { Schema } from "shexj";

/**
 * =============================================================================
 * stedsnavnSchema: ShexJ Schema for stedsnavn
 * =============================================================================
 */
export const stedsnavnSchema: Schema = {
  type: "Schema",
  shapes: [
    {
      id: "https://nomun.no/shapes#Municipality",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2004/02/skos/core#Concept",
              },
            },
            {
              type: "TripleConstraint",
              predicate: "http://purl.org/dc/terms/identifier",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
            },
            {
              type: "TripleConstraint",
              predicate: "http://purl.org/dc/terms/description",
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
            {
              type: "TripleConstraint",
              predicate: "https://schema.org/latitude",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#float",
              },
            },
            {
              type: "TripleConstraint",
              predicate: "https://schema.org/longitude",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#float",
              },
            },
          ],
        },
      },
    },
  ],
};
