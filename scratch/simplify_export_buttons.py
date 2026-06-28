import re

html_path = 'index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update PlannerView selectedUnit modal footer
# Remove PDF button and make DOC button icon-only download button
target_modal_footer = """                  <div className="modal-footer">
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
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => downloadPDFReport(selectedUnit)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: selectedUnit.planDate ? 0 : 'auto' }}
                    >
                      <i className="ti ti-download"></i> Cetak PDF
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => downloadDOCReport(selectedUnit)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 6 }}
                    >
                      <i className="ti ti-file-text"></i> Cetak Word
                    </button>
                    <button type="submit" className="btn btn-primary">Simpan Jadwal</button>
                  </div>"""

replacement_modal_footer = """                  <div className="modal-footer">
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
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => downloadDOCReport(selectedUnit)}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, marginLeft: selectedUnit.planDate ? 0 : 'auto' }}
                      title="Unduh Laporan Word (.doc)"
                    >
                      <i className="ti ti-download" style={{ fontSize: 16 }}></i>
                    </button>
                    <button type="submit" className="btn btn-primary">Simpan Jadwal</button>
                  </div>"""

if target_modal_footer in content:
    content = content.replace(target_modal_footer, replacement_modal_footer)
    print("Scheduler modal footer updated successfully.")
else:
    print("ERROR: Could not find Scheduler modal footer!")


# 2. Update list subtab desktop action column header width back to 140
content = content.replace('                        <th style={{width: 175}}>AKSI</th>', '                        <th style={{width: 140}}>AKSI</th>')

# 3. Update list subtab desktop action cell buttons
target_desktop_list = """                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {u.statusPlan === 'PLAN' ? (
                                <button 
                                  className="btn btn-secondary btn-sm" 
                                  onClick={() => { 
                                    setSelectedUnit(u); 
                                    setEditData({ planDate: u.planDate, lokasiPasang: u.lokasiPasang, picLapangan: u.picLapangan || '', teknisiPelaksana: u.teknisiPelaksana || '', gpsSerialLama: u.gpsSerialLama || '' }); 
                                  }}
                                  title="Lihat Rincian Jadwal"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flex: 1 }}
                                >
                                  <i className="ti ti-eye" style={{ fontSize: 13 }}></i> Jadwal
                                </button>
                              ) : (
                                <button 
                                  className="btn btn-primary btn-sm" 
                                  onClick={() => { 
                                    setSelectedUnit(u); 
                                    setEditData({ planDate: u.planDate, lokasiPasang: u.lokasiPasang, picLapangan: u.picLapangan || '', teknisiPelaksana: u.teknisiPelaksana || '', gpsSerialLama: u.gpsSerialLama || '' }); 
                                  }}
                                  title="Buat Jadwal Baru"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flex: 1 }}
                                >
                                  <i className="ti ti-calendar-plus" style={{ fontSize: 13 }}></i> Plan
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => downloadPDFReport(u)}
                                title="Cetak Laporan PDF"
                                style={{ padding: '0 8px', height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <i className="ti ti-download" style={{ fontSize: 13 }}></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => downloadDOCReport(u)}
                                title="Cetak Laporan Word (.doc)"
                                style={{ padding: '0 8px', height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: 4 }}
                              >
                                <i className="ti ti-file-text" style={{ fontSize: 13 }}></i>
                              </button>
                            </div>
                          </td>"""

replacement_desktop_list = """                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {u.statusPlan === 'PLAN' ? (
                                <button 
                                  className="btn btn-secondary btn-sm" 
                                  onClick={() => { 
                                    setSelectedUnit(u); 
                                    setEditData({ planDate: u.planDate, lokasiPasang: u.lokasiPasang, picLapangan: u.picLapangan || '', teknisiPelaksana: u.teknisiPelaksana || '', gpsSerialLama: u.gpsSerialLama || '' }); 
                                  }}
                                  title="Lihat Rincian Jadwal"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flex: 1 }}
                                >
                                  <i className="ti ti-eye" style={{ fontSize: 13 }}></i> Jadwal
                                </button>
                              ) : (
                                <button 
                                  className="btn btn-primary btn-sm" 
                                  onClick={() => { 
                                    setSelectedUnit(u); 
                                    setEditData({ planDate: u.planDate, lokasiPasang: u.lokasiPasang, picLapangan: u.picLapangan || '', teknisiPelaksana: u.teknisiPelaksana || '', gpsSerialLama: u.gpsSerialLama || '' }); 
                                  }}
                                  title="Buat Jadwal Baru"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flex: 1 }}
                                >
                                  <i className="ti ti-calendar-plus" style={{ fontSize: 13 }}></i> Plan
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => downloadDOCReport(u)}
                                title="Unduh Laporan Word (.doc)"
                                style={{ padding: '0 8px', height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <i className="ti ti-download" style={{ fontSize: 13 }}></i>
                              </button>
                            </div>
                          </td>"""

if target_desktop_list in content:
    content = content.replace(target_desktop_list, replacement_desktop_list)
    print("List tab desktop table action cell updated successfully.")
else:
    print("ERROR: Could not find list tab desktop table actions!")


# 4. Update list subtab mobile actions
target_mobile_list = """                      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        {u.statusPlan === 'PLAN' ? (
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => { 
                              setSelectedUnit(u); 
                              setEditData({ planDate: u.planDate, lokasiPasang: u.lokasiPasang, picLapangan: u.picLapangan || '', teknisiPelaksana: u.teknisiPelaksana || '', gpsSerialLama: u.gpsSerialLama || '' }); 
                            }}
                            style={{ flex: 1, justifyContent: 'center', height: 36 }}
                          >
                            <i className="ti ti-eye"></i> Jadwal
                          </button>
                        ) : (
                          <button 
                            className="btn btn-primary btn-sm" 
                            onClick={() => { 
                              setSelectedUnit(u); 
                              setEditData({ planDate: u.planDate, lokasiPasang: u.lokasiPasang, picLapangan: u.picLapangan || '', teknisiPelaksana: u.teknisiPelaksana || '', gpsSerialLama: u.gpsSerialLama || '' }); 
                            }}
                            style={{ flex: 1, justifyContent: 'center', height: 36 }}
                          >
                            <i className="ti ti-calendar-plus"></i> Plan
                          </button>
                        )}
                        <button 
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => downloadPDFReport(u)}
                          style={{ width: 40, justifyContent: 'center', height: 36, display: 'inline-flex', alignItems: 'center' }}
                          title="Cetak PDF"
                        >
                          <i className="ti ti-download"></i>
                        </button>
                        <button 
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => downloadDOCReport(u)}
                          style={{ width: 40, justifyContent: 'center', height: 36, display: 'inline-flex', alignItems: 'center', marginLeft: 4 }}
                          title="Cetak Word (.doc)"
                        >
                          <i className="ti ti-file-text"></i>
                        </button>
                      </div>"""

replacement_mobile_list = """                      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        {u.statusPlan === 'PLAN' ? (
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => { 
                              setSelectedUnit(u); 
                              setEditData({ planDate: u.planDate, lokasiPasang: u.lokasiPasang, picLapangan: u.picLapangan || '', teknisiPelaksana: u.teknisiPelaksana || '', gpsSerialLama: u.gpsSerialLama || '' }); 
                            }}
                            style={{ flex: 1, justifyContent: 'center', height: 36 }}
                          >
                            <i className="ti ti-eye"></i> Jadwal
                          </button>
                        ) : (
                          <button 
                            className="btn btn-primary btn-sm" 
                            onClick={() => { 
                              setSelectedUnit(u); 
                              setEditData({ planDate: u.planDate, lokasiPasang: u.lokasiPasang, picLapangan: u.picLapangan || '', teknisiPelaksana: u.teknisiPelaksana || '', gpsSerialLama: u.gpsSerialLama || '' }); 
                            }}
                            style={{ flex: 1, justifyContent: 'center', height: 36 }}
                          >
                            <i className="ti ti-calendar-plus"></i> Plan
                          </button>
                        )}
                        <button 
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => downloadDOCReport(u)}
                          style={{ width: 44, justifyContent: 'center', height: 36, display: 'inline-flex', alignItems: 'center' }}
                          title="Unduh Laporan Word (.doc)"
                        >
                          <i className="ti ti-download"></i>
                        </button>
                      </div>"""

if target_mobile_list in content:
    content = content.replace(target_mobile_list, replacement_mobile_list)
    print("List tab mobile card actions updated successfully.")
else:
    print("ERROR: Could not find list tab mobile card actions!")


# 5. Revert monitoring subtab desktop column width to 80px
content = content.replace("                        <th style={{ textAlign: 'center', width: '130px' }}>AKSI</th>", "                        <th style={{ textAlign: 'center', width: '80px' }}>AKSI</th>")

# 6. Update monitoring subtab desktop table rows
target_desktop_mon = """                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => downloadPDFReport(u)}
                                  title="Cetak Laporan PDF"
                                  style={{ padding: '0 8px', height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <i className="ti ti-download" style={{ fontSize: 12 }}></i> PDF
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => downloadDOCReport(u)}
                                  title="Cetak Laporan Word (.doc)"
                                  style={{ padding: '0 8px', height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <i className="ti ti-file-text" style={{ fontSize: 12 }}></i> Word
                                </button>
                              </div>
                            </td>"""

replacement_desktop_mon = """                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => downloadDOCReport(u)}
                                title="Unduh Laporan Word (.doc)"
                                style={{ padding: '0 8px', height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <i className="ti ti-download" style={{ fontSize: 13 }}></i>
                              </button>
                            </td>"""

if target_desktop_mon in content:
    content = content.replace(target_desktop_mon, replacement_desktop_mon)
    print("Monitoring tab desktop table row updated successfully.")
else:
    print("ERROR: Could not find monitoring tab desktop actions!")


# 7. Update monitoring subtab mobile cards
target_mobile_mon = """                        <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: 10, marginTop: 10, fontSize: 11, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ flex: 1, marginRight: 8 }}>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{lastNote.activity}: </span>
                            <span style={{ color: 'var(--text-secondary)' }}>{lastNote.notes}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                            <button 
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => downloadPDFReport(u)}
                              style={{ height: 28, padding: '0 8px', display: 'flex', alignItems: 'center', gap: 4 }}
                              title="Cetak PDF"
                            >
                              <i className="ti ti-download" style={{ fontSize: 12 }}></i> PDF
                            </button>
                            <button 
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => downloadDOCReport(u)}
                              style={{ height: 28, padding: '0 8px', display: 'flex', alignItems: 'center', gap: 4 }}
                              title="Cetak Word (.doc)"
                            >
                              <i className="ti ti-file-text" style={{ fontSize: 12 }}></i> Word
                            </button>
                          </div>
                        </div>"""

replacement_mobile_mon = """                        <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: 10, marginTop: 10, fontSize: 11, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ flex: 1, marginRight: 8 }}>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{lastNote.activity}: </span>
                            <span style={{ color: 'var(--text-secondary)' }}>{lastNote.notes}</span>
                          </div>
                          <button 
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => downloadDOCReport(u)}
                            style={{ height: 28, padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                            title="Unduh Laporan Word (.doc)"
                          >
                            <i className="ti ti-download" style={{ fontSize: 12 }}></i>
                          </button>
                        </div>"""

if target_mobile_mon in content:
    content = content.replace(target_mobile_mon, replacement_mobile_mon)
    print("Monitoring tab mobile card updated successfully.")
else:
    print("ERROR: Could not find monitoring tab mobile card actions!")


# 8. Update historyReviewUnit modal footer in TeknisiView
target_tech_review = """<div className="modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" style={{ flex: 1.2, height: 36, justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => downloadPDFReport(historyReviewUnit)}>
                    <i className="ti ti-download" style={{ fontSize: 13 }}></i> Cetak PDF
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1.2, height: 36, justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => downloadDOCReport(historyReviewUnit)}>
                    <i className="ti ti-file-text"></i> Cetak Word
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 0.8, height: 36 }} onClick={() => setHistoryReviewUnit(null)}>Tutup</button>
                </div>"""

replacement_tech_review = """<div className="modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" style={{ flex: 1.5, height: 36, justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => downloadDOCReport(historyReviewUnit)}>
                    <i className="ti ti-download" style={{ fontSize: 14 }}></i> Unduh Laporan
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1, height: 36 }} onClick={() => setHistoryReviewUnit(null)}>Tutup</button>
                </div>"""

if target_tech_review in content:
    content = content.replace(target_tech_review, replacement_tech_review)
    print("TeknisiView history review modal footer updated successfully.")
else:
    print("ERROR: Could not find TeknisiView modal footer!")


with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Simplification complete!")
