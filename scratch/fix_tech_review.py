html_path = 'index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """<div className="modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" style={{ flex: 1.2, height: 36, justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => downloadPDFReport(historyReviewUnit)}>
                    <i className="ti ti-download" style={{ fontSize: 13 }}></i> Cetak PDF
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1.2, height: 36, justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => downloadDOCReport(historyReviewUnit)}>
                    <i className="ti ti-file-text" style={{ fontSize: 13 }}></i> Cetak Word
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 0.8, height: 36 }} onClick={() => setHistoryReviewUnit(null)}>Tutup</button>
                </div>"""

replacement = """<div className="modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" style={{ flex: 1.5, height: 36, justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => downloadDOCReport(historyReviewUnit)}>
                    <i className="ti ti-download" style={{ fontSize: 14 }}></i> Unduh Laporan
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1, height: 36 }} onClick={() => setHistoryReviewUnit(null)}>Tutup</button>
                </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Successfully simplified history review modal footer in TeknisiView.")
else:
    print("ERROR: Could not find history review modal footer!")

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)
