// src/utils/store.js
const fs = require('fs');
const path = require('path');

function getPath(filename) {
  return path.join(__dirname, '../../data', filename);
}

function readJSON(filename) {
  const filePath = getPath(filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data || '[]');
}

function writeJSON(filename, data) {
  const filePath = getPath(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { readJSON, writeJSON };
