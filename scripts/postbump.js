const fs = require("fs");

function getPackageVersion() {
  return JSON.parse(fs.readFileSync("package.json", "utf-8")).version;
}
const libPackagePath = "projects/mc-image-editor/package.json";
const libPackage = JSON.parse(fs.readFileSync(libPackagePath));
libPackage.version = getPackageVersion();
fs.writeFileSync(libPackagePath, JSON.stringify(libPackage, null, 2), "utf-8");
