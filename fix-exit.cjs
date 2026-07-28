const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Pattern 1: Object variants
  const pattern1 = /exit=\{isMobile \? \{ opacity: 0, pointerEvents: 'none', transition: \{ duration: 0 \} \} : (\{[^}]+\})\}/g;
  
  // Pattern 2: String variants (like "exit")
  const pattern2 = /exit=\{isMobile \? \{ opacity: 0, pointerEvents: 'none', transition: \{ duration: 0 \} \} : "([^"]+)"\}/g;
  
  // Pattern 3: Nested object variants (if any)
  const pattern3 = /exit=\{isMobile \? \{ opacity: 0, pointerEvents: 'none', transition: \{ duration: 0 \} \} : (\{ opacity: 0, scale: 0\.92, y: 20 \})\}/g;

  let newContent = content
    .replace(pattern1, 'exit={isMobile ? undefined : $1}')
    .replace(pattern2, 'exit={isMobile ? undefined : "$1"}')
    .replace(pattern3, 'exit={isMobile ? undefined : $1}');
    
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log('Updated:', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir('./src/components');
console.log('Done!');
