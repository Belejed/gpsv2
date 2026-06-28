
    const { useState, useMemo, useEffect, createContext, useContext } = React;

    const LOCS = ['NAGRAK', 'CILEGON', 'PANDAAN', 'OSOWILANGUN', 'MEDAN', 'CAKUNGFUELLER'];
    const POOLS = ['TRAILER', 'WINGBOX', 'SMALLTRUCK', 'MOTORCARRIER'];
    const LOKASI_OPTS = LOCS.map(l => 'POOL ' + l);
    const TEKNISI_OPTS = ['SMA TEAM', 'PUNINAR TEAM'];
    const DEV_OPTS = ['TERPASANG', 'TIDAK TERPASANG'];
    const SYS_OPTS = ['OK', 'NOT OK'];
    const SUSPEND_OPTS = ['BELUM SUSPEND', 'PROSES SUSPEND', 'SUDAH SUSPEND'];
    const PASANG_OPTS = ['ON PROGRESS', 'DONE', 'RESCHEDULE'];
    const EASYGO_OPTS = ['BELUM', 'SUDAH'];
    const GPS_MODEL_OPTS = ['GEOTAB', 'SMA-TRACK'];

    // Google Apps Script URL
    const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbz6dpQovaZLLUSVi5FPsELRFK8PSxDExhrzGaIimSebqpzJceVQ4cr5p8KSPHD9_B9g/exec';

    // ----------------------------------------------------
    // TOAST NOTIFICATION HELPERS
    // ----------------------------------------------------
    let globalAddToast = () => {};

    // Helper functions
    function mapFromSheet(json) {
      if (!json || !Array.isArray(json.data)) return [];
      return json.data.map((u, i) => ({
        id: i + 1,
        rowIndex: u.rowIndex,
        ownership: u['OWNERSHIP'] || '',
        nopol: u['NOPOL'] || '',
        year: u['YEAR'] || '',
        merk: u['MERK'] || '',
        assetType: u['ASSET TYPE'] || '',
        location: u['BUSINESS LOCATION'] || '',
        pool: u['BUSINESS POOL'] || '',
        dedicate: u['BUSINESS DEDICATE'] || '',
        planDate: u['PLAN PASANG'] || '',
        lokasiPasang: u['LOKASI_PASANG'] || '',
        picLapangan: u['PIC LAPANGAN'] || '',
        teknisiPelaksana: u['TEKNISI PELAKSANA'] || '',
        modelGpsBaru: u['TIPE GPS BARU'] || '',
        gpsSerialBaru: u['SN GPS BARU'] || '',
        gpsImeiBaru: u['IMEI GPS BARU'] || '',
        nomorSIM: u['NOMOR KARTU GPS BARU'] || '',
        provider: u['PROVIDER SIM GPS BARU'] || '',
        gps: u['GPS'] || '',
        buzzer: u['BUZZER'] || '',
        sos: u['SOS'] || '',
        sensorWing: u['SENSOR WING'] || '',
        camera: u['CAMERA'] || '',
        fotoKendaraan: u['FOTO KENDARAAN (NOPOL)'] || '',
        fotoGPSLama: u['FOTO SERIAL GPS LAMA (DICABUT)'] || '',
        fotoGPSBaru: u['FOTO GPS BARU (SN TERLIHAT)'] || '',
        fotoHasilInstalasi: u['FOTO HASIL INSTALASI'] || '',
        statusPasang: u['STATUS REGISTRASI'] || 'BELUM DIPASANG',
        picCekFisikLama: u['CEK FISIK GPS LAMA'] || '',
        picCekFisikBaru: u['CEK FISIK GPS BARU'] || '',
        picCekKondisiSelesai: u['CEK KONDISI UNIT SELESAI INSTALASI'] || '',
        picCekFitur: u['CEK FITUR (SENSOR, SOS, CAMERA)'] || '',
        picFotoSerahTerima: u['FOTO BUKTI PENYERAHAN GPS LAMA'] || '',
        itCekAplikasi: u['CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK) - IT'] || '',
        itFotoIntegrasi: u['FOTO INTEGRASI DATA GPS KE PUNINAR'] || '',
        itFotoAbnormality: u['FOTO INTEGRASI DATA ABNORMALITY KE PUNINAR'] || '',
        cmtCekAplikasi: u['CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK) - CMT'] || '',
        cmtFotoTerimaFisik: u['FOTO TERIMA FISIK GPS LAMA'] || '',
        cmtFotoTerminasi: u['FOTO BUKTI TERMINASI GPS LAMA'] || '',
        updatedAt: u['LAST_UPDATE'] || '',
        easygoDicopot: u['STATUS_EASYGO_DICOPOT'] || '',
        statusPlan: u['PLAN PASANG'] ? 'PLAN' : 'UNPLAN'
      }));
    }

    // Date converter helpers
    function toISODate(dateVal) {
      if (!dateVal) return '';
      const strVal = String(dateVal).trim();
      if (strVal.includes('T')) {
        return strVal.split('T')[0];
      }
      if (strVal.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return strVal;
      }
      const p = strVal.split(/[-/]/);
      if (p.length === 3) {
        if (p[0].length === 4) return `${p[0]}-${String(p[1]).padStart(2, '0')}-${String(p[2]).padStart(2, '0')}`;
        return `${p[2]}-${String(p[1]).padStart(2, '0')}-${String(p[0]).padStart(2, '0')}`;
      }
      return '';
    }
    function fromISODate(yyyymmdd) {
      if (!yyyymmdd) return '';
      const strVal = String(yyyymmdd).trim();
      const p = strVal.split('-');
      if (p.length !== 3) return '';
      if (p[0].length === 2 && p[2].length === 4) return strVal;
      return `${p[2]}-${p[1]}-${p[0]}`;
    }

    const exportToCSV = (dataList, filename) => {
      const headers = [
        'NO', 'OWNERSHIP', 'NOPOL', 'YEAR', 'MERK', 'ASSET TYPE', 'BUSINESS LOCATION', 'BUSINESS POOL', 'BUSINESS DEDICATE',
        'PLAN PASANG', 'LOKASI PASANG', 'PIC LAPANGAN', 'TEKNISI PELAKSANA', 'TIPE GPS BARU', 'SN GPS BARU', 'IMEI GPS BARU',
        'NOMOR KARTU GPS BARU', 'PROVIDER SIM GPS BARU', 'GPS', 'BUZZER', 'SOS', 'SENSOR WING', 'CAMERA',
        'FOTO KENDARAAN (NOPOL)', 'FOTO SERIAL GPS LAMA (DICABUT)', 'FOTO GPS BARU (SN TERLIHAT)', 'FOTO HASIL INSTALASI', 'STATUS REGISTRASI',
        'CEK FISIK GPS LAMA', 'CEK FISIK GPS BARU', 'CEK KONDISI UNIT SELESAI INSTALASI', 'CEK FITUR (SENSOR, SOS, CAMERA)', 'FOTO BUKTI PENYERAHAN GPS LAMA',
        'CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK) - IT', 'FOTO INTEGRASI DATA GPS KE PUNINAR', 'FOTO INTEGRASI DATA ABNORMALITY KE PUNINAR',
        'CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK) - CMT', 'FOTO TERIMA FISIK GPS LAMA', 'FOTO BUKTI TERMINASI GPS LAMA', 'LAST_UPDATE'
      ];
      
      const escapeCSV = (val) => {
        if (val === null || val === undefined) return '';
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const rows = dataList.map((u, i) => [
        i + 1, u.ownership, u.nopol, u.year, u.merk, u.assetType, u.location, u.pool, u.dedicate,
        u.planDate, u.lokasiPasang, u.picLapangan, u.teknisiPelaksana, u.modelGpsBaru, u.gpsSerialBaru, u.gpsImeiBaru,
        u.nomorSIM, u.provider, u.gps, u.buzzer, u.sos, u.sensorWing, u.camera,
        u.fotoKendaraan, u.fotoGPSLama, u.fotoGPSBaru, u.fotoHasilInstalasi, u.statusPasang,
        u.picCekFisikLama, u.picCekFisikBaru, u.picCekKondisiSelesai, u.picCekFitur, u.picFotoSerahTerima,
        u.itCekAplikasi, u.itFotoIntegrasi, u.itFotoAbnormality,
        u.cmtCekAplikasi, u.cmtFotoTerimaFisik, u.cmtFotoTerminasi, u.updatedAt
      ].map(escapeCSV));

      const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const PAGE_LIMIT = 15;

    // ----------------------------------------------------
    // AUTHENTICATION CONTEXT & PROVIDER
    // ----------------------------------------------------
    const AuthContext = createContext(null);

    const DEFAULT_USERS = [
      { id: 1, username: 'admin', password: 'adminpassword', name: 'System Admin', role: 'admin' },
      { id: 2, username: 'planner1', password: 'plannerpassword', name: 'Budi (Planner)', role: 'planner' },
      { id: 3, username: 'teknisi1', password: 'teknisipassword', name: 'Agus (Teknisi)', role: 'teknisi' },
      { id: 4, username: 'pic1', password: 'picpassword', name: 'Doni (PIC Lapangan)', role: 'pic' },
      { id: 5, username: 'it1', password: 'itpassword', name: 'Heri (IT Puninar)', role: 'it' },
      { id: 6, username: 'cmt1', password: 'cmtpassword', name: 'Eko (CMT)', role: 'cmt' }
    ];

    function AuthProvider({ children }) {
      const [user, setUser] = useState(null);
      const [users, setUsers] = useState([]);

      useEffect(() => {
        // Load users database with safety validation
        const storedUsers = localStorage.getItem('puninar_gps_users');
        let parsedUsers = [];
        try {
          if (storedUsers) {
            parsedUsers = JSON.parse(storedUsers);
          }
        } catch (e) {}

        if (!Array.isArray(parsedUsers) || parsedUsers.length === 0 || !parsedUsers.some(u => u.username === 'admin') || !parsedUsers.some(u => u.role === 'pic')) {
          localStorage.setItem('puninar_gps_users', JSON.stringify(DEFAULT_USERS));
          setUsers(DEFAULT_USERS);
        } else {
          setUsers(parsedUsers);
        }

        // Load active session
        try {
          const storedSession = sessionStorage.getItem('gps_user_session');
          if (storedSession) {
            setUser(JSON.parse(storedSession));
          }
        } catch (e) {}
      }, []);

      const login = (username, password) => {
        const foundUser = users.find(u => u.username === username && u.password === password);
        if (foundUser) {
          setUser(foundUser);
          sessionStorage.setItem('gps_user_session', JSON.stringify(foundUser));
          return { success: true };
        }
        return { success: false, message: 'Username atau password salah!' };
      };

      const logout = () => {
        setUser(null);
        sessionStorage.removeItem('gps_user_session');
      };

      const updateUsersList = (newUsersList) => {
        setUsers(newUsersList);
        localStorage.setItem('puninar_gps_users', JSON.stringify(newUsersList));
      };

      return (
        <AuthContext.Provider value={{ user, users, login, logout, updateUsers: updateUsersList }}>
          {children}
        </AuthContext.Provider>
      );
    }

    // ----------------------------------------------------
    // SHARED REUSABLE COMPONENTS
    // ----------------------------------------------------
    function ToastContainer() {
      const [toasts, setToasts] = useState([]);

      useEffect(() => {
        globalAddToast = (text, type = 'info') => {
          const id = Date.now();
          setToasts(prev => [...prev, { id, text, type }]);
          setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
          }, 3500);
        };
      }, []);

      return (
                                         
          {toasts.map(t => (
            <div key={t.id} className={`toast ${t.type}`}>
              <i className={`ti ${t.type === 'success' ? 'ti-circle-check' : t.type === 'error' ? 'ti-alert-circle' : 'ti-info-circle'}`} style={{fontSize: 18}}>    
              <div style={{fontSize: 12, fontWeight: 500}}>{t.text}      
                                                                                                                 
                                           
                       
                  
          ))}
              
      );
    }

    function Badge({ val }) {
      const trimmed = val ? String(val).trim() : '';
      if (!trimmed) return <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>—       ;
      let cl = 'unplan';
      const cleanVal = trimmed.toUpperCase();
      if (cleanVal === 'PLAN' || cleanVal === 'BELUM DIPASANG') cl = 'plan';
      else if (cleanVal === 'DONE' || cleanVal === 'TERPASANG' || cleanVal === 'OK' || cleanVal === 'SUDAH' || cleanVal === 'SUDAH SUSPEND') cl = 'done';
      else if (cleanVal === 'ON PROGRESS' || cleanVal === 'IT VERIFIED' || cleanVal === 'PROSES SUSPEND') cl = 'progress';
      else if (cleanVal === 'DELAY' || cleanVal === 'CANCEL' || cleanVal === 'TIDAK TERPASANG' || cleanVal === 'NOT OK' || cleanVal === 'TEKNISI SUBMITTED') cl = 'delay';
      else if (cleanVal === 'RESCHEDULE' || cleanVal === 'PERLU REVISIT' || cleanVal === 'PIC VERIFIED') cl = 'reschedule';

      return <span className={`badge ${cl}`}>{trimmed}       ;
    }

    function FilterRow({ children }) {
      return                             {children}      ;
    }

    function Pager({ page, total, onChange }) {
      return (
                                         
                                      Halaman         {page}          dari         {total || 1}               
                                          
                                                                                                                 
                                                    
                     
                                                                                                                     
                                                     
                     
                
              
      );
    }

    // SVG Micro Charts
    function BarChart({ data, keys }) {
      const max = Math.max(1, ...data.flatMap(d => keys.map(k => d[k.key] || 0)));
      return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 160, padding: '10px 4px 4px 4px' }}>
          {data.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: '100%', width: '100%', justifyContent: 'center' }}>
                {keys.map(k => {
                  const val = d[k.key] || 0;
                  const pct = (val / max) * 100;
                  return (
                    <div key={k.key} title={`${k.label}: ${val}`} style={{
                      width: '45%',
                      height: `${Math.max(4, pct)}%`,
                      background: k.color,
                      borderRadius: '3px 3px 0 0',
                      transition: 'height 0.3s ease'
                    }} />
                  );
                })}
                    
              <span style={{ fontSize: 9, color: 'var(--text-secondary)', textAlign: 'center', fontWeight: 600, width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {d.label}
                     
                  
          ))}
              
      );
    }

    function DonutChart({ data, size = 120 }) {
      const total = data.reduce((s, d) => s + d.value, 0) || 1;
      let acc = 0;
      const r = size / 2 - 8;
      const c = size / 2;
      
      const segments = data.map(d => {
        const start = (acc / total) * 2 * Math.PI - Math.PI / 2;
        acc += d.value;
        const end = (acc / total) * 2 * Math.PI - Math.PI / 2;
        const x1 = c + r * Math.cos(start), y1 = c + r * Math.sin(start);
        const x2 = c + r * Math.cos(end), y2 = c + r * Math.sin(end);
        const large = (end - start) > Math.PI ? 1 : 0;
        return {
          path: `M${c},${c} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`,
          color: d.color
        };
      });

      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {segments.map((s, i) =>                                           )}
                                                                     
              
      );
    }

    // ----------------------------------------------------
    // AUTHENTICATED VIEWS
    // ----------------------------------------------------

    // 1. Dashboard View
    function DashboardView({ units, isMobile }) {
      const stats = useMemo(() => {
        const total = units.length;
        const unplanned = units.filter(u => !u.planDate).length;
        const planned = units.filter(u => u.planDate && u.statusPasang === 'BELUM DIPASANG').length;
        const progress = units.filter(u => u.statusPasang === 'ON PROGRESS').length;
        const teknisiSubmitted = units.filter(u => u.statusPasang === 'TEKNISI SUBMITTED').length;
        const picVerified = units.filter(u => u.statusPasang === 'PIC VERIFIED').length;
        const itVerified = units.filter(u => u.statusPasang === 'IT VERIFIED').length;
        const done = units.filter(u => u.statusPasang === 'DONE').length;
        const pendingVerif = teknisiSubmitted + picVerified + itVerified;
        
        return { total, unplanned, planned, progress, teknisiSubmitted, picVerified, itVerified, done, pendingVerif };
      }, [units]);

      const pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

      const locData = useMemo(() => {
        return LOCS.map(loc => ({
          label: loc.length > 8 ? loc.slice(0, 8) + '…' : loc,
          Total: units.filter(u => u.location === loc).length,
          Done: units.filter(u => u.location === loc && u.statusPasang === 'DONE').length,
        }));
      }, [units]);

      const pieData = useMemo(() => {
        return [
          { name: 'Complete (Done)', value: stats.done, color: 'var(--color-done)' },
          { name: 'On Progress', value: stats.progress, color: 'var(--color-progress)' },
          { name: 'Pending Verif', value: stats.pendingVerif, color: 'var(--color-delay)' },
          { name: 'Planned', value: stats.planned, color: 'var(--color-plan)' },
          { name: 'Unplanned', value: stats.unplanned, color: 'var(--color-unplan)' },
        ].filter(d => d.value > 0);
      }, [stats]);

      const recent = useMemo(() => {
        return units.filter(u => u.updatedAt).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
      }, [units]);

      return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                     
                                       
                                           Total Unit       
                                           {stats.total}       
                                         GPS Migration       
              <div className="stat-indicator" style={{background: 'var(--accent)'}} />
                  
                                       
                                           Terjadwal (Plan)       
              <span className="stat-value" style={{color: 'var(--color-plan)'}}>{stats.total - stats.unplanned}       
                                         {stats.total ? Math.round((stats.total - stats.unplanned)/stats.total*100) : 0}% ter-plan       
              <div className="stat-indicator" style={{background: 'var(--color-plan)'}} />
                  
                                       
                                           Belum Plan       
              <span className="stat-value" style={{color: 'var(--color-unplan)'}}>{stats.unplanned}       
                                         Menunggu jadwal       
              <div className="stat-indicator" style={{background: 'var(--color-unplan)'}} />
                  
                                       
                                           Selesai (Done)       
              <span className="stat-value" style={{color: 'var(--color-done)'}}>{stats.done}       
                                         {pct}% Migrasi Selesai       
              <div className="stat-indicator" style={{background: 'var(--color-done)'}} />
                  
                                       
                                           Pending Verifikasi       
              <span className="stat-value" style={{color: 'var(--color-delay)'}}>{stats.pendingVerif}       
                                         PIC, IT, dan CMT       
              <div className="stat-indicator" style={{background: 'var(--color-delay)'}} />
                  
                

          {/* Visual Pipeline Progress */}
          <div className="progress-panel" style={{ padding: '16px 20px' }}>
            <div style={{fontWeight: 700, fontSize: 13, marginBottom: 12, color: '#FFF'}}>Pipeline Status Pemasangan GPS      
            <div style={{
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              gap: 8,
              flexWrap: 'wrap',
              marginTop: 10
            }}>
              {[
                { label: 'Unplanned', val: stats.unplanned, color: 'var(--color-unplan)' },
                { label: 'Planned', val: stats.planned, color: 'var(--color-plan)' },
                { label: 'Installing', val: stats.progress, color: 'var(--color-progress)' },
                { label: 'Pending PIC', val: stats.teknisiSubmitted, color: 'var(--color-delay)' },
                { label: 'Pending IT', val: stats.picVerified, color: '#8b5cf6' },
                { label: 'Pending CMT', val: stats.itVerified, color: '#ec4899' },
                { label: 'Complete', val: stats.done, color: 'var(--color-done)' }
              ].map((step, idx) => (
                <div key={idx} style={{
                  flex: 1, 
                  minWidth: 90, 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '10px 6px', 
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  <div style={{fontSize: 18, fontWeight: 800, color: step.color}}>{step.val}      
                  <div style={{fontSize: 9, color: 'var(--text-secondary)', fontWeight: 600, marginTop: 4}}>{step.label}      
                  {idx < 6 && !isMobile && (
                    <div style={{
                      position: 'absolute', 
                      right: -10, 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      zIndex: 10, 
                      color: 'var(--text-tertiary)',
                      fontSize: 12
                    }}>
                                                             
                          
                  )}
                      
              ))}
                  
                

                                          
                                             
                                               Progress Migrasi Kumulatif       
                                               {stats.done} / {stats.total} Unit ({pct}%)       
                  
                                                    
              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                  
                                              
                                           <span className="legend-dot" style={{background: 'var(--color-done)'}} /> Complete ({stats.done})      
                                           <span className="legend-dot" style={{background: 'var(--color-progress)'}} /> On Progress ({stats.progress})      
                                           <span className="legend-dot" style={{background: 'var(--color-delay)'}} /> Pending Verif ({stats.pendingVerif})      
                                           <span className="legend-dot" style={{background: 'var(--color-unplan)'}} /> Unplanned ({stats.unplanned})      
                  
                

                                                 
                                        
                                                                             Unit per Lokasi      
              <BarChart data={locData} keys={[{key: 'Total', label: 'Total', color: 'var(--accent-light)'}, {key: 'Done', label: 'Done', color: 'var(--color-done)'}]} />
              <div style={{display:'flex', gap:12, marginTop: 16, justifyContent: 'center'}}>
                <span style={{fontSize:10, color:'var(--text-secondary)', display:'flex', alignItems:'center', gap:4}}>
                  <span style={{width:10, height:10, borderRadius:2, background:'var(--accent-light)'}}/>Total Unit
                       
                <span style={{fontSize:10, color:'var(--text-secondary)', display:'flex', alignItems:'center', gap:4}}>
                  <span style={{width:10, height:10, borderRadius:2, background:'var(--color-done)'}}/>Selesai Migrasi
                       
                    
                  

            <div className="panel-card" style={{ display: 'flex', flexDirection: 'column' }}>
                                                                               Distribusi Status      
              <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-around', padding: '10px 0' }}>
                                             
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {pieData.map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-secondary)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                      <strong style={{color: 'var(--text-primary)'}}>{d.value}          {d.name}
                          
                  ))}
                      
                    
                  
                

                                      
                                                                           Aktivitas Pemasangan Terakhir      
            {isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recent.map(u => (
                  <div key={u.id} className="mobile-unit-card" style={{ padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              {u.nopol}         
                                                    
                          
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>
                           Lokasi:         {u.location}               
                           Pool:         {u.pool}               
                           GPS Baru:         {u.modelGpsBaru || '—'}               
                           Update: <span className="text-muted" style={{ fontSize: 10 }}>{u.updatedAt || '—'}             
                          
                        
                ))}
                {recent.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-tertiary)' }}>Belum ada riwayat update data      
                )}
                    
            ) : (
              <div className="table-container" style={{boxShadow: 'none', border: 'none', margin: 0}}>
                                              
                         
                        
                          NOPOL     
                          LOKASI     
                          POOL     
                          MODEL GPS BARU     
                          STATUS PASANG     
                          LAST UPDATE     
                         
                          
                         
                    {recent.map(u => (
                                     
                                    {u.nopol}              
                            {u.location}     
                            {u.pool}     
                            {u.modelGpsBaru || '—'}     
                                                               
                        <td className="text-muted" style={{fontSize: 11}}>{u.updatedAt || '—'}     
                           
                    ))}
                    {recent.length === 0 && (
                          
                        <td colSpan="6" style={{ textAlign: 'center', padding: 20, color: 'var(--text-tertiary)' }}>Belum ada riwayat update data     
                           
                    )}
                          
                        
                    
            )}
                
              
      );
    }

    // 2. Planner View
    function PlannerView({ units, setUnits, syncUpdate, isMobile }) {
      const { users } = useContext(AuthContext);
      const [subTab, setSubTab] = useState('list'); // 'list' atau 'monitoring'
      const [q, setQ] = useState('');
      const [loc, setLoc] = useState('');
      const [poolF, setPoolF] = useState('');
      const [st, setSt] = useState('');
      const [page, setPage] = useState(1);
      const [merkF, setMerkF] = useState('');
      const [modelF, setModelF] = useState('');
      
      const [selectedUnit, setSelectedUnit] = useState(null);
      const [editData, setEditData] = useState({});

      const technicians = useMemo(() => {
        return (users || []).filter(u => u.role === 'teknisi');
      }, [users]);

      const pics = useMemo(() => {
        return (users || []).filter(u => u.role === 'pic');
      }, [users]);

      const workflowStages = [
        { name: 'UNPLAN', label: 'Unplan' },
        { name: 'PLAN', label: 'Plan' },
        { name: 'INSTALLATION', label: 'Installing' },
        { name: 'TEKNISI_SUBMITTED', label: 'Teknisi' },
        { name: 'PIC_VERIFIED', label: 'PIC' },
        { name: 'IT_VERIFIED', label: 'IT' },
        { name: 'COMPLETED', label: 'Done' }
      ];

      const getUnitCurrentStage = (u) => {
        if (u.statusPlan === 'UNPLAN') return 'UNPLAN';
        if (u.statusPasang === 'ON PROGRESS') return 'INSTALLATION';
        if (u.statusPasang === 'TEKNISI SUBMITTED') return 'TEKNISI_SUBMITTED';
        if (u.statusPasang === 'PIC VERIFIED') return 'PIC_VERIFIED';
        if (u.statusPasang === 'IT VERIFIED') return 'IT_VERIFIED';
        if (u.statusPasang === 'DONE') return 'COMPLETED';
        return 'PLAN';
      };

      const getStageStatus = (currentStage, stageName) => {
        const order = ['UNPLAN', 'PLAN', 'INSTALLATION', 'TEKNISI_SUBMITTED', 'PIC_VERIFIED', 'IT_VERIFIED', 'COMPLETED'];
        const currentIndex = order.indexOf(currentStage);
        const stageIndex = order.indexOf(stageName);
        if (currentIndex === stageIndex) return 'active';
        if (stageIndex < currentIndex) return 'past';
        return 'future';
      };

      const renderStageCell = (currentStage, stageName) => {
        const status = getStageStatus(currentStage, stageName);
        
        if (status === 'active') {
          let colorClass = 'progress-dot active';
          if (currentStage === 'INSTALLATION' || currentStage === 'TEKNISI_SUBMITTED') {
            colorClass = 'progress-dot warning animate-pulse';
          } else if (currentStage === 'COMPLETED') {
            colorClass = 'progress-dot success';
          } else {
            colorClass = 'progress-dot primary animate-pulse';
          }
          return (
            <span className={colorClass} title={`Sedang di tahap: ${stageName}`} />
          );
        }
        if (status === 'past') {
          return (
            <span className="progress-dot past" title={`Selesai: ${stageName}`} />
          );
        }
        return (
          <span className="progress-dot future" title={`Antrean: ${stageName}`} />
        );
      };

      const getLastActivityNote = (u) => {
        const stage = getUnitCurrentStage(u);
        switch (stage) {
          case 'UNPLAN':
            return { activity: 'Belum Plan', notes: 'Menunggu pembuatan jadwal pemasangan.' };
          case 'PLAN':
            return { activity: 'Jadwal Dibuat', notes: `Rencana pasang: ${u.planDate} di ${u.lokasiPasang || '—'}.` };
          case 'INSTALLATION':
            return { activity: 'Instalasi Lapangan', notes: `Sedang dipasang oleh ${u.teknisiPelaksana || 'Teknisi'}.` };
          case 'TEKNISI_SUBMITTED':
            return { activity: 'Verifikasi PIC', notes: `Instalasi selesai. Menunggu verifikasi PIC Lapangan (${u.picLapangan || '—'}).` };
          case 'PIC_VERIFIED':
            return { activity: 'Verifikasi IT', notes: 'Fisik OK. Menunggu verifikasi integrasi IT Puninar.' };
          case 'IT_VERIFIED':
            return { activity: 'Verifikasi CMT', notes: 'Integrasi data OK. Menunggu verifikasi final CMT (Terminasi).' };
          case 'COMPLETED':
            return { activity: 'Migrasi Selesai', notes: 'Unit aktif penuh dan vendor lama sudah diterminasi.' };
          default:
            return { activity: 'Update Data', notes: u.updatedAt ? `Pembaruan terakhir pada ${u.updatedAt}` : 'Data terdaftar.' };
        }
      };

      const [showAddModal, setShowAddModal] = useState(false);
      const [newUnitData, setNewUnitData] = useState({
        nopol: '', merk: '', model: '', location: LOCS[0], pool: POOLS[0], dedicate: 'LOGISTICS', noGpsLama: ''
      });

      const [isCustomMerk, setIsCustomMerk] = useState(false);
      const [isCustomModel, setIsCustomModel] = useState(false);
      const [isCustomDedicate, setIsCustomDedicate] = useState(false);

      // Auto-reset custom toggles when modal is closed
      useEffect(() => {
        if (!showAddModal) {
          setIsCustomMerk(false);
          setIsCustomModel(false);
          setIsCustomDedicate(false);
        }
      }, [showAddModal]);

      // CSV Import States
      const [showImportModal, setShowImportModal] = useState(false);
      const [importPreviewData, setImportPreviewData] = useState([]);
      const [importError, setImportError] = useState('');
      const [isImporting, setIsImporting] = useState(false);
      const [importProgress, setImportProgress] = useState(0);
      const [dragActive, setDragActive] = useState(false);

      // Memos to get unique values for autocomplete dropdowns (datalists)
      const uniqueMerks = useMemo(() => {
        return [...new Set(units.map(u => u.merk).filter(Boolean))].sort();
      }, [units]);

      const uniqueModels = useMemo(() => {
        return [...new Set(units.map(u => u.model).filter(Boolean))].sort();
      }, [units]);

      const uniqueDedicates = useMemo(() => {
        return [...new Set(units.map(u => u.dedicate).filter(Boolean))].sort();
      }, [units]);

      // 1. Download CSV Template Helper
      const downloadCSVTemplate = () => {
        const headers = ['NOPOL', 'MERK', 'MODEL', 'LOCATION', 'POOL', 'DEDICATE', 'NO_GPS_LAMA'];
        const sampleRows = [
          ['B 1234 ABC', 'MITSUBISHI', 'FUSO', LOCS[0] || 'JAKARTA', POOLS[0] || 'POOL A', 'LOGISTICS', '987654321'],
          ['B 5678 DEF', 'TOYOTA', 'DYNA', LOCS[0] || 'JAKARTA', POOLS[0] || 'POOL A', 'LOGISTICS', '']
        ];
        
        const csvContent = "\uFEFF" + [
          headers.join(','),
          ...sampleRows.map(r => r.map(val => {
            const str = String(val);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          }).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "template_import_kendaraan.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      // 2. Vanilla CSV Parser (handles escaped double quotes, commas inside quotes, and newlines)
      // 2. Vanilla CSV Parser (handles custom delimiter, escaped double quotes, commas inside quotes, and newlines)
      const parseCSVContent = (text, delimiter = ',') => {
        const lines = [];
        let row = [""];
        let inQuotes = false;
        
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const nextChar = text[i+1];
          
          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              row[row.length - 1] += '"';
              i++; // skip next quote
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === delimiter && !inQuotes) {
            row.push('');
          } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') {
              i++; // skip \n
            }
            lines.push(row);
            row = [''];
          } else {
            row[row.length - 1] += char;
          }
        }
        if (row.length > 1 || row[0] !== '') {
          lines.push(row);
        }
        return lines;
      };

      // 3. Handle CSV Upload and parse/validate rows locally
      const handleCSVUpload = (e) => {
        setImportError('');
        const file = e.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            let text = evt.target.result;
            
            // 1. Bersihkan UTF-8 BOM jika ada di awal file
            if (text.charCodeAt(0) === 0xFEFF || text.startsWith('\uFEFF')) {
              text = text.substring(1);
            }
            
            // 2. Deteksi Delimiter (koma ',' vs titik-koma ';') secara dinamis berdasarkan baris pertama
            const firstLine = text.split(/\r?\n/)[0] || '';
            const commaCount = (firstLine.match(/,/g) || []).length;
            const semicolonCount = (firstLine.match(/;/g) || []).length;
            const delimiter = semicolonCount > commaCount ? ';' : ',';
            
            const rawRows = parseCSVContent(text, delimiter);
            if (rawRows.length < 2) {
              setImportError('File CSV kosong atau tidak memiliki baris data.');
              return;
            }
            
            // 3. Bersihkan nama header dari tanda kutip, BOM, spasi, atau karakter tak terlihat
            const fileHeaders = rawRows[0].map(h => 
              h.trim().replace(/^["']|["']$/g, '').replace(/[\uFEFF\u200B]/g, '').toUpperCase()
            );
            
            const idxNopol = fileHeaders.findIndex(h => h === 'NOPOL');
            const idxMerk = fileHeaders.findIndex(h => h === 'MERK' || h === 'MERK KENDARAAN');
            const idxModel = fileHeaders.findIndex(h => h === 'MODEL' || h === 'MODEL KENDARAAN');
            const idxLocation = fileHeaders.findIndex(h => h === 'LOCATION' || h === 'LOKASI' || h === 'SITE LOKASI' || h === 'SITE');
            const idxPool = fileHeaders.findIndex(h => h === 'POOL');
            const idxDedicate = fileHeaders.findIndex(h => h === 'DEDICATE');
            const idxNoGpsLama = fileHeaders.findIndex(h => h === 'NO_GPS_LAMA' || h === 'NO GPS LAMA' || h === 'GPS LAMA');
            
            if (idxNopol === -1) {
              setImportError(`Kolom "NOPOL" tidak ditemukan di baris pertama CSV. Header terdeteksi: [${fileHeaders.join(', ')}]. Gunakan pemisah koma (,) atau titik koma (;).`);
              return;
            }
            
            const previewData = [];
            for (let i = 1; i < rawRows.length; i++) {
              const row = rawRows[i];
              if (row.length === 1 && row[0] === '') continue;
              
              // Bersihkan tanda kutip pembungkus cell jika ada
              const cleanCell = (val) => {
                if (!val) return '';
                return val.trim().replace(/^["']|["']$/g, '');
              };
              
              const nopolRaw = idxNopol > -1 ? row[idxNopol] : '';
              const nopol = cleanCell(nopolRaw).toUpperCase();
              const merk = idxMerk > -1 && row[idxMerk] ? cleanCell(row[idxMerk]).toUpperCase() : '';
              const model = idxModel > -1 && row[idxModel] ? cleanCell(row[idxModel]).toUpperCase() : '';
              const location = idxLocation > -1 && row[idxLocation] ? cleanCell(row[idxLocation]).toUpperCase() : LOCS[0];
              const pool = idxPool > -1 && row[idxPool] ? cleanCell(row[idxPool]).toUpperCase() : POOLS[0];
              const dedicate = idxDedicate > -1 && row[idxDedicate] ? cleanCell(row[idxDedicate]).toUpperCase() : 'LOGISTICS';
              const noGpsLama = idxNoGpsLama > -1 && row[idxNoGpsLama] ? cleanCell(row[idxNoGpsLama]) : '';
              
              let status = 'BARU';
              let statusText = 'Unit baru akan didaftarkan';
              
              if (!nopol) {
                status = 'INVALID';
                statusText = 'NOPOL kosong/tidak valid';
              } else {
                const isDuplicate = units.some(u => u.nopol.toUpperCase() === nopol);
                if (isDuplicate) {
                  status = 'UPDATE';
                  statusText = 'Unit sudah ada, info kendaraan akan diperbarui';
                }
              }
              
              previewData.push({
                nopol,
                merk,
                model,
                location,
                pool,
                dedicate,
                noGpsLama,
                status,
                statusText
              });
            }
            
            if (previewData.length === 0) {
              setImportError('Tidak ada baris data yang valid untuk diimpor.');
            } else {
              setImportPreviewData(previewData);
            }
          } catch (err) {
            setImportError('Gagal membaca atau memproses file CSV: ' + err.message);
          }
        };
        
        reader.onloadend = () => {
          if (e.target) e.target.value = '';
        };
        
        reader.readAsText(file);
      };

      // 4. Send updates payload to Google Sheets & sync local state
      const executeImport = async () => {
        const validItems = importPreviewData.filter(item => item.status === 'BARU' || item.status === 'UPDATE');
        if (validItems.length === 0) {
          globalAddToast('Tidak ada data valid untuk diimpor!', 'error');
          return;
        }
        
        setIsImporting(true);
        setImportProgress(0);
        
        try {
          // Kirim sinkronisasi data secara berurutan untuk menjamin kompatibilitas penuh dengan versi Google Apps Script mana pun
          // (baik versi lama yang hanya menerima data tunggal, maupun versi baru).
          // Cara ini memastikan data langsung masuk ke spreadsheet tanpa memaksa user melakukan re-deployment script web app.
          for (let i = 0; i < validItems.length; i++) {
            const item = validItems[i];
            await syncUpdate(item.nopol, {
              MERK: item.merk,
              MODEL: item.model,
              LOCATION: item.location,
              POOL: item.pool,
              DEDICATE: item.dedicate,
              NO_GPS_LAMA: item.noGpsLama,
              STATUS_PASANG: item.status === 'BARU' ? 'BELUM DIPASANG' : undefined,
              STATUS_EASYGO_DICOPOT: item.status === 'BARU' ? 'BELUM' : undefined
            });
            setImportProgress(i + 1);
          }
          
          setUnits(prev => {
            let updatedList = [...prev];
            validItems.forEach(item => {
              const existingIdx = updatedList.findIndex(u => u.nopol === item.nopol);
              if (existingIdx > -1) {
                updatedList[existingIdx] = {
                  ...updatedList[existingIdx],
                  merk: item.merk,
                  model: item.model,
                  location: item.location,
                  pool: item.pool,
                  dedicate: item.dedicate,
                  noGpsLama: item.noGpsLama
                };
              } else {
                updatedList.unshift({
                  id: Date.now() + Math.random(),
                  rowIndex: updatedList.length + 2,
                  nopol: item.nopol,
                  merk: item.merk,
                  model: item.model,
                  location: item.location,
                  pool: item.pool,
                  dedicate: item.dedicate,
                  easygoDicopot: 'BELUM',
                  planDate: '',
                  lokasiPasang: '',
                  teknisi: '',
                  teknisiPelaksana: '',
                  statusPlan: 'UNPLAN',
                  statusPasang: 'BELUM DIPASANG',
                  modelGpsBaru: '',
                  gps: '',
                  buzzer: '',
                  sos: '',
                  sensorWing: '',
                  statusSystem: '',
                  statusSuspend: '',
                  noGpsLama: item.noGpsLama,
                  updatedAt: ''
                });
              }
            });
            return updatedList;
          });
          
          const countBaru = validItems.filter(i => i.status === 'BARU').length;
          const countUpdate = validItems.filter(i => i.status === 'UPDATE').length;
          
          globalAddToast(`Impor sukses! Berhasil memproses ${validItems.length} unit (${countBaru} baru, ${countUpdate} diperbarui).`, 'success');
          setShowImportModal(false);
          setImportPreviewData([]);
          setImportError('');
        } catch (err) {
          globalAddToast('Gagal melakukan sinkronisasi impor ke Sheets: ' + err.message, 'error');
        } finally {
          setIsImporting(false);
        }
      };

      const filtered = useMemo(() => {
        return units.filter(u => 
          (!q || u.nopol.toLowerCase().includes(q.toLowerCase())) &&
          (!loc || u.location === loc) &&
          (!poolF || u.pool === poolF) &&
          (!st || u.statusPlan === st) &&
          (!merkF || u.merk === merkF) &&
          (!modelF || u.model === modelF)
        );
      }, [units, q, loc, poolF, st, merkF, modelF]);

      const total = Math.ceil(filtered.length / PAGE_LIMIT);
      const slice = filtered.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

      const save = (id, overrideData = null) => {
        const unit = units.find(u => u.id === id);
        const dataToSave = overrideData || editData;
        const newStatusPlan = dataToSave.planDate ? 'PLAN' : 'UNPLAN';
        let updatedFields = {};

        if (newStatusPlan === 'UNPLAN') {
          updatedFields = {
            planDate: '', lokasiPasang: '', teknisi: '', keteranganPlanner: '',
            picLapangan: '', teknisiPelaksana: '',
            statusPlan: 'UNPLAN', statusPasang: 'BELUM DIPASANG',
            easygoDicopot: 'BELUM', modelGpsBaru: '',
            gps: '', buzzer: '', sos: '', sensorWing: '', camera: '',
            statusSystem: '', statusSuspend: '', noGpsLama: unit.noGpsLama || '', updatedAt: ''
          };
          syncUpdate(unit.nopol, {
            "PLAN PASANG": '', "LOKASI PASANG": '', "PIC LAPANGAN": '', "TEKNISI PELAKSANA": '',
            "KETERANGAN_PLANNER": '', "STATUS REGISTRASI": 'BELUM DIPASANG',
            "STATUS_EASYGO_DICOPOT": 'BELUM', "TIPE GPS BARU": '',
            "GPS": '', "BUZZER": '', "SOS": '', "SENSOR WING": '', "CAMERA": '',
            "NO_GPS_LAMA": unit.noGpsLama || ''
          });
        } else {
          updatedFields = {
            planDate: dataToSave.planDate || '',
            lokasiPasang: dataToSave.lokasiPasang || '',
            picLapangan: dataToSave.picLapangan || '',
            teknisiPelaksana: dataToSave.teknisiPelaksana || '',
            keteranganPlanner: dataToSave.keteranganPlanner || '',
            statusPlan: newStatusPlan,
            statusPasang: 'BELUM DIPASANG'
          };
          syncUpdate(unit.nopol, {
            "PLAN PASANG": dataToSave.planDate || '',
            "LOKASI_PASANG": dataToSave.lokasiPasang || '',
            "PIC LAPANGAN": dataToSave.picLapangan || '',
            "TEKNISI PELAKSANA": dataToSave.teknisiPelaksana || '',
            "KETERANGAN_PLANNER": dataToSave.keteranganPlanner || '',
            "STATUS REGISTRASI": 'BELUM DIPASANG',
            "NO_GPS_LAMA": unit.noGpsLama || ''
          });
        }

        setUnits(prev => prev.map(u => u.id === id ? { ...u, ...updatedFields } : u));
        setSelectedUnit(null);
        globalAddToast(
          newStatusPlan === 'UNPLAN' 
            ? `Jadwal NOPOL ${unit.nopol} berhasil dihapus!` 
            : `Jadwal NOPOL ${unit.nopol} berhasil disimpan!`, 
          'success'
        );
      };

      const handleAddUnit = (e) => {
        e.preventDefault();
        const cleanNopol = newUnitData.nopol.trim().toUpperCase();
        if (!cleanNopol) {
          globalAddToast('NOPOL wajib diisi!', 'error');
          return;
        }

        const isDuplicate = units.some(u => u.nopol.toUpperCase() === cleanNopol);
        if (isDuplicate) {
          globalAddToast(`NOPOL ${cleanNopol} sudah terdaftar di database!`, 'error');
          return;
        }

        const newUnit = {
          id: Date.now(),
          rowIndex: units.length + 2,
          nopol: cleanNopol,
          merk: newUnitData.merk.trim().toUpperCase(),
          model: newUnitData.model.trim().toUpperCase(),
          location: newUnitData.location,
          pool: newUnitData.pool,
          dedicate: newUnitData.dedicate.trim().toUpperCase() || 'LOGISTICS',
          easygoDicopot: 'BELUM',
          planDate: '',
          lokasiPasang: '',
          teknisi: '',
          teknisiPelaksana: '',
          statusPlan: 'UNPLAN',
          statusPasang: 'BELUM DIPASANG',
          modelGpsBaru: '',
          gps: '',
          buzzer: '',
          sos: '',
          sensorWing: '',
          statusSystem: '',
          statusSuspend: '',
          noGpsLama: newUnitData.noGpsLama.trim(),
          updatedAt: ''
        };

        setUnits(prev => [newUnit, ...prev]);
        setShowAddModal(false);
        setNewUnitData({
          nopol: '', merk: '', model: '', location: LOCS[0], pool: POOLS[0], dedicate: 'LOGISTICS', noGpsLama: ''
        });

        // Push to Google Sheets (the updated doPost script will automatically append the row)
        syncUpdate(newUnit.nopol, {
          MERK: newUnit.merk,
          MODEL: newUnit.model,
          LOCATION: newUnit.location,
          POOL: newUnit.pool,
          DEDICATE: newUnit.dedicate,
          NO_GPS_LAMA: newUnit.noGpsLama,
          STATUS_PASANG: 'BELUM DIPASANG',
          STATUS_EASYGO_DICOPOT: 'BELUM',
          PLAN_TGL: '',
          LOKASI_PASANG: '',
          MODEL_GPS_BARU: '',
          GPS: '',
          BUZZER: '',
          SOS: '',
          SENSOR_WING: '',
          STATUS_SYSTEM: '',
          STATUS_SUSPEND: ''
        });

        globalAddToast(`Unit baru ${cleanNopol} berhasil ditambahkan!`, 'success');
      };

      return (
                                 
                                               
                                              
                          Role: Planner Logistics          — Atur tanggal rencana migrasi, site lokasi pemasangan, dan daftarkan unit baru.       
                

                                        
            <button className={`planner-tab-btn ${subTab === 'list' ? 'active' : ''}`} onClick={() => setSubTab('list')}>
                                                      
                    Daftar & Penjadwalan       
                     
            <button className={`planner-tab-btn ${subTab === 'monitoring' ? 'active' : ''}`} onClick={() => setSubTab('monitoring')}>
                                                
                    Progress Monitoring Matrix ({filtered.length})       
                     
                

                     
                                                  
                                              
              <input type="text" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} className="search-input" placeholder="Cari NOPOL..." />
                  
            <select value={loc} onChange={e => { setLoc(e.target.value); setPage(1); }} className="filter-select">
                               Semua Lokasi         
              {LOCS.map(l =>                           {l}         )}
                     
            <select value={poolF} onChange={e => { setPoolF(e.target.value); setPage(1); }} className="filter-select">
                               Semua Pool         
              {POOLS.map(p =>                           {p}         )}
                     
            <select value={merkF} onChange={e => { setMerkF(e.target.value); setPage(1); }} className="filter-select">
                               Semua Merk         
              {uniqueMerks.map(m =>                           {m}         )}
                     
            <select value={modelF} onChange={e => { setModelF(e.target.value); setPage(1); }} className="filter-select">
                               Semua Model         
              {uniqueModels.map(m =>                           {m}         )}
                     
            <select value={st} onChange={e => { setSt(e.target.value); setPage(1); }} className="filter-select">
                               Semua Status Plan         
                                   PLAN         
                                     UNPLAN         
                     
                                                                                                               
                                             Tambah Unit
                     
                                                                                                                         
                                               Impor CSV
                     
                                                                                                                                                
                                                 Ekspor CSV
                     
                                             {filtered.length} Unit ditemukan       
                      

          {subTab === 'list' ? (
            <>
              {isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
                  {slice.map((u, i) => (
                    <div key={u.id} className="mobile-unit-card" style={{ padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: 15 }}>{u.nopol}         
                                                    
                            
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>
                             Merk:         {u.merk || '—'}               
                             Model:         {u.model || '—'}               
                             Site:         {u.location}               
                             Pool:         {u.pool}               
                             Dedicate:         {u.dedicate || '—'}               
                             GPS Lama: <strong style={{ color: 'var(--color-delay)' }}>{u.noGpsLama || '—'}               
                        <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-color)', paddingTop: 6, marginTop: 4 }}>
                          Rencana Tanggal:         {u.planDate || 'Belum diplan'}         
                              
                        <div style={{ gridColumn: 'span 2' }}>
                          Pool Pasang:         {u.lokasiPasang || '—'}         
                              
                        <div style={{ gridColumn: 'span 2' }}>
                          Teknisi:         {u.teknisi || '—'}         
                              
                        {u.keteranganPlanner && (
                          <div style={{ gridColumn: 'span 2', color: 'var(--accent)', fontStyle: 'italic' }}>
                            Ket:         {u.keteranganPlanner}         
                                
                        )}
                            

                      <div style={{ marginTop: 12 }}>
                        {u.statusPlan === 'PLAN' ? (
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => { 
                              setSelectedUnit(u); 
                              setEditData({ planDate: u.planDate, lokasiPasang: u.lokasiPasang, noGpsLama: u.noGpsLama, picLapangan: u.picLapangan || '', teknisiPelaksana: u.teknisiPelaksana || '', keteranganPlanner: u.keteranganPlanner || '' }); 
                            }}
                            style={{ width: '100%', justifyContent: 'center', height: 36 }}
                          >
                                                          Lihat & Edit Jadwal
                                   
                        ) : (
                          <button 
                            className="btn btn-primary btn-sm" 
                            onClick={() => { 
                              setSelectedUnit(u); 
                              setEditData({ planDate: u.planDate, lokasiPasang: u.lokasiPasang, noGpsLama: u.noGpsLama, picLapangan: u.picLapangan || '', teknisiPelaksana: u.teknisiPelaksana || '', keteranganPlanner: u.keteranganPlanner || '' }); 
                            }}
                            style={{ width: '100%', justifyContent: 'center', height: 36 }}
                          >
                                                                    Buat Jadwal Baru
                                   
                        )}
                            
                          
                  ))}
                  {slice.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-tertiary)' }}>Tidak ada data unit yang sesuai filter      
                  )}
                      
              ) : (
                                                 
                                                
                           
                          
                            #     
                            NOPOL     
                            MERK     
                            MODEL     
                            SITE LOKASI     
                            POOL     
                            DEDICATE     
                                                    PLAN STATUS     
                            TGL RENCANA     
                            POOL PEMASANGAN     
                            TEKNISI     
                            NO GPS LAMA     
                            KETERANGAN PLANNER     
                        <th style={{width: 130}}>AKSI     
                           
                            
                           
                      {slice.map((u, i) => (
                                       
                                                     {(page - 1) * PAGE_LIMIT + i + 1}     
                                      {u.nopol}              
                              {u.merk || <span style={{color:'var(--text-tertiary)'}}>—       }     
                              {u.model || <span style={{color:'var(--text-tertiary)'}}>—       }     
                              {u.location}     
                              {u.pool}     
                              {u.dedicate || <span style={{color:'var(--text-tertiary)'}}>—       }     
                                                                                       
                              {u.planDate || <span style={{color:'var(--text-tertiary)'}}>Belum diplan       }     
                              {u.lokasiPasang || <span style={{color:'var(--text-tertiary)'}}>—       }     
                              {u.teknisi || <span style={{color:'var(--text-tertiary)'}}>—       }     
                              {u.noGpsLama || <span style={{color:'var(--text-tertiary)'}}>—       }     
                          <td style={{maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={u.keteranganPlanner || ''}>
                            {u.keteranganPlanner || <span style={{color:'var(--text-tertiary)'}}>-       }
                               
                              
                            {u.statusPlan === 'PLAN' ? (
                              <button 
                                className="btn btn-secondary btn-sm" 
                                onClick={() => { 
                                  setSelectedUnit(u); 
                                  setEditData({ planDate: u.planDate, lokasiPasang: u.lokasiPasang, noGpsLama: u.noGpsLama, picLapangan: u.picLapangan || '', teknisiPelaksana: u.teknisiPelaksana || '', keteranganPlanner: u.keteranganPlanner || '' }); 
                                }}
                                title="Lihat Rincian Jadwal"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                              >
                                <i className="ti ti-eye" style={{ fontSize: 13 }}>     Lihat Jadwal
                                       
                            ) : (
                              <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => { 
                                  setSelectedUnit(u); 
                                  setEditData({ planDate: u.planDate, lokasiPasang: u.lokasiPasang, noGpsLama: u.noGpsLama, picLapangan: u.picLapangan || '', teknisiPelaksana: u.teknisiPelaksana || '', keteranganPlanner: u.keteranganPlanner || '' }); 
                                }}
                                title="Buat Jadwal Baru"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                              >
                                <i className="ti ti-calendar-plus" style={{ fontSize: 13 }}>     Buat Jadwal
                                       
                            )}
                               
                             
                      ))}
                      {slice.length === 0 && (
                            
                          <td colSpan="14" style={{ textAlign: 'center', padding: 32, color: 'var(--text-tertiary)' }}>Tidak ada data unit yang sesuai filter     
                             
                      )}
                            
                          
                      
              )}
              
                                                                                                          
            </>
          ) : (
            <>
              {isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
                  {filtered.map((u) => {
                    const currentStage = getUnitCurrentStage(u);
                    const lastNote = getLastActivityNote(u);
                    const stageIndex = workflowStages.findIndex(s => s.name === currentStage);
                    const pct = Math.round(((stageIndex + 1) / workflowStages.length) * 100);
                    
                    return (
                      <div key={u.id} className="mobile-unit-card" style={{ padding: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                               
                                    {u.nopol}         
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                              {u.pool} • Site {u.location}
                                  
                                
                                                                                                                                                
                              

                        <div style={{ marginTop: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-secondary)', marginBottom: 4 }}>
                                  Progress Migrasi       
                                    {stageIndex + 1} / {workflowStages.length} Tahap ({pct}%)         
                                
                          <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: currentStage === 'COMPLETED' ? 'var(--color-done)' : 'var(--accent)' }} />
                                
                              

                        <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: 10, marginTop: 10, fontSize: 11 }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{lastNote.activity}:        
                          <span style={{ color: 'var(--text-secondary)' }}>{lastNote.notes}       
                              
                            
                    );
                  })}
                  {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-tertiary)' }}>Tidak ada unit yang sedang dimonitor      
                  )}
                      
              ) : (
                <div className="table-container" style={{ overflowX: 'auto', marginTop: 10 }}>
                  <table className="data-table" style={{ textAlign: 'center' }}>
                           
                          
                        <th style={{ textAlign: 'left', width: '150px' }}>NOPOL     
                        {workflowStages.map((stage) => (
                          <th key={stage.name} style={{ fontSize: '11px', padding: '12px 6px', fontWeight: 'bold' }}>
                            {stage.label}
                               
                        ))}
                        <th style={{ textAlign: 'right', width: '280px' }}>CATATAN AKTIVITAS TERAKHIR     
                           
                            
                           
                      {filtered.map((u) => {
                        const currentStage = getUnitCurrentStage(u);
                        const lastNote = getLastActivityNote(u);
                        return (
                          <tr key={u.id} style={{ height: '48px' }}>
                            <td style={{ textAlign: 'left' }}>
                                      {u.nopol}         
                              <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', fontWeight: '600', marginTop: '2px' }}>
                                {u.pool} • Site {u.location}
                                    
                                 
                            {workflowStages.map((stage) => (
                              <td key={stage.name} style={{ verticalAlign: 'middle' }}>
                                {renderStageCell(currentStage, stage.name)}
                                   
                            ))}
                            <td style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-secondary)', maxStrWidth: '280px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                              <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{lastNote.activity}:        
                                                           {lastNote.notes}       
                                 
                               
                        );
                      })}
                      {filtered.length === 0 && (
                            
                          <td colSpan={10} style={{ padding: 32, color: 'var(--text-tertiary)' }}>
                            Tidak ada unit yang sedang dimonitor
                               
                             
                      )}
                            
                          
                      
              )}
            </>
          )}

          {/* Modal Tambah Unit Baru */}
          {showAddModal && (
                                                                                  
                                                                             
                                              
                                                Tambah Unit Baru       
                                                                                                                             
                      
                                               
                                              
                                                 
                                                     NOPOL (Nomor Polisi)        
                      <input type="text" value={newUnitData.nopol} onChange={e => setNewUnitData(d => ({ ...d, nopol: e.target.value }))} className="input-field" placeholder="cth. B 1234 PQR" required autoFocus />
                          
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                                   
                                                       Merk Kendaraan        
                        {!isCustomMerk ? (
                          <select 
                            value={newUnitData.merk} 
                            onChange={e => {
                              if (e.target.value === '__NEW__') {
                                setIsCustomMerk(true);
                                setNewUnitData(d => ({ ...d, merk: '' }));
                              } else {
                                setNewUnitData(d => ({ ...d, merk: e.target.value }));
                              }
                            }} 
                            className="filter-select" 
                            style={{width:'100%', height:'38px'}} 
                            required
                          >
                                             — Pilih Merk —         
                            {uniqueMerks.map(m =>                           {m}         )}
                                                    + Tambah Merk Baru...         
                                   
                        ) : (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <input 
                              type="text" 
                              value={newUnitData.merk} 
                              onChange={e => setNewUnitData(d => ({ ...d, merk: e.target.value }))} 
                              className="input-field" 
                              placeholder="Ketik Merk Baru" 
                              required 
                              autoFocus 
                            />
                            <button 
                              type="button" 
                              className="btn btn-secondary btn-sm" 
                              onClick={() => {
                                setIsCustomMerk(false);
                                setNewUnitData(d => ({ ...d, merk: '' }));
                              }}
                              style={{ padding: '0 8px', height: '38px', minWidth: '38px' }}
                              title="Pilih dari daftar"
                            >
                                                            
                                     
                                
                        )}
                            
                                                   
                                                       Model Kendaraan        
                        {!isCustomModel ? (
                          <select 
                            value={newUnitData.model} 
                            onChange={e => {
                              if (e.target.value === '__NEW__') {
                                setIsCustomModel(true);
                                setNewUnitData(d => ({ ...d, model: '' }));
                              } else {
                                setNewUnitData(d => ({ ...d, model: e.target.value }));
                              }
                            }} 
                            className="filter-select" 
                            style={{width:'100%', height:'38px'}} 
                            required
                          >
                                             — Pilih Model —         
                            {uniqueModels.map(m =>                           {m}         )}
                                                    + Tambah Model Baru...         
                                   
                        ) : (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <input 
                              type="text" 
                              value={newUnitData.model} 
                              onChange={e => setNewUnitData(d => ({ ...d, model: e.target.value }))} 
                              className="input-field" 
                              placeholder="Ketik Model Baru" 
                              required 
                              autoFocus 
                            />
                            <button 
                              type="button" 
                              className="btn btn-secondary btn-sm" 
                              onClick={() => {
                                setIsCustomModel(false);
                                setNewUnitData(d => ({ ...d, model: '' }));
                              }}
                              style={{ padding: '0 8px', height: '38px', minWidth: '38px' }}
                              title="Pilih dari daftar"
                            >
                                                            
                                     
                                
                        )}
                            
                          

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                                   
                                                       Site Lokasi        
                        <select value={newUnitData.location} onChange={e => setNewUnitData(d => ({ ...d, location: e.target.value }))} className="filter-select" style={{width:'100%', height:'38px'}}>
                          {LOCS.map(l =>                           {l}         )}
                                 
                            
                                                   
                                                       Pool        
                        <select value={newUnitData.pool} onChange={e => setNewUnitData(d => ({ ...d, pool: e.target.value }))} className="filter-select" style={{width:'100%', height:'38px'}}>
                          {POOLS.map(p =>                           {p}         )}
                                 
                            
                          

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                                   
                                                       Dedicate        
                        {!isCustomDedicate ? (
                          <select 
                            value={newUnitData.dedicate} 
                            onChange={e => {
                              if (e.target.value === '__NEW__') {
                                setIsCustomDedicate(true);
                                setNewUnitData(d => ({ ...d, dedicate: '' }));
                              } else {
                                setNewUnitData(d => ({ ...d, dedicate: e.target.value }));
                              }
                            }} 
                            className="filter-select" 
                            style={{width:'100%', height:'38px'}} 
                            required
                          >
                                             — Pilih Dedicate —         
                            {uniqueDedicates.map(d =>                           {d}         )}
                                                    + Tambah Dedicate Baru...         
                                   
                        ) : (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <input 
                              type="text" 
                              value={newUnitData.dedicate} 
                              onChange={e => setNewUnitData(d => ({ ...d, dedicate: e.target.value }))} 
                              className="input-field" 
                              placeholder="Ketik Dedicate Baru" 
                              required 
                              autoFocus 
                            />
                            <button 
                              type="button" 
                              className="btn btn-secondary btn-sm" 
                              onClick={() => {
                                setIsCustomDedicate(false);
                                setNewUnitData(d => ({ ...d, dedicate: '' }));
                              }}
                              style={{ padding: '0 8px', height: '38px', minWidth: '38px' }}
                              title="Pilih dari daftar"
                            >
                                                            
                                     
                                
                        )}
                            
                                                   
                                                       No GPS Lama        
                        <input type="text" value={newUnitData.noGpsLama} onChange={e => setNewUnitData(d => ({ ...d, noGpsLama: e.target.value }))} className="input-field" placeholder="Nomor GPS lama (jika ada)" />
                            
                          
                        
                                                
                                                                                                               Batal         
                                                                      Simpan Unit         
                        
                       
                    
                  
          )}

          {/* Modal Buat Jadwal Pemasangan */}
          {selectedUnit && (
                                                                                 
                                                                             
                                              
                                                
                    {selectedUnit.statusPlan === 'PLAN' ? (
                      <>
                        <i className="ti ti-eye" style={{ marginRight: 6, color: 'var(--text-secondary)' }}>    
                        Lihat/Edit Jadwal Pemasangan
                      </>
                    ) : (
                      <>
                        <i className="ti ti-calendar-plus" style={{ marginRight: 6, color: 'var(--accent)' }}>    
                        Buat Jadwal Pemasangan
                      </>
                    )}
                         
                                                                                                                            
                      
                <form onSubmit={(e) => { e.preventDefault(); save(selectedUnit.id); }}>
                                              
                                                 
                                                     Nomor Polisi (NOPOL)        
                      <input type="text" value={selectedUnit.nopol} className="input-field" disabled style={{ background: 'var(--bg-secondary)', fontWeight: 'bold' }} />
                          

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, padding: 12, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 12 }}>
                           
                        <span style={{ color: 'var(--text-secondary)' }}>Merk / Model:       
                        <div style={{ fontWeight: 600 }}>{selectedUnit.merk || '—'} / {selectedUnit.model || '—'}      
                            
                           
                        <span style={{ color: 'var(--text-secondary)' }}>Site / Pool:       
                        <div style={{ fontWeight: 600 }}>{selectedUnit.location} / {selectedUnit.pool}      
                            
                          

                                                 
                                                     Tanggal Rencana Pemasangan        
                      <input 
                        type="date" 
                        value={toISODate(editData.planDate || '')} 
                        onChange={e => setEditData(d => ({ ...d, planDate: fromISODate(e.target.value) }))} 
                        className="input-field" 
                        required 
                      />
                          

                                                 
                                                     Pool Pemasangan (Lokasi Pasang)        
                      <select 
                        value={editData.lokasiPasang || ''} 
                        onChange={e => setEditData(d => ({ ...d, lokasiPasang: e.target.value }))} 
                        className="filter-select" 
                        style={{ width: '100%', height: '38px' }}
                        required
                      >
                                         — Pilih Pool Pemasangan —         
                        {LOKASI_OPTS.map(o =>                           {o}         )}
                               
                          

                                                 
                                                     Keterangan Pemasangan (untuk Teknisi)        
                      <textarea 
                        value={editData.keteranganPlanner || ''} 
                        onChange={e => setEditData(d => ({ ...d, keteranganPlanner: e.target.value }))} 
                        className="input-field" 
                        style={{ height: '60px', resize: 'vertical' }}
                        placeholder="Catatan tambahan untuk teknisi (opsional)..."
                      />
                          

                                                 
                                                     PIC Lapangan *        
                      <select 
                        value={editData.picLapangan || ''} 
                        onChange={e => setEditData(d => ({ ...d, picLapangan: e.target.value }))} 
                        className="filter-select" 
                        style={{ width: '100%', height: '38px' }}
                        required
                      >
                                         — Pilih PIC Lapangan —         
                        {pics.map(p =>                                   {p.name}         )}
                               
                          

                                                 
                                                     Teknisi Pelaksana        
                      <select 
                        value={editData.teknisiPelaksana || ''} 
                        onChange={e => setEditData(d => ({ ...d, teknisiPelaksana: e.target.value }))} 
                        className="filter-select" 
                        style={{ width: '100%', height: '38px' }}
                      >
                                         — Pilih Teknisi (Opsional) —         
                        {technicians.map(t =>                                   {t.name}         )}
                               
                          
                        
                                                
                                                                                                              Batal         
                    {selectedUnit.planDate && (
                      <button 
                        type="button" 
                        className="btn btn-danger" 
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin menghapus jadwal untuk NOPOL ${selectedUnit.nopol}?`)) {
                            save(selectedUnit.id, { planDate: '', lokasiPasang: '', noGpsLama: selectedUnit.noGpsLama || '' });
                          }
                        }}
                        style={{ marginRight: 'auto' }}
                      >
                        Hapus Jadwal
                               
                    )}
                                                                      Simpan Jadwal         
                        
                       
                    
                  
          )}

          {/* Modal Impor Data Massal (CSV) */}
          {showImportModal && (
            <div className="modal-overlay" onClick={() => { if (!isImporting) setShowImportModal(false); }}>
              <div className="modal-card" style={{ maxWidth: 650 }} onClick={e => e.stopPropagation()}>
                                              
                                                Impor Massal Data Kendaraan       
                  <button className="modal-close" disabled={isImporting} onClick={() => { setShowImportModal(false); setImportPreviewData([]); setImportError(''); }}>                                    
                      
                                            
                  <span style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Langkah 1: Format & Unduh Template       
                  <p className="text-muted" style={{ fontSize: 11, marginBottom: 8 }}>
                    Format file impor wajib menggunakan file CSV dengan baris pertama berupa nama kolom (headers) berikut:
                      
                  
                                                           
                                                             
                                                            
                                    NOPOL          (wajib, cth: B 1234 XYZ)       
                          
                                                             
                                                            
                                    MERK          (cth: MITSUBISHI)       
                          
                                                             
                                                            
                                    MODEL          (cth: FUSO)       
                          
                                                             
                                                            
                                    LOCATION          (cth: JAKARTA, MERAK)       
                          
                                                             
                                                            
                                    POOL          (cth: POOL A, POOL B)       
                          
                                                             
                                                            
                                    DEDICATE          (cth: LOGISTICS)       
                          
                    <div className="import-instruction-item" style={{ gridColumn: 'span 2' }}>
                                                            
                                    NO_GPS_LAMA          (opsional, nomor serial GPS sebelumnya)       
                          
                        
                  
                  <button type="button" className="btn btn-secondary btn-sm" onClick={downloadCSVTemplate} style={{ marginBottom: 16 }}>
                                                       Unduh Template CSV (.csv)
                           
                  
                  <span style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Langkah 2: Unggah File CSV       
                  
                  <div 
                    className={`csv-dropzone ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={e => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
                    onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
                    onDrop={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(false);
                      if (isImporting) return;
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        const fakeEvent = { target: { files: [file] } };
                        handleCSVUpload(fakeEvent);
                      }
                    }}
                    onClick={() => { if (!isImporting) document.getElementById('csv-file-input').click(); }}
                  >
                                                          
                                                        Tarik & lepas file CSV Anda di sini, atau klik untuk memilih file       
                                                           Hanya menerima format file .csv (UTF-8)       
                    <input 
                      type="file" 
                      id="csv-file-input" 
                      accept=".csv" 
                      onChange={handleCSVUpload} 
                      style={{ display: 'none' }} 
                      disabled={isImporting}
                    />
                        
                  
                  {importError && (
                    <div className="toast error" style={{ position: 'static', marginTop: 12, width: '100%', display: 'flex', boxShadow: 'none' }}>
                      <i className="ti ti-alert-triangle" style={{ fontSize: 18, marginRight: 8 }}>    
                            {importError}       
                          
                  )}
                  
                  {importPreviewData.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>Pratinjau Impor ({importPreviewData.length} unit terdeteksi):       
                        <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--color-done)' }} /> Baru: {importPreviewData.filter(i => i.status === 'BARU').length}
                                 
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--color-progress)' }} /> Perbarui: {importPreviewData.filter(i => i.status === 'UPDATE').length}
                                 
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--color-reschedule)' }} /> Error: {importPreviewData.filter(i => i.status === 'INVALID').length}
                                 
                              
                            
                      
                                                                
                                                                
                                 
                                
                              <th style={{ width: 30 }}>#     
                                  NOPOL     
                                  MERK     
                                  MODEL     
                                  SITE/POOL     
                                  NO GPS LAMA     
                              <th style={{ width: 90 }}>STATUS     
                                 
                                  
                                 
                            {importPreviewData.map((item, idx) => (
                              <tr key={idx} style={item.status === 'INVALID' ? { background: 'rgba(239, 68, 68, 0.05)' } : {}}>
                                                           {idx + 1}     
                                            {item.nopol || '—'}              
                                    {item.merk || <span style={{ color: 'var(--text-tertiary)' }}>—       }     
                                    {item.model || <span style={{ color: 'var(--text-tertiary)' }}>—       }     
                                    {item.location} / {item.pool}     
                                    {item.noGpsLama || <span style={{ color: 'var(--text-tertiary)' }}>—       }     
                                    
                                  <span className={`badge ${item.status === 'BARU' ? 'baru' : item.status === 'UPDATE' ? 'update' : 'invalid'}`} title={item.statusText}>
                                    {item.status}
                                         
                                     
                                   
                            ))}
                                  
                                
                            
                          
                  )}
                      
                
                                              
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => { setShowImportModal(false); setImportPreviewData([]); setImportError(''); }}
                    disabled={isImporting}
                  >
                    Batal
                           
                                                                                                                                                                                                                                                                                                                     
                    {isImporting ? (
                      <>
                        <i className="ti ti-loader animate-spin" style={{ marginRight: 6 }}>     Sinkronisasi: {importProgress}/{importPreviewData.filter(i => i.status === 'BARU' || i.status === 'UPDATE').length} ({Math.round((importProgress / (importPreviewData.filter(i => i.status === 'BARU' || i.status === 'UPDATE').length || 1)) * 100)}%)
                      </>
                    ) : (
                      <>
                        <i className="ti ti-check" style={{ marginRight: 4 }}>     Proses Impor ({importPreviewData.filter(i => i.status === 'BARU' || i.status === 'UPDATE').length} Unit)
                      </>
                    )}
                           
                      
                    
                  
          )}
              
      );
    }

    // 3. Teknisi View (Desktop + Mobile layout)
                                                                    function TeknisiView({ units, setUnits, syncUpdate }) {
      const { user, logout } = useContext(AuthContext);
      const [subTab, setSubTab] = useState(() => {
        try {
          return localStorage.getItem('teknisi_active_subtab') || 'today';
        } catch (e) {
          return 'today';
        }
      });
      const [activeUnitId, setActiveUnitId] = useState(() => {
        try {
          const saved = localStorage.getItem('teknisi_active_unit_id');
          return saved ? (isNaN(Number(saved)) ? saved : Number(saved)) : null;
        } catch (e) {
          return null;
        }
      });

      const [completedLocally, setCompletedLocally] = useState(() => {
        try {
          const saved = localStorage.getItem('teknisi_completed_locally');
          return saved ? JSON.parse(saved) : {};
        } catch (e) {
          return {};
        }
      });
      
      // Form fields
      const [noGpsLama, setNoGpsLama] = useState('');
      const [gpsSerialBaru, setGpsSerialBaru] = useState('');
      const [gpsImeiBaru, setGpsImeiBaru] = useState('');
      const [nomorSIM, setNomorSIM] = useState('');
      const [provider, setProvider] = useState('Telkomsel');
      const [catatanPasang, setCatatanPasang] = useState('');
      
      // Device test states
      const [modelGpsBaru, setModelGpsBaru] = useState('GEOTAB');
      const [gps, setGps] = useState('TERPASANG');
      const [buzzer, setBuzzer] = useState('TERPASANG');
      const [sos, setSos] = useState('TERPASANG');
      const [sensorWing, setSensorWing] = useState('TIDAK TERPASANG');
      const [camera, setCamera] = useState('TIDAK ADA');
      const [statusPasang, setStatusPasang] = useState('ON PROGRESS');
      
      // Photo states (Base64)
      const [fotoKendaraan, setFotoKendaraan] = useState('');
      const [fotoGPSLama, setFotoGPSLama] = useState('');
      const [fotoGPSBaru, setFotoGPSBaru] = useState('');
      const [fotoHasilInstalasi, setFotoHasilInstalasi] = useState('');

      // Claim and submit loading states
      const [loadingClaim, setLoadingClaim] = useState(false);
      const [loadingSubmit, setLoadingSubmit] = useState(false);

      // Scanner states
      const [isScannerOpen, setIsScannerOpen] = useState(false);
      const [activeScanField, setActiveScanField] = useState(''); // 'gpsLama', 'gpsBaru', 'gpsImei'

      // Wizard step state
      const [activeStep, setActiveStep] = useState(1);

      // Search & Filters for List
      const [q, setQ] = useState('');
      const [loc, setLoc] = useState('');

      // Cache-adjusted units where locally completed tasks are shown with their completed status
      const computedUnits = useMemo(() => {
        return units.map(u => {
          if (completedLocally[u.id]) {
            return { ...u, statusPasang: completedLocally[u.id] };
          }
          return u;
        });
      }, [units, completedLocally]);

      // Cleanup completed locally cache when server catches up
      useEffect(() => {
        let changed = false;
        const nextCompleted = { ...completedLocally };
        for (const id in nextCompleted) {
          const unit = units.find(u => String(u.id) === String(id));
          if (unit && unit.statusPasang === nextCompleted[id]) {
            delete nextCompleted[id];
            changed = true;
          }
        }
        if (changed) {
          setCompletedLocally(nextCompleted);
          try {
            localStorage.setItem('teknisi_completed_locally', JSON.stringify(nextCompleted));
          } catch (e) {}
        }
      }, [units, completedLocally]);

      // Find the active unit object
      const activeUnit = useMemo(() => {
        return computedUnits.find(u => u.id === activeUnitId);
      }, [computedUnits, activeUnitId]);

      // Ref to track whether form has been initialized for the current active unit
      const initializedUnitIdRef = React.useRef(null);

      // Save subTab to localStorage
      useEffect(() => {
        try {
          localStorage.setItem('teknisi_active_subtab', subTab);
        } catch (e) {
          console.error(e);
        }
      }, [subTab]);

      // Save activeUnitId to localStorage
      useEffect(() => {
        try {
          if (activeUnitId) {
            localStorage.setItem('teknisi_active_unit_id', String(activeUnitId));
          } else {
            localStorage.removeItem('teknisi_active_unit_id');
          }
        } catch (e) {
          console.error(e);
        }
      }, [activeUnitId]);

      // Save form state to localStorage whenever fields change
      useEffect(() => {
        try {
          // Only save to localStorage if the active unit has been fully initialized in state
          if (activeUnitId && initializedUnitIdRef.current === activeUnitId) {
            const stateToSave = {
              noGpsLama,
              gpsSerialBaru,
              gpsImeiBaru,
              nomorSIM,
              provider,
              catatanPasang,
              modelGpsBaru,
              gps,
              buzzer,
              sos,
              sensorWing,
              camera,
              statusPasang,
              fotoKendaraan,
              fotoGPSLama,
              fotoGPSBaru,
              fotoHasilInstalasi,
              activeStep
            };
            localStorage.setItem('active_install_form_' + activeUnitId, JSON.stringify(stateToSave));
          }
        } catch (e) {
          console.error(e);
        }
      }, [
        activeUnitId,
        noGpsLama,
        gpsSerialBaru,
        gpsImeiBaru,
        nomorSIM,
        provider,
        catatanPasang,
        modelGpsBaru,
        gps,
        buzzer,
        sos,
        sensorWing,
        camera,
        statusPasang,
        fotoKendaraan,
        fotoGPSLama,
        fotoGPSBaru,
        fotoHasilInstalasi,
        activeStep
      ]);

      // If activeUnitId changes, initialize form states (with localStorage loading fallback)
      useEffect(() => {
        if (activeUnitId) {
          if (activeUnit && initializedUnitIdRef.current !== activeUnitId) {
            let savedData = null;
            try {
              const savedDataStr = localStorage.getItem('active_install_form_' + activeUnitId);
              if (savedDataStr) {
                savedData = JSON.parse(savedDataStr);
              }
            } catch (e) {
              console.error("Failed to load saved state from localStorage:", e);
            }

            if (savedData) {
              setNoGpsLama(String(savedData.noGpsLama ?? ''));
              setGpsSerialBaru(String(savedData.gpsSerialBaru ?? ''));
              setGpsImeiBaru(String(savedData.gpsImeiBaru ?? ''));
              setNomorSIM(String(savedData.nomorSIM ?? ''));
              setProvider(String(savedData.provider ?? 'Telkomsel'));
              setCatatanPasang(String(savedData.catatanPasang ?? ''));
              
              setModelGpsBaru(String(savedData.modelGpsBaru ?? 'GEOTAB'));
              setGps(String(savedData.gps ?? 'TERPASANG'));
              setBuzzer(String(savedData.buzzer ?? 'TERPASANG'));
              setSos(String(savedData.sos ?? 'TERPASANG'));
              setSensorWing(String(savedData.sensorWing ?? 'TIDAK TERPASANG'));
              setCamera(String(savedData.camera ?? 'TIDAK ADA'));
              setStatusPasang(String(savedData.statusPasang ?? 'ON PROGRESS'));
              
              setFotoKendaraan(String(savedData.fotoKendaraan ?? ''));
              setFotoGPSLama(String(savedData.fotoGPSLama ?? ''));
              setFotoGPSBaru(String(savedData.fotoGPSBaru ?? ''));
              setFotoHasilInstalasi(String(savedData.fotoHasilInstalasi ?? ''));

              setActiveStep(Number(savedData.activeStep ?? 1));
            } else {
              setNoGpsLama(String(activeUnit.noGpsLama ?? ''));
              setGpsSerialBaru(String(activeUnit.gpsSerialBaru ?? ''));
              setGpsImeiBaru(String(activeUnit.gpsImeiBaru ?? ''));
              setNomorSIM(String(activeUnit.nomorSIM ?? ''));
              setProvider(String(activeUnit.provider ?? 'Telkomsel'));
              setCatatanPasang(String(activeUnit.catatanPasang ?? ''));
              
              setModelGpsBaru(String(activeUnit.modelGpsBaru ?? 'GEOTAB'));
              setGps(String(activeUnit.gps ?? 'TERPASANG'));
              setBuzzer(String(activeUnit.buzzer ?? 'TERPASANG'));
              setSos(String(activeUnit.sos ?? 'TERPASANG'));
              setSensorWing(String(activeUnit.sensorWing ?? 'TIDAK TERPASANG'));
              setCamera(String(activeUnit.camera ?? 'TIDAK ADA'));
              setStatusPasang(String(activeUnit.statusPasang ?? 'ON PROGRESS'));
              
              setFotoKendaraan(String(activeUnit.fotoKendaraan ?? ''));
              setFotoGPSLama(String(activeUnit.fotoGPSLama ?? ''));
              setFotoGPSBaru(String(activeUnit.fotoGPSBaru ?? ''));
              setFotoHasilInstalasi(String(activeUnit.fotoHasilInstalasi ?? ''));

              setActiveStep(1); // Reset wizard to step 1
            }
            initializedUnitIdRef.current = activeUnitId; // Mark as initialized for this ID
          }
        } else {
          initializedUnitIdRef.current = null;
        }
      }, [activeUnitId, activeUnit]);

      // Helper to cancel/batal current unit and delete localStorage backup
      const cancelActiveUnit = () => {
        try {
          if (activeUnitId) {
            localStorage.removeItem('active_install_form_' + activeUnitId);
            localStorage.removeItem('teknisi_active_unit_id');
          }
        } catch (e) {
          console.error(e);
        }
        setActiveUnitId(null);
        setSubTab('today');
      };

      // Helper to just go back to tab Tugas without deleting the local draft
      const goBackToList = () => {
        setSubTab('today');
      };

      const nameMatch = user.name || user.username;

      // Extract User Initials
      const initials = useMemo(() => {
        if (!nameMatch) return 'AF';
        const parts = nameMatch.trim().split(' ');
        if (parts.length >= 2) {
          return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return nameMatch.slice(0, 2).toUpperCase();
      }, [nameMatch]);

      // Check if technician currently has an active task in progress
      const hasActiveTask = useMemo(() => {
        return computedUnits.some(u => 
          u.statusPasang === 'ON PROGRESS' &&
          u.teknisiPelaksana && u.teknisiPelaksana.toLowerCase() === nameMatch.toLowerCase()
        );
      }, [computedUnits, nameMatch]);

      // Find the specific active unit claimed by this technician
      const myActiveUnit = useMemo(() => {
        return computedUnits.find(u => 
          u.statusPasang === 'ON PROGRESS' &&
          u.teknisiPelaksana && u.teknisiPelaksana.toLowerCase() === nameMatch.toLowerCase()
        );
      }, [computedUnits, nameMatch]);

      // Filtered queue units: planned, unclaimed/assigned to me, not yet completed
      const queueUnits = useMemo(() => {
        return computedUnits.filter(u => 
          u.statusPlan === 'PLAN' &&
          u.statusPasang === 'BELUM DIPASANG' &&
          (!u.teknisiPelaksana || u.teknisiPelaksana.trim() === '' || u.teknisiPelaksana.toLowerCase() === nameMatch.toLowerCase()) &&
          (!q || u.nopol.toLowerCase().includes(q.toLowerCase())) &&
          (!loc || u.location === loc)
        );
      }, [computedUnits, q, loc, nameMatch]);

      // History units: completed by this technician
      const historyUnits = useMemo(() => {
        return computedUnits.filter(u => 
          u.teknisiPelaksana && u.teknisiPelaksana.toLowerCase() === nameMatch.toLowerCase() &&
          ['TEKNISI SUBMITTED', 'PIC VERIFIED', 'IT VERIFIED', 'DONE'].includes(u.statusPasang)
        );
      }, [computedUnits, nameMatch]);

      // Automatically set activeUnitId if they have an active task and switch to installations
      useEffect(() => {
        if (subTab === 'installations' && !activeUnitId) {
          const task = computedUnits.find(u => 
            u.statusPasang === 'ON PROGRESS' &&
            u.teknisiPelaksana && u.teknisiPelaksana.toLowerCase() === nameMatch.toLowerCase()
          );
          if (task) {
            setActiveUnitId(task.id);
          }
        }
      }, [subTab, computedUnits, nameMatch, activeUnitId]);

      // Claim unit logic with concurrency collision check & single active task restriction
      const claimUnit = async (u) => {
        if (hasActiveTask) {
          globalAddToast('Selesaikan tugas aktif Anda di My Installs terlebih dahulu!', 'warning');
          return;
        }

        setLoadingClaim(true);
        globalAddToast('Memeriksa ketersediaan unit...', 'info');
        
        try {
          const res = await fetch(WEBAPP_URL);
          const json = await res.json();
          if (json.success) {
            const fresh = json.data.find(row => row.NOPOL === u.nopol);
            if (fresh && fresh.TEKNISI_PELAKSANA && fresh.TEKNISI_PELAKSANA.trim() !== '') {
              const currentClaimer = fresh.TEKNISI_PELAKSANA;
              globalAddToast(`Gagal: Unit ini sudah diklaim oleh ${currentClaimer}!`, 'danger');
              setUnits(prev => prev.map(item => item.nopol === u.nopol ? { ...item, teknisiPelaksana: currentClaimer } : item));
              setLoadingClaim(false);
              return;
            }
          }

          // Safe to claim
          const now = new Date();
          const dd = n => String(n).padStart(2, '0');
          const ts = `${dd(now.getDate())}-${dd(now.getMonth() + 1)}-${now.getFullYear()} ${dd(now.getHours())}:${dd(now.getMinutes())}`;
          
          const updates = {
            TEKNISI_PELAKSANA: nameMatch,
            STATUS_PASANG: 'ON PROGRESS',
            LAST_UPDATE: ts
          };

          await syncUpdate(u.nopol, updates);
          
          // Update local react state
          setUnits(prev => prev.map(item => item.nopol === u.nopol ? { 
            ...item, 
            teknisiPelaksana: nameMatch, 
            statusPasang: 'ON PROGRESS', 
            updatedAt: ts 
          } : item));

          setActiveUnitId(u.id);
          setSubTab('installations');
          globalAddToast(`Berhasil mengklaim unit ${u.nopol}!`, 'success');
        } catch (err) {
          console.error(err);
          globalAddToast('Gagal mengklaim unit: ' + String(err), 'danger');
        } finally {
          setLoadingClaim(false);
        }
      };

      // Release/batal claim back to pool
      const releaseClaim = async (u) => {
        if (!confirm(`Apakah Anda yakin ingin membatalkan klaim untuk unit ${u.nopol}? Unit ini akan dikembalikan ke daftar tugas agar bisa diklaim oleh teknisi lain.`)) {
          return;
        }

        setLoadingClaim(true);
        globalAddToast('Membatalkan klaim unit...', 'info');
        
        try {
          const now = new Date();
          const dd = n => String(n).padStart(2, '0');
          const ts = `${dd(now.getDate())}-${dd(now.getMonth() + 1)}-${now.getFullYear()} ${dd(now.getHours())}:${dd(now.getMinutes())}`;

          const updates = {
            TEKNISI_PELAKSANA: '',
            STATUS_PASANG: 'BELUM DIPASANG',
            LAST_UPDATE: ts
          };

          await syncUpdate(u.nopol, updates);
          
          // Update local react state
          setUnits(prev => prev.map(item => item.nopol === u.nopol ? { 
            ...item, 
            teknisiPelaksana: '', 
            statusPasang: 'BELUM DIPASANG', 
            updatedAt: ts 
          } : item));

          // Clear local storage draft
          try {
            localStorage.removeItem('active_install_form_' + u.id);
            localStorage.removeItem('teknisi_active_unit_id');
          } catch (e) {}

          setActiveUnitId(null);
          globalAddToast(`Klaim unit ${u.nopol} berhasil dibatalkan!`, 'success');
        } catch (err) {
          console.error(err);
          globalAddToast('Gagal membatalkan klaim unit: ' + String(err), 'danger');
        } finally {
          setLoadingClaim(false);
        }
      };

      // Image Compression & Conversion to Base64
      const handlePhotoChange = (fieldName, file) => {
        if (!file) return;
        globalAddToast('Mengompresi foto...', 'info');

        const reader = new FileReader();
        reader.onload = (e) => {
          const originalBase64 = e.target.result;
          const img = new Image();
          
          img.onload = () => {
            try {
              const maxDim = 800;
              let w = img.width;
              let h = img.height;
              if (w > maxDim || h > maxDim) {
                if (w > h) {
                  h = Math.round((h * maxDim) / w);
                  w = maxDim;
                } else {
                  w = Math.round((w * maxDim) / h);
                  h = maxDim;
                }
              }

              const canvas = document.createElement('canvas');
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, w, h);

              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

              if (fieldName === 'fotoKendaraan') setFotoKendaraan(compressedBase64);
              if (fieldName === 'fotoGPSLama') setFotoGPSLama(compressedBase64);
              if (fieldName === 'fotoGPSBaru') setFotoGPSBaru(compressedBase64);
              if (fieldName === 'fotoHasilInstalasi') setFotoHasilInstalasi(compressedBase64);
              
              globalAddToast('Foto berhasil ditambahkan!', 'success');
            } catch (canvasErr) {
              console.warn("Canvas compress failed, fallback to raw base64:", canvasErr);
              if (fieldName === 'fotoKendaraan') setFotoKendaraan(originalBase64);
              if (fieldName === 'fotoGPSLama') setFotoGPSLama(originalBase64);
              if (fieldName === 'fotoGPSBaru') setFotoGPSBaru(originalBase64);
              if (fieldName === 'fotoHasilInstalasi') setFotoHasilInstalasi(originalBase64);
              globalAddToast('Foto berhasil ditambahkan (tanpa kompresi)!', 'success');
            }
          };

          img.onerror = () => {
            if (fieldName === 'fotoKendaraan') setFotoKendaraan(originalBase64);
            if (fieldName === 'fotoGPSLama') setFotoGPSLama(originalBase64);
            if (fieldName === 'fotoGPSBaru') setFotoGPSBaru(originalBase64);
            if (fieldName === 'fotoHasilInstalasi') setFotoHasilInstalasi(originalBase64);
            globalAddToast('Foto berhasil ditambahkan!', 'success');
          };

          img.src = originalBase64;
        };
        reader.readAsDataURL(file);
      };

      // Scanner functions using HTML5 Qrcode
      const startScanning = (fieldName) => {
        setActiveScanField(fieldName);
        setIsScannerOpen(true);
        
        setTimeout(() => {
          try {
            const html5QrCode = new Html5Qrcode("scanner-view");
            window.activeScanner = html5QrCode;
            
            const qrSuccess = (decodedText) => {
              if (fieldName === 'gpsLama') setNoGpsLama(decodedText);
              if (fieldName === 'gpsBaru') setGpsSerialBaru(decodedText);
              if (fieldName === 'gpsImei') setGpsImeiBaru(decodedText);
              globalAddToast('Scan sukses: ' + decodedText, 'success');
              stopScanning();
            };

            html5QrCode.start(
              { facingMode: "environment" },
              { fps: 10, qrbox: { width: 250, height: 250 } },
              qrSuccess
            ).catch(err => {
              console.warn("Scan camera failed to start: ", err);
            });
          } catch (e) {
            console.error("Scanner error:", e);
          }
        }, 350);
      };

      const stopScanning = () => {
        if (window.activeScanner) {
          try {
            window.activeScanner.stop().then(() => {
              window.activeScanner = null;
              const el = document.getElementById("scanner-view");
              if (el) el.innerHTML = '';
            }).catch(e => {
              console.error("Error stopping scanner", e);
              window.activeScanner = null;
              const el = document.getElementById("scanner-view");
              if (el) el.innerHTML = '';
            });
          } catch (e) {
            window.activeScanner = null;
          }
        }
        setIsScannerOpen(false);
        setActiveScanField('');
      };

      const simulateScan = () => {
        const mockVal = "SN" + Math.floor(100000000 + Math.random() * 900000000);
        if (activeScanField === 'gpsLama') setNoGpsLama(mockVal);
        if (activeScanField === 'gpsBaru') setGpsSerialBaru(mockVal);
        if (activeScanField === 'gpsImei') setGpsImeiBaru("IMEI" + Math.floor(100000000000000 + Math.random() * 90000000000000));
        
        globalAddToast('Simulasi scan barcode berhasil!', 'success');
        stopScanning();
      };

      const isWingboxUnit = activeUnit && (
        (activeUnit.pool && activeUnit.pool.toLowerCase().includes('wingbox')) ||
        (activeUnit.model && activeUnit.model.toLowerCase().includes('wingbox')) ||
        (activeUnit.dedicate && activeUnit.dedicate.toLowerCase().includes('wingbox'))
      );

      const submitInstallation = async () => {
        if (loadingSubmit) return;

        // Hardware details validation
        if (!String(noGpsLama || '').trim()) {
          globalAddToast('Kesalahan: Kolom No GPS Lama wajib diisi!', 'danger');
          return;
        }
        if (!String(gpsSerialBaru || '').trim()) {
          globalAddToast('Kesalahan: Kolom Serial GPS Baru wajib diisi!', 'danger');
          return;
        }
        if (!String(gpsImeiBaru || '').trim()) {
          globalAddToast('Kesalahan: Kolom IMEI GPS Baru wajib diisi!', 'danger');
          return;
        }
        if (!String(nomorSIM || '').trim()) {
          globalAddToast('Kesalahan: Kolom Nomor SIM Baru wajib diisi!', 'danger');
          return;
        }

        // Wingbox mandatory sensor check
        if (isWingboxUnit && sensorWing !== 'TERPASANG') {
          globalAddToast('Kesalahan: Unit adalah Wingbox! Sensor Wingbox wajib Terpasang!', 'danger');
          return;
        }

        // Document photos validation
        if (!fotoKendaraan) {
          globalAddToast('Kesalahan: Foto Kendaraan wajib diunggah!', 'danger');
          return;
        }
        if (!fotoGPSLama) {
          globalAddToast('Kesalahan: Foto GPS Lama wajib diunggah!', 'danger');
          return;
        }
        if (!fotoGPSBaru) {
          globalAddToast('Kesalahan: Foto GPS Baru wajib diunggah!', 'danger');
          return;
        }
        if (!fotoHasilInstalasi) {
          globalAddToast('Kesalahan: Foto Hasil Instalasi wajib diunggah!', 'danger');
          return;
        }

        setLoadingSubmit(true);
        globalAddToast('Mengirim laporan ke IT...', 'info');

        const now = new Date();
        const dd = n => String(n).padStart(2, '0');
        const ts = `${dd(now.getDate())}-${dd(now.getMonth() + 1)}-${now.getFullYear()} ${dd(now.getHours())}:${dd(now.getMinutes())}`;

        const updates = {
          STATUS_PASANG: 'TEKNISI SUBMITTED',
          STATUS_EASYGO_DICOPOT: 'SUDAH',
          MODEL_GPS_BARU: modelGpsBaru,
          TEKNISI_PELAKSANA: nameMatch,
          GPS: gps,
          BUZZER: buzzer,
          SOS: sos,
          SENSOR_WING: sensorWing,
          CAMERA: camera,
          STATUS_SYSTEM: 'BELUM DITEST',
          NO_GPS_LAMA: noGpsLama,
          GPS_SERIAL_BARU: gpsSerialBaru,
          GPS_IMEI_BARU: gpsImeiBaru,
          NOMOR_SIM: nomorSIM,
          PROVIDER: provider,
          CATATAN_PASANG: catatanPasang,
          FOTO_KENDARAAN: fotoKendaraan,
          FOTO_GPS_LAMA: fotoGPSLama,
          FOTO_GPS_BARU: fotoGPSBaru,
          FOTO_HASIL_INSTALASI: fotoHasilInstalasi,
          LAST_UPDATE: ts
        };

        try {
          await syncUpdate(activeUnit.nopol, updates);
          
          setUnits(prev => prev.map(item => item.id === activeUnit.id ? {
            ...item,
            ...updates,
            easygoDicopot: 'SUDAH',
            statusSystem: 'BELUM DITEST',
            updatedAt: ts
          } : item));

          globalAddToast(`Laporan unit ${activeUnit.nopol} berhasil dikirim!`, 'success');
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
        } catch (err) {
          console.error(err);
          globalAddToast('Gagal mengirim ke cloud, data disimpan secara lokal.', 'warning');
          
          setUnits(prev => prev.map(item => item.id === activeUnit.id ? {
            ...item,
            ...updates,
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
        }
      };

      const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari aplikasi?')) {
          logout();
        }
      };

      return (
                                         
          {/* Header Bar */}
                                          
                                             
                                              
                {initials}
                    
                                                    
                                               {nameMatch}       
                                               Technician       
                    
                  
            
                                                  
                                                   
                                                                  
                      ONLINE       
                    
                                                  
                                             
                    
                                                  
                                              
                    
                  
                

          {/* TAB 1: Tugas Hari Ini (Today) */}
          {subTab === 'today' && (
                 
              {/* Hero Banner Card */}
                                                 
                                                    
                  <i className="ti ti-clipboard-list" style={{fontSize: 18}}>    
                        Tugas Hari Ini       
                      
                                                 
                  Berikut adalah daftar armada kendaraan yang ditugaskan kepada Anda hari ini.
                    
                    

              {/* Pinned Active Task Section */}
              {myActiveUnit && (
                                                     
                                                        
                                                       
                          Pemasangan Aktif Anda       
                        
                                                       
                                                         NOMOR POLISI       
                                                         
                                                        {myActiveUnit.pool || myActiveUnit.location || 'Nagrak Pool'}
                           
                        

                  <div className="teknisi-vehicle-nopol" style={{ marginBottom: 4 }}>
                    {myActiveUnit.nopol}
                        

                  <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 12 }}>
                    Tipe:         {myActiveUnit.merk} {myActiveUnit.model}         
                        

                  {myActiveUnit.keteranganPlanner && (
                    <div className="teknisi-quote-box" style={{ marginBottom: 12 }}>
                      &ldquo;{myActiveUnit.keteranganPlanner}&rdquo;
                          
                  )}

                                                        
                    <button 
                      className="teknisi-btn-play"
                      style={{ flex: 1.8 }}
                      onClick={() => {
                        setActiveUnitId(myActiveUnit.id);
                        setSubTab('installations');
                      }}
                    >
                                                            Lanjutkan Pemasangan
                             
                                                                                                                                                                                                                              
                                                              Lepas Klaim
                             
                        
                      
              )}

              {/* Available Tasks Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: myActiveUnit ? 24 : 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Tugas Tersedia ({queueUnits.length})
                       
                    

              {/* Search filter for mobile ease */}
              <div style={{marginBottom: 16, display: 'flex', gap: 8}}>
                <input 
                  type="text" 
                  value={q} 
                  onChange={e => setQ(e.target.value)} 
                  placeholder="Cari NOPOL..." 
                  style={{flex: 1}}
                />
                <select value={loc} onChange={e => setLoc(e.target.value)} style={{maxWidth: 130}}>
                                   Semua Site         
                  {LOCS.map(l =>                           {l}         )}
                         
                    

              {/* List of vehicle cards */}
              {queueUnits.map(u => {
                return (
                                                                   
                                                         
                                                           NOMOR POLISI       
                                                           
                                                          {u.pool || u.location || 'Nagrak Pool'}
                             
                          

                                                           
                      {u.nopol}
                          

                    {u.keteranganPlanner && (
                                                         
                        &ldquo;{u.keteranganPlanner}&rdquo;
                            
                    )}

                    <button 
                      className="teknisi-btn-play"
                      disabled={loadingClaim}
                      style={hasActiveTask ? { background: '#1F2937', color: '#94A3B8', opacity: 0.6 } : {}}
                      onClick={() => claimUnit(u)}
                    >
                                                            Mulai Pemasangan
                             
                        
                );
              })}

              {queueUnits.length === 0 && (
                <div style={{textAlign: 'center', padding: '30px 10px', background: '#111827', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', color: '#94A3B8', fontSize: 11}}>
                  Tidak ada armada kendaraan yang ditugaskan hari ini.
                      
              )}
                  
          )}

          {/* TAB 2: My Installs (Installations Form) */}
          {subTab === 'installations' && (
                 
              {!activeUnit ? (
                <div style={{textAlign: 'center', padding: '40px 20px', background: '#111827', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', color: '#94A3B8', fontSize: 12}}>
                  <i className="ti ti-tool" style={{fontSize: 28, display: 'block', marginBottom: 10, color: '#5850EC'}}>    
                  Tidak ada pemasangan aktif.      
                  Silakan pilih unit dari tab         Tugas          terlebih dahulu.
                      
              ) : (
                <div className="teknisi-vehicle-card" style={{margin: 0}}>
                  {/* Form Header */}
                  <div style={{display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
                    <button className="btn btn-secondary btn-sm" style={{padding: '4px 8px'}} onClick={goBackToList}>
                      &larr; Kembali
                             
                    <strong style={{color: '#FFF', fontSize: 14}}>{activeUnit.nopol} ({activeUnit.merk} {activeUnit.model})         
                        

                    {/* Step Progress Indicator */}
                         
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
                        {[
                          { step: 1, label: 'Hardware', icon: 'ti-qrcode' },
                          { step: 2, label: 'Pengujian', icon: 'ti-settings' },
                          { step: 3, label: 'Foto', icon: 'ti-camera' },
                          { step: 4, label: 'Review', icon: 'ti-circle-check' }
                        ].map((s) => {
                          const isActive = activeStep === s.step;
                          const isCompleted = activeStep > s.step;
                          return (
                            <div key={s.step} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative'}}>
                              <div style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                background: isActive ? '#5850EC' : isCompleted ? '#10B981' : '#1F2937',
                                color: '#FFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                                fontWeight: 700,
                                border: isActive ? '2px solid rgba(88,80,236,0.3)' : '1px solid rgba(255,255,255,0.08)',
                                marginBottom: 4,
                                zIndex: 2,
                                transition: 'all 0.3s ease'
                              }}>
                                {isCompleted ? <i className="ti ti-check" style={{fontSize: 14}}>     : <i className={`ti ${s.icon}`} style={{fontSize: 12}}>    }
                                    
                              <span style={{
                                fontSize: 9, 
                                color: isActive ? '#FFF' : '#94A3B8', 
                                fontWeight: isActive ? 700 : 500,
                                transition: 'all 0.3s ease'
                              }}>
                                {s.label}
                                     
                                  
                          );
                        })}
                            

                      {activeStep === 1 && (
                        <div className="form-section" style={{borderTop: 'none', marginTop: 0, paddingTop: 0}}>
                                                              Step 1: Identitas Hardware GPS & SIM      
                          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                                                         
                                                             No GPS Lama (Dicabut) *        
                              <div style={{display: 'flex', gap: 8}}>
                                                                                                                                                                                      
                                                                                                                                                                     Scan         
                                    
                                  

                                                         
                                                             Serial GPS Baru (SN Barcode) *        
                              <div style={{display: 'flex', gap: 8}}>
                                                                                                                                                                                           
                                                                                                                                                                     Scan         
                                    
                                  

                                                         
                                                             IMEI GPS Baru (IMEI Barcode) *        
                              <div style={{display: 'flex', gap: 8}}>
                                                                                                                                                                                     
                                                                                                                                                                     Scan         
                                    
                                  

                                                         
                                                             Nomor SIM Baru *        
                                                                                                                                                                        
                                  

                                                         
                                                             Provider SIM Card *        
                                                                                                   
                                                          Telkomsel         
                                                        Indosat         
                                                   XL         
                                                    Tri         
                                                          Smartfren         
                                       
                                  

                                                         
                                                             Catatan Pemasangan        
                                                                                                                                                                              
                                  
                                

                          {/* Navigation buttons */}
                          <div style={{marginTop: 24, display: 'flex', gap: 10}}>
                                                                                                           Tutup         
                                                                                                                                  Batal Klaim         
                            <button 
                              type="button"
                              className="btn btn-primary" 
                              style={{flex: 1.5, background: '#5850EC', border: 'none'}}
                              onClick={() => {
                                if (!String(noGpsLama || '').trim()) {
                                  globalAddToast('Kesalahan: Kolom No GPS Lama wajib diisi!', 'danger');
                                  return;
                                }
                                if (!String(gpsSerialBaru || '').trim()) {
                                  globalAddToast('Kesalahan: Kolom Serial GPS Baru wajib diisi!', 'danger');
                                  return;
                                }
                                if (!String(gpsImeiBaru || '').trim()) {
                                  globalAddToast('Kesalahan: Kolom IMEI GPS Baru wajib diisi!', 'danger');
                                  return;
                                }
                                if (!String(nomorSIM || '').trim()) {
                                  globalAddToast('Kesalahan: Kolom Nomor SIM Baru wajib diisi!', 'danger');
                                  return;
                                }
                                setActiveStep(2);
                              }}
                            >
                              Lanjut &rarr;
                                     
                                
                              
                      )}

                      {activeStep === 2 && (
                        <div className="form-section" style={{borderTop: 'none', marginTop: 0, paddingTop: 0}}>
                                                              Step 2: Pengujian Fitur      
                          
                          {isWingboxUnit && (
                                                                   
                                                                      
                                   
                                        Unit Wingbox Terdeteksi:          Sensor Wingbox wajib Terpasang agar dapat menyelesaikan migrasi.
                                    
                                  
                          )}

                          <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
                                                         
                                                             Model GPS Baru        
                                                                 
                                {['GEOTAB', 'SMA-TRACK'].map(m => (
                                  <button 
                                    type="button"
                                    key={m} 
                                    className={`teknisi-btn-option ${modelGpsBaru === m ? 'active' : ''}`}
                                    onClick={() => setModelGpsBaru(m)}
                                  >
                                    {m}
                                           
                                ))}
                                    
                                  

                                                         
                                                             GPS Status *        
                                                                 
                                {['TERPASANG', 'TIDAK TERPASANG'].map(opt => (
                                  <button 
                                    type="button"
                                    key={opt} 
                                    className={`teknisi-btn-option ${gps === opt ? (opt === 'TERPASANG' ? 'active' : 'active danger') : ''}`}
                                    onClick={() => setGps(opt)}
                                  >
                                    {opt}
                                           
                                ))}
                                    
                                  

                                                         
                                                             Buzzer *        
                                                                 
                                {['TERPASANG', 'TIDAK TERPASANG'].map(opt => (
                                  <button 
                                    type="button"
                                    key={opt} 
                                    className={`teknisi-btn-option ${buzzer === opt ? (opt === 'TERPASANG' ? 'active' : 'active danger') : ''}`}
                                    onClick={() => setBuzzer(opt)}
                                  >
                                    {opt}
                                           
                                ))}
                                    
                                  

                                                         
                                                             Tombol SOS *        
                                                                 
                                {['TERPASANG', 'TIDAK TERPASANG'].map(opt => (
                                  <button 
                                    type="button"
                                    key={opt} 
                                    className={`teknisi-btn-option ${sos === opt ? (opt === 'TERPASANG' ? 'active' : 'active danger') : ''}`}
                                    onClick={() => setSos(opt)}
                                  >
                                    {opt}
                                           
                                ))}
                                    
                                  

                                                         
                                                             Sensor Wingbox        
                                                                 
                                {['TIDAK TERPASANG', 'TERPASANG'].concat(!isWingboxUnit ? ['TIDAK ADA'] : []).map(opt => {
                                  const isActive = sensorWing === opt;
                                  let activeClass = 'active';
                                  if (opt === 'TIDAK TERPASANG' && isWingboxUnit) activeClass = 'active danger';
                                  return (
                                    <button 
                                      type="button"
                                      key={opt} 
                                      className={`teknisi-btn-option ${isActive ? activeClass : ''}`}
                                      onClick={() => setSensorWing(opt)}
                                    >
                                      {opt}
                                             
                                  );
                                })}
                                    
                                  

                                                         
                                                             Camera Status *        
                                                                 
                                {['OK', 'TIDAK TERPASANG', 'TIDAK ADA'].map(opt => {
                                  const isActive = camera === opt;
                                  let activeClass = 'active';
                                  if (opt === 'TIDAK TERPASANG') activeClass = 'active danger';
                                  return (
                                    <button 
                                      type="button"
                                      key={opt} 
                                      className={`teknisi-btn-option ${isActive ? activeClass : ''}`}
                                      onClick={() => setCamera(opt)}
                                    >
                                      {opt}
                                             
                                  );
                                })}
                                    
                                  
                                

                          {/* Navigation buttons */}
                          <div style={{marginTop: 24, display: 'flex', gap: 10}}>
                            <button type="button" className="btn btn-secondary" style={{flex: 1}} onClick={() => setActiveStep(1)}>&larr; Kembali         
                            <button 
                              type="button"
                              className="btn btn-primary" 
                              style={{flex: 1.5, background: '#5850EC', border: 'none'}}
                              onClick={() => {
                                if (isWingboxUnit && sensorWing !== 'TERPASANG') {
                                  globalAddToast('Kesalahan: Unit adalah Wingbox! Sensor Wingbox wajib Terpasang!', 'danger');
                                  return;
                                }
                                setActiveStep(3);
                              }}
                            >
                              Lanjut &rarr;
                                     
                                
                              
                      )}

                      {activeStep === 3 && (
                        <div className="form-section" style={{borderTop: 'none', marginTop: 0, paddingTop: 0}}>
                                                              Step 3: Upload Foto Dokumentasi *      
                                                      
                                                        
                              {fotoKendaraan ? (
                                <div style={{width:'100%'}}>
                                                                         
                                  <button type="button" className="btn btn-secondary btn-sm" style={{marginTop: 6, color: '#EF4444', width: '100%', border: 'none', background: 'rgba(239,68,68,0.1)'}} onClick={() => setFotoKendaraan('')}>Hapus         
                                      
                              ) : (
                                <label style={{cursor: 'pointer', display: 'block', padding: '10px 0', width: '100%'}}>
                                  <i className="ti ti-camera" style={{fontSize: 18, color: '#94A3B8'}}>    
                                  <span style={{display: 'block', fontSize: 9, fontWeight: 'bold', marginTop: 4, color: '#FFF'}}>Foto Kendaraan *       
                                  <span style={{display: 'block', fontSize: 7, color: '#94A3B8'}}>(Nopol Kelihatan)       
                                  <input type="file" accept="image/*" capture="environment" style={{display: 'none'}} onChange={e => handlePhotoChange('fotoKendaraan', e.target.files[0])} />
                                        
                              )}
                                  

                                                        
                              {fotoGPSLama ? (
                                <div style={{width:'100%'}}>
                                                                          
                                  <button type="button" className="btn btn-secondary btn-sm" style={{marginTop: 6, color: '#EF4444', width: '100%', border: 'none', background: 'rgba(239,68,68,0.1)'}} onClick={() => setFotoGPSLama('')}>Hapus         
                                      
                              ) : (
                                <label style={{cursor: 'pointer', display: 'block', padding: '10px 0', width:'100%'}}>
                                  <i className="ti ti-camera" style={{fontSize: 18, color: '#94A3B8'}}>    
                                  <span style={{display: 'block', fontSize: 9, fontWeight: 'bold', marginTop: 4, color: '#FFF'}}>Foto GPS Lama *       
                                  <span style={{display: 'block', fontSize: 7, color: '#94A3B8'}}>(Dicabut)       
                                  <input type="file" accept="image/*" capture="environment" style={{display: 'none'}} onChange={e => handlePhotoChange('fotoGPSLama', e.target.files[0])} />
                                        
                              )}
                                  

                                                        
                              {fotoGPSBaru ? (
                                <div style={{width:'100%'}}>
                                                                          
                                  <button type="button" className="btn btn-secondary btn-sm" style={{marginTop: 6, color: '#EF4444', width: '100%', border: 'none', background: 'rgba(239,68,68,0.1)'}} onClick={() => setFotoGPSBaru('')}>Hapus         
                                      
                              ) : (
                                <label style={{cursor: 'pointer', display: 'block', padding: '10px 0', width:'100%'}}>
                                  <i className="ti ti-camera" style={{fontSize: 18, color: '#94A3B8'}}>    
                                  <span style={{display: 'block', fontSize: 9, fontWeight: 'bold', marginTop: 4, color: '#FFF'}}>Foto GPS Baru *       
                                  <span style={{display: 'block', fontSize: 7, color: '#94A3B8'}}>(Barcode SN Jelas)       
                                  <input type="file" accept="image/*" capture="environment" style={{display: 'none'}} onChange={e => handlePhotoChange('fotoGPSBaru', e.target.files[0])} />
                                        
                              )}
                                  

                                                        
                              {fotoHasilInstalasi ? (
                                <div style={{width:'100%'}}>
                                                                                  
                                  <button type="button" className="btn btn-secondary btn-sm" style={{marginTop: 6, color: '#EF4444', width: '100%', border: 'none', background: 'rgba(239,68,68,0.1)'}} onClick={() => setFotoHasilInstalasi('')}>Hapus         
                                      
                              ) : (
                                <label style={{cursor: 'pointer', display: 'block', padding: '10px 0', width:'100%'}}>
                                  <i className="ti ti-camera" style={{fontSize: 18, color: '#94A3B8'}}>    
                                  <span style={{display: 'block', fontSize: 9, fontWeight: 'bold', marginTop: 4, color: '#FFF'}}>Hasil Instalasi *       
                                  <span style={{display: 'block', fontSize: 7, color: '#94A3B8'}}>(Posisi Terpasang)       
                                  <input type="file" accept="image/*" capture="environment" style={{display: 'none'}} onChange={e => handlePhotoChange('fotoHasilInstalasi', e.target.files[0])} />
                                        
                              )}
                                  
                                

                          {/* Navigation buttons */}
                          <div style={{marginTop: 24, display: 'flex', gap: 10}}>
                            <button type="button" className="btn btn-secondary" style={{flex: 1}} onClick={() => setActiveStep(2)}>&larr; Kembali         
                            <button 
                              type="button"
                              className="btn btn-primary" 
                              style={{flex: 1.5, background: '#5850EC', border: 'none'}}
                              onClick={() => {
                                if (!fotoKendaraan) {
                                  globalAddToast('Kesalahan: Foto Kendaraan wajib diunggah!', 'danger');
                                  return;
                                }
                                if (!fotoGPSLama) {
                                  globalAddToast('Kesalahan: Foto GPS Lama wajib diunggah!', 'danger');
                                  return;
                                }
                                if (!fotoGPSBaru) {
                                  globalAddToast('Kesalahan: Foto GPS Baru wajib diunggah!', 'danger');
                                  return;
                                }
                                if (!fotoHasilInstalasi) {
                                  globalAddToast('Kesalahan: Foto Hasil Instalasi wajib diunggah!', 'danger');
                                  return;
                                }
                                setActiveStep(4);
                              }}
                            >
                              Lanjut &rarr;
                                     
                                
                              
                      )}

                      {activeStep === 4 && (
                        <div className="form-section" style={{borderTop: 'none', marginTop: 0, paddingTop: 0}}>
                                                              Step 4: Review Laporan Pemasangan      
                          
                          <div style={{background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: 12, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 11}}>
                            
                                 
                              <div style={{color: '#64748B', fontWeight: 700, fontSize: 8, textTransform: 'uppercase', marginBottom: 2}}>Identitas Kendaraan & GPS      
                              <div style={{color: '#FFF'}}>{activeUnit.nopol} ({activeUnit.merk} {activeUnit.model})      
                              <div style={{color: '#94A3B8'}}>GPS Lama: <span style={{color: '#FFF', fontWeight: 600}}>{noGpsLama}             
                              <div style={{color: '#94A3B8'}}>GPS Baru (SN): <span style={{color: '#FFF', fontWeight: 600}}>{gpsSerialBaru}             
                              <div style={{color: '#94A3B8'}}>GPS Baru (IMEI): <span style={{color: '#FFF', fontWeight: 600}}>{gpsImeiBaru}             
                                  

                            <div style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10}}>
                              <div style={{color: '#64748B', fontWeight: 700, fontSize: 8, textTransform: 'uppercase', marginBottom: 2}}>SIM & Provider      
                              <div style={{color: '#FFF'}}>{provider} ({nomorSIM})      
                                  

                            <div style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10}}>
                              <div style={{color: '#64748B', fontWeight: 700, fontSize: 8, textTransform: 'uppercase', marginBottom: 2}}>Pengujian Fitur & Status      
                              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6}}>
                                <div style={{color: '#94A3B8'}}>Model GPS: <span style={{color: '#FFF'}}>{modelGpsBaru}             
                                <div style={{color: '#94A3B8'}}>Status Pasang: <span style={{color: '#F59E0B', fontWeight: 600}}>SUBMITTED             
                                <div style={{color: '#94A3B8'}}>GPS Status: <span style={{color: gps === 'TERPASANG' ? '#22C55E' : '#EF4444'}}>{gps}             
                                <div style={{color: '#94A3B8'}}>Buzzer: <span style={{color: buzzer === 'TERPASANG' ? '#22C55E' : '#EF4444'}}>{buzzer}             
                                <div style={{color: '#94A3B8'}}>Tombol SOS: <span style={{color: sos === 'TERPASANG' ? '#22C55E' : '#EF4444'}}>{sos}             
                                <div style={{color: '#94A3B8'}}>Sensor Wing: <span style={{color: sensorWing === 'TERPASANG' ? '#22C55E' : '#EF4444'}}>{sensorWing}             
                                <div style={{color: '#94A3B8'}}>Camera: <span style={{color: camera === 'OK' ? '#22C55E' : '#EF4444'}}>{camera}             
                                    
                                  

                            {catatanPasang.trim() && (
                              <div style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10}}>
                                <div style={{color: '#64748B', fontWeight: 700, fontSize: 8, textTransform: 'uppercase', marginBottom: 2}}>Catatan Pemasangan      
                                <div style={{color: '#FFF', fontStyle: 'italic'}}>&ldquo;{catatanPasang}&rdquo;      
                                    
                            )}

                            <div style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10}}>
                              <div style={{color: '#64748B', fontWeight: 700, fontSize: 8, textTransform: 'uppercase', marginBottom: 6}}>Dokumentasi Foto      
                              <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6}}>
                                <div style={{textAlign: 'center'}}>
                                  <img src={fotoKendaraan} style={{width: '100%', height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)'}} />
                                  <div style={{fontSize: 6, color: '#94A3B8', marginTop: 2}}>Kendaraan      
                                      
                                <div style={{textAlign: 'center'}}>
                                  <img src={fotoGPSLama} style={{width: '100%', height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)'}} />
                                  <div style={{fontSize: 6, color: '#94A3B8', marginTop: 2}}>GPS Lama      
                                      
                                <div style={{textAlign: 'center'}}>
                                  <img src={fotoGPSBaru} style={{width: '100%', height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)'}} />
                                  <div style={{fontSize: 6, color: '#94A3B8', marginTop: 2}}>GPS Baru      
                                      
                                <div style={{textAlign: 'center'}}>
                                  <img src={fotoHasilInstalasi} style={{width: '100%', height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)'}} />
                                  <div style={{fontSize: 6, color: '#94A3B8', marginTop: 2}}>Instalasi      
                                      
                                    
                                  

                                

                          {/* Navigation buttons */}
                          <div style={{marginTop: 24, display: 'flex', gap: 10}}>
                            <button type="button" className="btn btn-secondary" style={{flex: 1}} onClick={() => setActiveStep(3)}>&larr; Kembali         
                            <button 
                              type="button"
                              className="btn btn-primary" 
                              style={{flex: 2, background: '#22C55E', border: 'none'}}
                              disabled={loadingSubmit}
                              onClick={submitInstallation}
                            >
                              {loadingSubmit ? 'Mengirim...' : 'Kirim'}
                                     
                                
                              
                      )}
                          
                      
              )}
                  
          )}

          {/* TAB 3: Riwayat (History) */}
          {subTab === 'history' && (
                 
                                                 
                <div className="teknisi-hero-title" style={{color: '#10B981'}}>
                  <i className="ti ti-history" style={{fontSize: 18}}>    
                        Riwayat Pemasangan       
                      
                                                 
                  Berikut adalah daftar armada kendaraan yang telah selesai Anda pasang dan kirim ke IT.
                    
                    

              {historyUnits.map(u => (
                <div key={u.id} className="teknisi-vehicle-card" style={{borderLeft: '4px solid #10B981'}}>
                                                       
                    <span className="teknisi-card-label" style={{color: '#10B981'}}>SUCCESSFUL       
                                                         {u.pool || u.location}       
                        
                                                         {u.nopol}      
                  <div style={{fontSize: 11, color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: 4}}>
                         Model GPS:         {u.modelGpsBaru || 'GEOTAB'}               
                         SIM Card:         {u.nomorSIM} ({u.provider})               
                         Tgl Selesai:         {u.updatedAt}               
                        
                      
              ))}

              {historyUnits.length === 0 && (
                <div style={{textAlign: 'center', padding: '30px 10px', background: '#111827', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', color: '#94A3B8', fontSize: 11}}>
                  Belum ada riwayat pemasangan GPS yang Anda laporkan.
                      
              )}
                  
          )}

          {/* BARCODE SCANNER MODAL VIEW */}
          {isScannerOpen && (
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(5,11,26,0.95)',
              zIndex: 99999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 16
            }}>
              <div className="teknisi-vehicle-card" style={{width: '100%', maxWidth: 380, margin: 0}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
                  <strong style={{fontSize: 13, color: '#FFF'}}>Scan Barcode SN / IMEI         
                  <button style={{background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 18}} onClick={stopScanning}>
                                               
                           
                      
                <div id="scanner-view" style={{width: '100%', minHeight: 230, background: '#000', borderRadius: 8, overflow: 'hidden'}}>      
                <div style={{display: 'flex', gap: 10, marginTop: 16}}>
                  <button className="btn btn-secondary" style={{flex: 1, height: 36}} onClick={simulateScan}>Simulasi Scan         
                  <button className="btn btn-secondary" style={{flex: 1, height: 36, color: '#EF4444'}} onClick={stopScanning}>Batal         
                      
                    
                  
          )}

          {/* Fixed Premium Bottom Navigation Bar (Matches screenshot layout) */}
                                           
            <button 
              className={`teknisi-nav-item ${subTab === 'today' ? 'active' : ''}`} 
              onClick={() => {
                if (isScannerOpen) stopScanning();
                setSubTab('today');
              }}
            >
                                                      
                    Tugas       
                     
            <button 
              className={`teknisi-nav-item ${subTab === 'installations' ? 'active' : ''}`} 
              onClick={() => {
                if (isScannerOpen) stopScanning();
                setSubTab('installations');
              }}
            >
                                            
                    My Installs       
                     
            <button 
              className={`teknisi-nav-item ${subTab === 'history' ? 'active' : ''}`} 
              onClick={() => {
                if (isScannerOpen) stopScanning();
                setSubTab('history');
              }}
            >
                                                    
                    History       
                     
                                                                                                                   
                                              
                    Logout       
                     
                
              
      );
    }


    


    


    


    


    


    


    


    


    


    


    


    


    


    


    


    

    // 4. Verifikasi View

    

      

      

        // 4. Verifikasi View
    // 4. PIC Lapangan View
    function PICLapanganView({ units, setUnits, syncUpdate, isMobile }) {
      const [q, setQ] = useState('');
      const [loc, setLoc] = useState('');
      const [page, setPage] = useState(1);
      
      const [editId, setEditId] = useState(null);
      
      // Form states
      const [picCekFisikLama, setPicCekFisikLama] = useState('OK');
      const [picCekFisikBaru, setPicCekFisikBaru] = useState('OK');
      const [picCekKondisiSelesai, setPicCekKondisiSelesai] = useState('OK');
      const [picCekFitur, setPicCekFitur] = useState('OK');
      const [picFotoSerahTerima, setPicFotoSerahTerima] = useState('');
      const [loadingSubmit, setLoadingSubmit] = useState(false);

      const filtered = useMemo(() => {
        return units.filter(u => 
          u.statusPasang === 'TEKNISI SUBMITTED' &&
          (!q || u.nopol.toLowerCase().includes(q.toLowerCase())) &&
          (!loc || u.location === loc)
        );
      }, [units, q, loc]);

      const total = Math.ceil(filtered.length / PAGE_LIMIT);
      const slice = filtered.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

      const handlePhotoChange = (file) => {
        if (!file) return;
        globalAddToast('Mengompresi foto...', 'info');
        const reader = new FileReader();
        reader.onload = (e) => {
          const originalBase64 = e.target.result;
          const img = new Image();
          img.onload = () => {
            try {
              const maxDim = 800;
              let w = img.width;
              let h = img.height;
              if (w > maxDim || h > maxDim) {
                if (w > h) {
                  h = Math.round((h * maxDim) / w);
                  w = maxDim;
                } else {
                  w = Math.round((w * maxDim) / h);
                  h = maxDim;
                }
              }
              const canvas = document.createElement('canvas');
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, w, h);
              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
              setPicFotoSerahTerima(compressedBase64);
              globalAddToast('Foto berhasil ditambahkan!', 'success');
            } catch (canvasErr) {
              setPicFotoSerahTerima(originalBase64);
              globalAddToast('Foto berhasil ditambahkan (tanpa kompresi)!', 'success');
            }
          };
          img.onerror = () => {
            setPicFotoSerahTerima(originalBase64);
            globalAddToast('Foto berhasil ditambahkan!', 'success');
          };
          img.src = originalBase64;
        };
        reader.readAsDataURL(file);
      };

      const save = async (id) => {
        const unit = units.find(u => u.id === id);
        if (!picFotoSerahTerima) {
          globalAddToast('Kesalahan: Foto bukti penyerahan GPS lama wajib diunggah!', 'danger');
          return;
        }

        setLoadingSubmit(true);
        const now = new Date();
        const dd = n => String(n).padStart(2, '0');
        const ts = `${dd(now.getDate())}-${dd(now.getMonth() + 1)}-${now.getFullYear()} ${dd(now.getHours())}:${dd(now.getMinutes())}`;

        const updates = {
          STATUS_PASANG: 'PIC VERIFIED',
          CEK_FISIK_GPS_LAMA: picCekFisikLama,
          CEK_FISIK_GPS_BARU: picCekFisikBaru,
          CEK_KONDISI_UNIT_SELESAI_INSTALASI: picCekKondisiSelesai,
          CEK_FITUR_SENSOR_SOS_CAMERA: picCekFitur,
          FOTO_BUKTI_PENYERAHAN_GPS_LAMA: picFotoSerahTerima,
          LAST_UPDATE: ts
        };

        try {
          await syncUpdate(unit.nopol, updates);
          setUnits(prev => prev.map(u => u.id === id ? {
            ...u,
            statusPasang: 'PIC VERIFIED',
            picCekFisikLama,
            picCekFisikBaru,
            picCekKondisiSelesai,
            picCekFitur,
            picFotoSerahTerima,
            updatedAt: ts
          } : u));
          setEditId(null);
          setPicFotoSerahTerima('');
          globalAddToast(`Verifikasi PIC Lapangan NOPOL ${unit.nopol} berhasil dikirim!`, 'success');
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingSubmit(false);
        }
      };

      const editingUnit = units.find(u => u.id === editId);

      return (
                                 
                                           
                                                     
                          Role: PIC Lapangan          — Verifikasi fisik hardware, kelayakan fungsi, dan penyerahan GPS lama.       
                

          {!editId ? (
            <>
                         
                                                      
                                                  
                  <input type="text" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} className="search-input" placeholder="Cari NOPOL..." />
                      
                <select value={loc} onChange={e => { setLoc(e.target.value); setPage(1); }} className="filter-select">
                                   Semua Lokasi         
                  {LOCS.map(l =>                           {l}         )}
                         
                                                 {filtered.length} Unit Menunggu Verifikasi PIC       
                          

              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-tertiary)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: 12 }}>
                  <i className="ti ti-checklist" style={{ fontSize: 32, display: 'block', marginBottom: 10, color: 'var(--text-tertiary)' }}>    
                  Tidak ada unit berstatus TEKNISI SUBMITTED yang membutuhkan verifikasi PIC Lapangan.
                      
              ) : isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                  {slice.map(u => (
                    <div key={u.id} className="mobile-unit-card" style={{ padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: 15 }}>{u.nopol}         
                                                      
                            
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>
                             Site: {u.location} • Pool: {u.pool}      
                             Teknisi:         {u.teknisiPelaksana || '—'}               
                            
                      <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: 12, justifyContent: 'center' }} onClick={() => { setEditId(u.id); setPicCekFisikLama('OK'); setPicCekFisikBaru('OK'); setPicCekKondisiSelesai('OK'); setPicCekFitur('OK'); setPicFotoSerahTerima(''); }}>
                                                                  Mulai Verifikasi
                               
                          
                  ))}
                      
              ) : (
                <div className="table-container" style={{ marginTop: 12 }}>
                                                
                           
                          
                            #     
                            NOPOL     
                            BUSINESS LOCATION     
                            BUSINESS POOL     
                            TEKNISI     
                            SN GPS BARU     
                            AKSI     
                           
                            
                           
                      {slice.map((u, i) => (
                                       
                                                     {(page - 1) * PAGE_LIMIT + i + 1}     
                                      {u.nopol}              
                              {u.location}     
                              {u.pool}     
                              {u.teknisiPelaksana || '—'}     
                                    {u.gpsSerialBaru || '—'}            
                              
                            <button className="btn btn-primary btn-sm" onClick={() => { setEditId(u.id); setPicCekFisikLama('OK'); setPicCekFisikBaru('OK'); setPicCekKondisiSelesai('OK'); setPicCekFitur('OK'); setPicFotoSerahTerima(''); }}>
                                                                        Verifikasi
                                     
                               
                             
                      ))}
                            
                          
                      
              )}
              {filtered.length > 0 &&                                                               }
            </>
          ) : (
            <div className="panel-card fade-in" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Form Verifikasi PIC Lapangan: {editingUnit.nopol}       
                                                                                             Batal         
                    

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: 14, border: '1px solid var(--border-color)', fontSize: 12 }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>Rangkuman Instalasi Teknisi ({editingUnit.teknisiPelaksana})     
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                           Nopol:         {editingUnit.nopol}               
                           GPS Model:         {editingUnit.modelGpsBaru}               
                           SN GPS Baru:       {editingUnit.gpsSerialBaru}             
                           IMEI GPS Baru:       {editingUnit.gpsImeiBaru}             
                           No SIM:         {editingUnit.nomorSIM} ({editingUnit.provider})               
                           Catatan:                              {editingUnit.catatanPasang || '—'}             
                          
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12 }}>
                           
                        <span style={{ fontSize: 9, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>GPS       
                                                       
                            
                           
                        <span style={{ fontSize: 9, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Buzzer       
                                                          
                            
                           
                        <span style={{ fontSize: 9, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>SOS       
                                                       
                            
                           
                        <span style={{ fontSize: 9, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Wingbox       
                                                              
                            
                          
                        

                                               
                                                   Cek Fisik GPS Lama (Cabutan) *        
                                                       
                      {['OK', 'NOT OK'].map(o => (
                        <button type="button" key={o} className={`teknisi-btn-option ${picCekFisikLama === o ? (o === 'OK' ? 'active' : 'active danger') : ''}`} onClick={() => setPicCekFisikLama(o)}>
                          {o}
                                 
                      ))}
                          
                        

                                               
                                                   Cek Fisik GPS Baru *        
                                                       
                      {['OK', 'NOT OK'].map(o => (
                        <button type="button" key={o} className={`teknisi-btn-option ${picCekFisikBaru === o ? (o === 'OK' ? 'active' : 'active danger') : ''}`} onClick={() => setPicCekFisikBaru(o)}>
                          {o}
                                 
                      ))}
                          
                        

                                               
                                                   Cek Kondisi Unit Selesai Pemasangan *        
                                                       
                      {['OK', 'NOT OK'].map(o => (
                        <button type="button" key={o} className={`teknisi-btn-option ${picCekKondisiSelesai === o ? (o === 'OK' ? 'active' : 'active danger') : ''}`} onClick={() => setPicCekKondisiSelesai(o)}>
                          {o}
                                 
                      ))}
                          
                        

                                               
                                                   Cek Fitur (Sensor, SOS, Camera) *        
                                                       
                      {['OK', 'NOT OK'].map(o => (
                        <button type="button" key={o} className={`teknisi-btn-option ${picCekFitur === o ? (o === 'OK' ? 'active' : 'active danger') : ''}`} onClick={() => setPicCekFitur(o)}>
                          {o}
                                 
                      ))}
                          
                        
                      

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="photo-card" style={{ height: 230, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 8, background: 'var(--bg-primary)' }}>
                    {picFotoSerahTerima ? (
                      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <img src={picFotoSerahTerima} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 6 }} alt="Serah Terima" />
                        <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 8, right: 8, color: '#EF4444', border: 'none', background: 'rgba(239,68,68,0.2)' }} onClick={() => setPicFotoSerahTerima('')}>Hapus         
                            
                    ) : (
                      <label style={{ cursor: 'pointer', textAlign: 'center', padding: 20 }}>
                        <i className="ti ti-camera" style={{ fontSize: 32, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>    
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#FFF' }}>Upload Bukti Penyerahan GPS Lama *       
                        <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => handlePhotoChange(e.target.files[0])} />
                              
                    )}
                        

                  <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditId(null)}>Batal         
                    <button className="btn btn-primary" style={{ flex: 1.5, justifyContent: 'center' }} disabled={loadingSubmit || !picFotoSerahTerima} onClick={() => save(editingUnit.id)}>
                      {loadingSubmit ? 'Mengirim...' : 'Kirim Verifikasi'}
                             
                        
                      
                    
                  
          )}
              
      );
    }

    // 4b. IT View
    function ITView({ units, setUnits, syncUpdate, isMobile }) {
      const [q, setQ] = useState('');
      const [loc, setLoc] = useState('');
      const [page, setPage] = useState(1);
      
      const [editId, setEditId] = useState(null);
      
      // Form states
      const [itCekAplikasi, setItCekAplikasi] = useState('OK');
      const [itFotoIntegrasi, setItFotoIntegrasi] = useState('');
      const [itFotoAbnormality, setItFotoAbnormality] = useState('');
      const [loadingSubmit, setLoadingSubmit] = useState(false);

      const filtered = useMemo(() => {
        return units.filter(u => 
          u.statusPasang === 'PIC VERIFIED' &&
          (!q || u.nopol.toLowerCase().includes(q.toLowerCase())) &&
          (!loc || u.location === loc)
        );
      }, [units, q, loc]);

      const total = Math.ceil(filtered.length / PAGE_LIMIT);
      const slice = filtered.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

      const handlePhotoChange = (fieldName, file) => {
        if (!file) return;
        globalAddToast('Mengompresi foto...', 'info');
        const reader = new FileReader();
        reader.onload = (e) => {
          const originalBase64 = e.target.result;
          const img = new Image();
          img.onload = () => {
            try {
              const maxDim = 800;
              let w = img.width;
              let h = img.height;
              if (w > maxDim || h > maxDim) {
                if (w > h) {
                  h = Math.round((h * maxDim) / w);
                  w = maxDim;
                } else {
                  w = Math.round((w * maxDim) / h);
                  h = maxDim;
                }
              }
              const canvas = document.createElement('canvas');
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, w, h);
              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
              if (fieldName === 'itFotoIntegrasi') setItFotoIntegrasi(compressedBase64);
              if (fieldName === 'itFotoAbnormality') setItFotoAbnormality(compressedBase64);
              globalAddToast('Foto berhasil ditambahkan!', 'success');
            } catch (canvasErr) {
              if (fieldName === 'itFotoIntegrasi') setItFotoIntegrasi(originalBase64);
              if (fieldName === 'itFotoAbnormality') setItFotoAbnormality(originalBase64);
              globalAddToast('Foto berhasil ditambahkan (tanpa kompresi)!', 'success');
            }
          };
          img.onerror = () => {
            if (fieldName === 'itFotoIntegrasi') setItFotoIntegrasi(originalBase64);
            if (fieldName === 'itFotoAbnormality') setItFotoAbnormality(originalBase64);
            globalAddToast('Foto berhasil ditambahkan!', 'success');
          };
          img.src = originalBase64;
        };
        reader.readAsDataURL(file);
      };

      const save = async (id) => {
        const unit = units.find(u => u.id === id);
        if (!itFotoIntegrasi) {
          globalAddToast('Kesalahan: Foto integrasi data GPS wajib diunggah!', 'danger');
          return;
        }
        if (!itFotoAbnormality) {
          globalAddToast('Kesalahan: Foto integrasi data abnormality wajib diunggah!', 'danger');
          return;
        }

        setLoadingSubmit(true);
        const now = new Date();
        const dd = n => String(n).padStart(2, '0');
        const ts = `${dd(now.getDate())}-${dd(now.getMonth() + 1)}-${now.getFullYear()} ${dd(now.getHours())}:${dd(now.getMinutes())}`;

        const updates = {
          STATUS_PASANG: 'IT VERIFIED',
          "CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK) - IT": itCekAplikasi,
          FOTO_INTEGRASI_DATA_GPS_KE_PUNINAR: itFotoIntegrasi,
          FOTO_INTEGRASI_DATA_ABNORMALITY_KE_PUNINAR: itFotoAbnormality,
          LAST_UPDATE: ts
        };

        try {
          await syncUpdate(unit.nopol, updates);
          setUnits(prev => prev.map(u => u.id === id ? {
            ...u,
            statusPasang: 'IT VERIFIED',
            itCekAplikasi,
            itFotoIntegrasi,
            itFotoAbnormality,
            updatedAt: ts
          } : u));
          setEditId(null);
          setItFotoIntegrasi('');
          setItFotoAbnormality('');
          globalAddToast(`Verifikasi IT NOPOL ${unit.nopol} berhasil dikirim!`, 'success');
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingSubmit(false);
        }
      };

      const editingUnit = units.find(u => u.id === editId);

      return (
                                 
                                          
                                                              
                          Role: IT Puninar          — Verifikasi integrasi data GPS (Temon / Geotab / Smatrack) ke database internal Puninar.       
                

          {!editId ? (
            <>
                         
                                                      
                                                  
                  <input type="text" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} className="search-input" placeholder="Cari NOPOL..." />
                      
                <select value={loc} onChange={e => { setLoc(e.target.value); setPage(1); }} className="filter-select">
                                   Semua Lokasi         
                  {LOCS.map(l =>                           {l}         )}
                         
                                                 {filtered.length} Unit Menunggu IT       
                          

              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-tertiary)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: 12 }}>
                  <i className="ti ti-checklist" style={{ fontSize: 32, display: 'block', marginBottom: 10, color: 'var(--text-tertiary)' }}>    
                  Tidak ada unit berstatus PIC VERIFIED yang membutuhkan verifikasi IT.
                      
              ) : isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                  {slice.map(u => (
                    <div key={u.id} className="mobile-unit-card" style={{ padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: 15 }}>{u.nopol}         
                                                      
                            
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>
                             Site: {u.location} • Pool: {u.pool}      
                             PIC Lapangan:         {u.picLapangan || '—'}               
                            
                      <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: 12, justifyContent: 'center' }} onClick={() => { setEditId(u.id); setItCekAplikasi('OK'); setItFotoIntegrasi(''); setItFotoAbnormality(''); }}>
                                                                  Mulai Verifikasi IT
                               
                          
                  ))}
                      
              ) : (
                <div className="table-container" style={{ marginTop: 12 }}>
                                                
                           
                          
                            #     
                            NOPOL     
                            LOCATION     
                            PIC LAPANGAN     
                            TEKNISI     
                            SN GPS BARU     
                            AKSI     
                           
                            
                           
                      {slice.map((u, i) => (
                                       
                                                     {(page - 1) * PAGE_LIMIT + i + 1}     
                                      {u.nopol}              
                              {u.location}     
                              {u.picLapangan || '—'}     
                              {u.teknisiPelaksana || '—'}     
                                    {u.gpsSerialBaru || '—'}            
                              
                            <button className="btn btn-primary btn-sm" onClick={() => { setEditId(u.id); setItCekAplikasi('OK'); setItFotoIntegrasi(''); setItFotoAbnormality(''); }}>
                                                                        Verifikasi IT
                                     
                               
                             
                      ))}
                            
                          
                      
              )}
              {filtered.length > 0 &&                                                               }
            </>
          ) : (
            <div className="panel-card fade-in" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Form Verifikasi IT: {editingUnit.nopol}       
                                                                                             Batal         
                    

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: 14, border: '1px solid var(--border-color)', fontSize: 12 }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>Rangkuman Lapangan     
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                           Nopol:         {editingUnit.nopol}               
                           Tipe:         {editingUnit.merk} {editingUnit.assetType}               
                           GPS Baru:       {editingUnit.gpsSerialBaru}             
                           Teknisi:         {editingUnit.teknisiPelaksana}               
                           PIC Lapangan:         {editingUnit.picLapangan}               
                           Cek Fisik GPS Lama:                                                  
                           Cek Fisik GPS Baru:                                                  
                           Cek Fitur Lapangan:                                              
                          
                        

                                               
                                                   Cek Unit di Aplikasi (TEMON / GEOTAB / SMATRACK) *        
                                                       
                      {['OK', 'NOT OK'].map(o => (
                        <button type="button" key={o} className={`teknisi-btn-option ${itCekAplikasi === o ? (o === 'OK' ? 'active' : 'active danger') : ''}`} onClick={() => setItCekAplikasi(o)}>
                          {o}
                                 
                      ))}
                          
                        
                      

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="photo-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
                    <div className="photo-card" style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 8, background: 'var(--bg-primary)' }}>
                      {itFotoIntegrasi ? (
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                          <img src={itFotoIntegrasi} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 6 }} alt="Integrasi GPS" />
                          <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 8, right: 8, color: '#EF4444', border: 'none', background: 'rgba(239,68,68,0.2)' }} onClick={() => setItFotoIntegrasi('')}>Hapus         
                              
                      ) : (
                        <label style={{ cursor: 'pointer', textAlign: 'center', padding: 10 }}>
                          <i className="ti ti-camera" style={{ fontSize: 24, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>    
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#FFF' }}>Foto Integrasi Data GPS *       
                          <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => handlePhotoChange('itFotoIntegrasi', e.target.files[0])} />
                                
                      )}
                          

                    <div className="photo-card" style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 8, background: 'var(--bg-primary)' }}>
                      {itFotoAbnormality ? (
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                          <img src={itFotoAbnormality} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 6 }} alt="Integrasi Abnormality" />
                          <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 8, right: 8, color: '#EF4444', border: 'none', background: 'rgba(239,68,68,0.2)' }} onClick={() => setItFotoAbnormality('')}>Hapus         
                              
                      ) : (
                        <label style={{ cursor: 'pointer', textAlign: 'center', padding: 10 }}>
                          <i className="ti ti-camera" style={{ fontSize: 24, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>    
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#FFF' }}>Foto Integrasi Abnormality *       
                          <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => handlePhotoChange('itFotoAbnormality', e.target.files[0])} />
                                
                      )}
                          
                        

                  <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditId(null)}>Batal         
                    <button className="btn btn-primary" style={{ flex: 1.5, justifyContent: 'center' }} disabled={loadingSubmit || !itFotoIntegrasi || !itFotoAbnormality} onClick={() => save(editingUnit.id)}>
                      {loadingSubmit ? 'Mengirim...' : 'Kirim IT Verifikasi'}
                             
                        
                      
                    
                  
          )}
              
      );
    }

    // 4c. CMT View
    function CMTView({ units, setUnits, syncUpdate, isMobile }) {
      const [q, setQ] = useState('');
      const [loc, setLoc] = useState('');
      const [page, setPage] = useState(1);
      
      const [editId, setEditId] = useState(null);
      
      // Form states
      const [cmtCekAplikasi, setCmtCekAplikasi] = useState('OK');
      const [cmtFotoTerimaFisik, setCmtFotoTerimaFisik] = useState('');
      const [cmtFotoTerminasi, setCmtFotoTerminasi] = useState('');
      const [loadingSubmit, setLoadingSubmit] = useState(false);

      const filtered = useMemo(() => {
        return units.filter(u => 
          u.statusPasang === 'IT VERIFIED' &&
          (!q || u.nopol.toLowerCase().includes(q.toLowerCase())) &&
          (!loc || u.location === loc)
        );
      }, [units, q, loc]);

      const total = Math.ceil(filtered.length / PAGE_LIMIT);
      const slice = filtered.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

      const handlePhotoChange = (fieldName, file) => {
        if (!file) return;
        globalAddToast('Mengompresi foto...', 'info');
        const reader = new FileReader();
        reader.onload = (e) => {
          const originalBase64 = e.target.result;
          const img = new Image();
          img.onload = () => {
            try {
              const maxDim = 800;
              let w = img.width;
              let h = img.height;
              if (w > maxDim || h > maxDim) {
                if (w > h) {
                  h = Math.round((h * maxDim) / w);
                  w = maxDim;
                } else {
                  w = Math.round((w * maxDim) / h);
                  h = maxDim;
                }
              }
              const canvas = document.createElement('canvas');
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, w, h);
              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
              if (fieldName === 'cmtFotoTerimaFisik') setCmtFotoTerimaFisik(compressedBase64);
              if (fieldName === 'cmtFotoTerminasi') setCmtFotoTerminasi(compressedBase64);
              globalAddToast('Foto berhasil ditambahkan!', 'success');
            } catch (canvasErr) {
              if (fieldName === 'cmtFotoTerimaFisik') setCmtFotoTerimaFisik(originalBase64);
              if (fieldName === 'cmtFotoTerminasi') setCmtFotoTerminasi(originalBase64);
              globalAddToast('Foto berhasil ditambahkan (tanpa kompresi)!', 'success');
            }
          };
          img.onerror = () => {
            if (fieldName === 'cmtFotoTerimaFisik') setCmtFotoTerimaFisik(originalBase64);
            if (fieldName === 'cmtFotoTerminasi') setCmtFotoTerminasi(originalBase64);
            globalAddToast('Foto berhasil ditambahkan!', 'success');
          };
          img.src = originalBase64;
        };
        reader.readAsDataURL(file);
      };

      const save = async (id) => {
        const unit = units.find(u => u.id === id);
        if (!cmtFotoTerimaFisik) {
          globalAddToast('Kesalahan: Foto terima fisik GPS lama wajib diunggah!', 'danger');
          return;
        }
        if (!cmtFotoTerminasi) {
          globalAddToast('Kesalahan: Foto bukti terminasi GPS lama wajib diunggah!', 'danger');
          return;
        }

        setLoadingSubmit(true);
        const now = new Date();
        const dd = n => String(n).padStart(2, '0');
        const ts = `${dd(now.getDate())}-${dd(now.getMonth() + 1)}-${now.getFullYear()} ${dd(now.getHours())}:${dd(now.getMinutes())}`;

        const updates = {
          STATUS_PASANG: 'DONE',
          "CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK) - CMT": cmtCekAplikasi,
          FOTO_TERIMA_FISIK_GPS_LAMA: cmtFotoTerimaFisik,
          FOTO_BUKTI_TERMINASI_GPS_LAMA: cmtFotoTerminasi,
          LAST_UPDATE: ts
        };

        try {
          await syncUpdate(unit.nopol, updates);
          setUnits(prev => prev.map(u => u.id === id ? {
            ...u,
            statusPasang: 'DONE',
            cmtCekAplikasi,
            cmtFotoTerimaFisik,
            cmtFotoTerminasi,
            updatedAt: ts
          } : u));
          setEditId(null);
          setCmtFotoTerimaFisik('');
          setCmtFotoTerminasi('');
          globalAddToast(`Verifikasi CMT NOPOL ${unit.nopol} berhasil diselesaikan! Migrasi Lengkap.`, 'success');
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingSubmit(false);
        }
      };

      const editingUnit = units.find(u => u.id === editId);

      return (
                                 
                                           
                                                  
                          Role: CMT          — Verifikasi final penerimaan fisik GPS lama, terminasi sistem GPS lama, dan penutupan migrasi GPS.       
                

          {!editId ? (
            <>
                         
                                                      
                                                  
                  <input type="text" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} className="search-input" placeholder="Cari NOPOL..." />
                      
                <select value={loc} onChange={e => { setLoc(e.target.value); setPage(1); }} className="filter-select">
                                   Semua Lokasi         
                  {LOCS.map(l =>                           {l}         )}
                         
                                                 {filtered.length} Unit Menunggu CMT       
                          

              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-tertiary)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: 12 }}>
                  <i className="ti ti-checklist" style={{ fontSize: 32, display: 'block', marginBottom: 10, color: 'var(--text-tertiary)' }}>    
                  Tidak ada unit berstatus IT VERIFIED yang membutuhkan verifikasi final CMT.
                      
              ) : isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                  {slice.map(u => (
                    <div key={u.id} className="mobile-unit-card" style={{ padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: 15 }}>{u.nopol}         
                                                      
                            
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>
                             Site: {u.location} • Pool: {u.pool}      
                             IT Verified By:         IT Team               
                            
                      <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: 12, justifyContent: 'center' }} onClick={() => { setEditId(u.id); setCmtCekAplikasi('OK'); setCmtFotoTerimaFisik(''); setCmtFotoTerminasi(''); }}>
                                                                  Mulai Verifikasi Final
                               
                          
                  ))}
                      
              ) : (
                <div className="table-container" style={{ marginTop: 12 }}>
                                                
                           
                          
                            #     
                            NOPOL     
                            LOCATION     
                            POOL     
                            TEKNISI     
                            PIC     
                            IT STATUS     
                            AKSI     
                           
                            
                           
                      {slice.map((u, i) => (
                                       
                                                     {(page - 1) * PAGE_LIMIT + i + 1}     
                                      {u.nopol}              
                              {u.location}     
                              {u.pool}     
                              {u.teknisiPelaksana || '—'}     
                              {u.picLapangan || '—'}     
                                                                                          
                              
                            <button className="btn btn-primary btn-sm" onClick={() => { setEditId(u.id); setCmtCekAplikasi('OK'); setCmtFotoTerimaFisik(''); setCmtFotoTerminasi(''); }}>
                                                                        Verifikasi CMT
                                     
                               
                             
                      ))}
                            
                          
                      
              )}
              {filtered.length > 0 &&                                                               }
            </>
          ) : (
            <div className="panel-card fade-in" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Form Verifikasi Final CMT: {editingUnit.nopol}       
                                                                                             Batal         
                    

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: 14, border: '1px solid var(--border-color)', fontSize: 12 }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>Riwayat Alur Migrasi     
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                           Nopol:         {editingUnit.nopol}               
                           Tipe:         {editingUnit.merk} {editingUnit.assetType}               
                           SN GPS Baru:       {editingUnit.gpsSerialBaru}             
                           IMEI GPS Baru:       {editingUnit.gpsImeiBaru}             
                           Teknisi:         {editingUnit.teknisiPelaksana}               
                           PIC Lapangan:         {editingUnit.picLapangan}               
                           Cek Fisik GPS Lama:                                                  
                           Cek Fisik GPS Baru:                                                  
                           Cek Fitur Lapangan:                                              
                           Cek IT Aplikasi:                                                
                          
                        

                                               
                                                   Cek Unit di Aplikasi (TEMON / GEOTAB / SMATRACK) *        
                                                       
                      {['OK', 'NOT OK'].map(o => (
                        <button type="button" key={o} className={`teknisi-btn-option ${cmtCekAplikasi === o ? (o === 'OK' ? 'active' : 'active danger') : ''}`} onClick={() => setCmtCekAplikasi(o)}>
                          {o}
                                 
                      ))}
                          
                        
                      

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="photo-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
                    <div className="photo-card" style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 8, background: 'var(--bg-primary)' }}>
                      {cmtFotoTerimaFisik ? (
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                          <img src={cmtFotoTerimaFisik} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 6 }} alt="Terima Fisik GPS Lama" />
                          <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 8, right: 8, color: '#EF4444', border: 'none', background: 'rgba(239,68,68,0.2)' }} onClick={() => setCmtFotoTerimaFisik('')}>Hapus         
                              
                      ) : (
                        <label style={{ cursor: 'pointer', textAlign: 'center', padding: 10 }}>
                          <i className="ti ti-camera" style={{ fontSize: 24, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>    
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#FFF' }}>Foto Terima Fisik GPS Lama *       
                          <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => handlePhotoChange('cmtFotoTerimaFisik', e.target.files[0])} />
                                
                      )}
                          

                    <div className="photo-card" style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: 8, background: 'var(--bg-primary)' }}>
                      {cmtFotoTerminasi ? (
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                          <img src={cmtFotoTerminasi} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 6 }} alt="Terminasi GPS Lama" />
                          <button type="button" className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 8, right: 8, color: '#EF4444', border: 'none', background: 'rgba(239,68,68,0.2)' }} onClick={() => setCmtFotoTerminasi('')}>Hapus         
                              
                      ) : (
                        <label style={{ cursor: 'pointer', textAlign: 'center', padding: 10 }}>
                          <i className="ti ti-camera" style={{ fontSize: 24, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>    
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#FFF' }}>Foto Bukti Terminasi GPS Lama *       
                          <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => handlePhotoChange('cmtFotoTerminasi', e.target.files[0])} />
                                
                      )}
                          
                        

                  <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditId(null)}>Batal         
                    <button className="btn btn-primary" style={{ flex: 1.5, justifyContent: 'center' }} disabled={loadingSubmit || !cmtFotoTerimaFisik || !cmtFotoTerminasi} onClick={() => save(editingUnit.id)}>
                      {loadingSubmit ? 'Mengirim...' : 'Selesaikan Migrasi'}
                             
                        
                      
                    
                  
          )}
              
      );
    }
    function RekapView({ units, isMobile }) {
      const [subTab, setSubTab] = useState('summary');
      const [q, setQ] = useState('');
      const [loc, setLoc] = useState('');
      const [statusFilter, setStatusFilter] = useState('');
      const [page, setPage] = useState(1);

      const rekapData = useMemo(() => {
        return LOCS.map(loc => {
          const all = units.filter(u => u.location === loc);
          const plan = all.filter(u => u.statusPlan === 'PLAN').length;
          const done = all.filter(u => u.statusPasang === 'DONE').length;
          const activeProgress = all.filter(u => ['ON PROGRESS', 'TEKNISI SUBMITTED', 'PIC VERIFIED', 'IT VERIFIED'].includes(u.statusPasang)).length;
          const pct = all.length ? Math.round((done / all.length) * 100) : 0;
          return { loc, total: all.length, plan, unplan: all.length - plan, done, prog: activeProgress, pct };
        });
      }, [units]);

      const filteredUnits = useMemo(() => {
        return units.filter(u => 
          (!q || u.nopol.toLowerCase().includes(q.toLowerCase())) &&
          (!loc || u.location === loc) &&
          (!statusFilter || u.statusPasang === statusFilter)
        );
      }, [units, q, loc, statusFilter]);

      const totalPages = Math.ceil(filteredUnits.length / PAGE_LIMIT);
      const paginatedUnits = filteredUnits.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

      return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
            <button className={`btn ${subTab === 'summary' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSubTab('summary')} style={{ height: 36, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                  Ringkasan per Site
                     
            <button className={`btn ${subTab === 'details' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setSubTab('details'); setPage(1); }} style={{ height: 36, display: 'flex', alignItems: 'center', gap: 6 }}>
                                              Detail 39 Kolom Database
                     
                

          {subTab === 'summary' ? (
                                        
              <div className="panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                   Rekap Migrasi GPS per Site Lokasi
                       
                                                                                                                                                        
                                                     Ekspor Semua GPS (CSV)
                         
                    
              {isMobile ? (
                <div className="mobile-unit-list" style={{ marginTop: 10 }}>
                  {rekapData.map(d => (
                    <div key={d.loc} className="mobile-unit-card" style={{ padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{d.loc}       
                        <span className="badge info" style={{ fontSize: 10, padding: '2px 8px', fontWeight: 600 }}>{d.total} Unit       
                            
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', fontSize: 11, borderTop: '1px solid var(--border-color)', paddingTop: 10, paddingBottom: 10, marginBottom: 10 }}>
                             
                          <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: 9, fontWeight: 600 }}>PLAN / UNPLAN       
                                  {d.plan}          <span style={{ color: 'var(--text-tertiary)' }}>/ {d.unplan}       
                              
                             
                          <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: 9, fontWeight: 600 }}>DONE MIGRASI       
                          <strong style={{ color: 'var(--color-done)' }}>{d.done}         
                              
                             
                          <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: 9, fontWeight: 600 }}>ON PROGRESS / VERIF       
                          <strong style={{ color: 'var(--color-progress)' }}>{d.prog}         
                              
                            
                      
                      <div style={{ borderTop: '1px solid var(--bg-secondary)', paddingTop: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 600, marginBottom: 4 }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Persentase Selesai       
                          <span style={{ color: 'var(--color-done)' }}>{d.pct}%       
                              
                        <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${d.pct}%`, height: '100%', background: 'var(--color-done)' }} />
                              
                            
                          
                  ))}
                      
              ) : (
                <div className="table-container" style={{boxShadow:'none', border:'none', margin:0}}>
                                                
                           
                          
                            LOKASI SITE     
                                                    TOTAL UNIT     
                                                    PLAN     
                                                    UNPLAN     
                                                    DONE (MIGRASI)     
                                                    ON PROGRESS / VERIF     
                        <th style={{ width: 180 }}>PERSENTASE SELESAI     
                           
                            
                           
                      {rekapData.map(d => (
                                        
                                      {d.loc}              
                          <td className="text-center" style={{fontWeight:600}}>{d.total}     
                                                      {d.plan}     
                                                                 {d.unplan}     
                          <td className="text-center" style={{color:'var(--color-done)', fontWeight:700}}>{d.done}     
                          <td className="text-center" style={{color:'var(--color-progress)'}}>{d.prog}     
                              
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
                                <div style={{ width: `${d.pct}%`, height: '100%', background: 'var(--color-done)' }} />
                                    
                              <span style={{ fontSize: 11, fontWeight: 600, minWidth: 32, textAlign: 'right' }}>{d.pct}%       
                                  
                               
                             
                      ))}
                            
                          
                      
              )}
                  
          ) : (
                                        
              <div className="panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: 10 }}>
                                                      Detail Database Migrasi GPS (39 Kolom)       
                                                                                                                                                                       
                                                     Ekspor CSV Tersaring
                         
                    

                         
                                                      
                                                  
                  <input type="text" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} className="search-input" placeholder="Cari NOPOL..." />
                      
                <select value={loc} onChange={e => { setLoc(e.target.value); setPage(1); }} className="filter-select">
                                   Semua Lokasi         
                  {LOCS.map(l =>                           {l}         )}
                         
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="filter-select">
                                   Semua Status         
                                            UNPLANNED         
                                                 BELUM DIPASANG         
                                              ON PROGRESS         
                                                    TEKNISI SUBMITTED         
                                               PIC VERIFIED         
                                              IT VERIFIED         
                                       DONE         
                         
                                                 {filteredUnits.length} Unit       
                          

              <div className="table-container" style={{ overflowX: 'auto', maxHeight: 500, marginTop: 12 }}>
                <table className="data-table" style={{ minWidth: 2600 }}>
                         
                        
                          #     
                          NOPOL     
                          OWNERSHIP     
                          YEAR     
                          MERK     
                          ASSET TYPE     
                          BUSINESS LOCATION     
                          POOL     
                          DEDICATE     
                          STATUS REGISTRASI     
                          PLAN PASANG     
                          LOKASI PASANG     
                          PIC LAPANGAN     
                          TEKNISI PELAKSANA     
                          TIPE GPS BARU     
                          SN GPS BARU     
                          IMEI GPS BARU     
                          NOMOR SIM     
                          PROVIDER     
                          GPS     
                          BUZZER     
                          SOS     
                          SENSOR WING     
                          CAMERA     
                          CEK FISIK GPS LAMA     
                          CEK FISIK GPS BARU     
                          CEK KONDISI UNIT     
                          CEK FITUR     
                          CEK IT APLIKASI     
                          CEK CMT APLIKASI     
                          LAST UPDATE     
                         
                          
                         
                    {paginatedUnits.map((u, idx) => (
                                     
                                                   {(page - 1) * PAGE_LIMIT + idx + 1}     
                                    {u.nopol}              
                            {u.ownership}     
                            {u.year}     
                            {u.merk}     
                            {u.assetType}     
                            {u.location}     
                            {u.pool}     
                            {u.dedicate}     
                                                               
                            {u.planDate || '—'}     
                            {u.lokasiPasang || '—'}     
                            {u.picLapangan || '—'}     
                            {u.teknisiPelaksana || '—'}     
                            {u.modelGpsBaru || '—'}     
                                  {u.gpsSerialBaru || '—'}            
                                  {u.gpsImeiBaru || '—'}            
                            {u.nomorSIM || '—'}     
                            {u.provider || '—'}     
                                                      
                                                         
                                                      
                                                             
                                                         
                                                                  
                                                                  
                                                                       
                                                              
                                                                
                                                                 
                        <td className="text-muted" style={{ fontSize: 10 }}>{u.updatedAt || '—'}     
                           
                    ))}
                    {paginatedUnits.length === 0 && (
                          
                        <td colSpan="31" style={{ textAlign: 'center', padding: 24, color: 'var(--text-tertiary)' }}>Tidak ada data unit migrasi     
                           
                    )}
                          
                        
                    

              {totalPages > 1 && (
                                                                                   
              )}
                  
          )}
              
      );
    }
\n          {/* Apps Script Guide */}
                                           
                                                                                               
                    <i className="ti ti-code" style={{marginRight: 6}}>     Panduan Google Apps Script Backend       
              <i className={`ti ${showGASGuide ? 'ti-chevron-up' : 'ti-chevron-down'}`}>    
                  
            {showGASGuide && (
                                                
                   Aplikasi ini membaca dan menulis data ke Google Sheets Anda secara langsung dari browser. Agar sinkronisasi berjalan lancar, pastikan Apps Script Anda memiliki kode berikut:    
                                              
{`// =========================================================================
// 1. FUNGSI SETUP (Jalankan fungsi ini SEKALI setelah menempelkan kode ini)
//    Fungsi ini otomatis membuat sheet "DATABASE" dan 39 kolom header yang sesuai.
// =========================================================================
function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("DATABASE");
  if (!sheet) {
    sheet = ss.insertSheet("DATABASE");
    var sheet1 = ss.getSheetByName("Sheet1");
    if (sheet1 && sheet1.getLastRow() === 0) {
      ss.deleteSheet(sheet1);
    }
  }
  
  // 39 Kolom Header lengkap sesuai kebutuhan Web App & Excel Master
  var headers = [
    "NO", "OWNERSHIP", "NOPOL", "YEAR", "MERK", "ASSET TYPE", "BUSINESS LOCATION", "BUSINESS POOL", "BUSINESS DEDICATE",
    "PLAN PASANG", "LOKASI PASANG", "PIC LAPANGAN", "TEKNISI PELAKSANA", "TIPE GPS BARU", "SN GPS BARU", "IMEI GPS BARU",
    "NOMOR KARTU GPS BARU", "PROVIDER SIM GPS BARU", "GPS", "BUZZER", "SOS", "SENSOR WING", "CAMERA",
    "FOTO KENDARAAN (NOPOL)", "FOTO SERIAL GPS LAMA (DICABUT)", "FOTO GPS BARU (SN TERLIHAT)", "FOTO HASIL INSTALASI", "STATUS REGISTRASI",
    "CEK FISIK GPS LAMA", "CEK FISIK GPS BARU", "CEK KONDISI UNIT SELESAI INSTALASI", "CEK FITUR (SENSOR, SOS, CAMERA)", "FOTO BUKTI PENYERAHAN GPS LAMA",
    "CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK)", "FOTO INTEGRASI DATA GPS KE PUNINAR", "FOTO INTEGRASI DATA ABNORMALITY KE PUNINAR",
    "CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK)", "FOTO TERIMA FISIK GPS LAMA", "FOTO BUKTI TERMINASI GPS LAMA", "LAST_UPDATE"
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setBackground("#f3f4f6")
    .setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  
  Logger.log("DATABASE sheet setup sukses dengan " + headers.length + " kolom!");
}

// =========================================================================
// 2. FUNGSI GET (Membaca data dari Spreadsheet untuk Web App)
// =========================================================================
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("DATABASE");
  
  if (!sheet) {
    setupDatabase();
    sheet = ss.getSheetByName("DATABASE");
  }
  
  var data = sheet.getDataRange().getDisplayValues();
  var headers = data[0];
  var jsonArray = [];
  
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  for (var i = 1; i < data.length; i++) {
    var obj = { rowIndex: i + 1 };
    for (var j = 0; j < headers.length; j++) {
      var key = headers[j];
      if (j === 33) {
        key = "CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK) - IT";
      } else if (j === 36) {
        key = "CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK) - CMT";
      }
      obj[key] = data[i][j];
    }
    jsonArray.push(obj);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: true, data: jsonArray }))
    .setMimeType(ContentService.MimeType.JSON);
}

// =========================================================================
// 3. FUNGSI POST (Menulis / Mengupdate data dari Web App ke Spreadsheet)
// =========================================================================
function doPost(e) {
  var params = JSON.parse(e.postData.contents);
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("DATABASE");
  if (!sheet) {
    setupDatabase();
    sheet = ss.getSheetByName("DATABASE");
  }
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var nowStr = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy HH:mm");
  var updateCol = headers.indexOf("LAST_UPDATE");
  
  var items = [];
  if (params.batch && Array.isArray(params.batch)) {
    items = params.batch;
  } else {
    items = [params];
  }
  
  for (var idx = 0; idx < items.length; idx++) {
    var item = items[idx];
    var nopol = item.nopol;
    var updates = item.updates;
    if (!nopol) continue;
    
    var nopolCol = headers.indexOf("NOPOL");
    if (nopolCol === -1) nopolCol = 2; // fallback to index 2
    
    var row = -1;
    var cleanNopol = String(nopol).trim().toUpperCase();
    for (var i = 1; i < data.length; i++) {
      var sheetNopol = String(data[i][nopolCol]).trim().toUpperCase();
      if (sheetNopol === cleanNopol) {
        row = i + 1;
        break;
      }
    }
    
    if (row === -1) {
      row = sheet.getLastRow() + 1;
      sheet.getRange(row, nopolCol + 1).setValue(cleanNopol);
    }
    
    for (var key in updates) {
      var colIndex = -1;
      
      if (key === "CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK) - IT") {
        colIndex = 33;
      } else if (key === "CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK) - CMT") {
        colIndex = 36;
      } else {
        colIndex = headers.indexOf(key);
        if (colIndex === -1) {
          if (key === "STATUS_PASANG") colIndex = headers.indexOf("STATUS REGISTRASI");
          else if (key === "MODEL_GPS_BARU") colIndex = headers.indexOf("TIPE GPS BARU");
          else if (key === "GPS_SERIAL_BARU") colIndex = headers.indexOf("SN GPS BARU");
          else if (key === "GPS_IMEI_BARU") colIndex = headers.indexOf("IMEI GPS BARU");
          else if (key === "NOMOR_SIM") colIndex = headers.indexOf("NOMOR KARTU GPS BARU");
          else if (key === "PROVIDER") colIndex = headers.indexOf("PROVIDER SIM GPS BARU");
          else if (key === "CATATAN_PASANG") colIndex = headers.indexOf("CATATAN PEMAASANGAN");
          else if (key === "FOTO_KENDARAAN") colIndex = headers.indexOf("FOTO KENDARAAN (NOPOL)");
          else if (key === "FOTO_GPS_LAMA") colIndex = headers.indexOf("FOTO SERIAL GPS LAMA (DICABUT)");
          else if (key === "FOTO_GPS_BARU") colIndex = headers.indexOf("FOTO GPS BARU (SN TERLIHAT)");
          else if (key === "FOTO_HASIL_INSTALASI") colIndex = headers.indexOf("FOTO HASIL INSTALASI");
          else if (key === "CEK_FISIK_GPS_LAMA") colIndex = headers.indexOf("CEK FISIK GPS LAMA");
          else if (key === "CEK_FISIK_GPS_BARU") colIndex = headers.indexOf("CEK FISIK GPS BARU");
          else if (key === "CEK_KONDISI_UNIT_SELESAI_INSTALASI") colIndex = headers.indexOf("CEK KONDISI UNIT SELESAI INSTALASI");
          else if (key === "CEK_FITUR_SENSOR_SOS_CAMERA") colIndex = headers.indexOf("CEK FITUR (SENSOR, SOS, CAMERA)");
          else if (key === "FOTO_BUKTI_PENYERAHAN_GPS_LAMA") colIndex = headers.indexOf("FOTO BUKTI PENYERAHAN GPS LAMA");
          else if (key === "FOTO_INTEGRASI_DATA_GPS_KE_PUNINAR") colIndex = headers.indexOf("FOTO INTEGRASI DATA GPS KE PUNINAR");
          else if (key === "FOTO_INTEGRASI_DATA_ABNORMALITY_KE_PUNINAR") colIndex = headers.indexOf("FOTO INTEGRASI DATA ABNORMALITY KE PUNINAR");
          else if (key === "FOTO_TERIMA_FISIK_GPS_LAMA") colIndex = headers.indexOf("FOTO TERIMA FISIK GPS LAMA");
          else if (key === "FOTO_BUKTI_TERMINASI_GPS_LAMA") colIndex = headers.indexOf("FOTO BUKTI TERMINASI GPS LAMA");
        }
      }
      
      if (colIndex > -1) {
        sheet.getRange(row, colIndex + 1).setValue(updates[key]);
      }
    }
    
    if (updateCol > -1) {
      sheet.getRange(row, updateCol + 1).setValue(nowStr);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}`}                      
                <p style={{marginTop: 8}}>        Cara Pasang & Inisialisasi:             
                <ol style={{paddingLeft: 20, marginTop: 4, display:'flex', flexDirection:'column', gap:4}}>
                      Buka Spreadsheet tempat data GPS berada.     
                      Buka menu         Ekstensi          →         Apps Script         .     
                      Hapus semua kode bawaan, lalu paste kode di atas ke dalam editor script.     
                      Pilih fungsi         setupDatabase          di toolbar atas editor, lalu klik         Jalankan (Run)          untuk membuat sheet "DATABASE" beserta 33 kolom header secara otomatis!     
                      Klik         Terapkan (Deploy)          →         Penerapan baru (New deployment)         .     
                      Pilih jenis         Aplikasi Web (Web App)         . Atur hak akses     Who has access      ke         Anyone          (Penting agar Web App dapat mengakses).     
                      Klik Deploy/Terapkan, setujui izin akses (Authorize), lalu copy URL Web App yang dihasilkan.     
                      Buka file HTML ini, cari variabel       WEBAPP_URL        (sekitar baris 1253), dan ganti dengan URL Web App tersebut.     
                     
                    
            )}
                

          {/* Edit User Modal */}
          {editUser !== null && (
                                           
                                          
                                              
                                                Edit User Account: @{editUser.username}       
                                                                                                                        
                      
                                            
                                               
                                                   Nama Lengkap        
                    <input type="text" value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} className="input-field" required />
                        
                                               
                                                   Ubah Password        
                    <input type="text" value={editUser.password} onChange={e => setEditUser({ ...editUser, password: e.target.value })} className="input-field" required />
                        
                  {editUser.username !== 'admin' && (
                                                 
                                                     Role Akses        
                      <select value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })} className="filter-select" style={{width:'100%'}}>
                                                Planner (Jadwal & Site)         
                                                Teknisi (Instalasi Lapangan)         
                                            PIC Lapangan (Verifikasi Fisik)         
                                           IT Puninar (Verifikasi Sistem)         
                                            CMT (Verifikasi Final)         
                                              System Admin         
                               
                          
                  )}
                      
                                              
                                                                                          Batal         
                                                                               Simpan         
                      
                    
                  
          )}
              
      );
    }

    // ----------------------------------------------------
    // MAIN APP LAYOUT CONTROLLER
    // ----------------------------------------------------
    function App() {
      const { user, logout } = useContext(AuthContext);
      
      const [tab, setTab] = useState(() => {
        const items = [
          { id: 'dashboard', roles: ['admin', 'planner', 'pic', 'it', 'cmt'] },
          { id: 'planner', roles: ['admin', 'planner'] },
          { id: 'teknisi', roles: ['admin', 'teknisi'] },
          { id: 'pic', roles: ['admin', 'pic'] },
          { id: 'it', roles: ['admin', 'it'] },
          { id: 'cmt', roles: ['admin', 'cmt'] },
          { id: 'rekap', roles: ['admin', 'planner', 'pic', 'it', 'cmt'] },
          { id: 'admin', roles: ['admin'] }
        ];
        const allowed = items.filter(item => item.roles.includes(user.role));
        return allowed[0]?.id || 'dashboard';
      });
      const [units, setUnits] = useState(() => {
        try {
          const localData = localStorage.getItem('puninar_gps_units');
          return localData ? JSON.parse(localData) : [];
        } catch (e) {
          return [];
        }
      });
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [syncState, setSyncState] = useState('success'); // 'syncing', 'success', 'error'

      useEffect(() => {
        if (units && units.length > 0) {
          localStorage.setItem('puninar_gps_units', JSON.stringify(units));
        }
      }, [units]);
      
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

      const [width, setWidth] = useState(window.innerWidth);
      useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);
      const isMobile = width < 768 || user.role === 'teknisi';

      // Load Data from Google Sheets
      const loadData = (silent = false) => {
        const isSilent = silent === true;
        if (!isSilent) {
          setLoading(true);
          setError(null);
        }
        setSyncState('syncing');
        fetch(WEBAPP_URL)
          .then(res => res.json())
          .then(json => {
            if (json.success) {
              setUnits(mapFromSheet(json));
              setSyncState('success');
              if (!isSilent) {
                globalAddToast('Data berhasil disinkronisasi dari Google Sheets!', 'success');
              }
            } else {
              setSyncState('error');
              if (!isSilent) {
                setError(json.error || 'Gagal memuat data dari spreadsheet');
                globalAddToast('Gagal memuat data dari spreadsheet: ' + (json.error || 'Server error'), 'error');
              }
            }
            if (!isSilent) {
              setLoading(false);
            }
          })
          .catch(err => {
            setSyncState('error');
            if (!isSilent) {
              setLoading(false);
              setError(String(err));
              globalAddToast('Gagal terhubung ke Google Sheets API! Jalankan offline.', 'error');
            }
          });
      };

      useEffect(() => {
        loadData();
        
        // Auto refresh data every 15 seconds if tab is active
        const intervalId = setInterval(() => {
          if (document.visibilityState === 'visible') {
            loadData(true);
          }
        }, 15000);
        
        return () => clearInterval(intervalId);
      }, []);

      // Realtime push update helper
      const syncUpdate = (nopol, updates) => {
        setSyncState('syncing');
        const payload = (nopol === null && updates && updates.batch) ? updates : { nopol, updates };
        return fetch(WEBAPP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setSyncState('success');
            return json;
          } else {
            setSyncState('error');
            globalAddToast('Update lokal disimpan, gagal push ke Google Sheets!', 'error');
            throw new Error('Sheets sync failed');
          }
        })
        .catch(err => {
          setSyncState('error');
          globalAddToast('Gagal sinkron ke cloud. Data disimpan lokal.', 'error');
          throw err;
        });
      };

      // Navigation Items based on User Roles
      const tabs = useMemo(() => {
        const items = [
          { id: 'dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard', roles: ['admin', 'planner', 'pic', 'it', 'cmt'] },
          { id: 'planner', label: 'Planner', icon: 'ti-calendar', roles: ['admin', 'planner'] },
          { id: 'teknisi', label: 'Teknisi Lapangan', icon: 'ti-tool', roles: ['admin', 'teknisi'] },
          { id: 'pic', label: 'PIC Lapangan', icon: 'ti-clipboard-check', roles: ['admin', 'pic'] },
          { id: 'it', label: 'Verifikasi IT', icon: 'ti-device-desktop-analytics', roles: ['admin', 'it'] },
          { id: 'cmt', label: 'Verifikasi CMT', icon: 'ti-circle-check', roles: ['admin', 'cmt'] },
          { id: 'rekap', label: 'Rekap Migrasi', icon: 'ti-report', roles: ['admin', 'planner', 'pic', 'it', 'cmt'] },
          { id: 'admin', label: 'Admin Panel', icon: 'ti-settings', roles: ['admin'] }
        ];
        
        // Filter based on user role
        return items.filter(item => item.roles.includes(user.role));
      }, [user.role]);

      // Fallback to first allowed tab if current tab is invalid
      useEffect(() => {
        const allowedIds = tabs.map(t => t.id);
        if (user && !allowedIds.includes(tab)) {
          setTab(allowedIds[0] || 'dashboard');
        }
      }, [user.role, tabs, tab]);

      // Calculate simple done stats for header bar
      const doneStats = useMemo(() => {
        const total = units.length;
        const done = units.filter(u => u.statusPasang === 'DONE').length;
        const pct = total ? Math.round((done / total) * 100) : 0;
        return { total, done, pct };
      }, [units]);

      if (loading && units.length === 0) {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 14 }}>
            <i className="ti ti-loader" style={{ fontSize: 32, color: 'var(--accent)', animation: 'spin 1.2s linear infinite' }}>    
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Memuat database migrasi GPS...      
                
        );
      }

      if (error && units.length === 0) {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16, padding: 24, textAlign: 'center', background: 'var(--bg-primary)' }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: 36, color: 'var(--color-delay)' }}>    
            <div style={{ fontSize: 15, fontWeight: 700 }}>Gagal Memuat Data      
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 460, lineHeight: 1.6 }}>
              Detail Error: <code style={{ background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4, color: 'var(--color-delay)' }}>{error}       
                  
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', maxWidth: 460, lineHeight: 1.6 }}>
              Pastikan: (1) URL Apps Script (      WEBAPP_URL       ) sudah benar, (2) Setelan deployment Apps Script "Who has access" adalah "Anyone", dan (3) Koneksi internet Anda aktif.
                  
            <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                                                                     Coba Lagi         
              <button className="btn btn-secondary" onClick={() => {
                setError(null);
                setUnits(Array.from({ length: 15 }, (_, i) => ({
                  id: i + 1,
                  rowIndex: i + 2,
                  nopol: `B ${1000 + i * 23} ABC`,
                  merk: i % 2 === 0 ? 'MITSUBISHI' : 'ISUZU',
                  model: i % 2 === 0 ? 'FUSO' : 'ELF',
                  location: LOCS[i % LOCS.length],
                  pool: POOLS[i % POOLS.length],
                  dedicate: 'LOGISTICS',
                  easygoDicopot: 'BELUM',
                  planDate: i % 3 === 0 ? '15-06-2026' : '',
                  lokasiPasang: i % 3 === 0 ? `POOL ${LOCS[i % LOCS.length]}` : '',
                  keteranganPlanner: i % 3 === 0 ? 'Tolong pasang di dashboard kiri' : '',
                  teknisiPelaksana: '',
                  statusPlan: i % 3 === 0 ? 'PLAN' : 'UNPLAN',
                  statusPasang: 'BELUM DIPASANG',
                  modelGpsBaru: '',
                  gps: '', buzzer: '', sos: '', sensorWing: '',
                  statusSystem: '', statusSuspend: '',
                  updatedAt: ''
                })));
                globalAddToast('Berjalan dalam Mode Offline (Demo)!', 'info');
              }}>Jalankan Offline         
                                                                  Keluar         
                  
                
        );
      }

      return (
        <div className={`app-wrapper ${user.role === 'teknisi' ? 'mobile-only' : ''}`}>
          {/* Sidebar Navigation */}
          {user.role !== 'teknisi' && (
            <>
              <div 
                className={`sidebar-overlay ${mobileMenuOpen ? 'open' : ''}`} 
                onClick={() => setMobileMenuOpen(false)}
              />
              <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
                                                
                                                     
                                                     
                        
                                                 
                    PUNINAR
                          GPS Portal v2       
                        
                                                                                                 
                                               
                           
                      
                
                                              
                                                  
                    {user.name.charAt(0).toUpperCase()}
                        
                                                     
                                                      {user.name}      
                                                  {user.role} Account      
                        
                      

                                              
                  {tabs.map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => {
                        setTab(t.id);
                        setMobileMenuOpen(false);
                      }} 
                      className={`menu-item ${tab === t.id ? 'active' : ''}`}
                    >
                      <i className={`ti ${t.icon}`}>    
                      {t.label}
                             
                  ))}
                      

                                                
                  <button className="theme-toggle-btn" onClick={() => {
                    const cur = document.documentElement.getAttribute('data-theme');
                    const next = cur === 'dark' ? 'light' : 'dark';
                    document.documentElement.setAttribute('data-theme', next);
                    localStorage.setItem('theme', next);
                  }}>
                                                              Ganti Tema
                           
                  <button className="logout-btn" onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}>
                                                     Logout
                           
                      
                      
            </>
          )}

          {/* Main Layout Area */}
                                       
                                       
              <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {user.role !== 'teknisi' && (
                                                                                          
                                                    
                           
                )}
                                                   {tabs.find(t=>t.id===tab)?.label || 'Aplikasi'}       
                    
                                            
                <div className={`sync-status ${syncState}`}>
                  <i className={`ti ${syncState === 'syncing' ? 'ti-refresh' : syncState === 'success' ? 'ti-cloud-check' : 'ti-cloud-off'}`}>    
                  <span style={{display: isMobile ? 'none' : 'inline'}}>{syncState === 'syncing' ? 'Syncing...' : syncState === 'success' ? 'Sheets Terhubung' : 'Offline / Error'}       
                      
                                                                                             
                  <i className="ti ti-refresh" style={{fontSize: 16}}>    
                         
                <div style={{ display: isMobile ? 'none' : 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: 10, color: 'var(--text-secondary)' }}>
                        {doneStats.done} / {doneStats.total} Done       
                  <span style={{ fontWeight: 700, color: 'var(--color-done)' }}>{doneStats.pct}% Selesai       
                      
                {user.role === 'teknisi' && (
                  <button className="btn btn-danger btn-sm" onClick={logout} style={{ marginLeft: 6 }}>
                                                     Keluar
                           
                )}
                    
                     

                                           
              {tab === 'dashboard' &&                                                    }
              {tab === 'planner' &&                                                                                              }
              {tab === 'teknisi' &&                                                                          }
              {tab === 'pic' &&                                                                                                  }
              {tab === 'it' &&                                                                                         }
              {tab === 'cmt' &&                                                                                          }
              {tab === 'rekap' &&                                                }
              {tab === 'admin' &&              }
                   

            {/* Mobile Bottom Navigation Bar */}
            {user.role !== 'teknisi' && (
                                              
                {tabs.slice(0, 4).map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)} className={`mobile-nav-item ${tab === t.id ? 'active' : ''}`}>
                    <i className={`ti ${t.icon}`}>    
                          {t.label.split(' ')[0]}       
                           
                ))}
                <button className={`mobile-nav-item ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                                  
                        Menu       
                         
                    
            )}
                
              
      );
    }

    // ----------------------------------------------------
    // PASSWORD/LOGIN GATE VIEW
    // ----------------------------------------------------
    function LoginGate() {
      const { login } = useContext(AuthContext);
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [showPassword, setShowPassword] = useState(false);
      const [errMessage, setErrMessage] = useState('');

      const handleSubmit = (e) => {
        e.preventDefault();
        setErrMessage('');
        
        if (!username || !password) {
          setErrMessage('Username dan Password wajib diisi!');
          return;
        }

        const res = login(username, password);
        if (!res.success) {
          setErrMessage(res.message);
        }
      };

      return (
                                         
                                                               
                                        
                                            
                  
                                         PUNINAR LOGISTICS      
                                            Aplikasi Portal Migrasi GPS & Checklist      
            
            {errMessage && (
              <div style={{
                background: 'var(--color-delay-bg)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: 'var(--color-delay)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 11,
                fontWeight: 600,
                marginBottom: 16,
                textAlign: 'center'
              }}>
                {errMessage}
                    
            )}

                                         
                                             USERNAME        
                                                                                                                                                                           
                  

                                         
                                             PASSWORD        
                                                                                                                                                                                               
                                                                                                               
                <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`}>    
                       
                  

                                                        Masuk Aplikasi         
            
            <div style={{marginTop: 24, fontSize: 10, color: 'var(--text-tertiary)', textAlign: 'center'}}>
              Puninar Logistics IT Team • © 2026
                  
                 
              
      );
    }

    // ----------------------------------------------------
    // APP INITIALIZATION ROOT
    // ----------------------------------------------------
    function Root() {
      const { user } = useContext(AuthContext);

      useEffect(() => {
        // Theme initialization
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
      }, []);

      if (!user) return              ;
      return        ;
    }

    ReactDOM.createRoot(document.getElementById('root')).render(
                    
                
                          
                     
    );
  