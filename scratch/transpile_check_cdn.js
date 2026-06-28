const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const babelUrl = 'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js';
const cachePath = path.join(__dirname, 'babel-7.23.5.min.js');

async function getBabel() {
  if (fs.existsSync(cachePath)) {
    return fs.readFileSync(cachePath, 'utf8');
  }
  console.log('Downloading Babel 7.23.5 from CDN...');
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
    console.error('No react script block found!');
    process.exit(1);
  }

  const jsCode = babelScriptMatch[1];
  const preLines = htmlContent.split(/<script type="text\/babel"[^>]*>/)[0].split('\n').length;

  try {
    const babelSource = await getBabel();
    
    global.window = global;
    const fn = new Function(babelSource);
    fn();
    
    const Babel = global.Babel;
    if (!Babel) {
      console.error('Failed to initialize Babel 7.23.5 compiler.');
      process.exit(1);
    }

    console.log('Transpiling with Babel 7.23.5...');
    Babel.transform(jsCode, {
      presets: ['react'],
      filename: 'index.html'
    });
    console.log('SUCCESS: Compiled successfully with Babel 7.23.5!');
  } catch (err) {
    console.error('\n=== BABEL 7.23.5 ERROR ===');
    console.error(err.message);
    if (err.loc) {
      const actualLine = preLines + err.loc.line - 1;
      console.error(`\nError line in index.html: ~${actualLine} (Col: ${err.loc.column})`);
      const htmlLines = htmlContent.split('\n');
      const start = Math.max(0, actualLine - 5);
      const end = Math.min(htmlLines.length, actualLine + 5);
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
