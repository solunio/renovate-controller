fs = require('fs');

module.exports = JSON.parse(fs.readFileSync(process.env.CONFIG_PATH));