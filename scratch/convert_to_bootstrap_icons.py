import re

mapping = {
    "ti-activity": "bi-activity",
    "ti-alert-circle": "bi-exclamation-circle",
    "ti-alert-triangle": "bi-exclamation-triangle",
    "ti-arrow-back-up": "bi-arrow-counterclockwise",
    "ti-arrow-left": "bi-arrow-left",
    "ti-bell": "bi-bell",
    "ti-brightness-half": "bi-brightness-medium",
    "ti-calendar": "bi-calendar",
    "ti-calendar-event": "bi-calendar-event",
    "ti-calendar-plus": "bi-calendar-plus",
    "ti-camera": "bi-camera",
    "ti-chart-bar": "bi-bar-chart",
    "ti-chart-pie": "bi-pie-chart",
    "ti-check": "bi-check",
    "ti-checklist": "bi-list-check",
    "ti-chevron-down": "bi-chevron-down",
    "ti-chevron-left": "bi-chevron-left",
    "ti-chevron-right": "bi-chevron-right",
    "ti-chevron-up": "bi-chevron-up",
    "ti-circle-check": "bi-check-circle",
    "ti-clipboard-check": "bi-clipboard-check",
    "ti-clipboard-list": "bi-clipboard-data",
    "ti-cloud-check": "bi-cloud-check",
    "ti-cloud-off": "bi-cloud-slash",
    "ti-cloud-upload": "bi-cloud-upload",
    "ti-code": "bi-code",
    "ti-database": "bi-database",
    "ti-device-desktop-analytics": "bi-display",
    "ti-download": "bi-download",
    "ti-edit": "bi-pencil",
    "ti-external-link": "bi-box-arrow-up-right",
    "ti-eye": "bi-eye",
    "ti-eye-off": "bi-eye-slash",
    "ti-hand-finger": "bi-hand-index",
    "ti-history": "bi-history",
    "ti-info-circle": "bi-info-circle",
    "ti-layout-dashboard": "bi-speedometer2",
    "ti-link": "bi-link-45deg",
    "ti-list": "bi-list",
    "ti-loader": "bi-arrow-repeat",
    "ti-lock": "bi-lock",
    "ti-logout": "bi-box-arrow-right",
    "ti-map-pin": "bi-geo-alt",
    "ti-menu-2": "bi-list",
    "ti-mood-happy": "bi-emoji-smile",
    "ti-player-play": "bi-play",
    "ti-plus": "bi-plus",
    "ti-qrcode": "bi-qr-code",
    "ti-refresh": "bi-arrow-clockwise",
    "ti-report": "bi-file-earmark-text",
    "ti-search": "bi-search",
    "ti-settings": "bi-gear",
    "ti-shield-check": "bi-shield-check",
    "ti-sun": "bi-sun",
    "ti-table": "bi-table",
    "ti-tool": "bi-wrench",
    "ti-tools": "bi-tools",
    "ti-trash": "bi-trash",
    "ti-upload": "bi-upload",
    "ti-user-plus": "bi-person-plus",
    "ti-users": "bi-people",
    "ti-wifi": "bi-wifi",
    "ti-x": "bi-x"
}

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace CDN link
old_cdn = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/dist/tabler-icons.min.css">'
new_cdn = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">'
if old_cdn in content:
    content = content.replace(old_cdn, new_cdn)
else:
    old_cdn_cdnjs = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/2.47.0/iconfont/tabler-icons.min.css">'
    content = content.replace(old_cdn_cdnjs, new_cdn)

# Replace class usages
def repl(match):
    full_match = match.group(0)
    ti_name = match.group(1)
    bi_name = mapping.get("ti-" + ti_name, ti_name)
    # If the mapped name starts with bi-, remove that prefix since we prepend bi bi-
    if bi_name.startswith("bi-"):
        bi_name = bi_name[3:]
    return full_match.replace("ti ti-" + ti_name, "bi bi-" + bi_name)

content_new = re.sub(r'ti ti-([\w\-]+)', repl, content)

# Check if there are any remaining "ti ti-" strings
remaining = re.findall(r'ti ti-[\w\-]+', content_new)
if remaining:
    print("Warning, remaining ti- icons:", set(remaining))

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content_new)

print("Conversion complete!")
