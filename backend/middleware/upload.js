const multer = require("multer");
const AppError = require("../utils/appError");

const fileLimit = {
  fileSize: 10 * 1024 * 1024, 
};

const videoFormats = ["video/mp4", "video/mkv", "video/avi", "video/mov", "video/webm"];

const storage = multer.memoryStorage(); 

const fileFilter = (req, file, cb) => {
  if (videoFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Only MP4, MKV, AVI, MOV, and WEBM formats are allowed!", 400), false);
  }
};

const videoUpload = multer({
  storage: storage,
  limits: fileLimit,
  fileFilter,
}).single("video"); 

module.exports = videoUpload;
