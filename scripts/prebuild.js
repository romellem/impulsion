const fs = require('fs-extra');
const path = require('path');

const dist_dir = path.resolve(__dirname, '../dist');
fs.emptyDirSync(dist_dir);
