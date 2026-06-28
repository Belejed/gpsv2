import subprocess
import time
import urllib.request
import json
import socket
import hashlib
import base64
import struct

def handshake(sock, host, path):
    key = base64.b64encode(hashlib.sha1(str(time.time()).encode()).digest()).decode()
    req = (
        f"GET {path} HTTP/1.1\r\n"
        f"Host: {host}\r\n"
        f"Upgrade: websocket\r\n"
        f"Connection: Upgrade\r\n"
        f"Sec-WebSocket-Key: {key}\r\n"
        f"Sec-WebSocket-Version: 13\r\n\r\n"
    )
    sock.sendall(req.encode())
    resp = sock.recv(4096).decode()
    if "101" not in resp:
        raise Exception("Handshake failed: " + resp)

def send_frame(sock, text):
    data = text.encode('utf-8')
    length = len(data)
    # Header: fin=1, rsv=0, opcode=1 (text) -> 0x81
    header = bytearray([0x81])
    # Client frames must be masked!
    mask = bytearray([0x12, 0x34, 0x56, 0x78])
    
    if length <= 125:
        header.append(length | 0x80)
    elif length <= 65535:
        header.append(126 | 0x80)
        header.extend(struct.pack("!H", length))
    else:
        header.append(127 | 0x80)
        header.extend(struct.pack("!Q", length))
        
    header.extend(mask)
    
    masked_data = bytearray(length)
    for i in range(length):
        masked_data[i] = data[i] ^ mask[i % 4]
        
    sock.sendall(header + masked_data)

def recv_frame(sock):
    # Read first 2 bytes
    head = sock.recv(2)
    if len(head) < 2:
        return None
    opcode = head[0] & 0x0f
    masked = head[1] & 0x80
    length = head[1] & 0x7f
    
    if length == 126:
        length = struct.unpack("!H", sock.recv(2))[0]
    elif length == 127:
        length = struct.unpack("!Q", sock.recv(8))[0]
        
    if masked:
        mask = sock.recv(4)
        
    payload = bytearray()
    while len(payload) < length:
        chunk = sock.recv(length - len(payload))
        if not chunk:
            break
        payload.extend(chunk)
        
    if masked:
        for i in range(length):
            payload[i] ^= mask[i % 4]
            
    if opcode == 8: # Connection close
        return None
    return payload.decode('utf-8', errors='ignore')

def main():
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    port = 9222
    # Start chrome in headless mode
    print("Launching Chrome...")
    chrome_proc = subprocess.Popen([
        chrome_path,
        "--headless",
        "--disable-gpu",
        f"--remote-debugging-port={port}",
        "--no-sandbox",
        "--user-data-dir=C:\\Users\\bluje\\AppData\\Local\\Temp\\chrome_dev_profile"
    ])
    
    time.sleep(2) # Wait for Chrome to bind port
    
    try:
        # Fetch targets list
        print("Fetching targets...")
        with urllib.request.urlopen(f"http://127.0.0.1:{port}/json/list") as response:
            targets = json.loads(response.read().decode())
            
        page_targets = [t for t in targets if t.get("type") == "page"]
        if not page_targets:
            raise Exception("No page targets found. Targets were: " + str(targets))
            
        target = page_targets[0]
        ws_url = target.get("webSocketDebuggerUrl")
        print("Connecting to target:", target.get("title"), ws_url)
        
        # Parse ws URL: ws://127.0.0.1:9222/devtools/page/xxxx
        ws_url = ws_url.replace("ws://", "")
        host_port, path = ws_url.split("/", 1)
        host, ws_port = host_port.split(":")
        path = "/" + path
        
        # Open TCP socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect((host, int(ws_port)))
        handshake(sock, host_port, path)
        sock.settimeout(2.0)
        
        # Enable Log and Console
        send_frame(sock, json.dumps({"id": 1, "method": "Log.enable"}))
        send_frame(sock, json.dumps({"id": 2, "method": "Console.enable"}))
        send_frame(sock, json.dumps({"id": 3, "method": "Runtime.enable"}))
        
        # Navigate to index.html
        local_url = "file:///c:/Users/bluje/Downloads/New folder (2)/index.html"
        print(f"Navigating to {local_url}...")
        send_frame(sock, json.dumps({
            "id": 4,
            "method": "Page.navigate",
            "params": {"url": local_url}
        }))
        
        print("Listening to console events for 15 seconds...")
        start_time = time.time()
        while time.time() - start_time < 15:
            try:
                frame = recv_frame(sock)
                if not frame:
                    break
                msg = json.loads(frame)
                method = msg.get("method")
                params = msg.get("params", {})
                
                # Check for runtime exception or console message
                if method == "Runtime.exceptionThrown":
                    details = params.get("exceptionDetails", {})
                    exception = details.get("exception", {})
                    text = details.get("text", "")
                    description = exception.get("description", "")
                    print(f"\n[EXCEPTION THROWN] {text}: {description}")
                    if "exception" in details and "stackTrace" in details["exception"]:
                        print("Stack trace:")
                        for frame_st in details["exception"]["stackTrace"]["callFrames"]:
                            print(f"  at {frame_st.get('functionName')} ({frame_st.get('url')}:{frame_st.get('lineNumber')}:{frame_st.get('columnNumber')})")
                elif method == "Console.messageAdded":
                    message = params.get("message", {})
                    print(f"\n[CONSOLE {message.get('level').upper()}] {message.get('text')} ({message.get('url')}:{message.get('line')}:{message.get('column')})")
                elif method == "Log.entryAdded":
                    entry = params.get("entry", {})
                    print(f"\n[LOG {entry.get('level').upper()}] {entry.get('text')} ({entry.get('url')})")
            except socket.timeout:
                continue
            except Exception as e:
                print("Error in loop:", e)
                break
        
        # Evaluate root innerHTML
        print("\nEvaluating document.getElementById('root').innerHTML...")
        send_frame(sock, json.dumps({
            "id": 100,
            "method": "Runtime.evaluate",
            "params": {"expression": "document.getElementById('root') ? document.getElementById('root').innerHTML : 'no-root'"}
        }))
        time.sleep(1)
        # Read frames to find our evaluation result
        sock.settimeout(1.0)
        for _ in range(10):
            try:
                frame = recv_frame(sock)
                if not frame:
                    break
                msg = json.loads(frame)
                if msg.get("id") == 100:
                    val = msg.get("result", {}).get("result", {}).get("value")
                    print("\n=== ROOT INNERHTML ===")
                    print(val)
                    break
            except socket.timeout:
                break
            except Exception as e:
                print("Error reading evaluation result:", e)
                break

    finally:
        print("Terminating Chrome...")
        chrome_proc.terminate()
        chrome_proc.wait()

if __name__ == "__main__":
    main()
