const path = require('path');
const fs = require('fs');

const typeDefs = require('./typeDefs');

function mergeResolvers(target, source) {
  for (const key of Object.keys(source)) {
    if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
      target[key] = target[key] || {};
      mergeResolvers(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

const resolversDir = path.join(__dirname, '..', 'resolvers');
let resolvers = {};

if (fs.existsSync(resolversDir)) {
  const files = fs.readdirSync(resolversDir).filter((f) => f.endsWith('.js'));
  for (const file of files) {
    const mod = require(path.join(resolversDir, file));
    mergeResolvers(resolvers, mod);
  }
}

module.exports = { typeDefs, resolvers };