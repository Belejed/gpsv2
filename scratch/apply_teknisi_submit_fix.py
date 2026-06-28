with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# =========================================================
# FIX 1: On sync failure, DO NOT close form or mark as submitted.
# Just show error and let user retry.
# =========================================================
OLD_CATCH = """        } catch (err) {
          console.error(err);
          globalAddToast('Gagal mengirim ke cloud, data disimpan secara lokal.', 'warning');
          
          setUnits(prev => prev.map(item => item.id === activeUnit.id ? {
            ...item,
            ...updates,
            gpsSerialLama: noGpsLama,
            easygoDicopot: 'SUDAH',
            statusSystem: 'BELUM DITEST',
            updatedAt: ts
          } : item));
          try {
            localStorage.removeItem('active_install_form_' + activeUnit.id);
            localStorage.removeItem('teknisi_active_unit_id');
          } catch (e) {
            console.error(e);
          }
          setCompletedLocally(prev => {
            const next = { ...prev, [activeUnit.id]: 'TEKNISI SUBMITTED' };
            try {
              localStorage.setItem('teknisi_completed_locally', JSON.stringify(next));
            } catch (e) {}
            return next;
          });
          setActiveUnitId(null);
          setSubTab('today');
        } finally {
          setLoadingSubmit(false);
        }"""

NEW_CATCH = """        } catch (err) {
          console.error(err);
          // On sync failure, keep form open so technician can retry
          globalAddToast('Gagal kirim ke server! Cek koneksi internet lalu tekan "Kirim" lagi. Data form tidak hilang.', 'error');
        } finally {
          setLoadingSubmit(false);
        }"""

if OLD_CATCH in content:
    content = content.replace(OLD_CATCH, NEW_CATCH)
    print("FIX 1 applied: catch block now keeps form open on failure")
else:
    print("ERROR: OLD_CATCH not found - searching for alternative...")
    # Try to show context
    idx = content.find("Gagal mengirim ke cloud, data disimpan secara lokal.")
    if idx != -1:
        print("Found toast message at char:", idx)
        print("Context:", content[idx-200:idx+400])
    else:
        print("Toast message not found either")


# =========================================================
# FIX 2: Add "Edit Ulang" button in history table for TEKNISI SUBMITTED units
# Desktop table row: add button after Word button
# =========================================================
OLD_HIST_DESKTOP = """                                  <button 
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => downloadDOCReport(u, false)}
                                    style={{ gap: 4, display: 'inline-flex', alignItems: 'center' }}
                                    title="Unduh Laporan Word 1 Halaman"
                                  >
                                    <i className="bi bi-file-earmark-word"></i> Word
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}"""

NEW_HIST_DESKTOP = """                                  <button 
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => downloadDOCReport(u, false)}
                                    style={{ gap: 4, display: 'inline-flex', alignItems: 'center' }}
                                    title="Unduh Laporan Word 1 Halaman"
                                  >
                                    <i className="bi bi-file-earmark-word"></i> Word
                                  </button>
                                  {u.statusPasang === 'TEKNISI SUBMITTED' && (
                                    <button
                                      className="btn btn-sm"
                                      style={{ gap: 4, display: 'inline-flex', alignItems: 'center', background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}
                                      title="Buka kembali untuk diedit (hapus data lokal & kirim ulang)"
                                      onClick={() => {
                                        if (!confirm('Apakah Anda yakin ingin membuka kembali laporan ini untuk diedit ulang? Status akan dikembalikan ke ON PROGRESS.')) return;
                                        try {
                                          localStorage.removeItem('active_install_form_' + u.id);
                                          localStorage.removeItem('teknisi_active_unit_id');
                                          setCompletedLocally(prev => {
                                            const next = { ...prev };
                                            delete next[u.id];
                                            try { localStorage.setItem('teknisi_completed_locally', JSON.stringify(next)); } catch(e){}
                                            return next;
                                          });
                                        } catch(e) {}
                                        globalAddToast('Unit dibuka kembali untuk diedit. Harap kirim ulang laporan.', 'warning');
                                        setSubTab('installations');
                                        setActiveUnitId(u.id);
                                      }}
                                    >
                                      <i className="bi bi-pencil-square"></i> Edit
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}"""

if OLD_HIST_DESKTOP in content:
    content = content.replace(OLD_HIST_DESKTOP, NEW_HIST_DESKTOP)
    print("FIX 2a applied: Edit button added in desktop history table")
else:
    print("ERROR: OLD_HIST_DESKTOP not found")

# =========================================================
# FIX 2b: Mobile card - add Edit button for TEKNISI SUBMITTED
# =========================================================
OLD_HIST_MOBILE = """                      <button 
                        className="btn btn-secondary btn-sm" 
                        style={{ width: '100%', justifyContent: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', height: 34, color: 'var(--text-primary)' }}
                        onClick={() => setHistoryReviewUnit(u)}
                      >
                        <i className="bi bi-eye" style={{marginRight: 4}}></i> Detail Pekerjaan & Foto
                      </button>
                    </div>
                  ))}"""

NEW_HIST_MOBILE = """                      <button 
                        className="btn btn-secondary btn-sm" 
                        style={{ width: '100%', justifyContent: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', height: 34, color: 'var(--text-primary)' }}
                        onClick={() => setHistoryReviewUnit(u)}
                      >
                        <i className="bi bi-eye" style={{marginRight: 4}}></i> Detail Pekerjaan & Foto
                      </button>
                      {u.statusPasang === 'TEKNISI SUBMITTED' && (
                        <button
                          className="btn btn-sm"
                          style={{ width: '100%', justifyContent: 'center', height: 34, display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}
                          onClick={() => {
                            if (!confirm('Buka kembali untuk edit ulang? Status akan dikembalikan ke ON PROGRESS.')) return;
                            try {
                              localStorage.removeItem('active_install_form_' + u.id);
                              localStorage.removeItem('teknisi_active_unit_id');
                              setCompletedLocally(prev => {
                                const next = { ...prev };
                                delete next[u.id];
                                try { localStorage.setItem('teknisi_completed_locally', JSON.stringify(next)); } catch(e){}
                                return next;
                              });
                            } catch(e) {}
                            globalAddToast('Unit dibuka kembali untuk diedit. Harap kirim ulang laporan.', 'warning');
                            setSubTab('installations');
                            setActiveUnitId(u.id);
                          }}
                        >
                          <i className="bi bi-pencil-square"></i> Edit Ulang Laporan
                        </button>
                      )}
                    </div>
                  ))}"""

if OLD_HIST_MOBILE in content:
    content = content.replace(OLD_HIST_MOBILE, NEW_HIST_MOBILE)
    print("FIX 2b applied: Edit button added in mobile history cards")
else:
    print("ERROR: OLD_HIST_MOBILE not found")

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nDone! index.html updated.")
