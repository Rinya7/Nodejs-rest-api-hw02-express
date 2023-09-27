const multer = require("multer");
const path = require("path");
const fs = require("fs");

const tempDir = path.join(process.cwd(), "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const multerConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "temp"));
  },
  filename: function (req, file, cb) {
    const timeCreate = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .replace(/T/g, "_")
      .replace(/Z/g, "");
    cb(null, timeCreate + "_" + file.originalname);
  },
});

const upload = multer({ storage: multerConfig });

module.exports = upload;
