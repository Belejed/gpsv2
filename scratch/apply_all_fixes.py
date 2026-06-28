content = open('index.html', 'r', encoding='utf-8').read()

# ===================================================================
# FIX 1: DOC Report - Landscape orientation + foto lebih besar
# ===================================================================
# Replace the page setup / style in the DOC to add landscape + proper sizing

OLD_DOC_STYLE = (
    '"        <html xmlns:o=\\"urn:schemas-microsoft-com:office:office\\" xmlns:w=\\"urn:schemas-microsoft-com:office:word\\" xmlns=\\"http://www.w3.org/TR/REC-html40\\">\\n" +\n'
    '        "        <head>\\n" +\n'
    '        "          <title>Laporan Migrasi GPS - " + nopol + "</title>\\n" +\n'
    '        "          <style>\\n" +\n'
    '        "            body { font-family: \'Arial\', sans-serif; color: #1e293b; background: #ffffff; padding: " + paddingBody + "; }\\n" +\n'
    '        "            table { width: 100%; border-collapse: collapse; margin-bottom: " + marginBottomTable + "; }\\n" +\n'
    '        "            th, td { border: 1px solid #cbd5e1; padding: " + paddingCell + "; font-size: " + fontSizeCell + "; text-align: left; }\\n" +\n'
    '        "            th { background-color: #f1f5f9; font-weight: bold; color: #1e293b; }\\n" +\n'
    '        "            .section-header { font-size: " + fontSizeHeader + "; font-weight: bold; background-color: #e2e8f0; padding: " + paddingHeader + "; margin-top: " + marginTopHeader + "; margin-bottom: " + marginBottomHeader + "; border-left: 5px solid #3b82f6; }\\n" +\n'
    '        "            .photo-box { border: 1px solid #cbd5e1; padding: " + paddingPhoto + "; text-align: center; background-color: #f8fafc; }\\n" +\n'
    '        "            .photo-fallback { border: 1px dashed #94a3b8; padding: " + paddingFallback + "; text-align: center; color: #94a3b8; font-weight: bold; font-size: " + fontSizeFallback + "; }\\n" +\n'
    '        "          </style>\\n" +\n'
    '        "        </head>\\n" +'
)

NEW_DOC_STYLE = (
    '"        <html xmlns:o=\\"urn:schemas-microsoft-com:office:office\\" xmlns:w=\\"urn:schemas-microsoft-com:office:word\\" xmlns=\\"http://www.w3.org/TR/REC-html40\\">\\n" +\n'
    '        "        <head>\\n" +\n'
    '        "          <title>Laporan Migrasi GPS - " + nopol + "</title>\\n" +\n'
    '        "          <xml>\\n" +\n'
    '        "            <w:WordDocument>\\n" +\n'
    '        "              <w:View>Print</w:View>\\n" +\n'
    '        "              <w:Zoom>90</w:Zoom>\\n" +\n'
    '        "              <w:DoNotOptimizeForBrowser/>\\n" +\n'
    '        "            </w:WordDocument>\\n" +\n'
    '        "          </xml>\\n" +\n'
    '        "          <style>\\n" +\n'
    '        "            @page { size: A4 landscape; margin: 1cm 1.5cm; }\\n" +\n'
    '        "            @page WordSection1 { size: 842pt 595pt; mso-page-orientation: landscape; margin: 36pt 54pt; }\\n" +\n'
    '        "            div.WordSection1 { page: WordSection1; }\\n" +\n'
    '        "            body { font-family: \'Arial\', sans-serif; color: #1e293b; background: #ffffff; padding: " + paddingBody + "; }\\n" +\n'
    '        "            table { width: 100%; border-collapse: collapse; margin-bottom: " + marginBottomTable + "; }\\n" +\n'
    '        "            th, td { border: 1px solid #cbd5e1; padding: " + paddingCell + "; font-size: " + fontSizeCell + "; text-align: left; }\\n" +\n'
    '        "            th { background-color: #f1f5f9; font-weight: bold; color: #1e293b; }\\n" +\n'
    '        "            .section-header { font-size: " + fontSizeHeader + "; font-weight: bold; background-color: #e2e8f0; padding: " + paddingHeader + "; margin-top: " + marginTopHeader + "; margin-bottom: " + marginBottomHeader + "; border-left: 5px solid #3b82f6; }\\n" +\n'
    '        "            .photo-box { border: 1px solid #cbd5e1; padding: " + paddingPhoto + "; text-align: center; background-color: #f8fafc; }\\n" +\n'
    '        "            .photo-fallback { border: 1px dashed #94a3b8; padding: " + paddingFallback + "; text-align: center; color: #94a3b8; font-weight: bold; font-size: " + fontSizeFallback + "; }\\n" +\n'
    '        "          </style>\\n" +\n'
    '        "        </head>\\n" +'
)

if OLD_DOC_STYLE in content:
    content = content.replace(OLD_DOC_STYLE, NEW_DOC_STYLE)
    print("FIX 1a applied: landscape orientation added to DOC")
else:
    print("ERROR FIX 1a: DOC style block not found")
    # Try simple search
    idx = content.find('xmlns:o=\\"urn:schemas-microsoft-com:office:office\\"')
    print(f"  Found xmlns at char: {idx}")

# Wrap body in WordSection1 div for landscape
OLD_BODY_OPEN = '"        <body>\\n" +'
NEW_BODY_OPEN = '"        <body>\\n" +\n        "        <div class=\\"WordSection1\\">\\n" +'

if OLD_BODY_OPEN in content:
    content = content.replace(OLD_BODY_OPEN, NEW_BODY_OPEN, 1)
    print("FIX 1b applied: body wrapped in WordSection1 div")
else:
    print("ERROR FIX 1b: body open not found")

OLD_BODY_CLOSE = '"        </body>\\n" +\n        "        </html>\\n"'
NEW_BODY_CLOSE = '"        </div>\\n" +\n        "        </body>\\n" +\n        "        </html>\\n"'

if OLD_BODY_CLOSE in content:
    content = content.replace(OLD_BODY_CLOSE, NEW_BODY_CLOSE)
    print("FIX 1c applied: closing WordSection1 div added")
else:
    print("ERROR FIX 1c: body close not found")

# Make photos larger for landscape
OLD_PHOTO_SIZE_150 = 'width=\"" + (isFull ? \'150\' : \'110\') + "\" height=\"" + (isFull ? \'120\' : \'80\') + "\""'
NEW_PHOTO_SIZE_150 = 'width=\"" + (isFull ? \'190\' : \'130\') + "\" height=\"" + (isFull ? \'150\' : \'95\') + "\""'

count = content.count(OLD_PHOTO_SIZE_150)
if count > 0:
    content = content.replace(OLD_PHOTO_SIZE_150, NEW_PHOTO_SIZE_150)
    print(f"FIX 1d applied: photo sizes enlarged for landscape ({count} occurrences)")
else:
    print("ERROR FIX 1d: photo size not found")


# ===================================================================
# FIX 2: Planner - lock editing if unit is already claimed by teknisi
# (status = ON PROGRESS / TEKNISI SUBMITTED / PIC SUBMITTED / IT DONE / DONE)
# ===================================================================

CLAIMED_STATUSES = "['ON PROGRESS', 'TEKNISI SUBMITTED', 'PIC SUBMITTED', 'IT DONE', 'DONE']"

# 2a: Lock the date input
OLD_DATE_INPUT = """                    <div className="input-group">
                      <label className="input-label">Tanggal Rencana Pemasangan</label>
                      <input 
                        type="date" 
                        value={toISODate(editData.planDate || '')} 
                        onChange={e => setEditData(d => ({ ...d, planDate: fromISODate(e.target.value) }))} 
                        className="input-field" 
                        required 
                      />
                    </div>"""

NEW_DATE_INPUT = """                    {['ON PROGRESS', 'TEKNISI SUBMITTED', 'PIC SUBMITTED', 'IT DONE', 'DONE'].includes(selectedUnit.statusPasang) ? (
                      <div className="input-group">
                        <label className="input-label">Tanggal Rencana Pemasangan</label>
                        <div className="input-field" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <i className="bi bi-lock-fill" style={{ fontSize: 11 }}></i>
                          {editData.planDate || '—'} <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>(Terkunci - sudah diklaim teknisi)</span>
                        </div>
                      </div>
                    ) : (
                      <div className="input-group">
                        <label className="input-label">Tanggal Rencana Pemasangan</label>
                        <input 
                          type="date" 
                          value={toISODate(editData.planDate || '')} 
                          onChange={e => setEditData(d => ({ ...d, planDate: fromISODate(e.target.value) }))} 
                          className="input-field" 
                          required 
                        />
                      </div>
                    )}"""

if OLD_DATE_INPUT in content:
    content = content.replace(OLD_DATE_INPUT, NEW_DATE_INPUT)
    print("FIX 2a applied: date input locked if claimed")
else:
    print("ERROR FIX 2a: date input block not found")

# 2b: Lock lokasi pasang select
OLD_LOKASI_SELECT = """                    <div className="input-group">
                      <label className="input-label">Pool Pemasangan (Lokasi Pasang)</label>
                      <select 
                        value={editData.lokasiPasang || ''} 
                        onChange={e => setEditData(d => ({ ...d, lokasiPasang: e.target.value }))} 
                        className="filter-select" 
                        style={{ width: '100%', height: '38px' }}
                        required
                      >
                        <option value="">— Pilih Pool Pemasangan —</option>
                        {LOKASI_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>"""

NEW_LOKASI_SELECT = """                    {['ON PROGRESS', 'TEKNISI SUBMITTED', 'PIC SUBMITTED', 'IT DONE', 'DONE'].includes(selectedUnit.statusPasang) ? (
                      <div className="input-group">
                        <label className="input-label">Pool Pemasangan (Lokasi Pasang)</label>
                        <div className="input-field" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <i className="bi bi-lock-fill" style={{ fontSize: 11 }}></i>
                          {editData.lokasiPasang || '—'} <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>(Terkunci)</span>
                        </div>
                      </div>
                    ) : (
                      <div className="input-group">
                        <label className="input-label">Pool Pemasangan (Lokasi Pasang)</label>
                        <select 
                          value={editData.lokasiPasang || ''} 
                          onChange={e => setEditData(d => ({ ...d, lokasiPasang: e.target.value }))} 
                          className="filter-select" 
                          style={{ width: '100%', height: '38px' }}
                          required
                        >
                          <option value="">— Pilih Pool Pemasangan —</option>
                          {LOKASI_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    )}"""

if OLD_LOKASI_SELECT in content:
    content = content.replace(OLD_LOKASI_SELECT, NEW_LOKASI_SELECT)
    print("FIX 2b applied: lokasi pasang locked if claimed")
else:
    print("ERROR FIX 2b: lokasi select block not found")

# 2c: Lock teknisi select
OLD_TEKNISI_SELECT = """                    <div className="input-group">
                      <label className="input-label">Teknisi Pelaksana</label>
                      <select 
                        value={editData.teknisiPelaksana || ''} 
                        onChange={e => setEditData(d => ({ ...d, teknisiPelaksana: e.target.value }))} 
                        className="filter-select" 
                        style={{ width: '100%', height: '38px' }}
                      >
                        <option value="">— Pilih Pilih Teknisi (Opsional) —</option>
                        {technicians.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                      </select>
                    </div>"""

NEW_TEKNISI_SELECT = """                    {['ON PROGRESS', 'TEKNISI SUBMITTED', 'PIC SUBMITTED', 'IT DONE', 'DONE'].includes(selectedUnit.statusPasang) ? (
                      <div className="input-group">
                        <label className="input-label">Teknisi Pelaksana</label>
                        <div className="input-field" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <i className="bi bi-lock-fill" style={{ fontSize: 11 }}></i>
                          {editData.teknisiPelaksana || '—'} <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>(Terkunci)</span>
                        </div>
                      </div>
                    ) : (
                      <div className="input-group">
                        <label className="input-label">Teknisi Pelaksana</label>
                        <select 
                          value={editData.teknisiPelaksana || ''} 
                          onChange={e => setEditData(d => ({ ...d, teknisiPelaksana: e.target.value }))} 
                          className="filter-select" 
                          style={{ width: '100%', height: '38px' }}
                        >
                          <option value="">— Pilih Pilih Teknisi (Opsional) —</option>
                          {technicians.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                      </div>
                    )}"""

if OLD_TEKNISI_SELECT in content:
    content = content.replace(OLD_TEKNISI_SELECT, NEW_TEKNISI_SELECT)
    print("FIX 2c applied: teknisi select locked if claimed")
else:
    print("ERROR FIX 2c: teknisi select block not found")

# 2d: Hide "Hapus Jadwal" button and lock "Simpan Jadwal" if claimed
OLD_FOOTER = """                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedUnit(null)}>Batal</button>
                    {selectedUnit.planDate && (
                      <button 
                        type="button" 
                        className="btn btn-danger" 
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin menghapus jadwal untuk NOPOL ${selectedUnit.nopol}?`)) {
                            save(selectedUnit.id, { planDate: '', lokasiPasang: '', picLapangan: '', teknisiPelaksana: '', gpsSerialLama: '' });
                          }
                        }}
                        style={{ marginRight: 'auto' }}
                      >
                        Hapus Jadwal
                      </button>
                    )}
                    {selectedUnit.statusPasang === 'DONE' && (
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => downloadDOCReport(selectedUnit, true)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: selectedUnit.planDate ? 0 : 'auto' }}
                        title="Unduh Laporan Word (.doc)"
                      >
                        <i className="bi bi-file-earmark-word" style={{ color: '#2B579A' }}></i> Unduh Word
                      </button>
                    )}
                    <button type="submit" className="btn btn-primary">Simpan Jadwal</button>
                  </div>"""

NEW_FOOTER = """                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedUnit(null)}>Batal</button>
                    {/* Hapus Jadwal hanya muncul jika belum diklaim teknisi */}
                    {selectedUnit.planDate && !['ON PROGRESS', 'TEKNISI SUBMITTED', 'PIC SUBMITTED', 'IT DONE', 'DONE'].includes(selectedUnit.statusPasang) && (
                      <button 
                        type="button" 
                        className="btn btn-danger" 
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin menghapus jadwal untuk NOPOL ${selectedUnit.nopol}?`)) {
                            save(selectedUnit.id, { planDate: '', lokasiPasang: '', picLapangan: '', teknisiPelaksana: '', gpsSerialLama: '' });
                          }
                        }}
                        style={{ marginRight: 'auto' }}
                      >
                        Hapus Jadwal
                      </button>
                    )}
                    {/* Tombol Copy Data */}
                    {selectedUnit.planDate && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        title="Salin data jadwal sebagai teks untuk dikirim"
                        onClick={() => {
                          const d = selectedUnit;
                          const txt = [
                            '📋 *JADWAL PEMASANGAN GPS*',
                            '━━━━━━━━━━━━━━━━━━━━━━━',
                            `🚗 *NOPOL*      : ${d.nopol || '—'}`,
                            `🏢 *Ownership* : ${d.ownership || '—'}`,
                            `🔧 *Merk/Thn*  : ${d.merk || '—'} / ${d.year || '—'}`,
                            `📍 *Lokasi*     : ${d.location || '—'} / ${d.pool || '—'}`,
                            `🎯 *Dedicate*  : ${d.dedicate || '—'}`,
                            '━━━━━━━━━━━━━━━━━━━━━━━',
                            `📅 *Tgl Pasang* : ${d.planDate || '—'}`,
                            `🗺️ *Lokasi Pasang* : ${d.lokasiPasang || '—'}`,
                            `👷 *Teknisi*    : ${d.teknisiPelaksana || '—'}`,
                            `🤝 *PIC Lapangan* : ${d.picLapangan || '—'}`,
                            `📡 *No GPS Lama* : ${d.gpsSerialLama || '—'}`,
                            '━━━━━━━━━━━━━━━━━━━━━━━',
                            `📊 *Status*     : ${d.statusPasang || 'BELUM DIJADWALKAN'}`,
                          ].join('\n');
                          navigator.clipboard.writeText(txt).then(() => {
                            globalAddToast('Data jadwal berhasil disalin!', 'success');
                          }).catch(() => {
                            const el = document.createElement('textarea');
                            el.value = txt;
                            document.body.appendChild(el);
                            el.select();
                            document.execCommand('copy');
                            document.body.removeChild(el);
                            globalAddToast('Data jadwal berhasil disalin!', 'success');
                          });
                        }}
                      >
                        <i className="bi bi-clipboard"></i> Copy Data
                      </button>
                    )}
                    {selectedUnit.statusPasang === 'DONE' && (
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => downloadDOCReport(selectedUnit, true)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        title="Unduh Laporan Word (.doc)"
                      >
                        <i className="bi bi-file-earmark-word" style={{ color: '#2B579A' }}></i> Unduh Word
                      </button>
                    )}
                    {/* Simpan hanya aktif jika belum diklaim */}
                    {!['ON PROGRESS', 'TEKNISI SUBMITTED', 'PIC SUBMITTED', 'IT DONE', 'DONE'].includes(selectedUnit.statusPasang) ? (
                      <button type="submit" className="btn btn-primary">Simpan Jadwal</button>
                    ) : (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', padding: '0 8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, height: 36 }}>
                        <i className="bi bi-lock-fill" style={{ fontSize: 11 }}></i>
                        Jadwal dikunci — sudah diklaim
                      </div>
                    )}
                  </div>"""

if OLD_FOOTER in content:
    content = content.replace(OLD_FOOTER, NEW_FOOTER)
    print("FIX 2d applied: footer buttons updated (Hapus hidden, Copy added, Simpan locked)")
else:
    print("ERROR FIX 2d: modal footer block not found")
    # Debug
    idx = content.find('Hapus Jadwal')
    print(f"  'Hapus Jadwal' found at char: {idx}")

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nAll fixes written to index.html")
