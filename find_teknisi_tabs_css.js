const fs = require('fs');
const content = fs.readFileSync('Migrasi_GPS_Puninar_App.html', 'utf8');
const lines = content.split('\n');

console.log('All Teknisi tabs CSS:');
lines.forEach((line, idx) => {
  if ((line.includes('teknisi-tabs') || line.includes('teknisi-tab-btn')) && (line.includes('{') || line.includes(':'))) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
