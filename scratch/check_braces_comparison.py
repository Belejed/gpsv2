import re

def analyze_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r'<script type="text/babel"[^>]*>(.*?)</script>', content, re.DOTALL)
    if not match:
        return None
    script_code = match.group(1)
    
    open_braces = 0
    close_braces = 0
    open_parens = 0
    close_parens = 0
    open_brackets = 0
    close_brackets = 0
    
    in_string = False
    string_char = None
    escape = False
    
    for i, char in enumerate(script_code):
        if escape:
            escape = False
            continue
        if char == '\\':
            escape = True
            continue
        if in_string:
            if char == string_char:
                in_string = False
            continue
        if char in ["'", '"', '`']:
            in_string = True
            string_char = char
            continue
            
        if char == '{':
            open_braces += 1
        elif char == '}':
            close_braces += 1
        elif char == '(':
            open_parens += 1
        elif char == ')':
            close_parens += 1
        elif char == '[':
            open_brackets += 1
        elif char == ']':
            close_brackets += 1
            
    return {
        'braces': (open_braces, close_braces, open_braces - close_braces),
        'parens': (open_parens, close_parens, open_parens - close_parens),
        'brackets': (open_brackets, close_brackets, open_brackets - close_brackets)
    }

res_curr = analyze_file('index.html')
res_prev = analyze_file('index.html.before_convert.bak')

print("CURRENT index.html:")
print("Braces:", res_curr['braces'])
print("Parens:", res_curr['parens'])
print("Brackets:", res_curr['brackets'])
print("\nBEFORE CONVERT index.html:")
print("Braces:", res_prev['braces'])
print("Parens:", res_prev['parens'])
print("Brackets:", res_prev['brackets'])
