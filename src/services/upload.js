import { writeFileSync } from "fs";
import { resolve } from "path";
import { LOCAL_UPLOAD_PATH } from "../config/storage";

export function uploadFile (buffer, name, type) {
  const fileName = `${name}.${type.split("/")[1]}`;
  const filePath = resolve(LOCAL_UPLOAD_PATH, fileName);
  writeFileSync(filePath, buffer);
  return fileName;
}
