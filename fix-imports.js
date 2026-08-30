const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'backend', 'src')).filter(f => f.endsWith('.js'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Match relative imports that don't already end in .js
  content = content.replace(/(from\s+['"])(\.[^'"]+)(['"])/g, (match, p1, p2, p3) => {
    if (!p2.endsWith('.js')) {
      return `${p1}${p2}.js${p3}`;
    }
    return match;
  });
  // Also match import('...') dynamically if any
  content = content.replace(/(import\s*\(\s*['"])(\.[^'"]+)(['"]\s*\))/g, (match, p1, p2, p3) => {
    if (!p2.endsWith('.js')) {
      return `${p1}${p2}.js${p3}`;
    }
    return match;
  });
  fs.writeFileSync(file, content, 'utf8');
});

console.log('Fixed imports!');
