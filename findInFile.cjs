const fs = require('fs');
const content = fs.readFileSync('src/components/Dashboard.jsx', 'utf8');
const lines = content.split('\n');
const keyword = process.argv[2] || '';
console.log(`Searching for "${keyword}"...`);
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes(keyword.toLowerCase())) {
    console.log(`${idx + 1}: ${line.trim().substring(0, 120)}`);
  }
});
