const fs = require('fs');
const path = require('path');
const dir = 'apps/web/src/pages';
const files = fs.readdirSync(dir);
files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');
    if (content.includes('http://localhost:3001')) {
      content = "import { API_BASE_URL } from '../config';\n" + content;
      // Use backticks for string interpolation in the fetch
      content = content.replace(/'http:\/\/localhost:3001([^']*)'/g, "`\${API_BASE_URL}$1`");
      fs.writeFileSync(p, content);
      console.log('Updated ' + file);
    }
  }
});
