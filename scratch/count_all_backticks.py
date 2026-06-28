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

# Stack to track:
# - ('backtick', line_num, col_num, snippet) when inside a template literal
# - ('placeholder', line_num, col_num, snippet) when inside ${ }
stack = []
print("=== SCANNING ENTIRE BABEL SCRIPT FOR TEMPLATE LITERALS ===")

in_string = False
string_char = None
escape = False

# We want to properly tokenize:
# - Single line comments //
# - Multi-line comments /* */
# - Regular string literals '...' or "..." (where backticks or ${ are ignored)
# - Template literals `...` (where ${ starts a placeholder, and inside placeholder we have normal JS code again)

i = 0
if '<script type="text/babel"' in content:
    line_offset = content.split('<script type="text/babel"')[0].count('\n') + 1
else:
    line_offset = content.split("<script type='text/babel'")[0].count('\n') + 1

# Let's parse character by character
char_idx = 0
current_line = line_offset
current_col = 1

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
        current_col = 1
        char_idx += 1
        continue
    
    # Handle escape
    if char == '\\':
        char_idx += 2
        current_col += 2
        continue
        
    # Check if we are in a comment
    # Note: comments are only recognized outside of string/template literals
    if not stack or stack[-1][0] != 'backtick':
        # Check for single line comment
        if char == '/' and peek(2) == '//':
            # Skip until newline
            while char_idx < len(script_code) and script_code[char_idx] != '\n':
                char_idx += 1
            continue
        # Check for multi-line comment
        if char == '/' and peek(2) == '/*':
            char_idx += 2
            while char_idx < len(script_code) and not (script_code[char_idx] == '*' and script_code[char_idx+1:char_idx+2] == '/'):
                if script_code[char_idx] == '\n':
                    current_line += 1
                    current_col = 1
                else:
                    current_col += 1
                char_idx += 1
            char_idx += 2
            current_col += 2
            continue
            
    # Check if we are inside a normal string literal '...' or "..."
    # Strings are only checked when we are NOT in a template literal, OR when we are in a placeholder.
    if not stack or stack[-1][0] == 'placeholder':
        if not in_string:
            if char in ["'", '"']:
                in_string = True
                string_char = char
        else:
            if char == string_char:
                in_string = False
            char_idx += 1
            current_col += 1
            continue

    if in_string:
        char_idx += 1
        current_col += 1
        continue

    # Now we handle template literals and placeholders
    if char == '`':
        if stack and stack[-1][0] == 'backtick':
            opening = stack.pop()
            # print(f"L{current_line}: Closed backtick opened at L{opening[1]}")
        else:
            stack.append(('backtick', current_line, current_col, script_code[char_idx:char_idx+20].strip()))
            # print(f"L{current_line}: Opened backtick")
            
    elif char == '$' and peek(2) == '${':
        if stack and stack[-1][0] == 'backtick':
            stack.append(('placeholder', current_line, current_col, '${'))
            # print(f"L{current_line}: Opened placeholder")
            char_idx += 1
            current_col += 1
        else:
            # $ outside template literal is just a char (e.g. jQuery, regex, or string)
            pass
            
    elif char == '}':
        if stack and stack[-1][0] == 'placeholder':
            stack.pop()
            # print(f"L{current_line}: Closed placeholder")
            
    char_idx += 1
    current_col += 1

print("\n=== FINAL STACK STATUS ===")
if stack:
    print(f"ERROR: Found {len(stack)} unmatched items:")
    for item in stack:
        print(f"  Type: {item[0]:12s} | Line: {item[1]:4d} | Col: {item[2]:2d} | Snippet: {item[3]}")
else:
    print("SUCCESS: All template literals and placeholders are perfectly balanced!")
