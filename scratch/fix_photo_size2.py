content = open('index.html','r',encoding='utf-8').read()
lines = content.splitlines()
l = lines[3607]
print(repr(l[30:250]))

# The actual pattern in the file uses single quotes differently
# Let's search for the exact byte sequence
import re
# Find all patterns with photo dimensions
matches = list(re.finditer(r"width=\\'\" \+ \(isFull \? \\'150\\' : \\'110\\'\) \+ \\'\" height=\\'\" \+ \(isFull \? \\'120\\' : \\'80\\'\) \+ \\'\"", content))
print(f"Regex found: {len(matches)} matches")

# Try another approach - just replace the specific dimension strings in the photo HTML lines
old1 = "isFull ? '150' : '110'"
old2 = "isFull ? '120' : '80'"
count1 = content.count(old1)
count2 = content.count(old2)
print(f"Found '{old1}': {count1} times")
print(f"Found '{old2}': {count2} times")

if count1 > 0 and count2 > 0:
    # Only replace in the photo img tags (first 5 occurrences are all 5 photos)
    content = content.replace(old1, "isFull ? '190' : '130'")
    content = content.replace(old2, "isFull ? '155' : '95'")
    with open('index.html','w',encoding='utf-8') as f:
        f.write(content)
    print(f"DONE: replaced dimensions")
