const path = require("path");
try { process.loadEnvFile(path.join(__dirname, '.env')); } catch (e) {}
const crypto = require("crypto");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { fetChData } = require("./fetchData");
const { formSubmit } = require("./controller/form-submit");
const {
  UPLOADS_DIR,
  addDocument,
  createGroup,
  createProduct,
  deleteDocument,
  deleteGroup,
  deleteProduct,
  getCatalog,
  renameDocument,
  setProductImage,
  updateGroup,
  updateProduct,
} = require("./data/catalogStore");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const SESSION_COOKIE = "pilot_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const sessions = new Map();
const defaultCorsOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:8081",
  "http://127.0.0.1:8081",
];

const allowedOrigins = (process.env.CORS_ORIGIN || defaultCorsOrigins.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.ngrok-free.dev')) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/", (_req, res) => res.json({ ok: true, service: "pilot-api", uptime: process.uptime() }));
app.get("/health", (_req, res) => res.json({ ok: true, uptime: process.uptime() }));

const imageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const documentMimeTypes = new Set(["application/pdf"]);

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, UPLOADS_DIR);
  },
  filename(_req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
    const safeBase = base || "upload";
    const token = crypto.randomBytes(8).toString("hex");
    callback(null, `${Date.now()}-${token}-${safeBase}${extension}`);
  },
});

function uploader(allowedMimeTypes, maxFileSize) {
  return multer({
    storage,
    limits: { fileSize: maxFileSize },
    fileFilter(_req, file, callback) {
      if (allowedMimeTypes.has(file.mimetype)) return callback(null, true);
      const error = new Error("Unsupported file type.");
      error.status = 400;
      return callback(error);
    },
  });
}

const uploadImage = uploader(imageMimeTypes, 5 * 1024 * 1024);
const uploadDocument = uploader(documentMimeTypes, 10 * 1024 * 1024);

function parseCookies(header = "") {
  return header
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const index = part.indexOf("=");
      if (index === -1) return cookies;
      cookies[part.slice(0, index)] = decodeURIComponent(part.slice(index + 1));
      return cookies;
    }, {});
}

function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return null;
  return { username, password };
}

function getSession(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;

  const session = sessions.get(token);
  if (!session) return null;

  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(token);
    return null;
  }

  return { token, session };
}

function requireAdmin(req, res, next) {
  const current = getSession(req);
  if (!current) return res.status(401).json({ message: "Admin login required." });

  req.admin = current.session;
  req.adminToken = current.token;
  return next();
}

function setSessionCookie(res, token) {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: SESSION_TTL_MS,
    path: "/",
  });
}

function clearSessionCookie(res) {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  });
}

function sendCatalog(res) {
  res.json(getCatalog());
}

// Public APIs
app.get("/catalog", (_req, res, next) => {
  try {
    sendCatalog(res);
  } catch (error) {
    next(error);
  }
});

app.get("/data", (req, res, next) => {
  fetChData("1IB__sV0GWlqeglfQ3JpvPVjsu7PB7qD48dIXky_l0F4", "pilot_impex_product_details")
    .then((data) => res.json(data))
    .catch(next);
});

app.post("/form", formSubmit);

// Admin auth
app.post("/admin/login", (req, res) => {
  const credentials = getAdminCredentials();
  if (!credentials) {
    return res.status(500).json({ message: "ADMIN_USERNAME and ADMIN_PASSWORD are not configured." });
  }

  const username = String(req.body?.username || "");
  const password = String(req.body?.password || "");
  if (username !== credentials.username || password !== credentials.password) {
    return res.status(401).json({ message: "Invalid admin credentials." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { username, createdAt: Date.now() });
  setSessionCookie(res, token);
  return res.json({ username });
});

app.post("/admin/logout", requireAdmin, (req, res) => {
  sessions.delete(req.adminToken);
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get("/admin/me", requireAdmin, (req, res) => {
  res.json({ username: req.admin.username });
});

app.get("/admin/catalog", requireAdmin, (_req, res, next) => {
  try {
    sendCatalog(res);
  } catch (error) {
    next(error);
  }
});

// Admin catalog mutations
app.post("/admin/groups", requireAdmin, (req, res, next) => {
  try {
    createGroup(req.body);
    sendCatalog(res);
  } catch (error) {
    next(error);
  }
});

app.put("/admin/groups", requireAdmin, (req, res, next) => {
  try {
    updateGroup(req.body.currentSlug || req.body.slug, req.body);
    sendCatalog(res);
  } catch (error) {
    next(error);
  }
});

app.put("/admin/groups/:slug", requireAdmin, (req, res, next) => {
  try {
    updateGroup(req.params.slug, req.body);
    sendCatalog(res);
  } catch (error) {
    next(error);
  }
});

app.delete("/admin/groups", requireAdmin, (req, res, next) => {
  try {
    deleteGroup(req.body.slug);
    sendCatalog(res);
  } catch (error) {
    next(error);
  }
});

app.delete("/admin/groups/:slug", requireAdmin, (req, res, next) => {
  try {
    deleteGroup(req.params.slug);
    sendCatalog(res);
  } catch (error) {
    next(error);
  }
});

app.post("/admin/products", requireAdmin, (req, res, next) => {
  try {
    createProduct(req.body);
    sendCatalog(res);
  } catch (error) {
    next(error);
  }
});

app.put("/admin/products", requireAdmin, (req, res, next) => {
  try {
    updateProduct(req.body.currentSlug || req.body.slug, req.body);
    sendCatalog(res);
  } catch (error) {
    next(error);
  }
});

app.put("/admin/products/:slug", requireAdmin, (req, res, next) => {
  try {
    updateProduct(req.params.slug, req.body);
    sendCatalog(res);
  } catch (error) {
    next(error);
  }
});

app.delete("/admin/products", requireAdmin, (req, res, next) => {
  try {
    deleteProduct(req.body.slug);
    sendCatalog(res);
  } catch (error) {
    next(error);
  }
});

app.delete("/admin/products/:slug", requireAdmin, (req, res, next) => {
  try {
    deleteProduct(req.params.slug);
    sendCatalog(res);
  } catch (error) {
    next(error);
  }
});

app.post(
  "/admin/products/:slug/documents",
  requireAdmin,
  uploadDocument.single("document"),
  (req, res, next) => {
    try {
      addDocument(req.params.slug, req.file, req.body.name);
      sendCatalog(res);
    } catch (error) {
      next(error);
    }
  }
);

app.put("/admin/products/:slug/documents/:documentId", requireAdmin, (req, res, next) => {
  try {
    renameDocument(req.params.slug, req.params.documentId, req.body);
    sendCatalog(res);
  } catch (error) {
    next(error);
  }
});

app.delete("/admin/products/:slug/documents/:documentId", requireAdmin, (req, res, next) => {
  try {
    deleteDocument(req.params.slug, req.params.documentId);
    sendCatalog(res);
  } catch (error) {
    next(error);
  }
});

app.post("/admin/products/:slug/image", requireAdmin, uploadImage.single("image"), (req, res, next) => {
  try {
    setProductImage(req.params.slug, req.file);
    sendCatalog(res);
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  const status = error.status || (error instanceof multer.MulterError ? 400 : 500);
  res.status(status).json({ message: error.message || "Unexpected server error." });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
