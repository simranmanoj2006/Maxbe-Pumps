import { categories, products, type ProductModel } from "./products";

export type PumpFinderCriteria = {
  application: string;
  category: string;
  source: string;
  requirement: string;
};

function productEvidence(product: ProductModel): string {
  const category = categories.find((item) => item.slug === product.categorySlug);
  return [
    category?.name,
    category?.description,
    product.applications?.join(" "),
    product.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesApplication(product: ProductModel, application: string): boolean {
  const evidence = productEvidence(product);
  switch (application) {
    case "agricultural":
      return /agricultur|farm|irrigat/.test(evidence);
    case "domestic":
      return /domestic|household|residential/.test(evidence);
    case "industrial":
      return /industrial/.test(evidence);
    default:
      return false;
  }
}

function matchesSource(product: ProductModel, source: string): boolean {
  const evidence = productEvidence(product);
  switch (source) {
    case "open-well":
      return /open well/.test(evidence);
    case "borewell":
      return /borewell/.test(evidence);
    case "water-tank":
      return /water tank|rainwater tank|rainwater harvesting tank|sump/.test(
        evidence,
      );
    default:
      return false;
  }
}

function matchesRequirement(
  product: ProductModel,
  requirement: string,
): boolean {
  const evidence = productEvidence(product);
  switch (requirement) {
    case "irrigation":
      return /irrigat|agricultur|farm/.test(evidence);
    case "domestic-supply":
      return /domestic water supply|residential water supply|household water/.test(
        evidence,
      );
    case "industrial-supply":
      return /industrial/.test(evidence);
    default:
      return false;
  }
}

export function findMatchingProducts(
  criteria: PumpFinderCriteria,
): ProductModel[] {
  if (
    criteria.application === "other" ||
    criteria.source === "other" ||
    criteria.requirement === "other"
  ) {
    return [];
  }

  return products.filter((product) => {
    if (
      criteria.category !== "unsure" &&
      product.categorySlug !== criteria.category
    ) {
      return false;
    }

    return (
      matchesApplication(product, criteria.application) &&
      matchesSource(product, criteria.source) &&
      matchesRequirement(product, criteria.requirement)
    );
  });
}
