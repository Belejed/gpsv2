const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('c:/Users/bluje/Downloads/New folder (2)/index.html', 'utf8');
const compiledJs = fs.readFileSync('C:/Users/bluje/.gemini/antigravity/brain/a24819c6-5cae-427d-bf49-6bd57690f9bc/scratch/out/extracted.js', 'utf8');

// Replace the babel script tag with a clean script tag that JSDOM will run.
let cleanHtml = html
  .replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/babel-standalone[\s\S]*?<\/script>/, '')
  .replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/react\/[\s\S]*?<\/script>/, '')
  .replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/react-dom\/[\s\S]*?<\/script>/, '')
  .replace(
    /<script type="text\/babel" data-presets="react">[\s\S]*?<\/script>/,
    `<script>${compiledJs}</script>`
  );

const dom = new JSDOM(cleanHtml, {
  runScripts: "dangerously",
  resources: "usable",
  url: "http://localhost/"
});

// Set Node globals before requiring react
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

const React = require('react');
const ReactDOM = { ...require('react-dom'), ...require('react-dom/client') };

dom.window.React = React;
dom.window.ReactDOM = ReactDOM;

// Mock sessionStorage and localStorage
const store = {
  'gps_user_session': JSON.stringify({ id: 27, username: 'admin', name: 'Admin', role: 'admin' })
};

const storageMock = () => {
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { for (let k in store) delete store[k]; },
    removeItem: (key) => { delete store[key]; }
  };
};

dom.window.localStorage = storageMock();
dom.window.sessionStorage = storageMock();

// Mock fetch for Supabase calls
dom.window.fetch = async (url, options) => {
  console.log('MOCKED FETCH CALLED FOR URL:', url);
  
  let responseData = [];
  if (url.includes('/users')) {
    responseData = [
      { id: 27, username: 'admin', name: 'Admin', role: 'admin', password: 'adminpassword' },
      { id: 28, username: 'viewer', name: 'Viewer Account', role: 'view', password: 'viewerpassword' }
    ];
  } else if (url.includes('/units')) {
    responseData = [
      { id: 1, nopol: 'B1234ABC', ownership: 'PUNINAR', year: '2020', merk: 'HINO', assetType: 'TRAILER', location: 'NAGRAK', pool: 'TRAILER', statusPlan: 'UNPLAN', statusPasang: 'BELUM DIPASANG' }
    ];
  }
  
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new dom.window.Headers({
      'content-type': 'application/json',
      'content-range': `0-${responseData.length - 1}/${responseData.length}`
    }),
    json: async () => responseData,
    text: async () => JSON.stringify(responseData)
  };
};

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

console.log('Running JSDOM with compiled React scripts and mocked fetch...');

// Wait 5 seconds for React to mount with the loaded Supabase data
setTimeout(() => {
  try {
    const document = dom.window.document;
    const buttons = Array.from(document.querySelectorAll('.menu-item'));
    console.log('Found menu items:', buttons.map(b => b.textContent.trim()));
    
    const adminBtn = buttons.find(b => b.textContent.includes('Admin Panel'));
    if (adminBtn) {
      console.log('Clicking Admin Panel button...');
      adminBtn.click();
      
      // Wait another 1 second to let AdminView render and print the DOM to verify
      setTimeout(() => {
        console.log('AdminView rendered successfully! DOM snippet:', document.body.innerHTML.substring(0, 1000));
      }, 1000);
    } else {
      console.log('Admin Panel button not found!');
      console.log('Current body HTML:', document.body.innerHTML.substring(0, 1000));
    }
  } catch (e) {
    console.log('Error searching/clicking button:', e);
  }
}, 5000);

setTimeout(() => {
  console.log('Finished waiting.');
  process.exit(0);
}, 9000);
