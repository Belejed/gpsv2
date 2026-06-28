import os

file_path = "index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. statusPlan mapping
search_1 = "statusPlan: row.planDate ? 'PLAN' : 'UNPLAN'"
replace_1 = "statusPlan: row.statusPasang === 'DONE' ? 'DONE' : (row.planDate ? 'PLAN' : 'UNPLAN')"
assert search_1 in content, "Error: search_1 not found"
content = content.replace(search_1, replace_1)

# 2. Filter options
search_2 = """            <select value={st} onChange={e => { setSt(e.target.value); setPage(1); }} className="filter-select">
              <option value="">Semua Status Plan</option>
              <option value="PLAN">PLAN</option>
              <option value="UNPLAN">UNPLAN</option>
            </select>"""
replace_2 = """            <select value={st} onChange={e => { setSt(e.target.value); setPage(1); }} className="filter-select">
              <option value="">Semua Status Plan</option>
              <option value="PLAN">PLAN</option>
              <option value="UNPLAN">UNPLAN</option>
              <option value="DONE">DONE / FINISH</option>
            </select>"""
assert search_2 in content, "Error: search_2 not found"
content = content.replace(search_2, replace_2)

# 3. CMT submit setUnits state
search_3 = """          setUnits(prev => prev.map(u => u.id === id ? {
            ...u,
            statusPasang: finalStatus,
            cmtCekAplikasi,
            cmtFotoTerimaFisik: urlCmtFotoTerimaFisik,
            cmtFotoTerminasi: urlCmtFotoSerahTerima,
            updatedAt: ts
          } : u));"""
replace_3 = """          setUnits(prev => prev.map(u => u.id === id ? {
            ...u,
            statusPasang: finalStatus,
            statusPlan: finalStatus === 'DONE' ? 'DONE' : u.statusPlan,
            cmtCekAplikasi,
            cmtFotoTerimaFisik: urlCmtFotoTerimaFisik,
            cmtFotoTerminasi: urlCmtFotoSerahTerima,
            updatedAt: ts
          } : u));"""
assert search_3 in content, "Error: search_3 not found"
content = content.replace(search_3, replace_3)

# 4. List tab mobile card download button
search_4 = """                        <button 
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => downloadDOCReport(u)}
                          style={{ width: 44, justifyContent: 'center', height: 36, display: 'inline-flex', alignItems: 'center' }}
                          title="Unduh Laporan Word (.doc)"
                        >
                          <i className="bi bi-download"></i>
                        </button>"""
replace_4 = """                        {(u.statusPasang === 'DONE' || u.statusPasang === 'CONFIRM') && (
                          <button 
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => downloadDOCReport(u)}
                            style={{ width: 44, justifyContent: 'center', height: 36, display: 'inline-flex', alignItems: 'center' }}
                            title="Unduh Laporan Word (.doc)"
                          >
                            <i className="bi bi-download"></i>
                          </button>
                        )}"""
assert search_4 in content, "Error: search_4 not found"
content = content.replace(search_4, replace_4)

# 5 & 7. List tab & Monitoring tab desktop table download buttons (they are identical)
search_5 = """                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => downloadDOCReport(u)}
                                title="Unduh Laporan Word (.doc)"
                                style={{ padding: '0 8px', height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <i className="bi bi-download" style={{ fontSize: 13 }}></i>
                              </button>"""

replace_5 = """                              {(u.statusPasang === 'DONE' || u.statusPasang === 'CONFIRM') && (
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => downloadDOCReport(u)}
                                  title="Unduh Laporan Word (.doc)"
                                  style={{ padding: '0 8px', height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <i className="bi bi-download" style={{ fontSize: 13 }}></i>
                                </button>
                              )}"""
# Count occurrences to be sure
count_5 = content.count(search_5)
assert count_5 == 2, f"Error: search_5 expected 2 occurrences, found {count_5}"
content = content.replace(search_5, replace_5)

# 6. Monitoring tab mobile card download button
search_6 = """                          <button 
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => downloadDOCReport(u)}
                            style={{ height: 28, padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                            title="Unduh Laporan Word (.doc)"
                          >
                            <i className="bi bi-download" style={{ fontSize: 12 }}></i>
                          </button>"""
replace_6 = """                          {(u.statusPasang === 'DONE' || u.statusPasang === 'CONFIRM') && (
                            <button 
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => downloadDOCReport(u)}
                              style={{ height: 28, padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                              title="Unduh Laporan Word (.doc)"
                            >
                              <i className="bi bi-download" style={{ fontSize: 12 }}></i>
                            </button>
                          )}"""
assert search_6 in content, "Error: search_6 not found"
content = content.replace(search_6, replace_6)

# 8. Scheduler details modal button
search_8 = """                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => downloadDOCReport(selectedUnit)}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, marginLeft: selectedUnit.planDate ? 0 : 'auto' }}
                      title="Unduh Laporan Word (.doc)"
                    >
                      <i className="bi bi-download" style={{ fontSize: 16 }}></i>
                    </button>"""
replace_8 = """                    {(selectedUnit.statusPasang === 'DONE' || selectedUnit.statusPasang === 'CONFIRM') && (
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => downloadDOCReport(selectedUnit)}
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, marginLeft: selectedUnit.planDate ? 0 : 'auto' }}
                        title="Unduh Laporan Word (.doc)"
                      >
                        <i className="bi bi-download" style={{ fontSize: 16 }}></i>
                      </button>
                    )}"""
assert search_8 in content, "Error: search_8 not found"
content = content.replace(search_8, replace_8)

# 9. Technician history review modal footer button
search_9 = """<div className="modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" style={{ flex: 1.5, height: 36, justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => downloadDOCReport(historyReviewUnit)}>
                    <i className="bi bi-download" style={{ fontSize: 14 }}></i> Unduh Laporan
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1, height: 36 }} onClick={() => setHistoryReviewUnit(null)}>Tutup</button>
                </div>"""
replace_9 = """<div className="modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 10 }}>
                  {(historyReviewUnit.statusPasang === 'DONE' || historyReviewUnit.statusPasang === 'CONFIRM') && (
                    <button className="btn btn-primary" style={{ flex: 1.5, height: 36, justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => downloadDOCReport(historyReviewUnit)}>
                      <i className="bi bi-download" style={{ fontSize: 14 }}></i> Unduh Laporan
                    </button>
                  )}
                  <button className="btn btn-secondary" style={{ flex: 1, height: 36, marginLeft: (historyReviewUnit.statusPasang === 'DONE' || historyReviewUnit.statusPasang === 'CONFIRM') ? 0 : 'auto' }} onClick={() => setHistoryReviewUnit(null)}>Tutup</button>
                </div>"""
assert search_9 in content, "Error: search_9 not found"
content = content.replace(search_9, replace_9)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Edits successfully applied!")
