const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.jsx')) results.push(file);
  });
  return results;
}
walk('src').forEach(f => {
  let text = fs.readFileSync(f, 'utf8');
  if (text.includes('loading="lazy"')) {
    fs.writeFileSync(f, text.replace(/loading="lazy"/g, ''));
    console.log('Updated', f);
  }
});
