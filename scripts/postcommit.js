const shell = require("shelljs");
shell.exec(
  "git add projects/mc-image-editor/package.json && git commit --amend --no-edit"
);
