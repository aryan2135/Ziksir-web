import multer from "multer";
import path from "path";
import fs from "fs";

const uploadRoot = path.resolve(process.cwd(), "uploads", "requests");

// Ensure upload folder exists
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "request-image-" + unique + path.extname(file.originalname).toLowerCase());
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const extOK = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOK = allowed.test(file.mimetype);
  if (extOK && mimeOK) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
