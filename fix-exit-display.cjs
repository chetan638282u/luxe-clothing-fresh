const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) results.push(file);
    }
  });
  return results;
}
const files = walk('src/components');
let changed = false;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  content = content.replace(/exit=\{isMobile \? undefined :/g, "exit={isMobile ? { display: 'none', opacity: 0, transition: { duration: 0 } } :");
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
    changed = true;
  }
});
if (!changed) console.log('No files needed updating.');
