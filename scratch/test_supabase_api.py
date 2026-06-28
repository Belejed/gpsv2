import urllib.request
import json

url = "https://xbouteylammxknskzztv.supabase.co/rest/v1/units?statusPasang=eq.TEKNISI%20SUBMITTED&select=id,nopol,statusPasang,teknisiPelaksana,gpsSerialLama,gpsSerialBaru,gpsImeiBaru,fotoKendaraan"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhib3V0ZXlsYW1teGtuc2t6enR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NjI3NzIsImV4cCI6MjA5NzEzODc3Mn0.s-25G-3TBOfEamiXEK26x6wTxHbId8N5S-sh0tvJJ20",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhib3V0ZXlsYW1teGtuc2t6enR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NjI3NzIsImV4cCI6MjA5NzEzODc3Mn0.s-25G-3TBOfEamiXEK26x6wTxHbId8N5S-sh0tvJJ20"
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print("Successfully connected to Supabase! Sample data:")
        for d in data:
            print(d)
except Exception as e:
    print("Failed to connect to Supabase:", e)
    if hasattr(e, 'read'):
        print("Error response:", e.read().decode())
