import json
import urllib.request

url = "https://xbouteylammxknskzztv.supabase.co/rest/v1/units?id=gt.0"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhib3V0ZXlsYW1teGtuc2t6enR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NjI3NzIsImV4cCI6MjA5NzEzODc3Mn0.s-25G-3TBOfEamiXEK26x6wTxHbId8N5S-sh0tvJJ20"

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

data = {
    "planDate": None,
    "lokasiPasang": None,
    "picLapangan": None,
    "teknisiPelaksana": None,
    "gpsSerialLama": None,
    "statusPasang": "BELUM DIPASANG",
    "modelGpsBaru": None,
    "gpsImeiBaru": None,
    "gpsSerialBaru": None,
    "nomorSIM": None,
    "provider": None,
    "gps": None,
    "buzzer": None,
    "sos": None,
    "sensorWing": None,
    "camera": None,
    "fotoKendaraan": None,
    "fotoGPSLama": None,
    "fotoGPSBaru": None,
    "fotoHasilInstalasi": None,
    "picCekFisikLama": None,
    "picCekFisikBaru": None,
    "picCekKondisiSelesai": None,
    "picCekFitur": None,
    "picFotoSerahTerima": None,
    "itCekAplikasi": None,
    "itFotoIntegrasi": None,
    "itFotoAbnormality": None,
    "cmtCekAplikasi": None,
    "cmtFotoTerimaFisik": None,
    "cmtFotoTerminasi": None,
    "easygoDicopot": None,
    "updatedAt": None
}

req = urllib.request.Request(
    url, 
    data=json.dumps(data).encode("utf-8"), 
    headers=headers, 
    method="PATCH"
)

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.status}")
        print("Successfully reset all units in Supabase!")
except Exception as e:
    print(f"Error resetting database: {e}")
