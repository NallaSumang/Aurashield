import React, { useState, useEffect, useRef } from 'react';

// --- INLINE ICONS (Zero External Dependencies to prevent compiler crash) ---
const IconShield = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const IconFlame = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>);
const IconArrowUp = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className}><path d="M12 19V5M5 12l7-7 7 7"/></svg>);
const IconArrowDown = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className}><path d="M12 5v14M19 12l-7 7-7-7"/></svg>);
const IconAlert = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>);
const IconMap = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16"/></svg>);
const IconWifi = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>);

export default function App() {
  const [systemStatus, setSystemStatus] = useState('SAFE'); 
  const [aiLogs, setAiLogs] = useState([
    "12:00:01 - AuraShield Vision Online.",
    "12:00:05 - Polling 42 CCTV nodes...",
    "12:00:10 - All zones clear. Normal operations."
  ]);
  const [guestLanguage, setGuestLanguage] = useState('EN');
  const logEndRef = useRef(null);

  const translations = {
    EN: { safe: "You are safe. Enjoy your stay.", title: "EMERGENCY: FIRE DETECTED", north: "FIRE IN NORTH WING. DO NOT USE ELEVATORS. PROCEED TO SOUTH STAIRS.", south: "FIRE IN SOUTH WING. DO NOT USE ELEVATORS. PROCEED TO NORTH STAIRS." },
    ES: { safe: "Estás a salvo.", title: "EMERGENCIA: FUEGO DETECTADO", north: "FUEGO EN ALA NORTE. PROCEDA A ESCALERAS SUR.", south: "FUEGO EN ALA SUR. PROCEDA A ESCALERAS NORTE." },
    HI: { safe: "आप सुरक्षित हैं।", title: "आपातकाल: आग", north: "उत्तरी विंग में आग। दक्षिणी सीढ़ियों की ओर बढ़ें।", south: "दक्षिणी विंग में आग। उत्तरी सीढ़ियों की ओर बढ़ें।" },
    JA: { safe: "安全です。おくつろぎください。", title: "緊急：火災を検知しました", north: "北棟で火災発生。エレベーターは使用しないでください。南階段に進んでください。", south: "南棟で火災発生。エレベーターは使用しないでください。北階段に進んでください。" }
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiLogs]);

  const triggerEmergency = (zone) => {
    setSystemStatus(zone);
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setAiLogs(prev => [
      ...prev,
      `${time} - [ALERT] Anomaly detected in camera feed.`,
      `${time} - [GEMINI 1.5 PRO] Processing visual frames...`,
      `${time} - [GEMINI 1.5 PRO] JSON Payload: {"hazard": "fire", "confidence": 0.98, "severity": "CRITICAL"}`,
      `${time} - [SYSTEM] Recalculating dynamic escape routes...`
    ]);
  };

  const resolveEmergency = () => {
    setSystemStatus('SAFE');
    setAiLogs(prev => [...prev, `[SYSTEM] Manual override: Threat resolved.`]);
  };

  const getCellClass = (zoneName) => {
    const base = "h-24 rounded-lg border border-slate-700 flex flex-col items-center justify-center relative transition-all duration-500 ";
    if (systemStatus === 'SAFE') return base + "bg-slate-800 text-slate-400";
    if (systemStatus === 'FIRE_NORTH') {
      if (zoneName === 'North Wing') return base + "bg-red-900/80 border-red-500 animate-pulse text-red-200";
      if (zoneName === 'North Stairs') return base + "bg-red-900/30 border-red-500 text-red-400";
      if (zoneName === 'South Stairs') return base + "bg-emerald-900/80 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
    }
    if (systemStatus === 'FIRE_SOUTH') {
      if (zoneName === 'South Wing') return base + "bg-red-900/80 border-red-500 animate-pulse text-red-200";
      if (zoneName === 'South Stairs') return base + "bg-red-900/30 border-red-500 text-red-400";
      if (zoneName === 'North Stairs') return base + "bg-emerald-900/80 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
    }
    return base + "bg-slate-800 text-slate-400";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 flex flex-col">
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <IconShield className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-white">AuraShield Command</h1>
            <p className="text-xs text-slate-400">Code Gunners | Active</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => triggerEmergency('FIRE_NORTH')} className="px-4 py-2 bg-red-950 text-red-400 border border-red-900 hover:bg-red-900 rounded-md text-sm font-bold transition-colors">Simulate North Fire</button>
          <button onClick={() => triggerEmergency('FIRE_SOUTH')} className="px-4 py-2 bg-orange-950 text-orange-400 border border-orange-900 hover:bg-orange-900 rounded-md text-sm font-bold transition-colors">Simulate South Fire</button>
          <button onClick={resolveEmergency} className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-md text-sm font-bold transition-colors">Resolve</button>
        </div>
      </header>

      <div className="flex flex-1 gap-8">
        {/* LEFT COLUMN: DASHBOARD */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-white"><IconMap className="w-5 h-5 text-blue-400"/> Live Threat Matrix: Floor 3</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className={getCellClass('North Wing')}>
                <span className="font-bold">North Wing</span>
                {systemStatus === 'FIRE_NORTH' && <IconFlame className="absolute bottom-2 text-red-500 w-8 h-8" />}
              </div>
              <div className={getCellClass('North Stairs')}>
                <span className="font-bold">North Stairs</span>
                {systemStatus === 'FIRE_SOUTH' && <IconArrowUp className="absolute bottom-2 text-emerald-400 w-8 h-8 animate-bounce" />}
              </div>
              <div className="h-24 rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-500">Elevators (Locked)</div>

              <div className="h-24 rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center flex-col">
                <span className="text-slate-400">Room 301-305</span>
                <div className="flex gap-1 mt-2"><IconWifi className="w-4 h-4 text-emerald-500" /></div>
              </div>
              <div className={getCellClass('Center Hall')}>
                <span className="font-bold">Center Hall</span>
                {systemStatus !== 'SAFE' && <IconAlert className="absolute inset-0 m-auto w-12 h-12 text-yellow-500 opacity-30" />}
              </div>
              <div className="h-24 rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center flex-col">
                 <span className="text-slate-400">Room 306-310</span>
                 <div className="flex gap-1 mt-2"><IconWifi className="w-4 h-4 text-emerald-500" /></div>
              </div>

              <div className={getCellClass('South Wing')}>
                <span className="font-bold">South Wing</span>
                {systemStatus === 'FIRE_SOUTH' && <IconFlame className="absolute bottom-2 text-red-500 w-8 h-8" />}
              </div>
              <div className={getCellClass('South Stairs')}>
                <span className="font-bold">South Stairs</span>
                {systemStatus === 'FIRE_NORTH' && <IconArrowDown className="absolute bottom-2 text-emerald-400 w-8 h-8 animate-bounce" />}
              </div>
              <div className="h-24 rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-500">Staff Only</div>
            </div>
          </div>

          <div className="bg-black border border-slate-800 rounded-xl p-4 flex-1 flex flex-col font-mono text-sm shadow-inner min-h-[200px]">
            <h3 className="text-blue-400 mb-2 font-bold">Gemini AI Context Logs</h3>
            <div className="flex-1 overflow-y-auto space-y-2">
              {aiLogs.map((log, i) => (
                <div key={i} className={log.includes('ALERT') || log.includes('CRITICAL') ? 'text-red-400 font-bold' : 'text-emerald-400'}>{log}</div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MOBILE */}
        <div className="w-96 flex flex-col items-center shrink-0">
          <select value={guestLanguage} onChange={(e) => setGuestLanguage(e.target.value)} className="mb-4 bg-slate-800 border border-slate-700 text-white text-sm rounded-lg w-64 p-2.5 outline-none focus:ring-2 focus:ring-blue-500">
            <option value="EN">English</option>
            <option value="ES">Español</option>
            <option value="HI">हिंदी (Hindi)</option>
            <option value="JA">日本語 (Japanese)</option>
          </select>

          <div className="w-[320px] h-[650px] rounded-[3rem] border-[12px] border-slate-800 overflow-hidden shadow-2xl relative flex flex-col transition-colors duration-500" style={{ backgroundColor: systemStatus === 'SAFE' ? '#f8fafc' : '#ef4444' }}>
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl w-32 mx-auto z-10"></div>
            <div className="pt-20 px-6 flex-1 flex flex-col items-center text-center">
              {systemStatus === 'SAFE' ? (
                <>
                  <IconShield className="w-24 h-24 text-slate-300 mb-6" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">AuraShield</h3>
                  <p className="text-slate-500 font-medium">{translations[guestLanguage].safe}</p>
                </>
              ) : (
                <>
                  <IconAlert className="w-24 h-24 text-white mb-6 animate-pulse" />
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tight leading-tight">{translations[guestLanguage].title}</h3>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/20 mb-8 w-full">
                    <p className="text-white font-bold text-lg leading-snug">{systemStatus === 'FIRE_NORTH' ? translations[guestLanguage].north : translations[guestLanguage].south}</p>
                  </div>
                  <div className="animate-bounce bg-white rounded-full p-4 shadow-xl mt-auto mb-16">
                    {systemStatus === 'FIRE_NORTH' ? <IconArrowDown className="w-16 h-16 text-red-600" /> : <IconArrowUp className="w-16 h-16 text-red-600" />}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
