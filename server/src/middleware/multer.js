const multer = require("multer");
const { ALLOW_FILE_TYPES, MAX_SIZE } = require("../config/config");

const storage = multer.memoryStorage();

// Filterning
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("photo/")) {
    console.log(file.mimetype);
    return cb(new Error("Only images are Accepted"), false);
  }
  if (!file.size > MAX_SIZE) {
    return cb(new Error("File size exceeds the Maximum Limit"), false);
  }
  if (!ALLOW_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Error("File Extention Is not Allowed"), false);
  }
  cb(null, true);
};

const userPhotoUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// export

module.exports = userPhotoUpload;
