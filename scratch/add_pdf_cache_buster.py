import re

html_path = 'index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Helper to find function start and end using brace counting
def find_function_block(text, start_pattern):
    match = re.search(start_pattern, text)
    if not match:
        return None, None
    start_idx = match.start()
    
    first_brace_idx = text.find('{', start_idx)
    if first_brace_idx == -1:
        return None, None
        
    brace_count = 0
    idx = first_brace_idx
    while idx < len(text):
        char = text[idx]
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                return start_idx, idx + 1
        idx += 1
    return None, None

# Find and replace downloadPDFReport block
print("Replacing downloadPDFReport function with cache-buster updates...")
start_pat = r'const downloadPDFReport = \(u\) => \{'
start_idx, end_idx = find_function_block(content, start_pat)

if start_idx is not None and end_idx is not None:
    print(f"Found downloadPDFReport from index {start_idx} to {end_idx}.")
    
    pdf_replacement = """const downloadPDFReport = (u) => {
      // Create a temporary container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.background = '#FFFFFF';
      container.style.width = '750px';
      container.style.color = '#1F2937';
      container.style.fontFamily = 'Arial, sans-serif';
      
      // Override CSS custom properties on container to enforce light mode theme rendering
      container.style.setProperty('--bg-primary', '#f8fafc');
      container.style.setProperty('--bg-secondary', '#ffffff');
      container.style.setProperty('--bg-card', '#ffffff');
      container.style.setProperty('--text-primary', '#0f172a');
      container.style.setProperty('--text-secondary', '#475569');
      container.style.setProperty('--text-tertiary', '#94a3b8');
      container.style.setProperty('--border-color', '#e2e8f0');
      
      const getCmtFotoTerminasi = u.cmtFotoTerminasi || '';
      
      // Cache-buster helper to bypass browser cache CORS issues
      const getImgUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('data:')) return url;
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}cb=${Date.now()}`;
      };
      
      container.innerHTML = `
        <div style="padding: 30px; border: 1px solid #E5E7EB; border-radius: 8px; background: #FFFFFF; color: #1F2937;">
          <!-- Header Table (Flexbox-free) -->
          <table style="width: 100%; border-collapse: collapse; border-bottom: 3px solid #3B82F6; margin-bottom: 24px;">
            <tr>
              <td style="vertical-align: middle; text-align: left; padding-bottom: 16px;">
                <h1 style="font-size: 22px; font-weight: 800; color: #1E293B; margin: 0; letter-spacing: -0.5px;">LAPORAN MIGRASI & VERIFIKASI GPS</h1>
                <p style="font-size: 11px; color: #64748B; margin: 4px 0 0 0; font-weight: 500;">Portal Migrasi GPS Puninar Logistics</p>
              </td>
              <td style="vertical-align: middle; text-align: right; padding-bottom: 16px;">
                <span style="font-size: 11px; font-weight: 800; color: #10B981; border: 1.5px solid #10B981; padding: 6px 12px; border-radius: 6px; text-transform: uppercase; background: rgba(16, 185, 129, 0.05); letter-spacing: 0.5px; display: inline-block;">
                  ${u.statusPasang === 'DONE' ? 'SELESAI (DONE)' : (u.statusPasang || 'CONFIRM')}
                </span>
              </td>
            </tr>
          </table>

          <!-- Section 1: Detail Kendaraan -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 11px; font-weight: 800; color: #1E293B; background: #F1F5F9; padding: 6px 10px; border-radius: 4px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; border-left: 3px solid #3B82F6;">1. Detail Kendaraan</div>
            <table style="width: 100%; font-size: 10px; border-collapse: collapse; margin-bottom: 10px;">
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 6px; font-weight: 700; width: 25%; color: #64748B;">Nomor Polisi</td>
                <td style="padding: 6px; width: 25%; font-weight: bold; color: #0F172A;">${u.nopol || '—'}</td>
                <td style="padding: 6px; font-weight: 700; width: 25%; color: #64748B;">Ownership</td>
                <td style="padding: 6px; width: 25%; color: #0F172A;">${u.ownership || '—'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 6px; font-weight: 700; color: #64748B;">Merk / Tahun</td>
                <td style="padding: 6px; color: #0F172A;">${u.merk || '—'} / ${u.year || '—'}</td>
                <td style="padding: 6px; font-weight: 700; color: #64748B;">Asset Type</td>
                <td style="padding: 6px; color: #0F172A;">${u.assetType || '—'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 6px; font-weight: 700; color: #64748B;">Lokasi / Pool</td>
                <td style="padding: 6px; color: #0F172A;">${u.location || '—'} / ${u.pool || '—'}</td>
                <td style="padding: 6px; font-weight: 700; color: #64748B;">Dedicate</td>
                <td style="padding: 6px; color: #0F172A;">${u.dedicate || '—'}</td>
              </tr>
            </table>
          </div>

          <!-- Section 2: Jadwal & Pemasangan Teknisi -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 11px; font-weight: 800; color: #1E293B; background: #F1F5F9; padding: 6px 10px; border-radius: 4px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; border-left: 3px solid #3B82F6;">2. Laporan Pemasangan GPS (Teknisi)</div>
            <table style="width: 100%; font-size: 10px; border-collapse: collapse; margin-bottom: 12px;">
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 6px; font-weight: 700; width: 25%; color: #64748B;">Jadwal Pasang</td>
                <td style="padding: 6px; width: 25%; color: #0F172A;">${u.planDate || '—'}</td>
                <td style="padding: 6px; font-weight: 700; width: 25%; color: #64748B;">Lokasi Pasang</td>
                <td style="padding: 6px; width: 25%; color: #0F172A;">${u.lokasiPasang || '—'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 6px; font-weight: 700; color: #64748B;">Teknisi Pelaksana</td>
                <td style="padding: 6px; color: #0F172A; font-weight: bold;">${u.teknisiPelaksana || '—'}</td>
                <td style="padding: 6px; font-weight: 700; color: #64748B;">Tipe GPS Baru</td>
                <td style="padding: 6px; color: #0F172A;">${u.modelGpsBaru || '—'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 6px; font-weight: 700; color: #64748B;">Serial GPS Baru</td>
                <td style="padding: 6px; color: #0F172A;"><code>${u.gpsSerialBaru || '—'}</code></td>
                <td style="padding: 6px; font-weight: 700; color: #64748B;">IMEI GPS Baru</td>
                <td style="padding: 6px; color: #0F172A;"><code>${u.gpsImeiBaru || '—'}</code></td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 6px; font-weight: 700; color: #64748B;">Nomor SIM Card</td>
                <td style="padding: 6px; color: #0F172A;"><code>${u.nomorSIM || '—'}</code></td>
                <td style="padding: 6px; font-weight: 700; color: #64748B;">Provider SIM</td>
                <td style="padding: 6px; color: #0F172A;">${u.provider || '—'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 6px; font-weight: 700; color: #64748B;">Serial GPS Lama</td>
                <td style="padding: 6px; color: #0F172A;"><code>${u.gpsSerialLama || '—'}</code></td>
                <td style="padding: 6px; font-weight: 700; color: #64748B;">Status GPS</td>
                <td style="padding: 6px; color: #0F172A;">${u.gps || '—'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 6px; font-weight: 700; color: #64748B;">Buzzer / SOS</td>
                <td style="padding: 6px; color: #0F172A;">${u.buzzer || '—'} / ${u.sos || '—'}</td>
                <td style="padding: 6px; font-weight: 700; color: #64748B;">Sensor / Camera</td>
                <td style="padding: 6px; color: #0F172A;">${u.sensorWing || '—'} / ${u.camera || '—'}</td>
              </tr>
            </table>

            <div style="font-size: 9px; font-weight: bold; color: #475569; margin-bottom: 8px; text-transform: uppercase;">Dokumentasi Pemasangan (Teknisi):</div>
            <!-- Photo Grid using simple tables to avoid Flexbox render crashes in html2canvas -->
            <table style="width: 100%; border-collapse: collapse; font-size: 8px; margin-bottom: 10px; table-layout: fixed;">
              <tr>
                <td style="width: 25%; padding: 4px; vertical-align: top;">
                  ${u.fotoKendaraan ? `
                    <div style="border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px; text-align: center; background: #F8FAFC;">
                      <img src="${getImgUrl(u.fotoKendaraan)}" crossorigin="anonymous" style="width: 100%; height: 90px; object-fit: contain; border-radius: 4px; margin-bottom: 4px;" />
                      <div style="font-weight: bold; color: #334155;">Foto Kendaraan</div>
                    </div>` : `
                    <div style="border: 1px dashed #CBD5E1; border-radius: 6px; padding: 25px 4px; text-align: center; background: #F8FAFC; height: 110px; box-sizing: border-box;">
                      <div style="color: #94A3B8; font-weight: bold; font-size: 8px;">BELUM ADA FOTO</div>
                      <div style="color: #CBD5E1; font-size: 7px; margin-top: 4px;">Foto Kendaraan</div>
                    </div>`}
                </td>
                <td style="width: 25%; padding: 4px; vertical-align: top;">
                  ${u.fotoGPSLama ? `
                    <div style="border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px; text-align: center; background: #F8FAFC;">
                      <img src="${getImgUrl(u.fotoGPSLama)}" crossorigin="anonymous" style="width: 100%; height: 90px; object-fit: contain; border-radius: 4px; margin-bottom: 4px;" />
                      <div style="font-weight: bold; color: #334155;">Foto GPS Lama</div>
                    </div>` : `
                    <div style="border: 1px dashed #CBD5E1; border-radius: 6px; padding: 25px 4px; text-align: center; background: #F8FAFC; height: 110px; box-sizing: border-box;">
                      <div style="color: #94A3B8; font-weight: bold; font-size: 8px;">BELUM ADA FOTO</div>
                      <div style="color: #CBD5E1; font-size: 7px; margin-top: 4px;">Foto GPS Lama</div>
                    </div>`}
                </td>
                <td style="width: 25%; padding: 4px; vertical-align: top;">
                  ${u.fotoGPSBaru ? `
                    <div style="border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px; text-align: center; background: #F8FAFC;">
                      <img src="${getImgUrl(u.fotoGPSBaru)}" crossorigin="anonymous" style="width: 100%; height: 90px; object-fit: contain; border-radius: 4px; margin-bottom: 4px;" />
                      <div style="font-weight: bold; color: #334155;">Foto GPS Baru</div>
                    </div>` : `
                    <div style="border: 1px dashed #CBD5E1; border-radius: 6px; padding: 25px 4px; text-align: center; background: #F8FAFC; height: 110px; box-sizing: border-box;">
                      <div style="color: #94A3B8; font-weight: bold; font-size: 8px;">BELUM ADA FOTO</div>
                      <div style="color: #CBD5E1; font-size: 7px; margin-top: 4px;">Foto GPS Baru</div>
                    </div>`}
                </td>
                <td style="width: 25%; padding: 4px; vertical-align: top;">
                  ${u.fotoHasilInstalasi ? `
                    <div style="border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px; text-align: center; background: #F8FAFC;">
                      <img src="${getImgUrl(u.fotoHasilInstalasi)}" crossorigin="anonymous" style="width: 100%; height: 90px; object-fit: contain; border-radius: 4px; margin-bottom: 4px;" />
                      <div style="font-weight: bold; color: #334155;">Hasil Pemasangan</div>
                    </div>` : `
                    <div style="border: 1px dashed #CBD5E1; border-radius: 6px; padding: 25px 4px; text-align: center; background: #F8FAFC; height: 110px; box-sizing: border-box;">
                      <div style="color: #94A3B8; font-weight: bold; font-size: 8px;">BELUM ADA FOTO</div>
                      <div style="color: #CBD5E1; font-size: 7px; margin-top: 4px;">Hasil Pemasangan</div>
                    </div>`}
                </td>
              </tr>
            </table>
          </div>

          <!-- Section 3: Verifikasi Lapangan -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 11px; font-weight: 800; color: #1E293B; background: #F1F5F9; padding: 6px 10px; border-radius: 4px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; border-left: 3px solid #3B82F6;">3. Verifikasi Lapangan (PIC Lapangan)</div>
            <table style="width: 100%; font-size: 10px; border-collapse: collapse; margin-bottom: 10px;">
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 6px; font-weight: 700; width: 25%; color: #64748B;">PIC Lapangan</td>
                <td style="padding: 6px; width: 25%; font-weight: bold; color: #0F172A;">${u.picLapangan || '—'}</td>
                <td style="padding: 6px; font-weight: 700; width: 25%; color: #64748B;">Cek Fisik GPS Lama</td>
                <td style="padding: 6px; width: 25%; color: #0F172A;">${u.picCekFisikLama || '—'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 6px; color: #64748B; font-weight: 700;">Cek Fisik GPS Baru</td>
                <td style="padding: 6px; color: #0F172A;">${u.picCekFisikBaru || '—'}</td>
                <td style="padding: 6px; font-weight: 700; width: 25%; color: #64748B;">Kondisi Selesai</td>
                <td style="padding: 6px; width: 25%; color: #0F172A;">${u.picCekKondisiSelesai || '—'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 6px; font-weight: 700; color: #64748B;">Cek Fitur GPS</td>
                <td style="padding: 6px; color: #0F172A;">${u.picCekFitur || '—'}</td>
                <td style="padding: 6px; font-weight: 700; width: 25%; color: #64748B;">Bukti Serah Terima</td>
                <td style="padding: 6px; color: #0F172A;">
                  ${u.picFotoSerahTerima ? `
                    <div style="border: 1px solid #E2E8F0; border-radius: 6px; padding: 4px; display: inline-block; width: 120px; background: #F8FAFC; text-align: center;">
                      <img src="${getImgUrl(u.picFotoSerahTerima)}" crossorigin="anonymous" style="width: 100%; height: 60px; object-fit: contain; border-radius: 4px;" />
                    </div>` : '—'}
                </td>
              </tr>
            </table>
          </div>

          <!-- Section 4: Verifikasi IT & CMT -->
          <div style="margin-bottom: 25px;">
            <div style="font-size: 11px; font-weight: 800; color: #1E293B; background: #F1F5F9; padding: 6px 10px; border-radius: 4px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; border-left: 3px solid #3B82F6;">4. Verifikasi Akhir (IT & CMT)</div>
            <table style="width: 100%; font-size: 10px; border-collapse: collapse; margin-bottom: 10px;">
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 6px; font-weight: 700; width: 25%; color: #64748B;">IT Cek Aplikasi</td>
                <td style="padding: 6px; width: 25%; color: #0F172A;">${u.itCekAplikasi || '—'}</td>
                <td style="padding: 6px; font-weight: 700; width: 25%; color: #64748B;">CMT Cek Aplikasi</td>
                <td style="padding: 6px; width: 25%; color: #0F172A;">${u.cmtCekAplikasi || '—'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 6px; font-weight: 700; color: #64748B;">IT Foto Integrasi</td>
                <td style="padding: 6px; color: #0F172A;">
                  ${u.itFotoIntegrasi ? `<div style="border: 1px solid #E2E8F0; border-radius: 6px; padding: 4px; display: inline-block; width: 120px; background: #F8FAFC; text-align: center;"><img src="${getImgUrl(u.itFotoIntegrasi)}" crossorigin="anonymous" style="width: 100%; height: 60px; object-fit: contain; border-radius: 4px;" /></div>` : '—'}
                </td>
                <td style="padding: 6px; font-weight: 700; color: #64748B;">CMT Foto Terima Fisik</td>
                <td style="padding: 6px; color: #0F172A;">
                  ${u.cmtFotoTerimaFisik ? `<div style="border: 1px solid #E2E8F0; border-radius: 6px; padding: 4px; display: inline-block; width: 120px; background: #F8FAFC; text-align: center;"><img src="${getImgUrl(u.cmtFotoTerimaFisik)}" crossorigin="anonymous" style="width: 100%; height: 60px; object-fit: contain; border-radius: 4px;" /></div>` : '—'}
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 6px; font-weight: 700; color: #64748B;">IT Foto Abnormality</td>
                <td style="padding: 6px; color: #0F172A;">
                  ${u.itFotoAbnormality ? `<div style="border: 1px solid #E2E8F0; border-radius: 6px; padding: 4px; display: inline-block; width: 120px; background: #F8FAFC; text-align: center;"><img src="${getImgUrl(u.itFotoAbnormality)}" crossorigin="anonymous" style="width: 100%; height: 60px; object-fit: contain; border-radius: 4px;" /></div>` : '—'}
                </td>
                <td style="padding: 6px; font-weight: 700; color: #64748B;">CMT Foto Terminasi</td>
                <td style="padding: 6px; color: #0F172A;">
                  ${getCmtFotoTerminasi ? `<div style="border: 1px solid #E2E8F0; border-radius: 6px; padding: 4px; display: inline-block; width: 120px; background: #F8FAFC; text-align: center;"><img src="${getImgUrl(getCmtFotoTerminasi)}" crossorigin="anonymous" style="width: 100%; height: 60px; object-fit: contain; border-radius: 4px;" /></div>` : '—'}
                </td>
              </tr>
            </table>
          </div>

          <!-- Section 5: Tanda Tangan Verifikasi (Hard Copy) -->
          <div style="margin-top: 35px; margin-bottom: 20px; border-top: 1px solid #E2E8F0; padding-top: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 10px; table-layout: fixed;">
              <tr>
                <td style="width: 33%; text-align: center; vertical-align: top; padding: 10px 0;">
                  <div style="color: #64748B; margin-bottom: 45px; font-weight: 500;">Teknisi Pelaksana</div>
                  <div style="font-weight: 800; color: #0F172A; border-bottom: 1.5px solid #94A3B8; display: inline-block; min-width: 140px; padding-bottom: 2px;">
                    ${u.teknisiPelaksana || '—'}
                  </div>
                </td>
                <td style="width: 33%; text-align: center; vertical-align: top; padding: 10px 0;">
                  <div style="color: #64748B; margin-bottom: 45px; font-weight: 500;">PIC Lapangan</div>
                  <div style="font-weight: 800; color: #0F172A; border-bottom: 1.5px solid #94A3B8; display: inline-block; min-width: 140px; padding-bottom: 2px;">
                    ${u.picLapangan || '—'}
                  </div>
                </td>
                <td style="width: 34%; text-align: center; vertical-align: top; padding: 10px 0;">
                  <div style="color: #64748B; margin-bottom: 45px; font-weight: 500;">Menyetujui (Supervisor)</div>
                  <div style="font-weight: 800; color: #0F172A; border-bottom: 1.5px solid #94A3B8; display: inline-block; min-width: 140px; padding-bottom: 2px;">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <div style="border-top: 1px solid #E2E8F0; padding-top: 10px; margin-top: 25px; text-align: center; font-size: 8px; color: #94A3B8; font-weight: 500;">
            Dokumen ini diunduh secara otomatis dari Portal Migrasi GPS Puninar Logistics pada ${new Date().toLocaleString('id-ID')}.
          </div>
        </div>
      `;
      
      document.body.appendChild(container);
      
      const opt = {
        margin:       10,
        filename:     `Laporan_Migrasi_GPS_${u.nopol}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().from(container).set(opt).save().then(() => {
        document.body.removeChild(container);
      }).catch(err => {
        console.error("PDF Generate Error:", err);
        document.body.removeChild(container);
        alert("Gagal mengunduh PDF: " + String(err));
      });
    };"""
    
    content = content[:start_idx] + pdf_replacement + content[end_idx:]
    print("downloadPDFReport function updated successfully with cache-buster updates.")
else:
    print("ERROR: Could not find downloadPDFReport function!")

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("All modifications successfully written back to index.html.")
