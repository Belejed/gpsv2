import os

file_path = "index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Define the new downloadDOCReport function
new_download_doc = """    const downloadDOCReport = (u, isFull = true) => {
      const getCmtFotoTerminasi = u.cmtFotoTerminasi || '';
      
      const getImgUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('data:')) return url;
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}cb=${Date.now()}`;
      };

      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <title>Laporan Migrasi GPS - ${u.nopol}</title>
          <style>
            body { font-family: 'Arial', sans-serif; color: #1e293b; background: #ffffff; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; font-size: 10pt; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; color: #1e293b; }
            .section-header { font-size: 12pt; font-weight: bold; background-color: #e2e8f0; padding: 6px; margin-top: 15px; margin-bottom: 10px; border-left: 5px solid #3b82f6; }
            .photo-box { border: 1px solid #cbd5e1; padding: 5px; text-align: center; background-color: #f8fafc; }
            .photo-fallback { border: 1px dashed #94a3b8; padding: 20px; text-align: center; color: #94a3b8; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2 style="text-align: center; color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">LAPORAN MIGRASI & VERIFIKASI GPS</h2>
          <p style="text-align: right; font-size: 9pt; color: #64748b;">Status: <b>${u.statusPasang === 'DONE' ? 'SELESAI (DONE)' : (u.statusPasang || 'CONFIRM')}</b></p>
          
          <div class="section-header">1. DETAIL KENDARAAN</div>
          <table>
            <tr>
              <td style="font-weight: bold; width: 25%;">Nomor Polisi</td>
              <td style="font-weight: bold; width: 25%;">${u.nopol || '—'}</td>
              <td style="font-weight: bold; width: 25%;">Ownership</td>
              <td style="width: 25%;">${u.ownership || '—'}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Merk / Tahun</td>
              <td>${u.merk || '—'} / ${u.year || '—'}</td>
              <td style="font-weight: bold;">Asset Type</td>
              <td>${u.assetType || '—'}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Lokasi / Pool</td>
              <td>${u.location || '—'} / ${u.pool || '—'}</td>
              <td style="font-weight: bold;">Dedicate</td>
              <td>${u.dedicate || '—'}</td>
            </tr>
          </table>

          <div class="section-header">2. LAPORAN PEMASANGAN GPS (TEKNISI)</div>
          <table>
            <tr>
              <td style="font-weight: bold; width: 25%;">Jadwal Pasang</td>
              <td style="width: 25%;">${u.planDate || '—'}</td>
              <td style="font-weight: bold; width: 25%;">Lokasi Pasang</td>
              <td style="width: 25%;">${u.lokasiPasang || '—'}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Teknisi Pelaksana</td>
              <td style="font-weight: bold;">${u.teknisiPelaksana || '—'}</td>
              <td style="font-weight: bold;">Tipe GPS Baru</td>
              <td>${u.modelGpsBaru || '—'}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Serial GPS Baru</td>
              <td>${u.gpsSerialBaru || '—'}</td>
              <td style="font-weight: bold;">IMEI GPS Baru</td>
              <td>${u.gpsImeiBaru || '—'}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Nomor SIM Card</td>
              <td>${u.nomorSIM || '—'}</td>
              <td style="font-weight: bold;">Provider SIM</td>
              <td>${u.provider || '—'}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Serial GPS Lama</td>
              <td>${u.gpsSerialLama || '—'}</td>
              <td style="font-weight: bold;">Status GPS</td>
              <td>${u.gps || '—'}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Buzzer / SOS</td>
              <td>${u.buzzer || '—'} / ${u.sos || '—'}</td>
              <td style="font-weight: bold;">Sensor Wing / Camera</td>
              <td>${u.sensorWing || '—'} / ${u.camera || '—'}</td>
            </tr>
          </table>

          <div style="font-weight: bold; font-size: 10pt; margin-top: 10px; margin-bottom: 5px;">Dokumentasi Pemasangan (Teknisi):</div>
          <table>
            <tr>
              <td style="width: 25%; text-align: center; vertical-align: top;">
                ${u.fotoKendaraan ? `
                  <div class="photo-box">
                    <img src="${getImgUrl(u.fotoKendaraan)}" width="150" height="120" style="object-fit: contain;" />
                    <div style="font-size: 8pt; font-weight: bold; margin-top: 4px;">Foto Kendaraan</div>
                  </div>` : `
                  <div class="photo-fallback">BELUM ADA FOTO<br/><span style="font-size: 7pt; font-weight: normal;">Foto Kendaraan</span></div>`}
              </td>
              <td style="width: 25%; text-align: center; vertical-align: top;">
                ${u.fotoGPSLama ? `
                  <div class="photo-box">
                    <img src="${getImgUrl(u.fotoGPSLama)}" width="150" height="120" style="object-fit: contain;" />
                    <div style="font-size: 8pt; font-weight: bold; margin-top: 4px;">Foto GPS Lama</div>
                  </div>` : `
                  <div class="photo-fallback">BELUM ADA FOTO<br/><span style="font-size: 7pt; font-weight: normal;">Foto GPS Lama</span></div>`}
              </td>
              <td style="width: 25%; text-align: center; vertical-align: top;">
                ${u.fotoGPSBaru ? `
                  <div class="photo-box">
                    <img src="${getImgUrl(u.fotoGPSBaru)}" width="150" height="120" style="object-fit: contain;" />
                    <div style="font-size: 8pt; font-weight: bold; margin-top: 4px;">Foto GPS Baru</div>
                  </div>` : `
                  <div class="photo-fallback">BELUM ADA FOTO<br/><span style="font-size: 7pt; font-weight: normal;">Foto GPS Baru</span></div>`}
              </td>
              <td style="width: 25%; text-align: center; vertical-align: top;">
                ${u.fotoHasilInstalasi ? `
                  <div class="photo-box">
                    <img src="${getImgUrl(u.fotoHasilInstalasi)}" width="150" height="120" style="object-fit: contain;" />
                    <div style="font-size: 8pt; font-weight: bold; margin-top: 4px;">Hasil Pemasangan</div>
                  </div>` : `
                  <div class="photo-fallback">BELUM ADA FOTO<br/><span style="font-size: 7pt; font-weight: normal;">Hasil Pemasangan</span></div>`}
              </td>
            </tr>
          </table>

          ${isFull ? `
          <div class="section-header">3. VERIFIKASI LAPANGAN (PIC LAPANGAN)</div>
          <table>
            <tr>
              <td style="font-weight: bold; width: 25%;">PIC Lapangan</td>
              <td style="font-weight: bold; width: 25%;">${u.picLapangan || '—'}</td>
              <td style="font-weight: bold; width: 25%;">Cek Fisik GPS Lama</td>
              <td style="width: 25%;">${u.picCekFisikLama || '—'}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Cek Fisik GPS Baru</td>
              <td>${u.picCekFisikBaru || '—'}</td>
              <td style="font-weight: bold;">Kondisi Selesai</td>
              <td>${u.picCekKondisiSelesai || '—'}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Cek Fitur GPS</td>
              <td>${u.picCekFitur || '—'}</td>
              <td style="font-weight: bold;">Bukti Serah Terima</td>
              <td>
                ${u.picFotoSerahTerima ? `<img src="${getImgUrl(u.picFotoSerahTerima)}" width="120" height="80" style="object-fit: contain;" />` : '—'}
              </td>
            </tr>
          </table>

          <div class="section-header">4. VERIFIKASI AKHIR (IT & CMT)</div>
          <table>
            <tr>
              <td style="font-weight: bold; width: 25%;">IT Cek Aplikasi</td>
              <td style="width: 25%;">${u.itCekAplikasi || '—'}</td>
              <td style="font-weight: bold; width: 25%;">CMT Cek Aplikasi</td>
              <td style="width: 25%;">${u.cmtCekAplikasi || '—'}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">IT Foto Integrasi</td>
              <td>
                ${u.itFotoIntegrasi ? `<img src="${getImgUrl(u.itFotoIntegrasi)}" width="120" height="80" style="object-fit: contain;" />` : '—'}
              </td>
              <td style="font-weight: bold;">CMT Foto Terima Fisik</td>
              <td>
                ${u.cmtFotoTerimaFisik ? `<img src="${getImgUrl(u.cmtFotoTerimaFisik)}" width="120" height="80" style="object-fit: contain;" />` : '—'}
              </td>
            </tr>
            <tr>
              <td style="font-weight: bold;">IT Foto Abnormality</td>
              <td>
                ${u.itFotoAbnormality ? `<img src="${getImgUrl(u.itFotoAbnormality)}" width="120" height="80" style="object-fit: contain;" />` : '—'}
              </td>
              <td style="font-weight: bold;">CMT Foto Terminasi</td>
              <td>
                ${getCmtFotoTerminasi ? `<img src="${getImgUrl(getCmtFotoTerminasi)}" width="120" height="80" style="object-fit: contain;" />` : '—'}
              </td>
            </tr>
          </table>
          ` : ''}

          <br/><br/>
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
          `}

          <p style="text-align: center; font-size: 8pt; color: #94a3b8; margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 10px;">
            Dokumen ini diunduh secara otomatis dari Portal Migrasi GPS Puninar Logistics pada ${new Date().toLocaleString('id-ID')}.
          </p>
        </body>
        </html>
      `;

      const blob = new Blob(['\\ufeff' + htmlContent], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Laporan_Migrasi_GPS_${u.nopol}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };"""

# Identify old downloadDOCReport starting from "const downloadDOCReport = (u) => {" to "    };"
# Let's locate it in content
start_idx = content.find("const downloadDOCReport = (u) => {")
assert start_idx != -1, "Could not find start of downloadDOCReport"

# Find end of downloadDOCReport. In Javascript, the function ends with:
#       a.click();
#       document.body.removeChild(a);
#     };
#     ;;;;;;
end_search = """      a.click();
      document.body.removeChild(a);
    };"""

end_idx_sub = content.find(end_search, start_idx)
assert end_idx_sub != -1, "Could not find end of downloadDOCReport"
end_idx = end_idx_sub + len(end_search)

# Perform replacement of the function
content = content[:start_idx] + new_download_doc + content[end_idx:]

# Also update the technician review modal call to pass false:
old_modal_call = 'onClick={() => downloadDOCReport(historyReviewUnit)}'
new_modal_call = 'onClick={() => downloadDOCReport(historyReviewUnit, false)}'
assert old_modal_call in content, "Could not find technician history modal download call"
content = content.replace(old_modal_call, new_modal_call)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Conditional report successfully set up!")
