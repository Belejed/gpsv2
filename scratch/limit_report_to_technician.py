import os

file_path = "index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

search_str = """          <div class="section-header">3. VERIFIKASI LAPANGAN (PIC LAPANGAN)</div>
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

          <br/><br/>
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
          </table>"""

replace_str = """          <br/><br/>
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
          </table>"""

assert search_str in content, "Error: Search string not found in index.html"
content = content.replace(search_str, replace_str)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Report format successfully limited to technician details!")
