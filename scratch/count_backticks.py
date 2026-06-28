import os

script_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.abspath(os.path.join(script_dir, '..', 'index.html'))

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find downloadDOCReport function
start_idx = content.find('const downloadDOCReport =')
# Find exportToCSV (the next function) to end our search
end_idx = content.find('const exportToCSV =')

if start_idx == -1 or end_idx == -1:
    print("Failed to locate function bounds")
    exit(1)

func_code = content[start_idx:end_idx]
lines = func_code.splitlines()

# Stack to track:
# - 'backtick' when inside a template literal
# - 'placeholder' when inside ${ }
stack = []
print("=== TEMPLATE LITERAL STACK TRACE ===")

# To find actual line number in index.html, we need the start line of downloadDOCReport
pre_lines = content[:start_idx].count('\n') + 1

for idx, line in enumerate(lines):
    line_num = pre_lines + idx
    # We parse characters in the line
    i = 0
    while i < len(line):
        char = line[i]
        
        # Handle escape characters
        if char == '\\' and i + 1 < len(line):
            i += 2
            continue
            
        # We are looking for:
        # ` (backtick)
        # ${
        # }
        
        if char == '`':
            if stack and stack[-1] == 'backtick':
                stack.pop()
                print(f"Line {line_num:4d}: Closed backtick. Stack size: {len(stack)} ({stack})")
            else:
                stack.append('backtick')
                print(f"Line {line_num:4d}: Opened backtick. Stack size: {len(stack)} ({stack})")
        
        elif char == '$' and i + 1 < len(line) and line[i+1] == '{':
            if stack and stack[-1] == 'backtick':
                stack.append('placeholder')
                print(f"Line {line_num:4d}: Opened placeholder ${{. Stack size: {len(stack)} ({stack})")
                i += 1  # Skip the '{'
            else:
                # Outside a backtick, ${ is just normal characters (or syntax error, but let's log it)
                print(f"Line {line_num:4d}: WARNING: ${{ found outside template literal!")
                i += 1
                
        elif char == '}':
            if stack and stack[-1] == 'placeholder':
                stack.pop()
                print(f"Line {line_num:4d}: Closed placeholder }}. Stack size: {len(stack)} ({stack})")
            # If not a placeholder, it might be a JS block curly brace, which we don't track here
            
        i += 1

print("\n=== FINAL STATUS ===")
print("Remaining Stack:", stack)
if stack:
    print("ERROR: Unbalanced template literals or placeholders detected!")
else:
    print("SUCCESS: Template literals are balanced inside downloadDOCReport.")
