import multer from "multer";
import path from "path";

//@configure storage
const createStorage = (directory) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, directory);
    },
    filename: (req, file, cb) => {
      cb(null, "IMG" + "-" + Date.now() + path.extname(file.originalname));
    },
  });

//@configure uploader
export const createProfileUploader = (directory) =>
  multer({
    storage: createStorage(directory),
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
      //@Check file extentions
      const fileTypes = /jpg|jpeg|png|gif|/;
      const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      //@if image is not valid
      if (!extname) {
        return cb(new Error("Error : Image Only!", false));
      }
      //@if image is valid
      cb(null, true);
    },
  });

export const createThumbnailUploader = (directory) =>
  multer({
    storage: createStorage(directory),
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
      //@Check file extentions
      const fileTypes = /jpg|jpeg|png|gif|/;
      const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      //@if image is not valid
      if (!extname) {
        return cb(new Error("Error : Image Only!", false));
      }
      //@if image is valid
      cb(null, true);
    },
  });
