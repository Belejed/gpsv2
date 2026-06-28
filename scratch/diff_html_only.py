import os
import difflib

bak_path = os.path.abspath('../index.html.bak')
cur_path = os.path.abspath('../index.html')

with open(bak_path, 'r', encoding='utf-8') as f:
    bak = f.readlines()
with open(cur_path, 'r', encoding='utf-8') as f:
    cur = f.readlines()

def get_blocks(lines):
    in_style = False
    in_script = False
    style_lines = set()
    script_lines = set()
    for idx, line in enumerate(lines):
        if '<style>' in line or '<style ' in line:
            in_style = True
        if '</style>' in line:
            style_lines.add(idx)
            in_style = False
            continue
        if '<script type="text/babel"' in line or "<script type='text/babel'" in line:
            in_script = True
        if '</script>' in line and in_script:
            script_lines.add(idx)
            in_script = False
            continue
        if in_style:
            style_lines.add(idx)
        if in_script:
            script_lines.add(idx)
    return style_lines, script_lines

bak_style, bak_script = get_blocks(bak)
cur_style, cur_script = get_blocks(cur)

diff = difflib.unified_diff(bak, cur, fromfile='index.html.bak', tofile='index.html', n=1)
for line in diff:
    if line.startswith('+++') or line.startswith('---') or line.startswith('@@'):
        print(line.strip())
        continue
    content = line[1:]
    is_style_or_script = False
    
    if line.startswith('+'):
        for idx, cur_line in enumerate(cur):
            if cur_line == content:
                if idx in cur_style or idx in cur_script:
                    is_style_or_script = True
                    break
    elif line.startswith('-'):
        for idx, bak_line in enumerate(bak):
            if bak_line == content:
                if idx in bak_style or idx in bak_script:
                    is_style_or_script = True
                    break
                    
    if not is_style_or_script:
        print(line.strip())
