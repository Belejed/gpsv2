content = open('index.html','r',encoding='utf-8').read()
lines = content.splitlines()
# Print raw line 3608 (0-indexed = 3607)
l = lines[3607]
print('Raw line 3608:')
print(repr(l[30:200]))

# Try to replace with simple string.replace on the actual content
old = "width=\\\"' + (isFull ? '150' : '110') + '\\\" height=\\\"' + (isFull ? '120' : '80') + '\\\""
count = content.count(old)
print(f'\nFound old pattern: {count} times')

if count > 0:
    new = "width=\\\"' + (isFull ? '190' : '130') + '\\\" height=\\\"' + (isFull ? '155' : '95') + '\\\""
    content = content.replace(old, new)
    with open('index.html','w',encoding='utf-8') as f:
        f.write(content)
    print(f'Replaced {count} occurrences - DONE')
