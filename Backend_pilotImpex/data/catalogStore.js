const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const DATA_DIR = __dirname;
const CATALOG_PATH = path.join(DATA_DIR, "catalog.json");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const UPLOADS_DIR = path.join(DATA_DIR, "..", "uploads");

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function ensureStorage() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  if (!fs.existsSync(CATALOG_PATH)) {
    fs.writeFileSync(
      CATALOG_PATH,
      JSON.stringify({ groups: [], updatedAt: new Date().toISOString() }, null, 2) + "\n"
    );
  }
}

function backupCatalog() {
  ensureStorage();
  if (!fs.existsSync(CATALOG_PATH)) return;

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(BACKUP_DIR, `catalog-${timestamp}.json`);
  fs.copyFileSync(CATALOG_PATH, backupPath);
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function text(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

function optionalText(value, fallback = undefined) {
  const next = text(value, "");
  return next || fallback;
}

function numberValue(value, fallback = undefined) {
  if (value === undefined || value === null || value === "") return fallback;
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function booleanValue(value, fallback = true) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  return ["true", "1", "yes", "on", "in-stock"].includes(String(value).toLowerCase());
}

function stringList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => text(item)).filter(Boolean);
  }

  return String(value || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function specifications(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item, index) => ({
        srNo: numberValue(item.srNo, index + 1),
        characteristic: text(item.characteristic),
        specification: text(item.specification),
      }))
      .filter((item) => item.characteristic || item.specification);
  }

  return String(value)
    .split(/\r?\n/)
    .map((line, index) => {
      const [first, ...rest] = line.split(":");
      return {
        srNo: index + 1,
        characteristic: text(first),
        specification: text(rest.join(":")),
      };
    })
    .filter((item) => item.characteristic || item.specification);
}

function normalizeDocument(document) {
  const originalName = text(document.originalName || document.name);
  return {
    id: text(document.id, crypto.randomUUID()),
    name: text(document.name, originalName),
    url: text(document.url),
    originalName,
    mimeType: text(document.mimeType, "application/pdf"),
    size: numberValue(document.size, 0),
    uploadedAt: text(document.uploadedAt, new Date().toISOString()),
  };
}

function normalizeProduct(product, index = 0) {
  const name = text(product.name);
  const slug = slugify(product.slug || name);

  return {
    name,
    slug,
    image: text(product.image),
    specifications: specifications(product.specifications),
    caution: optionalText(product.caution, ""),
    applications: stringList(product.applications),
    documents: Array.isArray(product.documents) ? product.documents.map(normalizeDocument) : [],
    order: numberValue(product.order, index + 1),
    price: optionalText(product.price),
    unit: optionalText(product.unit),
    moq: optionalText(product.moq),
    description: optionalText(product.description),
    category: optionalText(product.category),
    inStock: booleanValue(product.inStock, true),
    rating: numberValue(product.rating),
    purity: optionalText(product.purity),
    purityValue: numberValue(product.purityValue),
  };
}

function normalizeGroup(group, index = 0) {
  const name = text(group.name);
  const slug = slugify(group.slug || name);

  return {
    name,
    slug,
    description: text(group.description),
    order: numberValue(group.order, index + 1),
    products: Array.isArray(group.products)
      ? group.products.map(normalizeProduct).filter((product) => product.name && product.slug)
      : [],
  };
}

function sortCatalog(catalog) {
  catalog.groups.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  catalog.groups.forEach((group) => {
    group.products.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  });
  return catalog;
}

function normalizeCatalog(catalog) {
  return sortCatalog({
    groups: Array.isArray(catalog.groups)
      ? catalog.groups.map(normalizeGroup).filter((group) => group.name && group.slug)
      : [],
    updatedAt: text(catalog.updatedAt, new Date().toISOString()),
  });
}

function readCatalog() {
  ensureStorage();

  try {
    const raw = fs.readFileSync(CATALOG_PATH, "utf8");
    return normalizeCatalog(JSON.parse(raw));
  } catch (error) {
    throw httpError(500, `Unable to read catalog: ${error.message}`);
  }
}

function writeCatalog(catalog) {
  ensureStorage();
  backupCatalog();
  const normalized = normalizeCatalog({ ...catalog, updatedAt: new Date().toISOString() });
  const tmpPath = `${CATALOG_PATH}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(normalized, null, 2) + "\n");
  fs.renameSync(tmpPath, CATALOG_PATH);
  return normalized;
}

function getCatalog() {
  return readCatalog();
}

function findGroup(catalog, slug) {
  return catalog.groups.find((group) => group.slug === slugify(slug));
}

function findProduct(catalog, slug) {
  const productSlug = slugify(slug);
  for (const group of catalog.groups) {
    const index = group.products.findIndex((product) => product.slug === productSlug);
    if (index !== -1) {
      return { group, product: group.products[index], index };
    }
  }
  return null;
}

function assertUniqueGroupSlug(catalog, slug, currentSlug) {
  const normalizedSlug = slugify(slug);
  if (catalog.groups.some((group) => group.slug === normalizedSlug && group.slug !== currentSlug)) {
    throw httpError(409, "A product group with this slug already exists.");
  }
}

function assertUniqueProductSlug(catalog, slug, currentSlug) {
  const normalizedSlug = slugify(slug);
  for (const group of catalog.groups) {
    if (group.products.some((product) => product.slug === normalizedSlug && product.slug !== currentSlug)) {
      throw httpError(409, "A product with this slug already exists.");
    }
  }
}

function groupPayload(body, existing) {
  const name = text(body.name, existing?.name);
  const slug = slugify(body.slug || existing?.slug || name);
  if (!name) throw httpError(400, "Group name is required.");
  if (!slug) throw httpError(400, "Group slug is required.");

  return {
    name,
    slug,
    description: text(body.description, existing?.description),
    order: numberValue(body.order, existing?.order),
    products: existing?.products || [],
  };
}

function productPayload(body, existing) {
  const name = text(body.name, existing?.name);
  const slug = slugify(body.slug || existing?.slug || name);
  if (!name) throw httpError(400, "Product name is required.");
  if (!slug) throw httpError(400, "Product slug is required.");
  const specificationSource = Object.prototype.hasOwnProperty.call(body, "specifications")
    ? body.specifications
    : existing?.specifications;
  const applicationSource = Object.prototype.hasOwnProperty.call(body, "applications")
    ? body.applications
    : existing?.applications;

  return {
    name,
    slug,
    image: text(body.image, existing?.image),
    specifications: specifications(specificationSource),
    caution: text(body.caution, existing?.caution),
    applications: stringList(applicationSource),
    documents: existing?.documents || [],
    order: numberValue(body.order, existing?.order),
    price: optionalText(body.price, existing?.price),
    unit: optionalText(body.unit, existing?.unit),
    moq: optionalText(body.moq, existing?.moq),
    description: optionalText(body.description, existing?.description),
    category: optionalText(body.category, existing?.category),
    inStock: booleanValue(body.inStock, existing?.inStock ?? true),
    rating: numberValue(body.rating, existing?.rating),
    purity: optionalText(body.purity, existing?.purity),
    purityValue: numberValue(body.purityValue, existing?.purityValue),
  };
}

function createGroup(body) {
  const catalog = readCatalog();
  const nextGroup = groupPayload(body);
  assertUniqueGroupSlug(catalog, nextGroup.slug);
  nextGroup.order = nextGroup.order ?? catalog.groups.length + 1;
  catalog.groups.push(nextGroup);
  writeCatalog(catalog);
  return nextGroup;
}

function updateGroup(slug, body) {
  const catalog = readCatalog();
  const group = findGroup(catalog, slug);
  if (!group) throw httpError(404, "Product group not found.");

  const nextGroup = groupPayload(body, group);
  assertUniqueGroupSlug(catalog, nextGroup.slug, group.slug);
  Object.assign(group, nextGroup);
  writeCatalog(catalog);
  return group;
}

function deleteGroup(slug) {
  const catalog = readCatalog();
  const index = catalog.groups.findIndex((group) => group.slug === slugify(slug));
  if (index === -1) throw httpError(404, "Product group not found.");

  const [removed] = catalog.groups.splice(index, 1);
  writeCatalog(catalog);
  removed.products.forEach(deleteProductUploads);
  return removed;
}

function createProduct(body) {
  const catalog = readCatalog();
  const group = findGroup(catalog, body.groupSlug);
  if (!group) throw httpError(400, "A valid product group is required.");

  const nextProduct = productPayload(body);
  assertUniqueProductSlug(catalog, nextProduct.slug);
  nextProduct.order = nextProduct.order ?? group.products.length + 1;
  group.products.push(nextProduct);
  writeCatalog(catalog);
  return nextProduct;
}

function updateProduct(slug, body) {
  const catalog = readCatalog();
  const match = findProduct(catalog, slug);
  if (!match) throw httpError(404, "Product not found.");

  const targetGroup = findGroup(catalog, body.groupSlug || match.group.slug);
  if (!targetGroup) throw httpError(400, "A valid product group is required.");

  const nextProduct = productPayload(body, match.product);
  assertUniqueProductSlug(catalog, nextProduct.slug, match.product.slug);

  if (targetGroup.slug === match.group.slug) {
    match.group.products[match.index] = nextProduct;
  } else {
    match.group.products.splice(match.index, 1);
    nextProduct.order = nextProduct.order ?? targetGroup.products.length + 1;
    targetGroup.products.push(nextProduct);
  }

  writeCatalog(catalog);
  return nextProduct;
}

function deleteProduct(slug) {
  const catalog = readCatalog();
  const match = findProduct(catalog, slug);
  if (!match) throw httpError(404, "Product not found.");

  const [removed] = match.group.products.splice(match.index, 1);
  writeCatalog(catalog);
  deleteProductUploads(removed);
  return removed;
}

function addDocument(slug, file, displayName) {
  if (!file) throw httpError(400, "PDF document is required.");

  const catalog = readCatalog();
  const match = findProduct(catalog, slug);
  if (!match) throw httpError(404, "Product not found.");

  const document = normalizeDocument({
    id: crypto.randomUUID(),
    name: text(displayName, file.originalname),
    url: `/uploads/${file.filename}`,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    uploadedAt: new Date().toISOString(),
  });

  match.product.documents.push(document);
  writeCatalog(catalog);
  return document;
}

function renameDocument(slug, documentId, body) {
  const catalog = readCatalog();
  const match = findProduct(catalog, slug);
  if (!match) throw httpError(404, "Product not found.");

  const document = match.product.documents.find((item) => item.id === documentId);
  if (!document) throw httpError(404, "Document not found.");

  const nextName = text(body.name, document.name);
  if (!nextName) throw httpError(400, "Document name is required.");

  document.name = nextName;
  writeCatalog(catalog);
  return document;
}

function deleteDocument(slug, documentId) {
  const catalog = readCatalog();
  const match = findProduct(catalog, slug);
  if (!match) throw httpError(404, "Product not found.");

  const index = match.product.documents.findIndex((document) => document.id === documentId);
  if (index === -1) throw httpError(404, "Document not found.");

  const [removed] = match.product.documents.splice(index, 1);
  writeCatalog(catalog);
  deleteUploadedFile(removed.url);
  return removed;
}

function setProductImage(slug, file) {
  if (!file) throw httpError(400, "Product image is required.");

  const catalog = readCatalog();
  const match = findProduct(catalog, slug);
  if (!match) throw httpError(404, "Product not found.");

  const previousImage = match.product.image;
  match.product.image = `/uploads/${file.filename}`;
  match.product.imageOriginalName = file.originalname;
  writeCatalog(catalog);
  if (previousImage && previousImage !== match.product.image) {
    deleteUploadedFile(previousImage);
  }
  return match.product;
}

function deleteProductUploads(product) {
  if (!product) return;
  if (product.image) deleteUploadedFile(product.image);
  if (Array.isArray(product.documents)) {
    product.documents.forEach((document) => deleteUploadedFile(document.url));
  }
}

function deleteUploadedFile(url) {
  if (!url || !url.startsWith("/uploads/")) return;

  const filename = path.basename(url);
  const filePath = path.join(UPLOADS_DIR, filename);
  if (!filePath.startsWith(UPLOADS_DIR)) return;

  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (error) {
    // Metadata should still be corrected even if an old file is already gone.
  }
}

module.exports = {
  CATALOG_PATH,
  UPLOADS_DIR,
  createGroup,
  createProduct,
  deleteDocument,
  deleteGroup,
  deleteProduct,
  getCatalog,
  addDocument,
  renameDocument,
  setProductImage,
  slugify,
  updateGroup,
  updateProduct,
};
