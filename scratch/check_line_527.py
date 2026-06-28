with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
start_marker = '<script type="text/babel" data-presets="react">'
start_idx = content.find(start_marker)
if start_idx == -1:
    print("Not found start")
else:
    script_content = content[start_idx + len(start_marker):]
    end_idx = script_content.find('</script>')
    script_content = script_content[:end_idx]
    lines = script_content.splitlines()
    line_527 = lines[526]
    print('Line 527:', repr(line_527))
    for idx, char in enumerate(line_527):
        print(f'Char {idx}: {repr(char)} (hex {hex(ord(char))})')
