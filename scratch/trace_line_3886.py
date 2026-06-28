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

# Helper to peek at next chars
def peek(n=1):
    if char_idx + n < len(script_code):
        return script_code[char_idx:char_idx+n]
    return ''

print(f"=== CHAR-BY-CHAR PARSER TRACE FOR LINE 3886 ===")

while char_idx < len(script_code):
    char = script_code[char_idx]
    
    # Track line and column numbers
    if char == '\n':
        current_line += 1
        current_col = 1
        char_idx += 1
        continue
    
    # Handle escape
    if char == '\\':
        char_idx += 2
        current_col += 2
        continue
        
    # Check comments
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
            
    # Check strings
    is_quote = char in ["'", '"']
    was_in_string = in_string
    
    if not stack or stack[-1] == 'placeholder':
        if not in_string:
            if is_quote:
                in_string = True
                string_char = char
        else:
            if char == string_char:
                in_string = False

    if current_line == 3886:
        # Print char and parser state
        state_str = f"in_str={in_string}({string_char if in_string else '-'})"
        stack_str = f"stack={stack}"
        print(f"L{current_line}:C{current_col:2d} | Char: {repr(char):6s} | {state_str:12s} | {stack_str}")
        
    if was_in_string and char_idx < len(script_code):
        char_idx += 1
        current_col += 1
        continue
        
    # Now we handle template literals and placeholders
    if char == '`':
        if stack and stack[-1] == 'backtick':
            stack.pop()
            if current_line == 3886:
                print("  >>> POP BACKTICK")
        else:
            stack.append('backtick')
            if current_line == 3886:
                print("  >>> PUSH BACKTICK")
            
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
