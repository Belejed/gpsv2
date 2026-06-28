with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.splitlines()
found = []
for i, line in enumerate(lines):
    if '\\${' in line:
        found.append((i + 1, line))

if found:
    print("Found " + str(len(found)) + " remaining instances of backslash-dollars:")
    for num, text in found:
        print("  Line " + str(num) + ": " + text.strip())
else:
    print("Zero instances of backslash-dollars found in index.html. Clean!")
