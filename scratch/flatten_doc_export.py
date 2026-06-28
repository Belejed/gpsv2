import os
import re

script_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.abspath(os.path.join(script_dir, '..', 'index.html'))

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Locate downloadDOCReport
start_pattern = "const downloadDOCReport = (u, isFull = true) => {"
end_pattern = "const exportToCSV = (dataList, filename) => {"

start_idx = content.find(start_pattern)
end_idx = content.find(end_pattern)

if start_idx == -1 or end_idx == -1:
    print("Error: Could not locate downloadDOCReport bounds!")
    exit(1)

# Flat implementation of downloadDOCReport
flat_doc_report_code = """const downloadDOCReport = (u, isFull = true) => {
      const getCmtFotoTerminasi = u.cmtFotoTerminasi || '';
      
      const getImgUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('data:')) return url;
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}cb=${Date.now()}`;
      };

      // Extract Odometer Photo HTML
      const fotoOdometerHtml = u.fotoOdometer ? `
        <div class="photo-box">
          <img src="${getImgUrl(u.fotoOdometer)}" width="${isFull ? '150' : '110'}" height="${isFull ? '120' : '80'}" style="object-fit: contain;" />
          <div style="font-size: ${isFull ? '8pt' : '7.5pt'}; font-weight: bold; margin-top: 4px;">Foto Odometer</div>
        </div>
      ` : `
        <div class="photo-fallback">BELUM ADA FOTO<br/><span style="font-size: 7pt; font-weight: normal;">Foto Odometer</span></div>
      `;

      // Extract other photos HTML
      const fotoKendaraanHtml = u.fotoKendaraan ? `
        <div class="photo-box">
          <img src="${getImgUrl(u.fotoKendaraan)}" width="${isFull ? '150' : '110'}" height="${isFull ? '120' : '80'}" style="object-fit: contain;" />
          <div style="font-size: ${isFull ? '8pt' : '7.5pt'}; font-weight: bold; margin-top: 4px;">Foto Kendaraan</div>
        </div>
      ` : `
        <div class="photo-fallback">BELUM ADA FOTO<br/><span style="font-size: 7pt; font-weight: normal;">Foto Kendaraan</span></div>
      `;

      const fotoGPSLamaHtml = u.fotoGPSLama ? `
        <div class="photo-box">
          <img src="${getImgUrl(u.fotoGPSLama)}" width="${isFull ? '150' : '110'}" height="${isFull ? '120' : '80'}" style="object-fit: contain;" />
          <div style="font-size: ${isFull ? '8pt' : '7.5pt'}; font-weight: bold; margin-top: 4px;">Foto GPS Lama</div>
        </div>
      ` : `
        <div class="photo-fallback">BELUM ADA FOTO<br/><span style="font-size: 7pt; font-weight: normal;">Foto GPS Lama</span></div>
      `;

      const fotoGPSBaruHtml = u.fotoGPSBaru ? `
        <div class="photo-box">
          <img src="${getImgUrl(u.fotoGPSBaru)}" width="${isFull ? '150' : '110'}" height="${isFull ? '120' : '80'}" style="object-fit: contain;" />
          <div style="font-size: ${isFull ? '8pt' : '7.5pt'}; font-weight: bold; margin-top: 4px;">Foto GPS Baru</div>
        </div>
      ` : `
        <div class="photo-fallback">BELUM ADA FOTO<br/><span style="font-size: 7pt; font-weight: normal;">Foto GPS Baru</span></div>
      `;

      const fotoHasilInstalasiHtml = u.fotoHasilInstalasi ? `
        <div class="photo-box">
          <img src="${getImgUrl(u.fotoHasilInstalasi)}" width="${isFull ? '150' : '110'}" height="${isFull ? '120' : '80'}" style="object-fit: contain;" />
          <div style="font-size: ${isFull ? '8pt' : '7.5pt'}; font-weight: bold; margin-top: 4px;">Hasil Pemasangan</div>
        </div>
      ` : `
        <div class="photo-fallback">BELUM ADA FOTO<br/><span style="font-size: 7pt; font-weight: normal;">Hasil Pemasangan</span></div>
      `;

      // Extract verification table if isFull
      let verificationHtml = '';
      if (isFull) {
        const picFotoSerahTerimaHtml = u.picFotoSerahTerima ? `<img src="${getImgUrl(u.picFotoSerahTerima)}" width="120" height="80" style="object-fit: contain;" />` : '—';
        const itFotoIntegrasiHtml = u.itFotoIntegrasi ? `<img src="${getImgUrl(u.itFotoIntegrasi)}" width="120" height="80" style="object-fit: contain;" />` : '—';
        const cmtFotoTerimaFisikHtml = u.cmtFotoTerimaFisik ? `<img src="${getImgUrl(u.cmtFotoTerimaFisik)}" width="120" height="80" style="object-fit: contain;" />` : '—';
        const itFotoAbnormalityHtml = u.itFotoAbnormality ? `<img src="${getImgUrl(u.itFotoAbnormality)}" width="120" height="80" style="object-fit: contain;" />` : '—';
        const cmtFotoTerminasiHtml = getCmtFotoTerminasi ? `<img src="${getImgUrl(getCmtFotoTerminasi)}" width="120" height="80" style="object-fit: contain;" />` : '—';

        verificationHtml = `
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
                ${picFotoSerahTerimaHtml}
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
                ${itFotoIntegrasiHtml}
              </td>
              <td style="font-weight: bold;">CMT Foto Terima Fisik</td>
              <td>
                ${cmtFotoTerimaFisikHtml}
              </td>
            </tr>
            <tr>
              <td style="font-weight: bold;">IT Foto Abnormality</td>
              <td>
                ${itFotoAbnormalityHtml}
              </td>
              <td style="font-weight: bold;">CMT Foto Terminasi</td>
              <td>
                ${cmtFotoTerminasiHtml}
              </td>
            </tr>
          </table>
        `;
      }

      // Extract signature block
      let signatureHtml = '';
      if (isFull) {
        signatureHtml = `
          <table style="border: none;">
            <tr style="border: none;">
              <td style="border: none; text-align: center; width: 33%;">
                <p style="color: #64748b; margin-bottom: 50px; font-size: 9pt;">Teknisi Pelaksana</p>
                <p style="font-weight: bold; border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 120px; font-size: 9pt;">${u.teknisiPelaksana || '—'}</p>
              </td>
              <td style="border: none; text-align: center; width: 33%;">
                <p style="color: #64748b; margin-bottom: 50px; font-size: 9pt;">PIC Lapangan</p>
                <p style="font-weight: bold; border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 120px; font-size: 9pt;">${u.picLapangan || '—'}</p>
              </td>
              <td style="border: none; text-align: center; width: 34%;">
                <p style="color: #64748b; margin-bottom: 50px; font-size: 9pt;">Menyetujui (Supervisor)</p>
                <p style="font-weight: bold; border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 120px; font-size: 9pt;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
              </td>
            </tr>
          </table>
        `;
      } else {
        signatureHtml = `
          <table style="border: none;">
            <tr style="border: none;">
              <td style="border: none; text-align: center; width: 50%;">
                <p style="color: #64748b; margin-bottom: 35px; font-size: 8.5pt;">Teknisi Pelaksana</p>
                <p style="font-weight: bold; border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 120px; font-size: 8.5pt;">${u.teknisiPelaksana || '—'}</p>
              </td>
              <td style="border: none; text-align: center; width: 50%;">
                <p style="color: #64748b; margin-bottom: 35px; font-size: 8.5pt;">Menyetujui (Supervisor)</p>
                <p style="font-weight: bold; border-bottom: 1px solid #94a3b8; display: inline-block; min-width: 120px; font-size: 8.5pt;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
              </td>
            </tr>
          </table>
        `;
      }

      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <title>Laporan Migrasi GPS - ${u.nopol}</title>
          <style>
            body { font-family: 'Arial', sans-serif; color: #1e293b; background: #ffffff; padding: ${isFull ? '20px' : '10px'}; }
            table { width: 100%; border-collapse: collapse; margin-bottom: ${isFull ? '20px' : '10px'}; }
            th, td { border: 1px solid #cbd5e1; padding: ${isFull ? '8px' : '4px'}; font-size: ${isFull ? '10pt' : '9pt'}; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; color: #1e293b; }
            .section-header { font-size: ${isFull ? '12pt' : '10.5pt'}; font-weight: bold; background-color: #e2e8f0; padding: ${isFull ? '6px' : '4px'}; margin-top: ${isFull ? '15px' : '8px'}; margin-bottom: ${isFull ? '10px' : '6px'}; border-left: 5px solid #3b82f6; }
            .photo-box { border: 1px solid #cbd5e1; padding: ${isFull ? '5px' : '3px'}; text-align: center; background-color: #f8fafc; }
            .photo-fallback { border: 1px dashed #94a3b8; padding: ${isFull ? '20px' : '10px'}; text-align: center; color: #94a3b8; font-weight: bold; font-size: ${isFull ? '10pt' : '8.5pt'}; }
          </style>
        </head>
        <body>
          <h2 style="text-align: center; color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; font-size: ${isFull ? '16pt' : '13pt'}; margin-top: 0; margin-bottom: 8px;">LAPORAN MIGRASI & VERIFIKASI GPS</h2>
          <p style="text-align: right; font-size: 8pt; color: #64748b; margin-bottom: 8px;">Status: <b>${u.statusPasang === 'DONE' ? 'SELESAI (DONE)' : (u.statusPasang || 'CONFIRM')}</b></p>
          
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
          
          <div style="font-weight: bold; font-size: 9pt; margin-top: 10px; margin-bottom: 5px;">Dokumentasi Pemasangan (Teknisi):</div>
          <table>
            <tr>
              <td style="width: 20%; text-align: center; vertical-align: top;">
                ${fotoKendaraanHtml}
              </td>
              <td style="width: 20%; text-align: center; vertical-align: top;">
                ${fotoGPSLamaHtml}
              </td>
              <td style="width: 20%; text-align: center; vertical-align: top;">
                ${fotoGPSBaruHtml}
              </td>
              <td style="width: 20%; text-align: center; vertical-align: top;">
                ${fotoHasilInstalasiHtml}
              </td>
              <td style="width: 20%; text-align: center; vertical-align: top;">
                ${fotoOdometerHtml}
              </td>
            </tr>
          </table>

          ${verificationHtml}

          <div style="margin-top: ${isFull ? '40px' : '15px'};"></div>
          ${signatureHtml}

          <p style="text-align: center; font-size: 8pt; color: #94a3b8; margin-top: 20px; border-top: 1px solid #cbd5e1; padding-top: 8px;">
            Dokumen ini diunduh secara otomatis dari Portal Migrasi GPS Puninar Logistics pada ${new Date().toLocaleString('id-ID')}.
          </p>
        </body>
        </html>
      `;

      const blob = new Blob(['\\ufeff' + htmlContent], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Laporan_Migrasi_GPS_\${u.nopol}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };"""

# Perform replacement
new_content = content[:start_idx] + flat_doc_report_code + content[end_idx:]

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("SUCCESS: downloadDOCReport function has been flattened and replaced.")
