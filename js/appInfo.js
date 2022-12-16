import { repoaddress, thisAppName } from "../config/dev-env";

let showDummyData = () => {
  return (dumdat = [thisAppName, repoaddress]);
};

let osc = () => {
  let system = require("os");
  const tmpdir = system.tmpdir.toString();
  const ostype = system.type.toString();
};

//export { showDummyData, osc }
