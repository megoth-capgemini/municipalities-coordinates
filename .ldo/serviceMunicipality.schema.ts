import { Schema } from "shexj";

/**
 * =============================================================================
 * serviceMunicipalitySchema: ShexJ Schema for serviceMunicipality
 * =============================================================================
 */
export const serviceMunicipalitySchema: Schema = {
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
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://data.europa.eu/m8g/PublicOrganisation",
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
            {
              type: "TripleConstraint",
              predicate: "https://w3id.org/amv#accuracy",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
            },
          ],
        },
      },
    },
    {
      id: "https://ldo.js.org/#MunicipalityCollection",
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
                datatype: "http://www.w3.org/1999/02/22-rdf-syntax-ns#List",
              },
            },
            {
              type: "TripleConstraint",
              predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#first",
              valueExpr: "https://ldo.js.org/#Municipality",
            },
            {
              type: "OneOf",
              expressions: [
                {
                  type: "TripleConstraint",
                  predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest",
                  valueExpr: "https://ldo.js.org/#MunicipalityCollection",
                },
                {
                  type: "TripleConstraint",
                  predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest",
                  valueExpr: {
                    type: "NodeConstraint",
                    datatype: "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil",
                  },
                },
              ],
            },
          ],
        },
      },
    },
  ],
};
