import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(__dirname, "..");
const backendRoot = path.resolve(frontendRoot, "..", "Backend_pilotImpex");
const publicRoot = path.join(frontendRoot, "public");
const sourceCatalog = path.join(backendRoot, "data", "catalog.json");
const sourceUploads = path.join(backendRoot, "uploads");
const targetCatalog = path.join(publicRoot, "catalog.json");
const targetUploads = path.join(publicRoot, "uploads");

function copyDirectory(source, target) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(target, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (entry.name === ".gitignore") continue;

    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

fs.mkdirSync(publicRoot, { recursive: true });

if (fs.existsSync(sourceCatalog)) {
  fs.copyFileSync(sourceCatalog, targetCatalog);
} else if (!fs.existsSync(targetCatalog)) {
  console.warn(`Catalog source not found: ${sourceCatalog}`);
}

copyDirectory(sourceUploads, targetUploads);
