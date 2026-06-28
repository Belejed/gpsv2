import os
import re

script_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.abspath(os.path.join(script_dir, '..', 'index.html'))

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract react script block
match = re.search(r'<script type="text/babel"[^>]*>(.*?)</script>', content, re.DOTALL)
if not match:
    match = re.search(r"<script type='text/babel'[^>]*>(.*?)</script>", content, re.DOTALL)

if not match:
    print("No react script block found!")
    exit(1)

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

# Helper to peek at next chars
def peek(n=1):
    if char_idx + n < len(script_code):
        return script_code[char_idx:char_idx+n]
    return ''

while char_idx < len(script_code):
    char = script_code[char_idx]
    
    # Track line and column numbers
    if char == '\n':
        current_line += 1
        char_idx += 1
        continue
    
    # Handle escape
    if char == '\\':
        char_idx += 2
        continue
        
    # Check if we are in a comment
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
            
    # Check if we are inside a normal string literal '...' or "..."
    if not stack or stack[-1] == 'placeholder':
        if not in_string:
            if char in ["'", '"']:
                in_string = True
                string_char = char
        else:
            if char == string_char:
                in_string = False
            char_idx += 1
            continue

    if in_string:
        char_idx += 1
        continue

    # Print log for lines 3500 to 4110
    log_enabled = (3500 <= current_line <= 4110)

    # Now we handle template literals and placeholders
    if char == '`':
        if stack and stack[-1] == 'backtick':
            stack.pop()
            if log_enabled:
                print(f"L{current_line}: Pop backtick. Stack: {stack}")
        else:
            if log_enabled and 'placeholder' in stack:
                print(f"L{current_line}: Push nested backtick. Stack: {stack}")
            stack.append('backtick')
            if log_enabled and 'placeholder' not in stack:
                print(f"L{current_line}: Push outer backtick. Stack: {stack}")
            
    elif char == '$' and peek(2) == '${':
        if stack and stack[-1] == 'backtick':
            stack.append('placeholder')
            if log_enabled:
                print(f"L{current_line}: Push placeholder. Stack: {stack}")
            char_idx += 1
            
    elif char == '}':
        if stack and stack[-1] == 'placeholder':
            stack.pop()
            if log_enabled:
                print(f"L{current_line}: Pop placeholder. Stack: {stack}")
            
    char_idx += 1
