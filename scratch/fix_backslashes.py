with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any escaped interpolation indicators back to standard JS template literal insertions
fixed_content = content.replace('\\${', '${')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print("Successfully removed all backslashes from template literals in index.html.")
