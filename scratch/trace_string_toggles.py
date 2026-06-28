import os
import re

script_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.abspath(os.path.join(script_dir, '..', 'index.html'))

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'<script type="text/babel"[^>]*>(.*?)</script>', content, re.DOTALL)
if not match:
    match = re.search(r"<script type='text/babel'[^>]*>(.*?)</script>", content, re.DOTALL)

script_code = match.group(1)
if '<script type="text/babel"' in content:
    line_offset = content.split('<script type="text/babel"')[0].count('\n') + 1
else:
    line_offset = content.split("<script type='text/babel'")[0].count('\n') + 1

stack = []
in_string = False
string_char = None
char_idx = 0
current_line = line_offset
current_col = 1

toggles = []

def peek(n=1):
    if char_idx + n < len(script_code):
        return script_code[char_idx:char_idx+n]
    return ''

while char_idx < len(script_code):
    char = script_code[char_idx]
    
    if char == '\n':
        current_line += 1
        current_col = 1
        char_idx += 1
        continue
    
    if char == '\\':
        char_idx += 2
        current_col += 2
        continue
        
    if not stack or stack[-1] != 'backtick':
        if char == '/' and peek(2) == '//':
            while char_idx < len(script_code) and script_code[char_idx] != '\n':
                char_idx += 1
            continue
        if char == '/' and peek(2) == '/*':
            char_idx += 2
            while char_idx < len(script_code) and not (script_code[char_idx] == '*' and script_code[char_idx+1:char_idx+2] == '/'):
                if script_code[char_idx] == '\n':
                    current_line += 1
                char_idx += 1
            char_idx += 2
            continue
            
    is_quote = char in ["'", '"']
    was_in_string = in_string
    
    if not stack or stack[-1] == 'placeholder':
        if not in_string:
            if is_quote:
                in_string = True
                string_char = char
                toggles.append((current_line, current_col, char, "OPEN"))
        else:
            if char == string_char:
                in_string = False
                toggles.append((current_line, current_col, char, "CLOSE"))

    if was_in_string and char_idx < len(script_code):
        char_idx += 1
        current_col += 1
        continue
        
    if char == '`':
        if stack and stack[-1] == 'backtick':
            stack.pop()
        else:
            stack.append('backtick')
            
    elif char == '$' and peek(2) == '${':
        if stack and stack[-1] == 'backtick':
            stack.append('placeholder')
            char_idx += 1
            current_col += 1
            
    elif char == '}':
        if stack and stack[-1] == 'placeholder':
            stack.pop()
            
    char_idx += 1
    current_col += 1

print("=== LAST 30 STRING TOGGLE EVENTS BEFORE L3886 ===")
count = 0
for t in toggles:
    if t[0] <= 3886:
        print(f"L{t[0]}:C{t[1]:2d} | Char: {repr(t[2])} | Event: {t[3]}")
