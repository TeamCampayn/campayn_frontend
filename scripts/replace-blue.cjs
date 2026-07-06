const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      const ext = path.extname(file);
      if (['.tsx', '.ts', '.css'].includes(ext)) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);
console.log(`Found ${files.length} files to scan.`);

let replacedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  if (content.toLowerCase().includes('#0066ff')) {
    // Let's do smart replacements
    content = content.replace(/bg-\[\#0066FF\]/gi, 'bg-black');
    content = content.replace(/hover:bg-\[\#0066FF\]\/90/gi, 'hover:bg-zinc-900');
    content = content.replace(/hover:bg-\[\#0066FF\]/gi, 'hover:bg-zinc-900');
    content = content.replace(/text-\[\#0066FF\]/gi, 'text-black');
    content = content.replace(/border-\[\#0066FF\]/gi, 'border-black');
    content = content.replace(/focus:ring-\[\#0066FF\]/gi, 'focus:ring-black');
    content = content.replace(/focus-visible:ring-\[\#0066FF\]/gi, 'focus-visible:ring-black');
    
    // Replace remaining #0066FF values in charts, fills, strokes, colors array, etc.
    content = content.replace(/\#0066FF/gi, '#000000');

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated: ${path.relative(srcDir, file)}`);
      replacedCount++;
    }
  }
});

console.log(`Successfully updated ${replacedCount} files.`);
