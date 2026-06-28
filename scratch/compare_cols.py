import re

# Supabase actual columns from schema query
supabase_cols = [
    'id','ownership','nopol','year','merk','assetType','location','pool','dedicate',
    'planDate','lokasiPasang','picLapangan','teknisiPelaksana','modelGpsBaru',
    'gpsSerialBaru','gpsImeiBaru','nomorSIM','provider','gps','buzzer','sos',
    'sensorWing','camera','fotoKendaraan','fotoGPSLama','fotoGPSBaru',
    'fotoHasilInstalasi','statusPasang','picCekFisikLama','picCekFisikBaru',
    'picCekKondisiSelesai','picCekFitur','picFotoSerahTerima','itCekAplikasi',
    'itFotoIntegrasi','itFotoAbnormality','cmtCekAplikasi','cmtFotoTerimaFisik',
    'cmtFotoTerminasi','easygoDicopot','updatedAt','created_at','updated_at','gpsSerialLama'
]

content = open('index.html','r',encoding='utf-8').read()
lines = content.splitlines()

# Find mapKeysToColumns start
start = None
for i, l in enumerate(lines):
    if 'const mapKeysToColumns' in l:
        start = i
        break

print(f"mapKeysToColumns found at line {start+1}")

# Extract all col = 'xxx' assignments in that function block
code_cols = set()
for l in lines[start:start+70]:
    m = re.search(r"col = '([^']+)'", l)
    if m:
        code_cols.add(m.group(1))

# Also check 'statusSystem' and 'fotoOdometer' that are used in updates
extra_check = ['statusSystem', 'fotoOdometer', 'statusPlan']
for extra in extra_check:
    if extra in content:
        code_cols.add(extra)

supabase_set = set(supabase_cols)

print('\n=== Kolom yang DIKIRIM CODE tapi TIDAK ADA di Supabase (AKAN ERROR) ===')
missing_in_supa = code_cols - supabase_set
for c in sorted(missing_in_supa):
    print(f'  MISSING IN SUPABASE: {c}')

print('\n=== Kolom di Supabase tapi TIDAK DIPETAKAN di kode ===')
not_in_code = supabase_set - code_cols - {'id','created_at','updated_at'}
for c in sorted(not_in_code):
    print(f'  NOT MAPPED IN CODE: {c}')

print('\n=== Kolom yang matched ===')
matched = code_cols & supabase_set
for c in sorted(matched):
    print(f'  OK: {c}')

# Now check actual updates objects in the code for unknown columns
print('\n=== Searching for statusSystem in upsert calls ===')
for i, l in enumerate(lines, 1):
    if 'statusSystem' in l or 'fotoOdometer' in l:
        print(f'  Line {i}: {l.strip()[:100]}')
