import fs from "fs";
import path from "path";
import { createLdoDataset, parseRdf, serialize } from "@ldo/ldo";
import dataFactory from "@rdfjs/data-model";
import { MunicipalityShapeType } from "./.ldo/stedsnavn.shapeTypes";
import { Municipality } from "./.ldo/stedsnavn.typings";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const documentToParse = path.join(dirname, "kommunenummer.ttl");
const documentToWrite = path.join(dirname, "kommunenummer-koordinater.ttl");
const identifier = "http://purl.org/dc/terms/identifier";
const VALID = "Gyldig";
const VERBOSE = true;

function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

async function parse() {
  return parseRdf(fs.readFileSync(documentToParse, "utf8"));
}

const filterPlaceOfType = (type: string) => (place: any) =>
  place.navneobjekttype === type;

async function getCoordinates(
  municipality: Municipality,
): Promise<Municipality> {
  let simpleNames = [
    ...municipality.description.split(" - "),
    ...municipality.description.split(" – "),
  ]
    .filter((name) => name.indexOf(" - ") === -1 && name.indexOf(" – ") === -1)
    .map((name) => name.replace(/\Wi\W(.*)/, ""));
  const names = removeDuplicates([
    ...simpleNames,
    ...simpleNames.map((simpleName) => `${simpleName} Kommune`),
  ]);
  const coordinatesList = await Promise.all(
    names.map(async (name) => {
      const simpleName = name.replace(/\Wi\W(.*)/, "");
      const response = await fetch(
        `https://api.kartverket.no/stedsnavn/v1/navn?sok=${encodeURI(simpleName)}&fuzzy=true&knr=${municipality.identifier}&utkoordsys=4258&treffPerSide=500&side=1`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const places = (await response.json())["navn"];
      const municipalities = places.filter(filterPlaceOfType("Kommune"));
      const townships = places.filter(filterPlaceOfType("Tettsted"));
      const islandGroups = places.filter(filterPlaceOfType("Øygruppe i sjø"));
      const islands = places.filter(filterPlaceOfType("Øy i sjø"));
      return [
        municipalities[0]?.representasjonspunkt["nord"] ||
          townships[0]?.representasjonspunkt["nord"] ||
          islandGroups[0]?.representasjonspunkt["nord"] ||
          islands[0]?.representasjonspunkt["nord"] ||
          places[0]?.representasjonspunkt["nord"],
        municipalities[0]?.representasjonspunkt["øst"] ||
          townships[0]?.representasjonspunkt["øst"] ||
          islandGroups[0]?.representasjonspunkt["øst"] ||
          islands[0]?.representasjonspunkt["øst"] ||
          places[0]?.representasjonspunkt["øst"],
      ];
    }),
  );
  const validCoordinates = coordinatesList.find(
    (coordinates) => !!coordinates[0],
  );
  if (VERBOSE) {
    console.log(`${names?.join(", ")}: ${validCoordinates?.join(", ")}`);
  }
  municipality.latitude = validCoordinates?.[0];
  municipality.longitude = validCoordinates?.[1];
  return municipality;
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
  writeFileSync(documentToWrite, municipalitiesTurtle.join(""), "utf8");
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
  const municipalitiesWithCoordinates = [];
  for (let i = 0; i < municipalities.length; i++) {
    try {
      const municipality = await getCoordinates(municipalities[i]);
      municipalitiesWithCoordinates.push(municipality);
      if (!municipality.latitude || !municipality.longitude) {
        console.log(
          `${i + 1}/${municipalities.length}: Did not find coordinates for ${municipality.description} (${municipality.identifier})`,
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 30));
    } catch (err) {
      console.error("Error occurred", err);
    }
  }
  await write(municipalitiesWithCoordinates);
}

main();
