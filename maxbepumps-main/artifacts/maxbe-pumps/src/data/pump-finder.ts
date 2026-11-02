import { categories, products, type ProductModel } from "./products";

export type PumpFinderCriteria = {
  application: string;
  category: string;
  source: string;
  requirement: string;
  horsepower: string;
  head: string;
  discharge: string;
};

export type PumpMatchCheck = {
  label: string;
  status: "match" | "mismatch" | "unknown" | "not-specified";
  detail: string;
};

export type PumpMatch = {
  product: ProductModel;
  checks: PumpMatchCheck[];
  score: number;
};

type ScoredCheck = {
  check: PumpMatchCheck;
  score: number;
};

const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

function productEvidence(product: ProductModel): string {
  return [
    product.applications?.join(" "),
    product.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function parseMaximum(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const numbers = value.match(/\d+(?:\.\d+)?/g);
  return numbers?.length ? Number(numbers[numbers.length - 1]) : undefined;
}

function getDischarge(product: ProductModel): number | undefined {
  const specification = product.specifications?.find(({ label }) =>
    /max(?:imum)?\s*(?:flow|discharge)/i.test(label),
  );
  return parseMaximum(specification?.value);
}

function getHorsepower(product: ProductModel): number | undefined {
  const value = product.motorPower.match(/(\d+(?:\.\d+)?)\s*HP/i)?.[1];
  return value ? Number(value) : undefined;
}

function requirementCheck(
  label: string,
  status: PumpMatchCheck["status"],
  detail: string,
  score: number,
): ScoredCheck {
  return { check: { label, status, detail }, score };
}

function checkApplication(product: ProductModel, application: string) {
  if (application === "other" || !application) {
    return requirementCheck(
      "Application",
      "unknown",
      "Confirm use.",
      0,
    );
  }
  const evidence = productEvidence(product);
  const patterns: Record<string, RegExp> = {
    agricultural: /agricultur|farm|irrigat/,
    domestic: /domestic|household|residential/,
    industrial: /industrial/,
  };
  const matches = patterns[application]?.test(evidence) ?? false;
  return requirementCheck(
    "Application",
    matches ? "match" : "mismatch",
    matches
      ? "Listed."
      : "Not listed.",
    matches ? 16 : 0,
  );
}

function checkCategory(product: ProductModel, category: string) {
  if (category === "unsure" || !category) {
    return requirementCheck(
      "Pump type",
      "not-specified",
      "Not selected.",
      0,
    );
  }
  const matches = product.categorySlug === category;
  const name = categoryBySlug.get(product.categorySlug)?.name ?? product.name;
  return requirementCheck(
    "Pump type",
    matches ? "match" : "mismatch",
    matches
      ? `${name}.`
      : `Listed: ${name}.`,
    matches ? 18 : 0,
  );
}

function checkSource(product: ProductModel, source: string) {
  if (source === "other" || !source) {
    return requirementCheck(
      "Water source",
      "unknown",
      "Confirm source.",
      0,
    );
  }
  const evidence = productEvidence(product);
  const matches =
    (source === "open-well" && product.categorySlug === "openwell") ||
    (source === "borewell" && product.categorySlug === "v4-submersible") ||
    (source === "water-tank" && /tank|sump|rainwater/.test(evidence));
  const label =
    source === "open-well"
      ? "open well"
      : source === "borewell"
        ? "borewell"
        : "water tank";
  return requirementCheck(
    "Water source",
    matches ? "match" : "mismatch",
    matches
      ? `Listed: ${label}.`
      : `Not for ${label}.`,
    matches ? 18 : 0,
  );
}

function checkRequirement(product: ProductModel, requirement: string) {
  if (requirement === "other" || !requirement) {
    return requirementCheck(
      "Water requirement",
      "unknown",
      "Confirm use.",
      0,
    );
  }
  const evidence = productEvidence(product);
  const patterns: Record<string, RegExp> = {
    irrigation: /irrigat|agricultur|farm/,
    "domestic-supply": /domestic water supply|residential water supply|household water/,
    "industrial-supply": /industrial/,
  };
  const matches = patterns[requirement]?.test(evidence) ?? false;
  return requirementCheck(
    "Water requirement",
    matches ? "match" : "mismatch",
    matches
      ? "Listed."
      : "Not listed.",
    matches ? 12 : 0,
  );
}

function checkHorsepower(product: ProductModel, requested: string) {
  if (requested === "unsure" || !requested) {
    return requirementCheck(
      "Motor power",
      "not-specified",
      "Not selected.",
      0,
    );
  }
  const actual = getHorsepower(product);
  if (actual === undefined) {
    return requirementCheck(
      "Motor power",
      "unknown",
      "HP unknown.",
      0,
    );
  }
  const target = Number(requested);
  const matches = actual === target;
  const score = matches ? 14 : Math.max(0, 8 - Math.abs(actual - target) * 2);
  return requirementCheck(
    "Motor power",
    matches ? "match" : "mismatch",
    matches
      ? `${actual} HP.`
      : `${actual} HP; need ${target}.`,
    score,
  );
}

function checkHead(product: ProductModel, requested: string) {
  const maximum = parseMaximum(product.maxHead);
  if (maximum === undefined) {
    return requirementCheck(
      "Head",
      "unknown",
      "Head unknown.",
      0,
    );
  }
  if (requested === "unsure" || !requested) {
    return requirementCheck(
      "Head",
      "not-specified",
      "Not selected.",
      0,
    );
  }
  const minimum = Number(requested);
  const matches = maximum >= minimum;
  const score = matches
    ? 14
    : Math.max(0, 10 - (minimum - maximum) * 0.4);
  return requirementCheck(
    "Head",
    matches ? "match" : "mismatch",
    matches
      ? `${maximum} m max; meets ${minimum} m.`
      : `${maximum} m max; below ${minimum} m.`,
    score,
  );
}

function checkDischarge(product: ProductModel, requested: string) {
  const maximum = getDischarge(product);
  if (maximum === undefined) {
    return requirementCheck(
      "Discharge",
      "unknown",
      "Flow unknown.",
      0,
    );
  }
  if (requested === "unsure" || !requested) {
    return requirementCheck(
      "Discharge",
      "not-specified",
      "Not selected.",
      0,
    );
  }
  const minimum = Number(requested);
  const matches = maximum >= minimum;
  const score = matches
    ? 14
    : Math.max(0, 10 - (minimum - maximum) * 0.25);
  return requirementCheck(
    "Discharge",
    matches ? "match" : "mismatch",
    matches
      ? `${maximum} LPM max; meets ${minimum} LPM.`
      : `${maximum} LPM max; below ${minimum} LPM.`,
    score,
  );
}

function evaluateProduct(
  product: ProductModel,
  criteria: PumpFinderCriteria,
): PumpMatch {
  const checks = [
    checkApplication(product, criteria.application),
    checkCategory(product, criteria.category),
    checkSource(product, criteria.source),
    checkRequirement(product, criteria.requirement),
    checkHorsepower(product, criteria.horsepower),
    checkHead(product, criteria.head),
    checkDischarge(product, criteria.discharge),
    ...(product.specifications
      ? []
      : [
          requirementCheck(
            "Other specifications",
            "unknown",
            "Specs unavailable.",
            0,
          ),
        ]),
  ];
  return {
    product,
    checks: checks.map(({ check }) => check),
    score: checks.reduce((total, check) => total + check.score, 0),
  };
}

export function findMatchingProducts(criteria: PumpFinderCriteria): PumpMatch[] {
  return products
    .map((product) => evaluateProduct(product, criteria))
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
}
