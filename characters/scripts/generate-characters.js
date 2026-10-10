
import fs from "node:fs";
import path from "node:path";

// Fixed, human-readable hair color palette.
const HAIR_COLORS = {
  black: "2c1b18",
  brown: "724133",
  blonde: "d6b370",
  grey: "929598",
  red: "c93305",
};

// Keep skin tones simple and easy to distinguish.
const SKIN_TONES = {
  light: "ffdbb4",
  dark: "614335",
};

// One valid hairstyle per character.
// These are Avataaars top variants, not gender settings.
const HAIRSTYLES = {
  male: [
    "shortFlat",
    "shortRound",
    "shortCurly",
    "shortWaved",
    "theCaesar",
  ],
  female: [
    "bob",
    "curvy",
    "straight01",
    "straight02",
    "straightAndStrand",
  ],
};

const characters = [
  {
    id: "char-1",
    name: "Felix",
    traits: { gender: "male", hasGlasses: true, hasBeard: true, hairColor: "grey", skinColor: "light" },
  },
  {
    id: "char-2",
    name: "Oliver",
    traits: { gender: "male", hasGlasses: false, hasBeard: false, hairColor: "black", skinColor: "light" },
  },
  {
    id: "char-3",
    name: "Arthur",
    traits: { gender: "male", hasGlasses: true, hasBeard: false, hairColor: "brown", skinColor: "light" },
  },
  {
    id: "char-4",
    name: "Henry",
    traits: { gender: "male", hasGlasses: false, hasBeard: true, hairColor: "blonde", skinColor: "dark" },
  },
  {
    id: "char-5",
    name: "George",
    traits: { gender: "male", hasGlasses: true, hasBeard: true, hairColor: "red", skinColor: "light" },
  },
  {
    id: "char-6",
    name: "Sophie",
    traits: { gender: "female", hasGlasses: false, hasBeard: false, hairColor: "black", skinColor: "dark" },
  },
  {
    id: "char-7",
    name: "Emma",
    traits: { gender: "female", hasGlasses: true, hasBeard: false, hairColor: "grey", skinColor: "dark" },
  },
  {
    id: "char-8",
    name: "Olivia",
    traits: { gender: "female", hasGlasses: false, hasBeard: false, hairColor: "brown", skinColor: "light" },
  },
  {
    id: "char-9",
    name: "Charlotte",
    traits: { gender: "female", hasGlasses: true, hasBeard: false, hairColor: "blonde", skinColor: "light" },
  },
  {
    id: "char-10",
    name: "Amelia",
    traits: { gender: "female", hasGlasses: false, hasBeard: false, hairColor: "red", skinColor: "dark" },
  },
  {
    id: "char-11",
    name: "Liam",
    traits: { gender: "male", hasGlasses: false, hasBeard: true, hairColor: "black", skinColor: "dark" },
  },
  {
    id: "char-12",
    name: "Noah",
    traits: { gender: "male", hasGlasses: true, hasBeard: false, hairColor: "blonde", skinColor: "light" },
  },
  {
    id: "char-13",
    name: "Mason",
    traits: { gender: "male", hasGlasses: false, hasBeard: false, hairColor: "brown", skinColor: "dark" },
  },
  {
    id: "char-14",
    name: "Ethan",
    traits: { gender: "male", hasGlasses: true, hasBeard: true, hairColor: "red", skinColor: "dark" },
  },
  {
    id: "char-15",
    name: "Lucas",
    traits: { gender: "male", hasGlasses: false, hasBeard: true, hairColor: "grey", skinColor: "light" },
  },
  {
    id: "char-16",
    name: "Mia",
    traits: { gender: "female", hasGlasses: true, hasBeard: false, hairColor: "black", skinColor: "light" },
  },
  {
    id: "char-17",
    name: "Isabella",
    traits: { gender: "female", hasGlasses: false, hasBeard: false, hairColor: "blonde", skinColor: "dark" },
  },
  {
    id: "char-18",
    name: "Ava",
    traits: { gender: "female", hasGlasses: true, hasBeard: false, hairColor: "brown", skinColor: "dark" },
  },
  {
    id: "char-19",
    name: "Grace",
    traits: { gender: "female", hasGlasses: false, hasBeard: false, hairColor: "grey", skinColor: "light" },
  },
  {
    id: "char-20",
    name: "Chloe",
    traits: { gender: "female", hasGlasses: true, hasBeard: false, hairColor: "red", skinColor: "light" },
  },
  {
    id: "char-21",
    name: "Jack",
    traits: { gender: "male", hasGlasses: true, hasBeard: false, hairColor: "black", skinColor: "dark" },
  },
  {
    id: "char-22",
    name: "James",
    traits: { gender: "male", hasGlasses: false, hasBeard: true, hairColor: "brown", skinColor: "light" },
  },
  {
    id: "char-23",
    name: "Benjamin",
    traits: { gender: "male", hasGlasses: true, hasBeard: true, hairColor: "blonde", skinColor: "dark" },
  },
  {
    id: "char-24",
    name: "Daniel",
    traits: { gender: "male", hasGlasses: false, hasBeard: false, hairColor: "red", skinColor: "light" },
  },
  {
    id: "char-25",
    name: "Ella",
    traits: { gender: "female", hasGlasses: false, hasBeard: false, hairColor: "black", skinColor: "dark" },
  },
  {
    id: "char-26",
    name: "Lily",
    traits: { gender: "female", hasGlasses: true, hasBeard: false, hairColor: "brown", skinColor: "light" },
  },
  {
    id: "char-27",
    name: "Zoe",
    traits: { gender: "female", hasGlasses: false, hasBeard: false, hairColor: "blonde", skinColor: "dark" },
  },
  {
    id: "char-28",
    name: "Hannah",
    traits: { gender: "female", hasGlasses: true, hasBeard: false, hairColor: "grey", skinColor: "light" },
  },
  {
    id: "char-29",
    name: "Lucy",
    traits: { gender: "female", hasGlasses: false, hasBeard: false, hairColor: "red", skinColor: "dark" },
  },
  {
    id: "char-30",
    name: "Ruby",
    traits: { gender: "female", hasGlasses: true, hasBeard: false, hairColor: "black", skinColor: "light" },
  },
];

function generateCharacter(character, index) {
  const { traits } = character;

  // Validate the metadata before making API requests.
  if (!HAIRSTYLES[traits.gender]) {
    throw new Error(
      `Invalid gender for ${character.name}: ${traits.gender}`
    );
  }

  if (!Object.hasOwn(HAIR_COLORS, traits.hairColor)) {
    throw new Error(
      `Invalid hair color for ${character.name}: ${traits.hairColor}`
    );
  }

  if (!Object.hasOwn(SKIN_TONES, traits.skinColor)) {
    throw new Error(
      `Invalid skin tone for ${character.name}: ${traits.skinColor}`
    );
  }

  // Assign one hairstyle deterministically to each character.
  const options = HAIRSTYLES[traits.gender];
  const hairstyle = options[index % options.length];

  const hairHex = HAIR_COLORS[traits.hairColor];
  const skinHex = SKIN_TONES[traits.skinColor];

  const params = new URLSearchParams({
    seed: character.id,

    // Ordinary, neutral facial features.
    eyes: "default",
    mouth: "default",

    // Glasses: always present or absent according to metadata.
    accessoriesProbability: traits.hasGlasses ? "100" : "0",
    accessories: "round",

    // Beard: always present or absent according to metadata.
    facialHairProbability: traits.hasBeard ? "100" : "0",
    facialHair: "beardLight",
    facialHairColor: hairHex,

    // Fixed colors.
    hairColor: hairHex,
    skinColor: skinHex,

    // Exactly one valid hairstyle.
    top: hairstyle,
    topProbability: "100",
  });

  return {
    id: character.id,
    name: character.name,
    imageUrl: `/characters/${character.id}.svg`,
    traits,
    sourceUrl:
      `https://api.dicebear.com/9.x/avataaars/svg?${params}`,
  };
}

async function main() {
  const outputDir = path.join("public", "characters");
  const metadataDir = "data";

  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(metadataDir, { recursive: true });

  const generatedCharacters = characters.map(
    (character, index) => generateCharacter(character, index)
  );

  for (const character of generatedCharacters) {
    const response = await fetch(character.sourceUrl);

    if (!response.ok) {
      const errorDetails = await response.text();

      throw new Error(
        `Failed to generate ${character.name}: ` +
        `${response.status}\n${errorDetails}`
      );
    }

    const svg = await response.text();

    fs.writeFileSync(
      path.join(outputDir, `${character.id}.svg`),
      svg,
      "utf8"
    );

    console.log(`Generated ${character.name}`);
  }

  // Save game metadata without the external generation URL.
  const metadata = generatedCharacters.map(
    ({ sourceUrl, ...character }) => character
  );

  fs.writeFileSync(
    path.join(metadataDir, "characters.json"),
    JSON.stringify(metadata, null, 2),
    "utf8"
  );

  console.log(
    `Successfully generated ${metadata.length} characters.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
