import os

file_path = "index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update style tag in downloadDOCReport
search_style = """          <style>
            body { font-family: 'Arial', sans-serif; color: #1e293b; background: #ffffff; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; font-size: 10pt; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; color: #1e293b; }
            .section-header { font-size: 12pt; font-weight: bold; background-color: #e2e8f0; padding: 6px; margin-top: 15px; margin-bottom: 10px; border-left: 5px solid #3b82f6; }
            .photo-box { border: 1px solid #cbd5e1; padding: 5px; text-align: center; background-color: #f8fafc; }
            .photo-fallback { border: 1px dashed #94a3b8; padding: 20px; text-align: center; color: #94a3b8; font-weight: bold; }
          </style>"""

replace_style = """          <style>
            body { font-family: 'Arial', sans-serif; color: #1e293b; background: #ffffff; padding: ${isFull ? '20px' : '10px'}; }
            table { width: 100%; border-collapse: collapse; margin-bottom: ${isFull ? '20px' : '10px'}; }
            th, td { border: 1px solid #cbd5e1; padding: ${isFull ? '8px' : '4px'}; font-size: ${isFull ? '10pt' : '9pt'}; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; color: #1e293b; }
            .section-header { font-size: ${isFull ? '12pt' : '10.5pt'}; font-weight: bold; background-color: #e2e8f0; padding: ${isFull ? '6px' : '4px'}; margin-top: ${isFull ? '15px' : '8px'}; margin-bottom: ${isFull ? '10px' : '6px'}; border-left: 5px solid #3b82f6; }
            .photo-box { border: 1px solid #cbd5e1; padding: ${isFull ? '5px' : '3px'}; text-align: center; background-color: #f8fafc; }
            .photo-fallback { border: 1px dashed #94a3b8; padding: ${isFull ? '20px' : '10px'}; text-align: center; color: #94a3b8; font-weight: bold; font-size: ${isFull ? '10pt' : '8.5pt'}; }
          </style>"""

assert search_style in content, "Error: search_style not found"
content = content.replace(search_style, replace_style)

# 2. Update photos width & height
# Photo 1: fotoKendaraan
search_p1 = """              <td style="width: 25%; text-align: center; vertical-align: top;">
                ${u.fotoKendaraan ? `
                  <div class="photo-box">
                    <img src="${getImgUrl(u.fotoKendaraan)}" width="150" height="120" style="object-fit: contain;" />
                    <div style="font-size: 8pt; font-weight: bold; margin-top: 4px;">Foto Kendaraan</div>
                  </div>` : `"""

replace_p1 = """              <td style="width: 25%; text-align: center; vertical-align: top;">
                ${u.fotoKendaraan ? `
                  <div class="photo-box">
                    <img src="${getImgUrl(u.fotoKendaraan)}" width="${isFull ? '150' : '110'}" height="${isFull ? '120' : '80'}" style="object-fit: contain;" />
                    <div style="font-size: ${isFull ? '8pt' : '7.5pt'}; font-weight: bold; margin-top: 4px;">Foto Kendaraan</div>
                  </div>` : `"""

assert search_p1 in content, "Error: search_p1 not found"
content = content.replace(search_p1, replace_p1)

# Photo 2: fotoGPSLama
search_p2 = """              <td style="width: 25%; text-align: center; vertical-align: top;">
                ${u.fotoGPSLama ? `
                  <div class="photo-box">
                    <img src="${getImgUrl(u.fotoGPSLama)}" width="150" height="120" style="object-fit: contain;" />
                    <div style="font-size: 8pt; font-weight: bold; margin-top: 4px;">Foto GPS Lama</div>
                  </div>` : `"""

replace_p2 = """              <td style="width: 25%; text-align: center; vertical-align: top;">
                ${u.fotoGPSLama ? `
                  <div class="photo-box">
                    <img src="${getImgUrl(u.fotoGPSLama)}" width="${isFull ? '150' : '110'}" height="${isFull ? '120' : '80'}" style="object-fit: contain;" />
                    <div style="font-size: ${isFull ? '8pt' : '7.5pt'}; font-weight: bold; margin-top: 4px;">Foto GPS Lama</div>
                  </div>` : `"""

assert search_p2 in content, "Error: search_p2 not found"
content = content.replace(search_p2, replace_p2)

# Photo 3: fotoGPSBaru
search_p3 = """              <td style="width: 25%; text-align: center; vertical-align: top;">
                ${u.fotoGPSBaru ? `
                  <div class="photo-box">
                    <img src="${getImgUrl(u.fotoGPSBaru)}" width="150" height="120" style="object-fit: contain;" />
                    <div style="font-size: 8pt; font-weight: bold; margin-top: 4px;">Foto GPS Baru</div>
                  </div>` : `"""

replace_p3 = """              <td style="width: 25%; text-align: center; vertical-align: top;">
                ${u.fotoGPSBaru ? `
                  <div class="photo-box">
                    <img src="${getImgUrl(u.fotoGPSBaru)}" width="${isFull ? '150' : '110'}" height="${isFull ? '120' : '80'}" style="object-fit: contain;" />
                    <div style="font-size: ${isFull ? '8pt' : '7.5pt'}; font-weight: bold; margin-top: 4px;">Foto GPS Baru</div>
                  </div>` : `"""

assert search_p3 in content, "Error: search_p3 not found"
content = content.replace(search_p3, replace_p3)

# Photo 4: fotoHasilInstalasi
search_p4 = """              <td style="width: 25%; text-align: center; vertical-align: top;">
                ${u.fotoHasilInstalasi ? `
                  <div class="photo-box">
                    <img src="${getImgUrl(u.fotoHasilInstalasi)}" width="150" height="120" style="object-fit: contain;" />
                    <div style="font-size: 8pt; font-weight: bold; margin-top: 4px;">Hasil Pemasangan</div>
                  </div>` : `"""

replace_p4 = """              <td style="width: 25%; text-align: center; vertical-align: top;">
                ${u.fotoHasilInstalasi ? `
                  <div class="photo-box">
                    <img src="${getImgUrl(u.fotoHasilInstalasi)}" width="${isFull ? '150' : '110'}" height="${isFull ? '120' : '80'}" style="object-fit: contain;" />
                    <div style="font-size: ${isFull ? '8pt' : '7.5pt'}; font-weight: bold; margin-top: 4px;">Hasil Pemasangan</div>
                  </div>` : `"""

assert search_p4 in content, "Error: search_p4 not found"
content = content.replace(search_p4, replace_p4)

# 3. Update signatures block to be tighter
search_sig = """          <br/><br/>
          ${isFull ? `
          <table style="border: none;">
            <tr style="border: none;">
              <td style="border: none; text-align: center; width: 33%;">
                <p style="color: #64748b; margin-bottom: 50px;">Teknisi Pelaksana</p>
                <p style="font-weight: bold; border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 120px;">${u.teknisiPelaksana || '—'}</p>
              </td>
              <td style="border: none; text-align: center; width: 33%;">
                <p style="color: #64748b; margin-bottom: 50px;">PIC Lapangan</p>
                <p style="font-weight: bold; border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 120px;">${u.picLapangan || '—'}</p>
              </td>
              <td style="border: none; text-align: center; width: 34%;">
                <p style="color: #64748b; margin-bottom: 50px;">Menyetujui (Supervisor)</p>
                <p style="font-weight: bold; border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 120px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
              </td>
            </tr>
          </table>
          ` : `
          <table style="border: none;">
            <tr style="border: none;">
              <td style="border: none; text-align: center; width: 50%;">
                <p style="color: #64748b; margin-bottom: 50px;">Teknisi Pelaksana</p>
                <p style="font-weight: bold; border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 120px;">${u.teknisiPelaksana || '—'}</p>
              </td>
              <td style="border: none; text-align: center; width: 50%;">
                <p style="color: #64748b; margin-bottom: 50px;">Menyetujui (Supervisor)</p>
                <p style="font-weight: bold; border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 120px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
              </td>
            </tr>
          </table>
          `}"""

replace_sig = """          <div style="margin-top: ${isFull ? '40px' : '15px'};"></div>
          ${isFull ? `
          <table style="border: none;">
            <tr style="border: none;">
              <td style="border: none; text-align: center; width: 33%;">
                <p style="color: #64748b; margin-bottom: 50px;">Teknisi Pelaksana</p>
                <p style="font-weight: bold; border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 120px;">${u.teknisiPelaksana || '—'}</p>
              </td>
              <td style="border: none; text-align: center; width: 33%;">
                <p style="color: #64748b; margin-bottom: 50px;">PIC Lapangan</p>
                <p style="font-weight: bold; border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 120px;">${u.picLapangan || '—'}</p>
              </td>
              <td style="border: none; text-align: center; width: 34%;">
                <p style="color: #64748b; margin-bottom: 50px;">Menyetujui (Supervisor)</p>
                <p style="font-weight: bold; border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 120px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
              </td>
            </tr>
          </table>
          ` : `
          <table style="border: none;">
            <tr style="border: none;">
              <td style="border: none; text-align: center; width: 50%;">
                <p style="color: #64748b; margin-bottom: 35px;">Teknisi Pelaksana</p>
                <p style="font-weight: bold; border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 120px;">${u.teknisiPelaksana || '—'}</p>
              </td>
              <td style="border: none; text-align: center; width: 50%;">
                <p style="color: #64748b; margin-bottom: 35px;">Menyetujui (Supervisor)</p>
                <p style="font-weight: bold; border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 120px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
              </td>
            </tr>
          </table>
          `}"""

assert search_sig in content, "Error: search_sig not found"
content = content.replace(search_sig, replace_sig)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Technician report successfully formatted for 1 page!")
