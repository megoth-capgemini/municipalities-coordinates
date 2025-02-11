import fs from "fs";
import path from "path";
import { createLdoDataset, parseRdf, serialize } from "@ldo/ldo";
import dataFactory from "@rdfjs/data-model";
import { MunicipalityShapeType } from "./.ldo/municipalities.shapeTypes";
import { Municipality } from "./.ldo/municipalities.typings";
import { writeFileSync } from "node:fs";

const documentToParse = path.join(__dirname, "kommunenummer.ttl");
const documentToWrite = path.join(__dirname, "kommunenummer-generated.ttl");
const identifier = "http://purl.org/dc/terms/identifier";
const VALID = "Gyldig";

async function parse() {
  return parseRdf(fs.readFileSync(documentToParse, "utf8"));
}

async function write(municipalities: Array<Municipality>) {
  const municipalitiesTurtle = await Promise.all(
    municipalities.map((municipality) => {
      const localEntity = createLdoDataset()
        .usingType(MunicipalityShapeType)
        .fromJson(municipality);
      return serialize(localEntity, { format: "Turtle" });
    }),
  );
  writeFileSync(documentToWrite, municipalitiesTurtle.join(), "utf8");
  console.log(
    `Written ${municipalities.length} municipalities to file ${documentToWrite}`,
  );
}

async function main() {
  const ldoDataset = await parse();
  const municipalities = ldoDataset
    .match(null, dataFactory.namedNode(identifier))
    .toArray()
    .map((quad) =>
      ldoDataset
        .usingType(MunicipalityShapeType)
        .fromSubject(quad.subject.value),
    )
    .filter((municipality) => municipality.status === VALID);
  await write(municipalities);
}

main();
