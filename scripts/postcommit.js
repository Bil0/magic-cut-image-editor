const shell = require("shelljs");
shell.exec(
  "git add projects/cegid-lib/package.json && git commit --amend --no-edit"
);
