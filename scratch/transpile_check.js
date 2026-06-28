const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const babelUrl = 'https://unpkg.com/@babel/standalone/babel.min.js';
const cachePath = path.join(__dirname, 'babel.min.js');

async function getBabel() {
  if (fs.existsSync(cachePath)) {
    console.log('Loading Babel from cache...');
    return fs.readFileSync(cachePath, 'utf8');
  }
  console.log('Downloading Babel Standalone from unpkg...');
  const res = await fetch(babelUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch Babel: ${res.statusText}`);
  }
  const data = await res.text();
  fs.writeFileSync(cachePath, data, 'utf8');
  return data;
}

async function main() {
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const babelScriptMatch = htmlContent.match(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/);

  if (!babelScriptMatch) {
    console.error('No <script type="text/babel"> block found in index.html!');
    process.exit(1);
  }

  const jsCode = babelScriptMatch[1];
  const preLines = htmlContent.split(/<script type="text\/babel"[^>]*>/)[0].split('\n').length;

  try {
    const babelSource = await getBabel();
    
    // Evaluate Babel source in global scope
    // Standalone Babel registers itself as global.Babel
    global.window = global;
    const fn = new Function(babelSource);
    fn();
    
    const Babel = global.Babel;
    if (!Babel) {
      console.error('Failed to initialize Babel compiler from standalone source.');
      process.exit(1);
    }

    console.log('Transpiling React/JSX code...');
    Babel.transform(jsCode, {
      presets: ['react'],
      filename: 'index.html'
    });
    console.log('SUCCESS: Code compiled successfully with Babel! No syntax errors found.');
  } catch (err) {
    console.error('\n=== BABEL TRANSPILE ERROR ===');
    console.error(err.message);
    if (err.loc) {
      const actualLine = preLines + err.loc.line - 1;
      console.error(`\nEstimated error line in index.html: ~${actualLine} (Col: ${err.loc.column})`);
      // Print context lines around the error in index.html
      const htmlLines = htmlContent.split('\n');
      const start = Math.max(0, actualLine - 10);
      const end = Math.min(htmlLines.length, actualLine + 10);
      console.error('\nContext:');
      for (let i = start; i < end; i++) {
        const marker = (i + 1) === actualLine ? '>>> ' : '    ';
        console.error(`${marker}${i + 1}: ${htmlLines[i]}`);
      }
    } else {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

main();
