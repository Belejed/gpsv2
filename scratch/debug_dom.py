import os
import subprocess
import time
import re

script_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.abspath(os.path.join(script_dir, '..', 'index.html'))
temp_html_path = os.path.abspath(os.path.join(script_dir, 'temp_debug.html'))
log_file = os.path.abspath(os.path.join(script_dir, 'chrome.log'))

if os.path.exists(log_file):
    os.remove(log_file)

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

debug_script = """
<script>
  console.log("DEBUG_SCRIPT_RUNNING");
  window.addEventListener('error', function(e) {
    console.log("UNCAUGHT_ERROR: " + e.message + " at " + e.filename + ":" + e.lineno + ":" + e.colno);
  });
  
  // Dump script tag details
  setTimeout(function() {
    var script = document.querySelector('script[type="text/babel"]');
    if (script) {
      console.log("SCRIPT_DOM_INFO: length=" + script.textContent.length);
      console.log("SCRIPT_DOM_TAIL:\\n" + script.textContent.slice(-300));
    } else {
      console.log("SCRIPT_DOM_INFO: Script tag not found!");
    }
  }, 2000);
</script>
"""

modified_content = content.replace('</body>', debug_script + '\n</body>')

with open(temp_html_path, 'w', encoding='utf-8') as f:
    f.write(modified_content)

chrome_path = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
html_url = 'file:///' + temp_html_path.replace('\\\\', '/').replace('\\', '/') + '?cb=' + str(time.time())

print('Running Chrome headlessly...')
proc = subprocess.Popen([
    chrome_path,
    '--headless',
    '--disable-gpu',
    '--enable-logging',
    '--v=1',
    f'--log-file={log_file}',
    html_url
])

time.sleep(6)
proc.terminate()
time.sleep(1)
proc.kill()

if os.path.exists(temp_html_path):
    os.remove(temp_html_path)

if os.path.exists(log_file):
    with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
        log_content = f.read()
    
    print('\n=== OUTPUT ===')
    # Print lines containing SCRIPT_DOM
    for line in log_content.splitlines():
        if 'SCRIPT_DOM' in line or 'CONSOLE' in line:
            # Filter noise
            if not any(n in line.lower() for n in ['usb_service', 'usb_device', 'direct_composition', 'proxy_resolution', 'segmentation_platform', 'google_apis', 'verbose1']):
                print(line.strip())
else:
    print('No log file.')
