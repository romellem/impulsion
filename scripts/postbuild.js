const fs = require('fs-extra');
const path = require('path');

const dist_file = path.resolve(__dirname, '../dist/implosion.js');
const docs_file = path.resolve(__dirname, '../docs/implosion.js');
fs.copySync(dist_file, docs_file);
