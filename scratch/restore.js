const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const startKeyword = "const [units, setUnits] = useState(() => {";
const endKeyword = "}, [user.role]);";

const startIndex = content.indexOf(startKeyword);
if (startIndex === -1) {
  console.error("Start keyword not found!");
  process.exit(1);
}

// Find the first occurrence of endKeyword AFTER startIndex
const endIndex = content.indexOf(endKeyword, startIndex);
if (endIndex === -1) {
  console.error("End keyword not found after start!");
  process.exit(1);
}

const replaceEnd = endIndex + endKeyword.length;

console.log("Found corrupted block at index", startIndex, "to", replaceEnd);

const restoredBlock = "const [units, setUnits] = useState(() => {\n" +
"        try {\n" +
"          const localData = localStorage.getItem('puninar_gps_units');\n" +
"          return localData ? JSON.parse(localData) : [];\n" +
"        } catch (e) {\n" +
"          return [];\n" +
"        }\n" +
"      });\n" +
"      const [loading, setLoading] = useState(true);\n" +
"      const [error, setError] = useState(null);\n" +
"      const [syncState, setSyncState] = useState('success'); // 'syncing', 'success', 'error'\n" +
"\n" +
"      useEffect(() => {\n" +
"        if (units && units.length > 0) {\n" +
"          localStorage.setItem('puninar_gps_units', JSON.stringify(units));\n" +
"        }\n" +
"      }, [units]);\n" +
"      \n" +
"      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n" +
"\n" +
"      const [width, setWidth] = useState(window.innerWidth);\n" +
"      useEffect(() => {\n" +
"        const handleResize = () => setWidth(window.innerWidth);\n" +
"        window.addEventListener('resize', handleResize);\n" +
"        return () => window.removeEventListener('resize', handleResize);\n" +
"      }, []);\n" +
"      const isMobile = width < 768;\n" +
"\n" +
"      // Helper to map mixed-case updates keys to DB columns\n" +
"      const mapKeysToColumns = (updates) => {\n" +
"        const mapped = {};\n" +
"        for (const key in updates) {\n" +
"          if (updates[key] === undefined) continue;\n" +
"          \n" +
"          const normKey = key.trim().toUpperCase();\n" +
"          if (\n" +
"            normKey === 'IMEI GPS BARU' || normKey === 'GPS_IMEI_BARU' || normKey === 'GPSIMEIBARU' ||\n" +
"            normKey === 'NOMOR KARTU GPS BARU' || normKey === 'NOMOR_SIM' || normKey === 'NOMORSIM' ||\n" +
"            normKey === 'PROVIDER SIM GPS BARU' || normKey === 'PROVIDER' || normKey === 'PROVIDERSIM' ||\n" +
"            key === 'gpsImeiBaru' || key === 'nomorSIM' || key === 'provider'\n" +
"          ) {\n" +
"            continue;\n" +
"          }\n" +
"\n" +
"          let col = key;\n" +
"          if (normKey === 'OWNERSHIP') col = 'ownership';\n" +
"          else if (normKey === 'NOPOL') col = 'nopol';\n" +
"          else if (normKey === 'YEAR') col = 'year';\n" +
"          else if (normKey === 'MERK') col = 'merk';\n" +
"          else if (normKey === 'ASSET TYPE' || normKey === 'MODEL' || normKey === 'ASSETTYPE') col = 'assetType';\n" +
"          else if (normKey === 'BUSINESS LOCATION' || normKey === 'LOCATION') col = 'location';\n" +
"          else if (normKey === 'BUSINESS POOL' || normKey === 'POOL') col = 'pool';\n" +
"          else if (normKey === 'BUSINESS DEDICATE' || normKey === 'DEDICATE') col = 'dedicate';\n" +
"          else if (normKey === 'PLAN PASANG' || normKey === 'PLAN_TGL' || normKey === 'PLANDATE') col = 'planDate';\n" +
"          else if (normKey === 'LOKASI PASANG' || normKey === 'LOKASI_PASANG' || normKey === 'LOKASIPASANG') col = 'lokasiPasang';\n" +
"          else if (normKey === 'PIC LAPANGAN' || normKey === 'PICLAPANGAN') col = 'picLapangan';\n" +
"          else if (normKey === 'TEKNISI PELAKSANA' || normKey === 'TEKNISI_PELAKSANA' || normKey === 'TEKNISI' || normKey === 'TEKNISIPELAKSANA') col = 'teknisiPelaksana';\n" +
"          else if (normKey === 'SN GPS LAMA' || normKey === 'NO GPS LAMA' || normKey === 'GPSSERIALLAMA' || normKey === 'NOGPSLAMA') col = 'gpsSerialLama';\n" +
"          else if (normKey === 'TIPE GPS BARU' || normKey === 'MODEL_GPS_BARU' || normKey === 'MODELGPSBARU') col = 'modelGpsBaru';\n" +
"          else if (normKey === 'SN GPS BARU' || normKey === 'GPS_SERIAL_BARU' || normKey === 'GPSSERIALBARU') col = 'gpsSerialBaru';\n" +
"          else if (normKey === 'GPS') col = 'gps';\n" +
"          else if (normKey === 'BUZZER') col = 'buzzer';\n" +
"          else if (normKey === 'SOS') col = 'sos';\n" +
"          else if (normKey === 'SENSOR WING' || normKey === 'SENSOR_WING' || normKey === 'SENSORWING') col = 'sensorWing';\n" +
"          else if (normKey === 'CAMERA') col = 'camera';\n" +
"          else if (normKey === 'FOTO KENDARAAN (NOPOL)' || normKey === 'FOTO_KENDARAAN' || normKey === 'FOTOKENDARAAN') col = 'fotoKendaraan';\n" +
"          else if (normKey === 'FOTO SERIAL GPS LAMA (DICABUT)' || normKey === 'FOTO_GPS_LAMA' || normKey === 'FOTOGPSLAMA') col = 'fotoGPSLama';\n" +
"          else if (normKey === 'FOTO GPS BARU (SN TERLIHAT)' || normKey === 'FOTO_GPS_BARU' || normKey === 'FOTOGPSBARU') col = 'fotoGPSBaru';\n" +
"          else if (normKey === 'FOTO HASIL INSTALASI' || normKey === 'FOTO_HASIL_INSTALASI' || normKey === 'FOTOHASILINSTALASI') col = 'fotoHasilInstalasi';\n" +
"          else if (normKey === 'STATUS REGISTRASI' || normKey === 'STATUS_PASANG' || normKey === 'STATUSREGISTRASI' || normKey === 'STATUSPASANG') col = 'statusPasang';\n" +
"          else if (normKey === 'CEK FISIK GPS LAMA' || normKey === 'CEK_FISIK_GPS_LAMA' || normKey === 'CEKFISIKGPSLAMA') col = 'picCekFisikLama';\n" +
"          else if (normKey === 'CEK FISIK GPS BARU' || normKey === 'CEK_FISIK_GPS_BARU' || normKey === 'CEKFISIKGPSBARU') col = 'picCekFisikBaru';\n" +
"          else if (normKey === 'CEK KONDISI UNIT SELESAI INSTALASI' || normKey === 'CEK_KONDISI_UNIT_SELESAI_INSTALASI' || normKey === 'CEKKONDISIUNITSELESAIINSTALASI') col = 'picCekKondisiSelesai';\n" +
"          else if (normKey === 'CEK FITUR (SENSOR, SOS, CAMERA)' || normKey === 'CEK_FITUR_SENSOR_SOS_CAMERA' || normKey === 'CEKFITURSENSORSOSCAMERA') col = 'picCekFitur';\n" +
"          else if (normKey === 'FOTO BUKTI PENYERAHAN GPS LAMA' || normKey === 'FOTO_BUKTI_PENYERAHAN_GPS_LAMA' || normKey === 'FOTOBUKTIPENYERAHANGPSLAMA') col = 'picFotoSerahTerima';\n" +
"          else if (normKey === 'CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK) - IT' || normKey === 'CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK)') col = 'itCekAplikasi';\n" +
"          else if (normKey === 'FOTO INTEGRASI DATA GPS KE PUNINAR' || normKey === 'FOTO_INTEGRASI_DATA_GPS_KE_PUNINAR' || normKey === 'FOTOINTEGRASIDATAGPSKEPUNINAR') col = 'itFotoIntegrasi';\n" +
"          else if (normKey === 'FOTO INTEGRASI DATA ABNORMALITY KE PUNINAR' || normKey === 'FOTO_INTEGRASI_DATA_ABNORMALITY_KE_PUNINAR' || normKey === 'FOTOINTEGRASIDATAABNORMALITYKEPUNINAR') col = 'itFotoAbnormality';\n" +
"          else if (normKey === 'CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK) - CMT' || normKey === 'CEK UNIT DI APLIKASI (TEMON /GEOTAB / SMATRACK) - CMT') col = 'cmtCekAplikasi';\n" +
"          else if (normKey === 'FOTO TERIMA FISIK GPS LAMA' || normKey === 'FOTO_TERIMA_FISIK_GPS_LAMA' || normKey === 'FOTOTERIMAFISIKGPSLAMA') col = 'cmtFotoTerimaFisik';\n" +
"          else if (normKey === 'FOTO BUKTI TERMINASI GPS LAMA' || normKey === 'FOTO_BUKTI_TERMINASI_GPS_LAMA' || normKey === 'FOTOBUKTITERMINASIGPSLAMA') col = 'cmtFotoTerminasi';\n" +
"          else if (normKey === 'STATUS_EASYGO_DICOPOT' || normKey === 'EASYGODICOPOT') col = 'easygoDicopot';\n" +
"          else if (normKey === 'LAST_UPDATE' || normKey === 'UPDATEDAT') col = 'updatedAt';\n" +
"          else if (normKey === 'TEKNISI SUBMIT AT' || normKey === 'TEKNISYSUBMITAT') col = 'teknisiSubmitAt';\n" +
"          else if (normKey === 'PIC SUBMIT AT' || normKey === 'PICSUBMITAT') col = 'picSubmitAt';\n" +
"          else if (normKey === 'CMT SUBMIT AT' || normKey === 'CMTSUBMITAT') col = 'cmtSubmitAt';\n" +
"          else if (normKey === 'IT SUBMIT AT' || normKey === 'ITSUBMITAT') col = 'itSubmitAt';\n" +
"          else if (normKey === 'FOTO ODOMETER' || normKey === 'FOTO_ODOMETER' || normKey === 'FOTOODOMETER') col = 'fotoOdometer';\n" +
"          else if (normKey === 'STATUS SYSTEM' || normKey === 'STATUS_SYSTEM' || normKey === 'STATUSSYSTEM') col = 'statusSystem';\n" +
"          else if (normKey === 'STATUS SUSPEND' || normKey === 'STATUS_SUSPEND' || normKey === 'STATUSSUSPEND') col = 'statusSuspend';\n" +
"          else if (normKey === 'STATUSPLAN' || normKey === 'STATUS_PLAN' || normKey === 'STATUS PLAN') { /* statusPlan is computed, skip syncing */ continue; }\n" +
"          \n" +
"          mapped[col] = updates[key];\n" +
"        }\n" +
"        return mapped;\n" +
"      };\n" +
"\n" +
"      // Load Data from Supabase\n" +
"      const loadData = async (silent = false) => {\n" +
"        const isSilent = silent === true;\n" +
"        if (!isSilent) {\n" +
"          setLoading(true);\n" +
"          setError(null);\n" +
"        }\n" +
"        setSyncState('syncing');\n" +
"        try {\n" +
"          const { data, error } = await supabaseClient\n" +
"            .from('units')\n" +
"            .select('*')\n" +
"            .order('id', { ascending: true });\n" +
"          \n" +
"          if (error) throw error;\n" +
"          \n" +
"          const mappedList = (data || []).map(row => ({\n" +
"            ...row,\n" +
"            statusPlan: row.statusPasang === 'DONE' ? 'DONE' : (row.planDate ? 'PLAN' : 'UNPLAN')\n" +
"          }));\n" +
"          \n" +
"          setUnits(mappedList);\n" +
"          setSyncState('success');\n" +
"          if (!isSilent) {\n" +
"            globalAddToast('Data berhasil disinkronisasi dari Supabase!', 'success');\n" +
"          }\n" +
"        } catch (err) {\n" +
"          setSyncState('error');\n" +
"          if (!isSilent) {\n" +
"            setError(String(err));\n" +
"            globalAddToast('Gagal memuat data dari Supabase: ' + String(err), 'error');\n" +
"          }\n" +
"        } finally {\n" +
"          if (!isSilent) {\n" +
"            setLoading(false);\n" +
"          }\n" +
"        }\n" +
"      };\n" +
"\n" +
"      useEffect(() => {\n" +
"        loadData();\n" +
"        \n" +
"        // Auto refresh data every 15 seconds if tab is active\n" +
"        const intervalId = setInterval(() => {\n" +
"          if (document.visibilityState === 'visible') {\n" +
"            loadData(true);\n" +
"          }\n" +
"        }, 15000);\n" +
"        \n" +
"        return () => clearInterval(intervalId);\n" +
"      }, []);\n" +
"\n" +
"      // Realtime push update helper using upsert (insert-or-update by nopol)\n" +
"      const syncUpdate = async (nopol, updates) => {\n" +
"        setSyncState('syncing');\n" +
"        \n" +
"        try {\n" +
"          // Normalize and map keys\n" +
"          const mappedUpdates = mapKeysToColumns(updates);\n" +
"          mappedUpdates.nopol = String(nopol).trim().toUpperCase(); // Ensure uppercase NOPOL\n" +
"          \n" +
"          if (!mappedUpdates.updatedAt) {\n" +
"            const now = new Date();\n" +
"            const dd = n => String(n).padStart(2, '0');\n" +
"            const ts = `${now.getFullYear()}-${dd(now.getMonth() + 1)}-${dd(now.getDate())} ${dd(now.getHours())}:${dd(now.getMinutes())}`;\n" +
"            mappedUpdates.updatedAt = ts;\n" +
"          }\n" +
"          \n" +
"          const { data, error } = await supabaseClient\n" +
"            .from('units')\n" +
"            .upsert([mappedUpdates], { onConflict: 'nopol' });\n" +
"            \n" +
"          if (error) throw error;\n" +
"          \n" +
"          setSyncState('success');\n" +
"          return { success: true };\n" +
"        } catch (err) {\n" +
"          setSyncState('error');\n" +
"          console.error(\"Sync error details:\", err);\n" +
"          globalAddToast('Gagal sinkron data ke Supabase!', 'error');\n" +
"          throw err;\n" +
"        }\n" +
"      };\n" +
"\n" +
"      // Navigation Items based on User Roles\n" +
"      const tabs = useMemo(() => {\n" +
"        const items = [\n" +
"          { id: 'dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard', roles: ['admin', 'planner', 'it', 'cmt', 'view'] },\n" +
"          { id: 'progress', label: 'Progress Migrasi', icon: 'ti-activity', roles: ['admin', 'planner', 'view'] },\n" +
"          { id: 'planner', label: 'Planner', icon: 'ti-calendar', roles: ['admin', 'planner'] },\n" +
"          { id: 'teknisi', label: 'Teknisi Lapangan', icon: 'ti-tool', roles: ['admin', 'teknisi'] },\n" +
"          { id: 'pic', label: 'PIC Lapangan', icon: 'ti-clipboard-check', roles: ['admin', 'pic'] },\n" +
"          { id: 'it', label: 'Verifikasi IT', icon: 'ti-device-desktop-analytics', roles: ['admin', 'it'] },\n" +
"          { id: 'cmt', label: 'Verifikasi CMT', icon: 'ti-circle-check', roles: ['admin', 'cmt'] },\n" +
"          { id: 'rekap', label: 'Rekap Migrasi', icon: 'ti-report', roles: ['admin', 'planner', 'it', 'cmt', 'view'] },\n" +
"          { id: 'admin', label: 'Admin Panel', icon: 'ti-settings', roles: ['admin'] }\n" +
"        ];\n" +
"        \n" +
"        // Filter based on user role\n" +
"        return items.filter(item => item.roles.includes(user.role));\n" +
"      }, [user.role]);";

const newContent = content.slice(0, startIndex) + restoredBlock + content.slice(replaceEnd);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log("Restored successfully!");
