import os

file_path = "index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Teknisi - fotoKendaraan
search_t1 = """                              {fotoKendaraan ? (
                                <div style={{width:'100%'}}>
                                  <a href={fotoKendaraan} onClick={(e) => { e.preventDefault(); window.showImagePreview(fotoKendaraan); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '80px', textDecoration: 'none', background: 'rgba(59, 130, 246, 0.08)', borderRadius: 6, border: '1px dashed #3B82F6', color: '#60A5FA' }}>
                                    <i className="bi bi-link-45deg" style={{ fontSize: 18, marginBottom: 4 }}></i>
                                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>LIHAT FOTO</span>
                                  </a>
                                  <button type="button" className="btn btn-secondary btn-sm" style={{marginTop: 6, color: '#EF4444', width: '100%', border: 'none', background: 'rgba(239,68,68,0.1)'}} onClick={() => setFotoKendaraan('')}>Hapus</button>
                                </div>"""

replace_t1 = """                              {fotoKendaraan ? (
                                <div style={{width:'100%'}}>
                                  <a href={fotoKendaraan} onClick={(e) => { e.preventDefault(); window.showImagePreview(fotoKendaraan); }} style={{ display: 'block', width: '100%', height: '80px', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                    <img src={fotoKendaraan} alt="Foto Kendaraan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </a>
                                  <button type="button" className="btn btn-secondary btn-sm" style={{marginTop: 6, color: '#EF4444', width: '100%', border: 'none', background: 'rgba(239,68,68,0.1)'}} onClick={() => setFotoKendaraan('')}>Hapus</button>
                                </div>"""

assert search_t1 in content, "Error: search_t1 not found"
content = content.replace(search_t1, replace_t1)

# 2. Teknisi - fotoGPSLama
search_t2 = """                              {fotoGPSLama ? (
                                <div style={{width:'100%'}}>
                                  <a href={fotoGPSLama} onClick={(e) => { e.preventDefault(); window.showImagePreview(fotoGPSLama); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '80px', textDecoration: 'none', background: 'rgba(59, 130, 246, 0.08)', borderRadius: 6, border: '1px dashed #3B82F6', color: '#60A5FA' }}>
                                    <i className="bi bi-link-45deg" style={{ fontSize: 18, marginBottom: 4 }}></i>
                                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>LIHAT FOTO</span>
                                  </a>
                                  <button type="button" className="btn btn-secondary btn-sm" style={{marginTop: 6, color: '#EF4444', width: '100%', border: 'none', background: 'rgba(239,68,68,0.1)'}} onClick={() => setFotoGPSLama('')}>Hapus</button>
                                </div>"""

replace_t2 = """                              {fotoGPSLama ? (
                                <div style={{width:'100%'}}>
                                  <a href={fotoGPSLama} onClick={(e) => { e.preventDefault(); window.showImagePreview(fotoGPSLama); }} style={{ display: 'block', width: '100%', height: '80px', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                    <img src={fotoGPSLama} alt="Foto GPS Lama" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </a>
                                  <button type="button" className="btn btn-secondary btn-sm" style={{marginTop: 6, color: '#EF4444', width: '100%', border: 'none', background: 'rgba(239,68,68,0.1)'}} onClick={() => setFotoGPSLama('')}>Hapus</button>
                                </div>"""

assert search_t2 in content, "Error: search_t2 not found"
content = content.replace(search_t2, replace_t2)

# 3. Teknisi - fotoGPSBaru
search_t3 = """                              {fotoGPSBaru ? (
                                <div style={{width:'100%'}}>
                                  <a href={fotoGPSBaru} onClick={(e) => { e.preventDefault(); window.showImagePreview(fotoGPSBaru); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '80px', textDecoration: 'none', background: 'rgba(59, 130, 246, 0.08)', borderRadius: 6, border: '1px dashed #3B82F6', color: '#60A5FA' }}>
                                    <i className="bi bi-link-45deg" style={{ fontSize: 18, marginBottom: 4 }}></i>
                                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>LIHAT FOTO</span>
                                  </a>
                                  <button type="button" className="btn btn-secondary btn-sm" style={{marginTop: 6, color: '#EF4444', width: '100%', border: 'none', background: 'rgba(239,68,68,0.1)'}} onClick={() => setFotoGPSBaru('')}>Hapus</button>
                                </div>"""

replace_t3 = """                              {fotoGPSBaru ? (
                                <div style={{width:'100%'}}>
                                  <a href={fotoGPSBaru} onClick={(e) => { e.preventDefault(); window.showImagePreview(fotoGPSBaru); }} style={{ display: 'block', width: '100%', height: '80px', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                    <img src={fotoGPSBaru} alt="Foto GPS Baru" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </a>
                                  <button type="button" className="btn btn-secondary btn-sm" style={{marginTop: 6, color: '#EF4444', width: '100%', border: 'none', background: 'rgba(239,68,68,0.1)'}} onClick={() => setFotoGPSBaru('')}>Hapus</button>
                                </div>"""

assert search_t3 in content, "Error: search_t3 not found"
content = content.replace(search_t3, replace_t3)

# 4. Teknisi - fotoHasilInstalasi
search_t4 = """                              {fotoHasilInstalasi ? (
                                <div style={{width:'100%'}}>
                                  <a href={fotoHasilInstalasi} onClick={(e) => { e.preventDefault(); window.showImagePreview(fotoHasilInstalasi); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '80px', textDecoration: 'none', background: 'rgba(59, 130, 246, 0.08)', borderRadius: 6, border: '1px dashed #3B82F6', color: '#60A5FA' }}>
                                    <i className="bi bi-link-45deg" style={{ fontSize: 18, marginBottom: 4 }}></i>
                                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>LIHAT FOTO</span>
                                  </a>
                                  <button type="button" className="btn btn-secondary btn-sm" style={{marginTop: 6, color: '#EF4444', width: '100%', border: 'none', background: 'rgba(239,68,68,0.1)'}} onClick={() => setFotoHasilInstalasi('')}>Hapus</button>
                                </div>"""

replace_t4 = """                              {fotoHasilInstalasi ? (
                                <div style={{width:'100%'}}>
                                  <a href={fotoHasilInstalasi} onClick={(e) => { e.preventDefault(); window.showImagePreview(fotoHasilInstalasi); }} style={{ display: 'block', width: '100%', height: '80px', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                    <img src={fotoHasilInstalasi} alt="Foto Hasil Instalasi" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </a>
                                  <button type="button" className="btn btn-secondary btn-sm" style={{marginTop: 6, color: '#EF4444', width: '100%', border: 'none', background: 'rgba(239,68,68,0.1)'}} onClick={() => setFotoHasilInstalasi('')}>Hapus</button>
                                </div>"""

assert search_t4 in content, "Error: search_t4 not found"
content = content.replace(search_t4, replace_t4)

# 5. PIC - picFotoSerahTerima
search_p = """                    {picFotoSerahTerima ? (
                      <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <a href={picFotoSerahTerima} onClick={(e) => { e.preventDefault(); window.showImagePreview(picFotoSerahTerima); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', textDecoration: 'none', background: 'rgba(59, 130, 246, 0.08)', borderRadius: 6, color: '#60A5FA' }}>
                          <i className="bi bi-link-45deg" style={{ fontSize: 24, marginBottom: 6 }}></i>
                          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>LIHAT FOTO BUKTI PENYERAHAN</span>
                        </a>
                        <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 8, right: 8, color: '#EF4444', border: 'none', background: 'rgba(239,68,68,0.2)', padding: '4px 8px', fontSize: 10 }} onClick={() => setPicFotoSerahTerima('')}>Hapus</button>
                      </div>
                    ) : ("""

replace_p = """                    {picFotoSerahTerima ? (
                      <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <a href={picFotoSerahTerima} onClick={(e) => { e.preventDefault(); window.showImagePreview(picFotoSerahTerima); }} style={{ display: 'block', width: '100%', height: '100%', borderRadius: 6, overflow: 'hidden' }}>
                          <img src={picFotoSerahTerima} alt="Bukti Penyerahan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </a>
                        <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 8, right: 8, color: '#EF4444', border: 'none', background: 'rgba(239,68,68,0.2)', padding: '4px 8px', fontSize: 10 }} onClick={() => setPicFotoSerahTerima('')}>Hapus</button>
                      </div>
                    ) : ("""

assert search_p in content, "Error: search_p not found"
content = content.replace(search_p, replace_p)

# 6. IT - itFotoIntegrasi
search_i1 = """                    <div className="photo-card" style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 8, background: 'var(--bg-primary)' }}>
                      {itFotoIntegrasi ? (
                        <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <a href={itFotoIntegrasi} onClick={(e) => { e.preventDefault(); window.showImagePreview(itFotoIntegrasi); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', textDecoration: 'none', background: 'rgba(59, 130, 246, 0.08)', borderRadius: 6, color: '#60A5FA' }}>
                            <i className="bi bi-link-45deg" style={{ fontSize: 24, marginBottom: 4 }}></i>
                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>LIHAT FOTO INTEGRASI</span>
                          </a>
                          <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 8, right: 8, color: '#EF4444', border: 'none', background: 'rgba(239,68,68,0.2)' }} onClick={() => setItFotoIntegrasi('')}>Hapus</button>
                        </div>
                      ) : ("""

replace_i1 = """                    <div className="photo-card" style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 8, background: 'var(--bg-primary)' }}>
                      {itFotoIntegrasi ? (
                        <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <a href={itFotoIntegrasi} onClick={(e) => { e.preventDefault(); window.showImagePreview(itFotoIntegrasi); }} style={{ display: 'block', width: '100%', height: '100%', borderRadius: 6, overflow: 'hidden' }}>
                            <img src={itFotoIntegrasi} alt="Foto Integrasi" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </a>
                          <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 8, right: 8, color: '#EF4444', border: 'none', background: 'rgba(239,68,68,0.2)' }} onClick={() => setItFotoIntegrasi('')}>Hapus</button>
                        </div>
                      ) : ("""

assert search_i1 in content, "Error: search_i1 not found"
content = content.replace(search_i1, replace_i1)

# 7. IT - itFotoAbnormality
search_i2 = """                    <div className="photo-card" style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 8, background: 'var(--bg-primary)' }}>
                      {itFotoAbnormality ? (
                        <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <a href={itFotoAbnormality} onClick={(e) => { e.preventDefault(); window.showImagePreview(itFotoAbnormality); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', textDecoration: 'none', background: 'rgba(59, 130, 246, 0.08)', borderRadius: 6, color: '#60A5FA' }}>
                            <i className="bi bi-link-45deg" style={{ fontSize: 24, marginBottom: 4 }}></i>
                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>LIHAT FOTO ABNORMALITY</span>
                          </a>
                          <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 8, right: 8, color: '#EF4444', border: 'none', background: 'rgba(239,68,68,0.2)' }} onClick={() => setItFotoAbnormality('')}>Hapus</button>
                        </div>
                      ) : ("""

replace_i2 = """                    <div className="photo-card" style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 8, background: 'var(--bg-primary)' }}>
                      {itFotoAbnormality ? (
                        <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <a href={itFotoAbnormality} onClick={(e) => { e.preventDefault(); window.showImagePreview(itFotoAbnormality); }} style={{ display: 'block', width: '100%', height: '100%', borderRadius: 6, overflow: 'hidden' }}>
                            <img src={itFotoAbnormality} alt="Foto Abnormality" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </a>
                          <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 8, right: 8, color: '#EF4444', border: 'none', background: 'rgba(239,68,68,0.2)' }} onClick={() => setItFotoAbnormality('')}>Hapus</button>
                        </div>
                      ) : ("""

assert search_i2 in content, "Error: search_i2 not found"
content = content.replace(search_i2, replace_i2)

# 8. CMT - cmtFotoTerimaFisik
search_c1 = """                    <div className="photo-card" style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 8, background: 'var(--bg-primary)' }}>
                      {cmtFotoTerimaFisik ? (
                        <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <a href={cmtFotoTerimaFisik} onClick={(e) => { e.preventDefault(); window.showImagePreview(cmtFotoTerimaFisik); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', textDecoration: 'none', background: 'rgba(59, 130, 246, 0.08)', borderRadius: 6, color: '#60A5FA' }}>
                            <i className="bi bi-link-45deg" style={{ fontSize: 24, marginBottom: 4 }}></i>
                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>LIHAT FOTO TERIMA FISIK</span>
                          </a>
                          <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 8, right: 8, color: '#EF4444', border: 'none', background: 'rgba(239,68,68,0.2)' }} onClick={() => setCmtFotoTerimaFisik('')}>Hapus</button>
                        </div>
                      ) : ("""

replace_c1 = """                    <div className="photo-card" style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 8, background: 'var(--bg-primary)' }}>
                      {cmtFotoTerimaFisik ? (
                        <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <a href={cmtFotoTerimaFisik} onClick={(e) => { e.preventDefault(); window.showImagePreview(cmtFotoTerimaFisik); }} style={{ display: 'block', width: '100%', height: '100%', borderRadius: 6, overflow: 'hidden' }}>
                            <img src={cmtFotoTerimaFisik} alt="Foto Terima Fisik" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </a>
                          <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 8, right: 8, color: '#EF4444', border: 'none', background: 'rgba(239,68,68,0.2)' }} onClick={() => setCmtFotoTerimaFisik('')}>Hapus</button>
                        </div>
                      ) : ("""

assert search_c1 in content, "Error: search_c1 not found"
content = content.replace(search_c1, replace_c1)

# 9. CMT - cmtFotoSerahTerima
search_c2 = """                    <div className="photo-card" style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 8, background: 'var(--bg-primary)' }}>
                      {cmtFotoSerahTerima ? (
                        <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <a href={cmtFotoSerahTerima} onClick={(e) => { e.preventDefault(); window.showImagePreview(cmtFotoSerahTerima); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', textDecoration: 'none', background: 'rgba(59, 130, 246, 0.08)', borderRadius: 6, color: '#60A5FA' }}>
                            <i className="bi bi-link-45deg" style={{ fontSize: 24, marginBottom: 4 }}></i>
                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>LIHAT FOTO BUKTI TERMINASI</span>
                          </a>
                          <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 8, right: 8, color: '#EF4444', border: 'none', background: 'rgba(239,68,68,0.2)' }} onClick={() => setCmtFotoSerahTerima('')}>Hapus</button>
                        </div>
                      ) : ("""

replace_c2 = """                    <div className="photo-card" style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 8, background: 'var(--bg-primary)' }}>
                      {cmtFotoSerahTerima ? (
                        <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <a href={cmtFotoSerahTerima} onClick={(e) => { e.preventDefault(); window.showImagePreview(cmtFotoSerahTerima); }} style={{ display: 'block', width: '100%', height: '100%', borderRadius: 6, overflow: 'hidden' }}>
                            <img src={cmtFotoSerahTerima} alt="Foto Serah Terima" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </a>
                          <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 8, right: 8, color: '#EF4444', border: 'none', background: 'rgba(239,68,68,0.2)' }} onClick={() => setCmtFotoSerahTerima('')}>Hapus</button>
                        </div>
                      ) : ("""

assert search_c2 in content, "Error: search_c2 not found"
content = content.replace(search_c2, replace_c2)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Photo previews successfully restored!")
