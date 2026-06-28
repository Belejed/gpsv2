const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('c:/Users/bluje/Downloads/New folder (2)/index.html', 'utf8');
const compiledJs = fs.readFileSync('C:/Users/bluje/.gemini/antigravity/brain/a24819c6-5cae-427d-bf49-6bd57690f9bc/scratch/out/extracted.js', 'utf8');

// Replace the babel script tag with the compiled script
const cleanHtml = html.replace(
  /<script type="text\/babel" data-presets="react">[\s\S]*?<\/script>/,
  `<script>${compiledJs}</script>`
);

// Mock localStorage and sessionStorage
const store = {
  'gps_user_session': JSON.stringify({ id: 27, username: 'admin', name: 'Admin', role: 'admin' }),
  'puninar_gps_units': JSON.stringify([
    { id: 1, nopol: 'B1234ABC', ownership: 'PUNINAR', year: '2020', merk: 'HINO', assetType: 'TRAILER', location: 'NAGRAK', pool: 'TRAILER', statusPlan: 'UNPLAN', statusPasang: 'BELUM DIPASANG' }
  ])
};

const storageMock = () => {
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { for (let k in store) delete store[k]; },
    removeItem: (key) => { delete store[key]; }
  };
};

const dom = new JSDOM(cleanHtml, {
  runScripts: "dangerously",
  resources: "usable",
  url: "http://localhost/"
});

dom.window.localStorage = storageMock();
dom.window.sessionStorage = storageMock();

dom.window.console.error = (...args) => {
  console.log('BROWSER CONSOLE ERROR:', ...args);
};

dom.window.console.log = (...args) => {
  console.log('BROWSER CONSOLE LOG:', ...args);
};

// Listen for uncaught exceptions
dom.window.addEventListener('error', (event) => {
  console.log('BROWSER UNCAUGHT EXCEPTION:', event.error ? (event.error.stack || event.error.message) : event.message);
});

console.log('Running JSDOM with compiled React script. Waiting for initial load...');

setTimeout(() => {
  try {
    const document = dom.window.document;
    const buttons = Array.from(document.querySelectorAll('.menu-item'));
    console.log('Found menu items:', buttons.map(b => b.textContent.trim()));
    
    const adminBtn = buttons.find(b => b.textContent.includes('Admin Panel'));
    if (adminBtn) {
      console.log('Clicking Admin Panel button...');
      adminBtn.click();
    } else {
      console.log('Admin Panel button not found!');
    }
  } catch (e) {
    console.log('Error searching/clicking button:', e);
  }
}, 4000);

setTimeout(() => {
  console.log('Finished waiting.');
  process.exit(0);
}, 8000);
