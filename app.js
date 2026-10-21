'use strict';
const APP_VERSION = '0.7.2';

/* =========================================================
   PRÜFLISTE (Vorlage)
   Später: je Leaf ein Array `points` mit konkreten Prüfpunkten
   und eigener `minPhotos`-Vorgabe ergänzen.
   Jede Session speichert eine Kopie der Vorlage -> spätere
   Änderungen brechen bestehende Physicals nicht.
   ========================================================= */
const DEFAULT_MIN_PHOTOS = 1;
const CHECKLIST = [
  { id: '1', title: 'A/C Placards & Markings', folder: '1 AC Placards & Markings', children: [
    { id: '1.1', title: 'Registration', folder: '1.1 Registration' },
    { id: '1.2', title: 'National Flag', folder: '1.2 National Flag' },
    { id: '1.3', title: 'Lease- / Owner Plate + Manufacture Plate', folder: '1.3 Lease- Owner Plate + Manufacture Plate', minPhotos: 2 },
    { id: '1.4', title: 'Samples', folder: '1.4 Samples' } ] },
  { id: '2', title: 'A/C Documentation', folder: '2 AC Documentation', children: [
    { id: '2.1', title: 'A/C Compliance with AFM', folder: '2.1 AC Compliance with AFM', children: [
      { id: '2.1.1', title: 'EFB = Comply?', folder: '2.1.1 EFB', minPhotos: 0 },
      { id: '2.1.2', title: 'Sample (TCDS, AFM, etc.)', folder: '2.1.2 Sample' } ] },
    // docs: alle Fotos in einem Ordner, Dateiname beginnt mit Dokument-Nr.; je Pflichtdokument min. 1 Foto (mehrseitig möglich)
    { id: '2.2', title: 'On-Board Documentation / Techlog', folder: '2.2 On-Board Documentation - Techlog', docs: [
      { id: '2.2.1', name: 'CofA' }, { id: '2.2.2', name: 'CofR' }, { id: '2.2.3', name: 'Radio License' },
      { id: '2.2.4', name: 'AOC' }, { id: '2.2.5', name: 'Noise Certificate' }, { id: '2.2.6', name: 'ARC' },
      { id: '2.2.7', name: 'Insurance' }, { id: '2.2.8', name: 'TLB', optional: 'if applicable' } ] } ] },
  { id: '3', title: 'A/C Functional Checks', folder: '3 AC Functional Checks', children: [
    { id: '3.1', title: 'Check A/C Fluid Levels per CDU', folder: '3.1 Check AC Fluid Levels per CDU', docs: [
      { id: '3.1.1', name: 'ENG Oil' }, { id: '3.1.2', name: 'HYD' }, { id: '3.1.3', name: 'OXY' }, { id: '3.1.4', name: 'NAV Database' } ] },
    { id: '3.2', title: 'Initiate A/C Functional Checks as required', folder: '3.2 Initiate AC Functional Checks as required', docs: [
      { id: '3.2.1', name: 'Exterior Lights Check', optional: true }, { id: '3.2.2', name: 'Flaps - Slats - Spoiler Check', optional: true },
      { id: '3.2.3', name: 'Cockpit Video System Check', optional: true }, { id: '3.2.4', name: 'Flight Control Check', optional: true } ] } ] },
  { id: '4', title: 'A/C Interior Inspection', folder: '4 AC Interior Inspection', children: [
    { id: '4.1', title: 'Interior – Emergency Equipment (Cockpit & Cabin)', folder: '4.1 Interior - Emergency Equipment (Cockpit & Cabin)', docs: [
      { id: '4.1.1', name: 'Cockpit Emergency Equipment' }, { id: '4.1.2', name: 'Cabin Emergency Equipment' },
      { id: '4.1.3', name: 'Emergency Light Check', optional: true } ] },
    { id: '4.2', title: 'Interior – Cockpit', folder: '4.2 Interior - Cockpit' },
    { id: '4.3', title: 'Interior – Cabin', folder: '4.3 Interior - Cabin' } ] },
  { id: '5', title: 'A/C Exterior Inspection', folder: '5 AC Exterior Inspection', children: [
    { id: '5.1', title: 'Exterior – A/C General Condition', folder: '5.1 Exterior - AC General Condition' },
    { id: '5.2', title: 'Exterior – Structures Condition', folder: '5.2 Exterior - Structures Condition' },
    { id: '5.3', title: 'Exterior – Engine Condition', folder: '5.3 Exterior - Engine Condition', children: [
      { id: '5.3.1', title: 'Engine #1', folder: '5.3.1 Engine 1' },
      { id: '5.3.2', title: 'Engine #2', folder: '5.3.2 Engine 2' },
      { id: '5.3.3', title: 'APU', folder: '5.3.3 APU' } ] },
    { id: '5.4', title: 'Exterior – Landing Gears Condition', folder: '5.4 Exterior - Landing Gears Condition', children: [
      { id: '5.4.1', title: 'NLG', folder: '5.4.1 NLG' },
      { id: '5.4.2', title: 'MLG LH', folder: '5.4.2 MLG LH' },
      { id: '5.4.3', title: 'MLG RH', folder: '5.4.3 MLG RH' } ] },
    { id: '5.5', title: 'Exterior – Doors / Panels', folder: '5.5 Exterior - Doors - Panels' },
    { id: '5.6', title: 'Exterior – Cargo Compartment', folder: '5.6 Exterior - Cargo Compartment', children: [
      { id: '5.6.1', title: 'FWD Cargo', folder: '5.6.1 FWD Cargo' },
      { id: '5.6.2', title: 'AFT Cargo', folder: '5.6.2 AFT Cargo' } ] },
    { id: '5.7', title: 'Exterior – Avionics Bay', folder: '5.7 Exterior - Avionics Bay' } ] },
  // samples: Samples werden aus beliebigen Prüfpunkten heraus angelegt und landen hier
  { id: '6', title: 'A/C Physical Compliance with Records', folder: '6 AC Physical Compliance with Records', children: [
    { id: '6.1', title: 'Component Samples', folder: '6.1 Component Samples', samples: 'comp' },
    { id: '6.2', title: 'LOPA Samples', folder: '6.2 LOPA Samples', samples: 'lopa' },
    { id: '6.3', title: 'D&B Samples', folder: '6.3 D&B Samples', samples: 'db' } ] },
];

/* ---------------- Gedankenstützen je Prüfpunkt ----------------
   Werden immer aus dieser aktuellen Liste gelesen (nicht aus der
   Session-Kopie) -> Änderungen wirken auch in laufenden Physicals.
   Einfach Zeilen ergänzen/ändern; Key = Prüfpunkt-ID. */
const HINTS = {
  '4.2': [
    'Windshields & Side Windows – delamination, scratches, cracks, heating',
    'Seats incl. Observer – adjustment, harnesses/buckles, covers',
    'Lights – panel/flood/dome/map lights, annunciator test',
    'Placards & Markings – present, legible, correct (compass card, limitations, INOP ↔ MEL/techlog)',
    'Additionally: panels/displays, crew oxygen masks, pulled CBs ↔ techlog, cockpit door',
  ],
  '4.3': [
    'Furniture general (e.g. bins, side walls, windscreens, floor area) – damage, bin latches, loose parts, carpets',
    'Windows – scratches, cracks, shades',
    'Passenger Seats (incl. seat belts, tables, armrests, seat pocket) – recline, life vest under seat',
    'Attendant Seats – auto-retract, harness',
    'Lights – cabin lights, reading lights, exit signs, floor path marking',
    'Galley function / condition – latches, trolley stops, inserts, water/drain',
    'Lavatories function / condition – smoke detector, waste bin flap, ashtray',
    'Placards & Markings – no smoking/fasten seatbelt, row/bin/exit placards',
    'Additionally: PSU/oxygen box doors, doors/slide armed indication, assist handles',
  ],
  '5.1': ['Paint condition', 'Exterior lights', 'Fluid leakages', 'Missing parts (e.g. fasteners, static dischargers)'],
  '5.2': ['Airframe condition', 'Radome condition', 'LH wing condition (flaps extended)', 'RH wing condition (flaps extended)',
    'Horizontal stabilizer condition', 'Vertical stabilizer condition', 'Pitot tubes condition', 'Static ports & area condition'],
  '5.3': ['Engine cowling condition (fan cowls opened)', 'Engine air inlet condition', 'Fan condition (incl. lining)', 'Fluid levels / leakages', 'Access panel condition'],
  '5.4': ['Tire condition', 'Brake condition', 'Shock strut condition', 'Fluid leakages', 'Gear door condition'],
  '5.5': ['Passenger / service door function / condition', 'Cargo door function / condition', 'Access door / panel condition', 'Proper bonding (EWIS)'],
  '5.6': ['General condition', 'Cargo securing devices', 'Lights', 'ETOPS requirements (as applicable)'],
  '5.7': ['General condition (EWIS)', 'Lights'],
};

/* ---------------- Samples (Prüfpunkt 6) ---------------- */
const SAMPLE_KINDS = { comp: { item: '6.1', label: 'Component' }, lopa: { item: '6.2', label: 'LOPA' }, db: { item: '6.3', label: 'D&B' } };
// Sitzgruppen je Typ (aus Feld „Type“ des Physicals); Fallback Narrowbody
const lopaSides = type => /A?33\d/i.test(type || '') ? ['AC', 'DEFG', 'HK'] : ['ABC', 'DEF'];
const smNo = sm => 'S' + pad(sm.num);
const samplesOf = (s, kind) => (s.samples || []).filter(x => x.kind === kind).sort((a, b) => a.num - b.num);
function smOrigin(s, sm) { const l = sm.origin && leafById(s, sm.origin); return l ? `${l.id} ${l.title}` : ''; }
function smLabel(s, sm) {
  if (sm.kind === 'lopa') return [`Row ${sm.row || '?'} ${sm.side || ''}`.trim(), sm.desc].filter(Boolean).join(' · ');
  return [smOrigin(s, sm), sm.pn && 'P/N ' + sm.pn, sm.sn && 'S/N ' + sm.sn, sm.desc].filter(Boolean).join(' · ');
}
function smFile(s, sm) {
  const k = SAMPLE_KINDS[sm.kind], o = sm.origin && leafById(s, sm.origin);
  const parts = [`${k.item} ${smNo(sm)}`];
  if (sm.kind === 'lopa') parts.push(`Row ${sm.row || 'X'} ${sm.side || ''}`.trim());
  else if (o && !o.samples) parts.push(o.folder);
  if (sm.kind === 'comp' && sm.pn) parts.push('PN ' + sm.pn);
  if (sm.kind === 'comp' && sm.sn) parts.push('SN ' + sm.sn);
  if (sm.kind === 'db' && sm.desc) parts.push(sm.desc.slice(0, 40));
  return safeName(parts.join('_'));
}
// Erlaubte Sample-Arten je Herkunft: Kat. 4 ohne D&B, Kat. 5 ohne LOPA
const allowedKinds = id => Object.keys(SAMPLE_KINDS).filter(k => !(/^4\./.test(id || '') && k === 'db') && !(/^5\./.test(id || '') && k === 'lopa'));
const defaultKind = id => /^4\.3/.test(id) ? 'lopa' : /^5\.[12]/.test(id) ? 'db' : 'comp';

const AC_TYPES = ['A320-212', 'A320-214', 'A320-271N', 'A321-211', 'A321-271NX', 'A330-941'];

const QUALITY = {
  original: { label: 'Original (full resolution, large) – default', max: 0 },
  high:     { label: 'High – max. 3000 px', max: 3000, q: 0.88 },
  medium:   { label: 'Medium – max. 2000 px', max: 2000, q: 0.85 },
};

/* ---------------- Utils ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
const pad = (n, l = 2) => String(n).padStart(l, '0');
const nowISO = () => new Date().toISOString();
const fmtDT = iso => { const d = new Date(iso); return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const fmtDay = ymd => { const [y, m, d] = String(ymd || '').split('-'); return d ? `${d}.${m}.${y}` : ''; };
const todayYMD = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const fmtMB = b => (b / 1048576).toFixed(b > 104857600 ? 0 : 1) + ' MB';
const safeName = s => String(s).replace(/[\\/:*?"<>|#%]+/g, '-').replace(/\s+/g, ' ').trim();
const byCreated = (a, b) => a.createdAt.localeCompare(b.createdAt);
const extOf = t => ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/heic': 'heic', 'image/heif': 'heif', 'image/webp': 'webp' }[t] || 'jpg');
const fNo = f => 'F' + pad(f.num);

const settings = { quality: 'original' };
try { Object.assign(settings, JSON.parse(localStorage.getItem('arc-settings') || '{}')); } catch {}
const saveSettings = () => { try { localStorage.setItem('arc-settings', JSON.stringify(settings)); } catch {} };

/* ---------------- IndexedDB ---------------- */
let dbp;
function db() {
  return dbp ||= new Promise((res, rej) => {
    const r = indexedDB.open('arc-physical', 1);
    r.onupgradeneeded = () => {
      const d = r.result;
      d.createObjectStore('sessions', { keyPath: 'id' });
      d.createObjectStore('findings', { keyPath: 'id' }).createIndex('sessionId', 'sessionId');
      d.createObjectStore('photos', { keyPath: 'id' }).createIndex('sessionId', 'sessionId');
      d.createObjectStore('blobs', { keyPath: 'id' }); // Vollbild als ArrayBuffer (robuster als Blob auf iOS)
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
const reqP = r => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
async function tx(stores, mode, fn) {
  const d = await db();
  return new Promise((res, rej) => {
    const t = d.transaction(stores, mode); let out;
    Promise.resolve(fn(t)).then(v => { out = v; });
    t.oncomplete = () => res(out);
    t.onerror = () => rej(t.error);
    t.onabort = () => rej(t.error || new Error('Transaktion abgebrochen'));
  });
}
const get = (s, k) => tx([s], 'readonly', t => reqP(t.objectStore(s).get(k)));
const getAll = s => tx([s], 'readonly', t => reqP(t.objectStore(s).getAll()));
const bySession = (s, id) => tx([s], 'readonly', t => reqP(t.objectStore(s).index('sessionId').getAll(id)));
const put = (s, v) => tx([s], 'readwrite', t => { t.objectStore(s).put(v); });

/* ---------------- Modell ---------------- */
let cur = null; // { s, findings, photos }
let capture = null, fFilter = 'all', exportReady = null, viewer = null;
const thumbURLs = new Map();

// Beliebig tiefe Verschachtelung: nur Knoten ohne `children` sind prüfbare Punkte
function walk(nodes, parents = [], out = []) {
  for (const n of nodes) {
    if (n.children) walk(n.children, [...parents, n], out);
    else out.push({ ...n, parents, group: parents[0] || null });
  }
  return out;
}
const leaves = s => walk(s.checklist);
const leafById = (s, id) => leaves(s).find(l => l.id === id);
const leafPath = l => [...(l.parents || []).map(p => p.folder), l.folder].join('/');
const itemState = (s, id) => (s.items[id] ||= { status: 'open', reason: '', note: '' });

function evalItem(c, l) {
  const st = c.s.items[l.id] || { status: 'open', reason: '', note: '' };
  const n = c.photos.filter(p => p.itemId === l.id).length;
  let min = l.minPhotos ?? DEFAULT_MIN_PHOTOS, ok = n >= min, miss = [];
  if (l.docs) {
    const req = l.docs.filter(d => !d.optional);
    miss = req.filter(d => !c.photos.some(p => p.itemId === l.id && p.docId === d.id));
    min = req.length; ok = !miss.length;
  }
  if (l.samples) { min = 1; ok = samplesOf(c.s, l.samples).some(x => c.photos.some(p => p.sampleId === x.id)); }
  const fnd = c.findings.filter(f => f.itemId === l.id).sort((a, b) => a.num - b.num);
  let state = 'open';
  if (st.status === 'na') state = st.reason?.trim() ? 'done' : 'warn';
  else if (st.status === 'ok') state = ok ? 'done' : 'warn';
  return { st, n, min, ok, miss, fnd, state };
}
function checkIssues(c) {
  const r = { open: [], noPhoto: [], noReason: [] };
  for (const l of leaves(c.s)) {
    const e = evalItem(c, l);
    if (e.st.status === 'open') r.open.push(l);
    else if (e.st.status === 'ok' && !e.ok) r.noPhoto.push(l);
    else if (e.st.status === 'na' && !e.st.reason?.trim()) r.noReason.push(l);
  }
  const fs = [...c.findings].sort((a, b) => a.num - b.num);
  r.noWO = fs.filter(f => !f.wo?.trim());
  r.noText = fs.filter(f => !f.text?.trim());
  r.count = r.open.length + r.noPhoto.length + r.noReason.length + r.noWO.length + r.noText.length;
  return r;
}
function summary(c) {
  const L = leaves(c.s);
  return { done: L.filter(l => evalItem(c, l).state === 'done').length, total: L.length,
    photos: c.photos.length, findings: c.findings.length, noWO: c.findings.filter(f => !f.wo?.trim()).length };
}
async function touch() {
  const c = cur; if (!c) return;
  c.s.modifiedAt = nowISO(); c.s.summary = summary(c);
  await put('sessions', c.s);
}
function revokeThumbs() { for (const u of thumbURLs.values()) URL.revokeObjectURL(u); thumbURLs.clear(); }
async function loadSession(id) {
  if (cur && cur.s.id === id) return cur;
  revokeThumbs(); cur = null; exportReady = null;
  const s = await get('sessions', id); if (!s) return null;
  const [findings, photos] = await Promise.all([bySession('findings', id), bySession('photos', id)]);
  cur = { s, findings, photos };
  if (!s.closedAt) await syncChecklist(cur);
  return cur;
}
// Offene Physicals übernehmen die aktuelle Prüfliste; abgeschlossene bleiben unverändert.
// Fotos/Findings auf entfallenen Punkten werden umgehängt (Doku-Nr. -> docs, sonst erster Unterpunkt).
async function syncChecklist(c) {
  const s = c.s, next = JSON.stringify(CHECKLIST);
  if (JSON.stringify(s.checklist) === next) return;
  s.checklist = JSON.parse(next);
  const L = leaves(s), ids = new Set(L.map(l => l.id));
  const map = id => {
    if (ids.has(id)) return null;
    const dl = L.find(l => l.docs?.some(d => d.id === id));
    if (dl) return { itemId: dl.id, docId: id };
    const ch = L.find(l => l.id.startsWith(id + '.')) || L.find(l => id.startsWith(l.id + '.'));
    return ch ? { itemId: ch.id } : null;
  };
  const ph = [], fn = [];
  for (const p of c.photos) {
    const m = map(p.itemId);
    if (m) { p.itemId = m.itemId; if (m.docId && !p.findingId) p.docId = m.docId; ph.push(p); }
    else if (p.docId && !L.find(l => l.id === p.itemId)?.docs?.some(d => d.id === p.docId)) { p.docId = null; ph.push(p); }
  }
  for (const f of c.findings) { const m = map(f.itemId); if (m) { f.itemId = m.itemId; fn.push(f); } }
  for (const [k, v] of Object.entries(s.items)) { const m = map(k); if (m && !s.items[m.itemId]) s.items[m.itemId] = v; }
  if (ph.length) await savePhotoMetas(ph);
  if (fn.length) await tx(['findings'], 'readwrite', t => { for (const f of fn) t.objectStore('findings').put(f); });
  await touch();
}
function thumbURL(p) {
  if (!p.thumb) return '';
  let u = thumbURLs.get(p.id);
  if (!u) { u = URL.createObjectURL(new Blob([p.thumb], { type: 'image/jpeg' })); thumbURLs.set(p.id, u); }
  return u;
}

/* Debounced Speichern von Texteingaben */
const dirtyF = new Set(); let sessDirty = false, flushT;
function schedule() { clearTimeout(flushT); flushT = setTimeout(flush, 400); }
async function flush() {
  clearTimeout(flushT);
  const fs = [...dirtyF]; dirtyF.clear(); const sd = sessDirty; sessDirty = false;
  for (const f of fs) await put('findings', f);
  if (cur && (sd || fs.length)) await touch();
}

/* ---------------- Bilder ---------------- */
function drawScaled(img, max) {
  const w = img.naturalWidth, h = img.naturalHeight;
  const k = max ? Math.min(1, max / Math.max(w, h)) : 1;
  const cv = document.createElement('canvas');
  cv.width = Math.round(w * k); cv.height = Math.round(h * k);
  cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
  return cv;
}
const toBlob = (cv, q) => new Promise((res, rej) => cv.toBlob(b => b ? res(b) : rej(new Error('Bildkonvertierung fehlgeschlagen')), 'image/jpeg', q));
async function processImage(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image(); img.src = url;
    try { await img.decode(); } catch { // nicht dekodierbar (z. B. HEIC am Desktop): Original ohne Vorschau
      return { full: await file.arrayBuffer(), type: file.type || 'image/jpeg', thumb: null, w: 0, h: 0 };
    }
    const q = QUALITY[settings.quality] || QUALITY.high;
    let full, type, w = img.naturalWidth, h = img.naturalHeight;
    if (!q.max || (Math.max(w, h) <= q.max && file.type === 'image/jpeg')) {
      full = await file.arrayBuffer(); type = file.type || 'image/jpeg';
    } else {
      const cv = drawScaled(img, q.max); w = cv.width; h = cv.height;
      full = await (await toBlob(cv, q.q)).arrayBuffer(); type = 'image/jpeg'; cv.width = cv.height = 0;
    }
    const tc = drawScaled(img, 400);
    const thumb = await (await toBlob(tc, 0.72)).arrayBuffer(); tc.width = tc.height = 0;
    return { full, type, thumb, w, h };
  } finally { URL.revokeObjectURL(url); }
}
async function addPhotos(files, ctx) {
  const c = cur; if (!c) return;
  let fid = ctx.fid;
  if (ctx.newFinding) fid = (await createFinding(ctx.item)).id;
  if (files.length > 1) busy(`Saving ${files.length} photos …`);
  const added = [];
  try {
    for (const file of files) {
      const r = await processImage(file);
      const meta = { id: uid(), sessionId: c.s.id, itemId: ctx.item, findingId: fid || null, docId: (!fid && ctx.doc) || null, sampleId: (!fid && ctx.sample) || null, thumb: r.thumb,
        type: r.type, w: r.w, h: r.h, size: r.full.byteLength, createdAt: nowISO(), note: '' };
      await tx(['photos', 'blobs'], 'readwrite', t => {
        t.objectStore('photos').put(meta);
        t.objectStore('blobs').put({ id: meta.id, buf: r.full, type: r.type });
      });
      c.photos.push(meta); added.push(meta);
    }
  } finally { busy(false); }
  await touch();
  navigator.storage?.persist?.();
  if (ctx.newFinding) { location.hash = `#/s/${c.s.id}/f/${fid}`; return; }
  render();
  const n = c.photos.filter(p => p.itemId === ctx.item).length;
  if (ctx.smEdit) { const sm = c.s.samples.find(x => x.id === ctx.sample); if (sm) return smDetailSheet(sm); }
  toast(`${added.length > 1 ? added.length + ' photos' : 'Photo'} saved · ${ctx.sample ? ctx.item + ' ' + smNo(c.s.samples.find(x => x.id === ctx.sample) || { num: 0 }) : ctx.doc || ctx.item} (${ctx.sample ? c.photos.filter(p => p.sampleId === ctx.sample).length : ctx.doc ? c.photos.filter(p => p.docId === ctx.doc).length : n})`, 'Undo', () => deletePhotos(added));
}
async function deletePhotos(list) {
  const c = cur; if (!c) return;
  await tx(['photos', 'blobs'], 'readwrite', t => { for (const p of list) { t.objectStore('photos').delete(p.id); t.objectStore('blobs').delete(p.id); t.objectStore('blobs').delete(p.id + '#ann'); } });
  const ids = new Set(list.map(p => p.id));
  c.photos = c.photos.filter(p => !ids.has(p.id));
  for (const id of ids) { const u = thumbURLs.get(id); if (u) { URL.revokeObjectURL(u); thumbURLs.delete(id); } }
  await touch(); render();
}
async function createFinding(itemId) {
  const c = cur;
  c.s.findingSeq = (c.s.findingSeq || 0) + 1;
  const f = { id: uid(), sessionId: c.s.id, num: c.s.findingSeq, itemId, text: '', wo: '', rectified: false, rect: '', createdAt: nowISO() };
  await put('findings', f); c.findings.push(f); await touch();
  return f;
}
async function savePhotoMetas(list) { await tx(['photos'], 'readwrite', t => { for (const p of list) t.objectStore('photos').put(p); }); }

/* ---------------- UI-Bausteine ---------------- */
const app = $('#app');
function topbar(title, sub, back, right = '') {
  const b = back === 'history' ? `<button class="tb-back" data-act="back" aria-label="Back">‹</button>`
    : back ? `<a class="tb-back" href="${back}" aria-label="Back">‹</a>` : '<span class="tb-sp"></span>';
  return `<header class="top">${b}<div class="tb-t"><div class="tb-title">${esc(title)}</div>${sub ? `<div class="tb-sub">${esc(sub)}</div>` : ''}</div>${right || '<span class="tb-sp"></span>'}</header>`;
}
const sessSub = s => [s.msn && 'MSN ' + s.msn, s.type, fmtDay(s.date)].filter(Boolean).join(' · ');
function tabs(c, active) {
  const b = `#/s/${c.s.id}`, iss = checkIssues(c);
  return `<nav class="tabs"><a href="${b}" class="${active === 'list' ? 'on' : ''}">Checklist</a>
  <a href="${b}/findings" class="${active === 'findings' ? 'on' : ''}">Findings${c.findings.length ? ` (${c.findings.length})` : ''}</a>
  <a href="${b}/close" class="${active === 'close' ? 'on' : ''}">Close-out${iss.count ? ` <span class="dot"></span>` : ''}</a></nav>`;
}
function photoGrid(ph, ctx) {
  if (!ph.length) return '<div class="mut sm">No photos yet</div>';
  return `<div class="grid">${ph.map(p => `<button class="ph" data-act="view" data-pid="${p.id}" data-ctx="${esc(ctx)}">${p.thumb ? `<img src="${thumbURL(p)}" alt="" loading="lazy">` : '<span class="noth">Photo</span>'}${p.findingId ? `<span class="ph-f">${fNo(cur.findings.find(f => f.id === p.findingId) || { num: 0 })}</span>` : ''}</button>`).join('')}</div>`;
}
function itemSelect(s, val, field, extra = '') {
  return `<select class="inp" data-field="${field}" ${extra}>${leaves(s).map(l => `<option value="${esc(l.id)}" ${l.id === val ? 'selected' : ''}>${esc(l.id + ' ' + l.title)}</option>`).join('')}</select>`;
}
function stIcon(e) {
  if (e.state === 'done') return e.st.status === 'na' ? ['na', '–'] : ['done', '✓'];
  if (e.state === 'warn') return ['warn', '!'];
  return ['open', ''];
}
function itemRow(c, l, sub) {
  const e = evalItem(c, l), [cls, ic] = stIcon(e);
  return `<a class="row${sub ? ' sub' : ''}" href="#/s/${c.s.id}/i/${l.id}"><span class="st ${cls}">${ic}</span>
  <span class="row-t"><span class="row-id">${esc(l.id)}</span> ${esc(l.title)}</span>
  <span class="row-m">${e.n ? `<span class="chip">📷 ${e.n}</span>` : ''}${e.fnd.length ? `<span class="chip fnd">⚠ ${e.fnd.length}</span>` : ''}</span><span class="chev">›</span></a>`;
}
function progressBox(c) {
  const m = summary(c), pct = Math.round(m.done / m.total * 100);
  return `<div class="card pad"><div class="pb-h"><b>${m.done} / ${m.total} items done</b><span>${pct} %</span></div>
  <div class="pbar"><i style="width:${pct}%"></i></div>
  <div class="mut sm">📷 ${m.photos} photos · ⚠ ${m.findings} Findings${m.noWO ? ` · <span class="bad">${m.noWO} without WO</span>` : ''}${c.s.closedAt ? ` · <span class="ok">closed</span>` : ''}</div></div>`;
}
function findingMini(c, f) {
  return `<a class="fmini" href="#/s/${c.s.id}/f/${f.id}"><b>${fNo(f)}</b><span class="grow">${esc(f.text || '(no description)')}</span>
  <span class="chip ${f.wo ? 'ok' : 'bad'}">${f.wo ? 'WO ' + esc(f.wo) : 'no WO'}</span></a>`;
}

/* ---------------- Views ---------------- */
async function viewHome() {
  const ss = (await getAll('sessions')).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  let h = topbar('ARC Physical', 'Physical Survey Helper', null, `<button class="tb-btn" data-act="settings" aria-label="Settings">⚙︎</button>`);
  h += `<main class="wrap"><button class="btn pri big block" data-act="newSession">+ New Physical</button>`;
  if (!ss.length) h += `<p class="empty">No Physicals yet.</p>`;
  for (const s of ss) {
    const m = s.summary || { done: 0, total: 17, photos: 0, findings: 0, noWO: 0 };
    const pct = m.total ? Math.round(m.done / m.total * 100) : 0;
    const unexp = (m.photos || m.findings) && (!s.exportedAt || s.modifiedAt > s.exportedAt);
    h += `<a class="card sess" href="#/s/${s.id}"><div class="sess-h"><b>${esc(s.reg)}</b><span class="mut">${esc(fmtDay(s.date))}</span></div>
    <div class="mut sm">${esc([s.msn && 'MSN ' + s.msn, s.type, s.location].filter(Boolean).join(' · '))}</div>
    <div class="pbar"><i style="width:${pct}%"></i></div>
    <div class="chips"><span class="chip">${m.done}/${m.total}</span><span class="chip">📷 ${m.photos}</span>
    <span class="chip ${m.findings ? 'fnd' : ''}">⚠ ${m.findings}${m.noWO ? ` · ${m.noWO} without WO` : ''}</span>
    ${s.closedAt ? '<span class="chip ok">closed</span>' : ''}${unexp ? '<span class="chip bad">not exported</span>' : ''}</div></a>`;
  }
  return h + '</main>';
}
function viewSession(c) {
  let h = topbar(c.s.reg, sessSub(c.s), '#/', `<button class="tb-btn" data-act="editSession" aria-label="Edit">✎</button>`);
  h += tabs(c, 'list') + `<main class="wrap">` + progressBox(c);
  const cnt = L => `${L.filter(l => evalItem(c, l).state === 'done').length}/${L.length}`;
  for (const g of c.s.checklist) {
    if (!g.children) { h += `<div class="ghead"><span></span></div><div class="card">${itemRow(c, { ...g, parents: [], group: null })}</div>`; continue; }
    h += `<div class="ghead"><span>${esc(g.id)} ${esc(g.title)}</span><span>${cnt(walk(g.children, [g]))}</span></div><div class="card">`;
    for (const ch of g.children) {
      if (ch.children) {
        const L = walk(ch.children, [g, ch]);
        h += `<div class="subhead"><span>${esc(ch.id)} ${esc(ch.title)}</span><span>${cnt(L)}</span></div>${L.map(l => itemRow(c, l, true)).join('')}`;
      } else h += itemRow(c, { ...ch, parents: [g], group: g });
    }
    h += '</div>';
  }
  return h + '</main>';
}
function viewItem(c, id) {
  const L = leaves(c.s), i = L.findIndex(l => l.id === id);
  if (i < 0) return notFound(c);
  const l = L[i], e = evalItem(c, l), st = e.st, base = `#/s/${c.s.id}`;
  const prev = L[i - 1], next = L[i + 1];
  let h = topbar(`${l.id} ${l.title}`, `${c.s.reg}${l.parents.length ? ' · ' + l.parents[l.parents.length - 1].title : ''}`, base);
  h += `<main class="wrap has-bbar"><div class="card pad"><div class="lbl">Status</div><div class="seg">
  ${[['open', 'Open'], ['ok', 'Checked'], ['na', 'N/A']].map(([v, t]) => `<button data-act="setStatus" data-item="${l.id}" data-v="${v}" class="${st.status === v ? 'on ' + v : ''}">${t}</button>`).join('')}</div>
  ${st.status === 'na' ? `<div class="lbl">N/A reason</div><input class="inp" data-field="naReason" data-id="${l.id}" value="${esc(st.reason)}" placeholder="Required">` : ''}
  ${e.state === 'warn' ? `<div class="hint">${st.status === 'ok' ? (l.docs ? `Missing documents: ${e.miss.map(d => d.name).join(', ')}` : l.samples ? 'At least 1 sample with photo required' : `Required photo missing (${e.n} / ${e.min})`) : 'N/A reason missing'}</div>` : ''}</div>`;
  // Hinweise des Prüfpunkts, sonst vom nächsten Elternknoten (z. B. 5.3 -> 5.3.1/5.3.2/5.3.3)
  const hi = [l, ...[...(l.parents || [])].reverse()].map(n => HINTS[n.id]).find(Boolean);
  if (hi?.length) h += `<details class="card pad hints"><summary class="lbl">What to look for</summary><ul>${hi.map(t => `<li>${esc(t)}</li>`).join('')}</ul></details>`;
  const ph = c.photos.filter(p => p.itemId === l.id).sort(byCreated);
  if (l.docs) {
    for (const d of l.docs) {
      const dp = ph.filter(p => p.docId === d.id);
      h += `<div class="card pad"><div class="lbl">${esc(d.id)} ${esc(d.name)}${d.optional ? ` <span class="mut">(${d.optional === true ? 'optional' : esc(d.optional)})</span>` : ''} <span class="mut">${dp.length ? dp.length + ' photo(s)' : ''}</span></div>${photoGrid(dp, 'd:' + d.id)}
      <button class="btn" data-act="cam" data-item="${l.id}" data-doc="${d.id}">📷 Photo</button>
      <button class="link" data-act="library" data-item="${l.id}" data-doc="${d.id}">From library</button></div>`;
    }
    const rest = ph.filter(p => !p.docId && !p.findingId);
    if (rest.length) h += `<div class="card pad"><div class="lbl">Other photos</div>${photoGrid(rest, 'item:' + l.id)}</div>`;
  } else if (l.samples) {
    const list = samplesOf(c.s, l.samples), sides = lopaSides(c.s.type);
    if (!list.length) h += '<div class="card pad"><div class="mut sm">No samples yet. Use „＋ Sample“ in any checklist item, or add one here.</div></div>';
    for (const sm of list) {
      const sp = ph.filter(p => p.sampleId === sm.id);
      h += `<div class="card pad"><div class="sm-h"><b>${smNo(sm)}</b><span class="mut grow">${esc(smOrigin(c.s, sm))}</span><button class="link bad" data-act="smDel" data-sid="${sm.id}">Delete</button></div>
      ${smFields(sm, sides)}${photoGrid(sp, 'sm:' + sm.id)}
      <button class="btn" data-act="cam" data-item="${l.id}" data-sample="${sm.id}">📷 Photo</button>
      <button class="link" data-act="library" data-item="${l.id}" data-sample="${sm.id}">From library</button></div>`;
    }
    const rest = ph.filter(p => !p.sampleId && !p.findingId);
    if (rest.length) h += `<div class="card pad"><div class="lbl">Other photos</div>${photoGrid(rest, 'item:' + l.id)}</div>`;
    h += `<button class="btn block" data-act="smNew" data-origin="${l.id}" data-kind="${l.samples}">＋ New ${SAMPLE_KINDS[l.samples].label} sample</button>`;
  } else h += `<div class="card pad"><div class="lbl">Photos <span class="mut">${e.n}${e.min ? ` / min. ${e.min}` : ''}</span></div>${photoGrid(ph, 'item:' + l.id)}
  <button class="link" data-act="library" data-item="${l.id}">Add from library</button></div>`;
  const here = (c.s.samples || []).filter(x => x.origin === l.id && !l.samples).sort((a, b) => a.kind.localeCompare(b.kind) || a.num - b.num);
  if (here.length) h += `<div class="card pad"><div class="lbl">Samples taken here</div>${here.map(x => `<a class="iss-i" href="#/s/${c.s.id}/i/${SAMPLE_KINDS[x.kind].item}">${SAMPLE_KINDS[x.kind].item} ${smNo(x)} · ${esc(SAMPLE_KINDS[x.kind].label)}${x.pn ? ' · P/N ' + esc(x.pn) : ''}${x.row ? ' · Row ' + esc(x.row) + ' ' + esc(x.side) : ''} · 📷 ${c.photos.filter(p => p.sampleId === x.id).length} ›</a>`).join('')}</div>`;
  h += `<div class="card pad"><div class="lbl">Findings</div>${e.fnd.length ? e.fnd.map(f => findingMini(c, f)).join('') : '<div class="mut sm">None</div>'}
  <button class="link" data-act="newFindingNoPhoto" data-item="${l.id}">Create finding without photo</button></div>`;
  h += `<div class="card pad"><div class="lbl">Note</div><textarea class="inp" rows="2" data-field="itemNote" data-id="${l.id}" placeholder="optional">${esc(st.note)}</textarea></div>`;
  h += `<div class="nav2">${prev ? `<a class="btn" href="${base}/i/${prev.id}">‹ ${esc(prev.id)}</a>` : '<span></span>'}
  ${next ? `<a class="btn" href="${base}/i/${next.id}">${esc(next.id)} ›</a>` : `<a class="btn" href="${base}/close">Abschluss ›</a>`}</div></main>`;
  h += `<div class="bbar"><button class="btn pri big grow" data-act="cam" data-item="${l.id}">📷 Photo</button>
  ${l.samples || !/^[45]\./.test(l.id) ? '' : `<button class="btn big smbtn" data-act="smNew" data-origin="${l.id}">＋ Sample</button>`}
  <button class="btn big fndbtn" data-act="camFinding" data-item="${l.id}">⚠ Finding</button></div>`;
  return h;
}
function viewFinding(c, fid) {
  const f = c.findings.find(x => x.id === fid);
  if (!f) return notFound(c);
  const l = leafById(c.s, f.itemId), ph = c.photos.filter(p => p.findingId === f.id).sort(byCreated);
  let h = topbar(`Finding ${fNo(f)}`, l ? `${l.id} ${l.title}` : '', 'history');
  h += `<main class="wrap has-bbar"><div class="card pad"><div class="lbl">Description</div>
  <textarea class="inp" rows="3" data-field="fText" data-fid="${f.id}" placeholder="Short description (dictate via keyboard mic)">${esc(f.text)}</textarea></div>`;
  h += `<div class="card pad"><div class="lbl">Photos <span class="mut">${ph.length}</span></div>${photoGrid(ph, 'f:' + f.id)}
  <button class="link" data-act="library" data-item="${f.itemId}" data-fid="${f.id}">Add from library</button></div>`;
  h += `<div class="card pad"><div class="lbl">Work Order</div>
  <input class="inp" data-field="fWO" data-fid="${f.id}" value="${esc(f.wo)}" placeholder="WO number" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false">
  <label class="chk"><input type="checkbox" data-field="fRectified" data-fid="${f.id}" ${f.rectified ? 'checked' : ''}> Rectified</label>
  ${f.rectified ? `<textarea class="inp" rows="2" data-field="fRect" data-fid="${f.id}" placeholder="Rectification (optional)">${esc(f.rect)}</textarea>` : ''}</div>`;
  h += `<div class="card pad"><div class="lbl">Checklist item</div>${itemSelect(c.s, f.itemId, 'fItem', `data-fid="${f.id}"`)}
  <div class="mut sm" style="margin-top:8px">Created ${fmtDT(f.createdAt)}</div></div>
  <button class="btn danger block" data-act="delFinding" data-fid="${f.id}">Delete finding</button></main>`;
  h += `<div class="bbar"><button class="btn pri big grow" data-act="cam" data-item="${f.itemId}" data-fid="${f.id}">📷 Photo for finding</button></div>`;
  return h;
}
function viewFindings(c) {
  let h = topbar(c.s.reg, sessSub(c.s), '#/') + tabs(c, 'findings') + '<main class="wrap">';
  const all = [...c.findings].sort((a, b) => a.num - b.num);
  const flt = { all: () => true, nowo: f => !f.wo?.trim(), wo: f => f.wo?.trim() && !f.rectified, rect: f => f.rectified };
  const lbl = { all: 'All', nowo: 'No WO', wo: 'WO open', rect: 'Rectified' };
  h += `<div class="filters">${Object.keys(flt).map(k => `<button class="chip-btn ${fFilter === k ? 'on' : ''}" data-act="fFilter" data-v="${k}">${lbl[k]} ${all.filter(flt[k]).length}</button>`).join('')}</div>`;
  const list = all.filter(flt[fFilter] || flt.all);
  if (!list.length) h += '<p class="empty">No findings in this view.</p>';
  for (const f of list) {
    const l = leafById(c.s, f.itemId), ph = c.photos.filter(p => p.findingId === f.id).sort(byCreated);
    h += `<div class="card fcard"><a class="fc-h" href="#/s/${c.s.id}/f/${f.id}"><b>${fNo(f)}</b><span class="mut grow">${esc(l ? l.id + ' ' + l.title : f.itemId)}</span><span class="chev">›</span></a>
    ${ph.length ? `<div class="fc-ph">${ph.slice(0, 3).map(p => `<button class="ph" data-act="view" data-pid="${p.id}" data-ctx="f:${f.id}">${p.thumb ? `<img src="${thumbURL(p)}" alt="">` : '<span class="noth">Photo</span>'}</button>`).join('')}</div>` : ''}
    <div class="fc-t">${esc(f.text || '(no description)')}</div>
    <div class="fc-wo"><input class="inp" data-field="fWO" data-fid="${f.id}" value="${esc(f.wo)}" placeholder="Enter WO number" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false">
    ${f.rectified ? '<span class="chip ok">rectified</span>' : ''}</div></div>`;
  }
  return h + '</main>';
}
function viewClose(c) {
  const s = c.s, iss = checkIssues(c), b = `#/s/${s.id}`;
  let h = topbar(s.reg, sessSub(s), '#/') + tabs(c, 'close') + '<main class="wrap">';
  const sec = (title, arr, link) => arr.length ? `<div class="iss"><div class="iss-h">${title} <span class="chip bad">${arr.length}</span></div>${arr.map(link).join('')}</div>` : '';
  const li = l => `<a class="iss-i" href="${b}/i/${l.id}">${esc(l.id)} ${esc(l.title)} ›</a>`;
  const lf = f => `<a class="iss-i" href="${b}/f/${f.id}">${fNo(f)} · ${esc(f.itemId)} ${esc((f.text || '').slice(0, 40))} ›</a>`;
  h += `<div class="card pad"><div class="lbl">Completeness check</div>`;
  h += iss.count ? sec('Items open', iss.open, li) + sec('Required photo missing', iss.noPhoto, li) + sec('N/A without reason', iss.noReason, li)
    + sec('Findings without WO number', iss.noWO, lf) + sec('Findings without description', iss.noText, lf)
    : `<div class="okbox">✓ All items assessed, required photos present, all findings with WO.</div>`;
  h += '</div>';
  if (!s.closedAt) {
    h += `<div class="card pad"><div class="lbl">Close Physical</div>
    ${iss.count ? `<textarea class="inp" rows="2" data-field="closeReason" placeholder="Reason for closing with open items (required)">${esc(s.closeReason || '')}</textarea>` : ''}
    <button class="btn pri block" data-act="closeSession">Close Physical</button></div>`;
  } else {
    h += `<div class="card pad"><div class="okbox">Closed ${fmtDT(s.closedAt)}</div>${s.closeReason ? `<div class="sm">Reason: ${esc(s.closeReason)}</div>` : ''}
    <div class="mut sm">WO numbers and rectifications can still be added.</div>
    <button class="btn block" data-act="reopen">Reopen</button></div>`;
  }
  const size = c.photos.reduce((a, p) => a + (p.size || 0), 0);
  const exp = s.exportedAt && s.modifiedAt <= s.exportedAt;
  h += `<div class="card pad"><div class="lbl">Export (ZIP)</div>
  <div class="sm">${c.photos.length} photos · approx. ${fmtMB(size)} · folder structure per checklist item, findings folder, Findings.csv, inspection report</div>
  <div class="sm ${exp ? 'ok' : 'bad'}">${s.exportedAt ? (exp ? 'Exported ' + fmtDT(s.exportedAt) : 'Changed since last export') : 'Not exported yet'}</div>`;
  if (exportReady && exportReady.sid === s.id) {
    h += `<div class="okbox">ZIP ready: ${esc(exportReady.name)} (${fmtMB(exportReady.blob.size)})</div>
    <button class="btn pri block" data-act="shareZip">Share / Save to Files</button>
    <button class="btn block" data-act="downloadZip">Download</button>`;
  } else h += `<button class="btn pri block" data-act="buildZip">Create ZIP</button>`;
  h += `</div><div class="card pad"><div class="lbl">Clean up device</div>
  <div class="mut sm">Permanently deletes this Physical incl. all photos from the app.</div>
  <button class="btn danger block" data-act="delSession">Delete Physical from device</button></div></main>`;
  return h;
}
function notFound(c) { return topbar('Not found', '', c ? `#/s/${c.s.id}` : '#/') + '<main class="wrap"><p class="empty">Entry does not exist (anymore).</p></main>'; }

/* ---------------- Router ---------------- */
function parseRoute() {
  const p = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (p[0] !== 's' || !p[1]) return { view: 'home' };
  const r = { sid: p[1], view: 'list' };
  if (p[2] === 'findings') r.view = 'findings';
  else if (p[2] === 'close') r.view = 'close';
  else if (p[2] === 'i') { r.view = 'item'; r.id = p[3]; }
  else if (p[2] === 'f') { r.view = 'finding'; r.id = p[3]; }
  return r;
}
let lastKey = '';
async function render() {
  const r = parseRoute(), key = location.hash, y = window.scrollY;
  let html;
  try {
    if (r.view === 'home') html = await viewHome();
    else {
      const c = await loadSession(r.sid);
      if (!c) { location.hash = '#/'; return; }
      html = { list: viewSession, findings: viewFindings, close: viewClose, item: viewItem, finding: viewFinding }[r.view](c, r.id);
    }
  } catch (err) { console.error(err); html = `<main class="wrap"><p class="bad">Fehler: ${esc(err.message)}</p></main>`; }
  app.innerHTML = html;
  window.scrollTo(0, key === lastKey ? y : 0);
  lastKey = key;
}

/* ---------------- Overlays ---------------- */
let toastT, toastFn;
function toast(msg, action, fn) {
  const el = $('#toast');
  el.innerHTML = `<span>${esc(msg)}</span>${action ? `<button data-act="toastAct">${esc(action)}</button>` : ''}`;
  toastFn = fn; el.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; toastFn = null; }, action ? 5000 : 3000);
}
function busy(msg) { const el = $('#busy'); if (msg === false) { el.hidden = true; return; } el.textContent = msg; el.hidden = false; }
function openSheet(html) { const el = $('#sheet'); el.innerHTML = `<div class="sheet-bg" data-act="sheetBg"><div class="sheet">${html}</div></div>`; el.hidden = false; }
function closeSheet() { const el = $('#sheet'); el.hidden = true; el.innerHTML = ''; }

function sessionSheet(s) {
  const v = s || { reg: '', msn: '', type: '', location: '', date: todayYMD() };
  openSheet(`<h2>${s ? 'Edit Physical' : 'New Physical'}</h2>
  <label class="lbl">Registration *</label><input class="inp" id="fReg" value="${esc(v.reg)}" placeholder="D-ABCD" autocapitalize="characters" autocomplete="off" autocorrect="off">
  <label class="lbl">MSN</label><input class="inp" id="fMsn" value="${esc(v.msn)}" autocomplete="off">
  <label class="lbl">Type</label><select class="inp" id="fType"><option value="">– select –</option>${[...AC_TYPES, ...(v.type && !AC_TYPES.includes(v.type) ? [v.type] : [])].map(t => `<option ${v.type === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>
  <label class="lbl">Location</label><input class="inp" id="fLoc" value="${esc(v.location)}" autocomplete="off">
  <label class="lbl">Date</label><input class="inp" id="fDate" type="date" value="${esc(v.date)}">
  <div class="row2"><button class="btn" data-act="sheetCancel">Cancel</button><button class="btn pri" data-act="saveSession" data-id="${s ? s.id : ''}">Save</button></div>`);
  if (!s) setTimeout(() => $('#fReg')?.focus(), 50);
}
function smFields(sm, sides, inSheet) {
  const a = k => inSheet ? `id="sm_${k}"` : `data-field="sm_${k}" data-sid="${sm.id}"`;
  const inp = (k, lbl, ph = '', extra = '') => `<label class="lbl">${lbl}</label><input class="inp" ${a(k)} value="${esc(sm[k] || '')}" placeholder="${ph}" autocomplete="off" autocorrect="off" ${extra}>`;
  if (sm.kind === 'comp') return inp('pn', 'P/N', 'optional', 'autocapitalize="characters" spellcheck="false"') + inp('sn', 'S/N', 'optional', 'autocapitalize="characters" spellcheck="false"') + inp('desc', 'Description', 'optional');
  if (sm.kind === 'lopa') return inp('row', 'Row *', 'e.g. 12', 'inputmode="numeric"')
    + `<label class="lbl">Seats *</label><select class="inp" ${a('side')}>${sides.map(x => `<option ${sm.side === x ? 'selected' : ''}>${x}</option>`).join('')}</select>` + inp('desc', 'Remark', 'optional');
  return inp('desc', 'Location / description', 'optional, e.g. LH wing lower skin aft of MLG');
}
let smDraft = null;
function sampleSheet() {
  const sm = smDraft, fixed = sm.fixed, sides = lopaSides(cur.s.type);
  if (sm.kind === 'lopa' && !sm.side) sm.side = sides[0];
  openSheet(`<h2>New sample</h2>${sm.origin ? `<div class="mut sm">Origin: ${esc(smOrigin(cur.s, sm))}</div>` : ''}
  ${fixed ? '' : `<div class="seg" style="margin-top:12px">${Object.entries(SAMPLE_KINDS).filter(([k]) => allowedKinds(sm.origin).includes(k)).map(([k, v]) => `<button data-act="smKind" data-v="${k}" class="${sm.kind === k ? 'on open' : ''}">${esc(v.label)}</button>`).join('')}</div>`}
  ${sm.kind === 'comp' ? '<div class="mut sm" style="margin-top:12px">Take the photo first – P/N, S/N and description are entered afterwards.</div>' : smFields(sm, sides, true)}
  <div class="row2"><button class="btn" data-act="sheetCancel">Cancel</button><button class="btn pri" data-act="smCreate">📷 Save & photo</button></div>
  <button class="link" data-act="smCreate" data-src="lib">Save & choose from library</button>`);
}
function smDetailSheet(sm) {
  openSheet(`<h2>${SAMPLE_KINDS[sm.kind].item} ${smNo(sm)} · ${esc(SAMPLE_KINDS[sm.kind].label)}</h2>${sm.origin ? `<div class="mut sm">Origin: ${esc(smOrigin(cur.s, sm))}</div>` : ''}
  ${smFields(sm, lopaSides(cur.s.type))}
  <div class="row2"><button class="btn pri" data-act="smDone">Done</button></div>`);
  setTimeout(() => $('#sheet [data-field="sm_pn"]')?.focus(), 50);
}
function smReadSheet() { for (const k of ['pn', 'sn', 'desc', 'row', 'side']) { const el = $('#sm_' + k); if (el) smDraft[k] = el.value.trim(); } }

async function saveSession(id) {
  const reg = $('#fReg').value.trim().toUpperCase();
  if (!reg) { toast('Registration missing'); return; }
  const data = { reg, msn: $('#fMsn').value.trim(), type: $('#fType').value.trim(), location: $('#fLoc').value.trim(), date: $('#fDate').value || todayYMD() };
  if (id) { Object.assign(cur.s, data); await touch(); closeSheet(); render(); return; }
  const s = { id: uid(), ...data, createdAt: nowISO(), modifiedAt: nowISO(), checklist: JSON.parse(JSON.stringify(CHECKLIST)),
    items: {}, findingSeq: 0, closedAt: null, closeReason: '', exportedAt: null, appVersion: APP_VERSION };
  s.summary = { done: 0, total: leaves(s).length, photos: 0, findings: 0, noWO: 0 };
  await put('sessions', s);
  navigator.storage?.persist?.();
  closeSheet(); location.hash = `#/s/${s.id}`;
}
async function settingsSheet() {
  openSheet(`<h2>Settings</h2><label class="lbl">Photo quality (for new photos)</label>
  <select class="inp" id="setQ">${Object.entries(QUALITY).map(([k, q]) => `<option value="${k}" ${settings.quality === k ? 'selected' : ''}>${q.label}</option>`).join('')}</select>
  <div class="mut sm">“Original” keeps full resolution and EXIF data but creates very large exports. “High” keeps placards legible and the ZIP export on the iPhone more stable.</div>
  <div class="lbl">Storage</div><div class="sm" id="storInfo">…</div>
  <div class="mut sm">Version ${APP_VERSION}. Data stays on this device only.</div>
  <div class="row2"><button class="btn pri" data-act="sheetCancel">Done</button></div>`);
  $('#setQ').onchange = e => { settings.quality = e.target.value; saveSettings(); };
  try {
    const est = await navigator.storage?.estimate?.(); const pers = await navigator.storage?.persisted?.();
    $('#storInfo').textContent = est ? `${fmtMB(est.usage || 0)} used · persistent storage: ${pers ? 'yes' : 'not confirmed (add app to Home Screen)'}` : 'not available';
  } catch { $('#storInfo').textContent = 'not available'; }
}

/* Foto-Viewer */
async function openViewer(pid, ctx, orig = false) {
  const p = cur?.photos.find(x => x.id === pid); if (!p) return;
  const b = await get('blobs', p.annotated && !orig ? pid + '#ann' : pid);
  if (viewer?.url) URL.revokeObjectURL(viewer.url);
  viewer = { pid, ctx, orig, url: b ? URL.createObjectURL(new Blob([b.buf], { type: b.type })) : '' };
  document.body.classList.add('noscroll');
  renderViewer();
}
function viewerList() {
  const i = viewer.ctx.indexOf(':'), k = viewer.ctx.slice(0, i), v = viewer.ctx.slice(i + 1);
  return cur.photos.filter(p => k === 'f' ? p.findingId === v : k === 'd' ? p.docId === v : k === 'sm' ? p.sampleId === v : p.itemId === v).sort(byCreated);
}
function renderViewer() {
  const c = cur, p = c.photos.find(x => x.id === viewer.pid);
  if (!p) return closeViewer();
  const list = viewerList(), i = list.findIndex(x => x.id === p.id), el = $('#viewer');
  el.innerHTML = `<div class="v-top"><button class="v-btn" data-act="vClose" aria-label="Close">✕</button>
  <span class="v-info">${i + 1}/${list.length}</span>
  ${p.annotated ? `<button class="v-btn txt" data-act="vOrig">${viewer.orig ? 'Marked' : 'Original'}</button>` : ''}
  <button class="v-btn txt mark" data-act="vEdit">✏︎ Mark up</button>
  <button class="v-btn" data-act="vDel" aria-label="Delete">🗑</button></div>
  <div class="v-img">${viewer.url ? `<img src="${viewer.url}" alt="">` : '<span>Image not readable</span>'}
  ${i > 0 ? '<button class="v-nav l" data-act="vPrev">‹</button>' : ''}${i < list.length - 1 ? '<button class="v-nav r" data-act="vNext">›</button>' : ''}</div>
  <div class="v-panel"><div class="v-meta">${fmtDT(p.createdAt)}${p.annotated ? (viewer.orig ? ' · Original' : ' · marked copy') : ''}</div><label>Checklist item</label>${itemSelect(c.s, p.itemId, 'vItem')}
  <label>Finding</label><select class="inp" data-field="vFinding"><option value="">– no finding (evidence photo) –</option>
  ${[...c.findings].sort((a, b) => a.num - b.num).map(f => `<option value="${f.id}" ${p.findingId === f.id ? 'selected' : ''}>${fNo(f)} · ${esc(f.itemId)} ${esc((f.text || '').slice(0, 30))}</option>`).join('')}
  <option value="__new">+ New finding from this photo</option></select>
  <label>Note</label><input class="inp" data-field="vNote" value="${esc(p.note)}" placeholder="optional"></div>`;
  el.hidden = false;
}
function closeViewer() {
  const el = $('#viewer'); el.hidden = true; el.innerHTML = '';
  if (viewer?.url) URL.revokeObjectURL(viewer.url);
  viewer = null; document.body.classList.remove('noscroll'); render();
}
async function viewerStep(d) {
  const list = viewerList(), i = list.findIndex(x => x.id === viewer.pid), n = list[i + d];
  if (n) await openViewer(n.id, viewer.ctx);
}

/* ---------------- Markieren ----------------
   Original bleibt unverändert (Beweiswert). Markierungen werden als
   Vektoren (normierte Koordinaten 0..1) gespeichert -> jederzeit
   nachbearbeitbar. Zusätzlich wird eine markierte JPEG-Kopie erzeugt. */
let ed = null, edTool = 'circle', edColor = '#ff1f1f';
const ED_W = 0.008; // Strichstärke relativ zur längeren Bildkante

function drawShapes(ctx, shapes, W, H) {
  const m = Math.max(W, H);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const s of shapes) {
    ctx.strokeStyle = s.c; ctx.lineWidth = s.w * m; ctx.beginPath();
    if (s.t === 'circle') {
      const [x1, y1, x2, y2] = s.p;
      ctx.ellipse((x1 + x2) / 2 * W, (y1 + y2) / 2 * H, Math.max(1, Math.abs(x2 - x1) / 2 * W), Math.max(1, Math.abs(y2 - y1) / 2 * H), 0, 0, Math.PI * 2);
    } else if (s.t === 'arrow') {
      const x1 = s.p[0] * W, y1 = s.p[1] * H, x2 = s.p[2] * W, y2 = s.p[3] * H;
      const a = Math.atan2(y2 - y1, x2 - x1), L = s.w * m * 4;
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.moveTo(x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45)); ctx.lineTo(x2, y2);
      ctx.lineTo(x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45));
    } else {
      for (let i = 0; i < s.p.length; i += 2) { const x = s.p[i] * W, y = s.p[i + 1] * H; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    }
    ctx.stroke();
  }
}
async function openEditor(pid) {
  const p = cur.photos.find(x => x.id === pid);
  const b = await get('blobs', pid);
  if (!b) { toast('Original not readable'); return; }
  const url = URL.createObjectURL(new Blob([b.buf], { type: b.type })), img = new Image(); img.src = url;
  try { await img.decode(); } catch { URL.revokeObjectURL(url); toast('This image format cannot be marked up'); return; }
  $('#toast').hidden = true;
  ed = { p, img, url, shapes: JSON.parse(JSON.stringify(p.shapes || [])), drawing: null };
  const el = $('#editor');
  el.innerHTML = `<div class="v-top"><button class="v-btn" data-act="edCancel" aria-label="Cancel">✕</button>
  <span class="v-info">Mark up · ${esc(p.itemId)}</span><button class="btn pri" data-act="edSave">Save</button></div>
  <div class="ed-wrap"><canvas id="edCv"></canvas></div><div class="ed-bar" id="edBar"></div>`;
  el.hidden = false;
  const cv = $('#edCv');
  cv.addEventListener('pointerdown', edDown); cv.addEventListener('pointermove', edMove);
  cv.addEventListener('pointerup', edUp); cv.addEventListener('pointercancel', edUp);
  edBar(); edLayout();
}
function edBar() {
  const tools = [['circle', '◯ Circle'], ['arrow', '➚ Arrow'], ['free', '✎ Free']];
  const cols = ['#ff1f1f', '#ffd400', '#ffffff'];
  $('#edBar').innerHTML = tools.map(([v, t]) => `<button class="ed-b ${edTool === v ? 'on' : ''}" data-act="edTool" data-v="${v}">${t}</button>`).join('')
    + cols.map(c => `<button class="ed-c ${edColor === c ? 'on' : ''}" style="background:${c}" data-act="edColor" data-v="${c}" aria-label="Colour"></button>`).join('')
    + `<span class="grow"></span><button class="ed-b" data-act="edUndo" ${ed.shapes.length ? '' : 'disabled'}>↶</button>
    <button class="ed-b" data-act="edClear" ${ed.shapes.length ? '' : 'disabled'}>All</button>`;
}
function edLayout() {
  if (!ed) return;
  const cv = $('#edCv'), wrap = cv.parentElement, dpr = window.devicePixelRatio || 1;
  const W = wrap.clientWidth, H = wrap.clientHeight, iw = ed.img.naturalWidth, ih = ed.img.naturalHeight;
  cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  const k = Math.min(W / iw, H / ih);
  ed.box = { x: (W - iw * k) / 2, y: (H - ih * k) / 2, w: iw * k, h: ih * k, dpr };
  edDraw();
}
function edDraw() {
  const cv = $('#edCv'), ctx = cv.getContext('2d'), b = ed.box;
  ctx.setTransform(b.dpr, 0, 0, b.dpr, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.drawImage(ed.img, b.x, b.y, b.w, b.h);
  ctx.save(); ctx.translate(b.x, b.y);
  drawShapes(ctx, ed.drawing ? [...ed.shapes, ed.drawing] : ed.shapes, b.w, b.h);
  ctx.restore();
}
function edPt(e) {
  const r = e.currentTarget.getBoundingClientRect(), b = ed.box, cl = v => Math.min(1, Math.max(0, v));
  return [cl((e.clientX - r.left - b.x) / b.w), cl((e.clientY - r.top - b.y) / b.h)];
}
function edDown(e) {
  e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId);
  const [x, y] = edPt(e);
  ed.drawing = { t: edTool, c: edColor, w: ED_W, p: edTool === 'free' ? [x, y] : [x, y, x, y] };
}
function edMove(e) {
  if (!ed?.drawing) return;
  const [x, y] = edPt(e), d = ed.drawing;
  if (d.t === 'free') d.p.push(x, y); else { d.p[2] = x; d.p[3] = y; }
  edDraw();
}
function edUp() {
  const d = ed?.drawing; if (!d) return; ed.drawing = null;
  const big = d.t === 'free' ? d.p.length > 4 : Math.hypot(d.p[2] - d.p[0], d.p[3] - d.p[1]) > 0.015;
  if (big) ed.shapes.push(d);
  edDraw(); edBar();
}
async function makeThumb(img, shapes) {
  const k = Math.min(1, 400 / Math.max(img.naturalWidth, img.naturalHeight));
  const cv = document.createElement('canvas'); cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k);
  const ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0, cv.width, cv.height);
  if (shapes.length) drawShapes(ctx, shapes, cv.width, cv.height);
  const buf = await (await toBlob(cv, 0.72)).arrayBuffer(); cv.width = cv.height = 0;
  return buf;
}
async function edSave() {
  const { p, img, shapes } = ed;
  busy('Saving mark-up …');
  try {
    if (shapes.length) {
      const cv = document.createElement('canvas'); cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      const ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0); drawShapes(ctx, shapes, cv.width, cv.height);
      const full = await (await toBlob(cv, 0.9)).arrayBuffer(); cv.width = cv.height = 0;
      p.thumb = await makeThumb(img, shapes); p.shapes = shapes; p.annotated = true;
      await tx(['photos', 'blobs'], 'readwrite', t => { t.objectStore('photos').put(p); t.objectStore('blobs').put({ id: p.id + '#ann', buf: full, type: 'image/jpeg' }); });
    } else {
      p.thumb = await makeThumb(img, []); p.shapes = []; p.annotated = false;
      await tx(['photos', 'blobs'], 'readwrite', t => { t.objectStore('photos').put(p); t.objectStore('blobs').delete(p.id + '#ann'); });
    }
    const u = thumbURLs.get(p.id); if (u) { URL.revokeObjectURL(u); thumbURLs.delete(p.id); }
    await touch();
  } catch (err) { console.error(err); toast('Save failed: ' + err.message); }
  finally { busy(false); }
  const ctx = viewer?.ctx; closeEditor();
  if (ctx) await openViewer(p.id, ctx);
}
function closeEditor() {
  const el = $('#editor'); el.hidden = true; el.innerHTML = '';
  if (ed?.url) URL.revokeObjectURL(ed.url); ed = null;
}
window.addEventListener('resize', () => setTimeout(edLayout, 100));

/* ---------------- Export ---------------- */
function csvCell(v) { const s = String(v ?? ''); return /[;"\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }
const findingFolder = f => safeName(`${fNo(f)}_${f.itemId}_${f.wo?.trim() ? 'WO' + f.wo.trim() : 'no-WO'}`);
const encPath = p => p.split('/').map(encodeURIComponent).join('/');

function smTable(c) {
  const all = Object.keys(SAMPLE_KINDS).flatMap(k => samplesOf(c.s, k));
  return `<h2>Samples</h2>${all.length ? `<table><tr><th>No.</th><th>Type</th><th>Origin</th><th>P/N</th><th>S/N</th><th>Row / Seats</th><th>Description</th><th>Photos</th></tr>${all.map(x =>
    `<tr><td>${SAMPLE_KINDS[x.kind].item} ${smNo(x)}</td><td>${esc(SAMPLE_KINDS[x.kind].label)}</td><td>${esc(smOrigin(c.s, x))}</td><td>${esc(x.pn)}</td><td>${esc(x.sn)}</td><td>${x.row ? esc(x.row + ' ' + x.side) : ''}</td><td>${esc(x.desc)}</td><td>${c.photos.filter(p => p.sampleId === x.id).length}</td></tr>`).join('')}</table>` : '<p>No samples.</p>'}`;
}
function protocolHTML(c, names, annNames) {
  const s = c.s, L = leaves(s), iss = checkIssues(c), stl = { open: 'open', ok: 'checked', na: 'N/A' };
  const rows = L.map(l => {
    const e = evalItem(c, l);
    const rem = [e.st.status === 'na' ? 'Reason: ' + (e.st.reason || '—') : '', e.st.note].filter(Boolean).join(' | ');
    return `<tr class="${e.state}"><td>${esc(l.id)}</td><td>${esc(l.title)}</td><td>${stl[e.st.status]}${e.state === 'warn' ? ' ⚠' : ''}</td><td>${e.n} / ${e.min}</td><td>${e.fnd.map(fNo).join(', ')}</td><td>${esc(rem)}</td><td>${e.st.changedAt ? fmtDT(e.st.changedAt) : ''}</td></tr>`;
  }).join('');
  const fs = [...c.findings].sort((a, b) => a.num - b.num);
  const frows = fs.map(f => `<tr><td>${fNo(f)}</td><td>${esc(f.itemId)}</td><td>${esc(f.text)}</td><td>${esc(f.wo)}</td><td>${f.rectified ? 'yes' : 'no'}</td><td>${esc(f.rect)}</td><td>${c.photos.filter(p => p.findingId === f.id).length}</td></tr>`).join('');
  const fig = p => `<figure><a href="${encPath(annNames.get(p.id) || names.get(p.id))}"><img src="${encPath(annNames.get(p.id) || names.get(p.id))}" loading="lazy"></a><figcaption>${esc(names.get(p.id).split('/').pop())} · ${fmtDT(p.createdAt)}${p.findingId ? ' · ' + fNo(c.findings.find(f => f.id === p.findingId) || { num: 0 }) : ''}${p.note ? ' · ' + esc(p.note) : ''}</figcaption></figure>`;
  const gal = L.map(l => { const ph = c.photos.filter(p => p.itemId === l.id).sort(byCreated); return ph.length ? `<h3>${esc(l.id)} ${esc(l.title)}</h3><div class="g">${ph.map(fig).join('')}</div>` : ''; }).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Inspection Report ${esc(s.reg)} ${esc(fmtDay(s.date))}</title>
<style>body{font:13px/1.4 -apple-system,Segoe UI,Arial,sans-serif;margin:24px;color:#111}h1{font-size:20px;margin:0 0 4px}h2{font-size:16px;margin:24px 0 8px;border-bottom:2px solid #111}h3{font-size:14px;margin:16px 0 6px}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #bbb;padding:4px 6px;text-align:left;vertical-align:top}th{background:#eee}tr.warn td,tr.open td{background:#fdecea}
.meta td{border:none;padding:2px 12px 2px 0}.g{display:flex;flex-wrap:wrap;gap:8px}figure{margin:0;width:180px}figure img{width:180px;height:135px;object-fit:cover;border:1px solid #ccc}figcaption{font-size:10px;color:#555}
@media print{figure{break-inside:avoid}h2{break-after:avoid}}</style></head><body>
<h1>ARC Physical Survey – Inspection Report</h1>
<table class="meta"><tr><td><b>Registrierung</b></td><td>${esc(s.reg)}</td><td><b>MSN</b></td><td>${esc(s.msn)}</td></tr>
<tr><td><b>Typ</b></td><td>${esc(s.type)}</td><td><b>Ort</b></td><td>${esc(s.location)}</td></tr>
<tr><td><b>Date</b></td><td>${esc(fmtDay(s.date))}</td><td><b>Closed</b></td><td>${s.closedAt ? fmtDT(s.closedAt) : 'not closed'}</td></tr>
${s.closeReason ? `<tr><td><b>Reason</b></td><td colspan="3">${esc(s.closeReason)}</td></tr>` : ''}
<tr><td><b>Open items</b></td><td colspan="3">${iss.count ? `${iss.open.length} open, ${iss.noPhoto.length} without required photo, ${iss.noReason.length} N/A without reason, ${iss.noWO.length} findings without WO` : 'none'}</td></tr>
<tr><td><b>Export</b></td><td colspan="3">${fmtDT(nowISO())} · ARC Physical Helper ${APP_VERSION}</td></tr></table>
<h2>Checklist Items</h2><table><tr><th>No.</th><th>Item</th><th>Status</th><th>Photos</th><th>Findings</th><th>Remark</th><th>Assessed</th></tr>${rows}</table>
<h2>Findings</h2>${fs.length ? `<table><tr><th>No.</th><th>Item</th><th>Description</th><th>WO</th><th>Rectified</th><th>Rectification</th><th>Photos</th></tr>${frows}</table>` : '<p>No findings.</p>'}
${smTable(c)}<h2>Photo Evidence</h2>${gal || '<p>No photos.</p>'}</body></html>`;
}

async function buildZip() {
  const c = cur, s = c.s;
  if (typeof JSZip === 'undefined') { toast('ZIP library not loaded'); return; }
  await flush();
  const builtAt = nowISO();
  const root = safeName(`${s.date}_${s.reg}_ARC-Physical`);
  const zip = new JSZip(), R = zip.folder(root), L = leaves(s);
  for (const l of L) R.folder(leafPath(l)); // vollständige Ordnerstruktur, auch leere
  const photos = [...c.photos].sort(byCreated), names = new Map(), annNames = new Map(), cnt = {};
  busy('Collecting photos …');
  try {
    for (const p of photos) {
      const ext = extOf(p.type), f = p.findingId && c.findings.find(x => x.id === p.findingId);
      let path;
      if (f) { const fn = findingFolder(f); cnt[fn] = (cnt[fn] || 0) + 1; path = `Findings/${fn}/${fn}_${pad(cnt[fn])}.${ext}`; }
      else {
        const l = L.find(x => x.id === p.itemId) || { id: p.itemId, folder: 'Unassigned', parents: [] };
        const d = p.docId && l.docs?.find(x => x.id === p.docId), sm = p.sampleId && (s.samples || []).find(x => x.id === p.sampleId);
        if (sm) { cnt[sm.id] = (cnt[sm.id] || 0) + 1; path = `${leafPath(l)}/${smFile(s, sm)}_${pad(cnt[sm.id])}.${ext}`; }
        else if (d) { cnt[d.id] = (cnt[d.id] || 0) + 1; path = `${leafPath(l)}/${safeName(d.id + ' ' + d.name)}_${pad(cnt[d.id])}.${ext}`; }
        else { cnt[l.id] = (cnt[l.id] || 0) + 1; path = `${leafPath(l)}/${l.id}_${pad(cnt[l.id], 3)}.${ext}`; }
      }
      names.set(p.id, path);
      const b = await get('blobs', p.id);
      if (b) R.file(path, b.buf, { binary: true, date: new Date(p.createdAt) });
      if (p.annotated) { // markierte Kopie zusätzlich, Original bleibt unverändert
        const a = await get('blobs', p.id + '#ann');
        if (a) { const ap = path.replace(/\.[^.]+$/, '_markiert.jpg'); annNames.set(p.id, ap); R.file(ap, a.buf, { binary: true, date: new Date(p.createdAt) }); }
      }
    }
    const fs = [...c.findings].sort((a, b) => a.num - b.num);
    const head = ['Finding', 'Item', 'Item Title', 'Description (Physical)', 'WO No.', 'Rectified', 'Rectification', 'No. of Photos', 'Folder', 'Created', 'WO Wording (manual)'];
    const rows = fs.map(f => [fNo(f), f.itemId, leafById(s, f.itemId)?.title || '', f.text, f.wo, f.rectified ? 'yes' : 'no', f.rect,
      c.photos.filter(p => p.findingId === f.id).length, 'Findings/' + findingFolder(f), fmtDT(f.createdAt), '']);
    const sHead = ['Sample', 'Type', 'Origin Item', 'P/N', 'S/N', 'Row', 'Seats', 'Description', 'No. of Photos', 'Created'];
    const sRows = Object.keys(SAMPLE_KINDS).flatMap(k => samplesOf(s, k)).map(x => [`${SAMPLE_KINDS[x.kind].item} ${smNo(x)}`, SAMPLE_KINDS[x.kind].label, smOrigin(s, x),
      x.pn, x.sn, x.row, x.side, x.desc, c.photos.filter(p => p.sampleId === x.id).length, fmtDT(x.createdAt)]);
    R.file('Samples.csv', '\ufeff' + [sHead, ...sRows].map(r => r.map(csvCell).join(';')).join('\r\n'));
    R.file('Findings.csv', '﻿' + [head, ...rows].map(r => r.map(csvCell).join(';')).join('\r\n'));
    R.file('Pruefprotokoll.html', protocolHTML(c, names, annNames));
    R.file('session.json', JSON.stringify({ app: 'ARC Physical Helper', version: APP_VERSION, exportedAt: builtAt, session: s, findings: fs,
      photos: photos.map(p => ({ id: p.id, itemId: p.itemId, findingId: p.findingId, createdAt: p.createdAt, note: p.note, file: names.get(p.id), annotatedFile: annNames.get(p.id) || null })) }, null, 1));
    const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE', streamFiles: true }, m => busy(`Creating ZIP … ${Math.round(m.percent)} %`));
    if (exportReady?.url) URL.revokeObjectURL(exportReady.url);
    exportReady = { sid: s.id, blob, name: root + '.zip', url: URL.createObjectURL(blob), builtAt };
  } catch (err) { console.error(err); toast('Export failed: ' + err.message); }
  finally { busy(false); }
  render();
}
async function markExported() {
  cur.s.exportedAt = exportReady.builtAt > cur.s.modifiedAt ? exportReady.builtAt : cur.s.modifiedAt;
  await put('sessions', cur.s); render();
}
async function shareZip() {
  const x = exportReady; if (!x) return;
  const file = new File([x.blob], x.name, { type: 'application/zip' });
  try {
    if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: x.name }); await markExported(); }
    else downloadZip();
  } catch (err) { if (err.name !== 'AbortError') toast('Share failed: ' + err.message); }
}
function downloadZip() {
  const a = document.createElement('a'); a.href = exportReady.url; a.download = exportReady.name;
  document.body.appendChild(a); a.click(); a.remove(); markExported();
}
async function deleteSession() {
  const c = cur;
  await tx(['sessions', 'findings', 'photos', 'blobs'], 'readwrite', t => {
    t.objectStore('sessions').delete(c.s.id);
    for (const f of c.findings) t.objectStore('findings').delete(f.id);
    for (const p of c.photos) { t.objectStore('photos').delete(p.id); t.objectStore('blobs').delete(p.id); t.objectStore('blobs').delete(p.id + '#ann'); }
  });
  revokeThumbs(); cur = null; exportReady = null; location.hash = '#/';
}

/* ---------------- Events ---------------- */
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act, c = cur, d = el.dataset;
  try {
    switch (a) {
      // Kamera muss synchron im Klick ausgelöst werden (User-Geste)
      case 'cam': capture = { item: d.item, sample: d.sample || null, doc: d.doc || null, fid: d.fid || null, newFinding: false }; $('#camIn').click(); break;
      case 'camFinding': capture = { item: d.item, fid: null, newFinding: true }; $('#camIn').click(); break;
      case 'library': capture = { item: d.item, sample: d.sample || null, doc: d.doc || null, fid: d.fid || null, newFinding: false }; $('#libIn').click(); break;
      case 'newFindingNoPhoto': { const f = await createFinding(d.item); location.hash = `#/s/${c.s.id}/f/${f.id}`; break; }
      case 'setStatus': { const st = itemState(c.s, d.item); st.status = d.v; st.changedAt = nowISO(); await touch(); render(); break; }
      case 'view': await openViewer(d.pid, d.ctx); break;
      case 'back': if (history.length > 1) history.back(); else location.hash = '#/'; break;
      case 'fFilter': fFilter = d.v; render(); break;
      case 'newSession': sessionSheet(); break;
      case 'editSession': sessionSheet(c.s); break;
      case 'smNew': smDraft = { kind: d.kind || defaultKind(d.origin), origin: d.kind ? null : d.origin, fixed: !!d.kind }; sampleSheet(); break;
      case 'smDone': closeSheet(); await flush(); render(); break;
      case 'smKind': smReadSheet(); smDraft.kind = d.v; sampleSheet(); break;
      case 'smCreate': { // synchron bis zum Kamera-Klick (User-Geste)
        smReadSheet();
        if (smDraft.kind === 'lopa' && !smDraft.row) { toast('Row missing'); break; }
        const sq = c.s.sampleSeq ||= {}; sq[smDraft.kind] = (sq[smDraft.kind] || 0) + 1;
        const { fixed, ...base } = smDraft;
        const sm = { id: uid(), ...base, pn: base.kind === 'comp' ? base.pn || '' : '', sn: base.kind === 'comp' ? base.sn || '' : '',
          row: base.kind === 'lopa' ? base.row : '', side: base.kind === 'lopa' ? base.side : '', desc: base.desc || '', num: sq[smDraft.kind], createdAt: nowISO() };
        (c.s.samples ||= []).push(sm);
        capture = { item: SAMPLE_KINDS[sm.kind].item, sample: sm.id, smEdit: sm.kind === 'comp', doc: null, fid: null, newFinding: false };
        $(d.src === 'lib' ? '#libIn' : '#camIn').click();
        closeSheet(); smDraft = null; await touch(); render(); break;
      }
      case 'smDel': {
        const sm = c.s.samples.find(x => x.id === d.sid), sp = c.photos.filter(p => p.sampleId === sm.id);
        if (!confirm(`Delete ${SAMPLE_KINDS[sm.kind].item} ${smNo(sm)}${sp.length ? ` incl. ${sp.length} photo(s)` : ''}?`)) break;
        c.s.samples = c.s.samples.filter(x => x !== sm);
        if (sp.length) await deletePhotos(sp); else { await touch(); render(); }
        break;
      }
      case 'saveSession': await saveSession(d.id); break;
      case 'settings': settingsSheet(); break;
      case 'sheetCancel': closeSheet(); break;
      case 'sheetBg': if (e.target === el) closeSheet(); break;
      case 'toastAct': { const fn = toastFn; $('#toast').hidden = true; toastFn = null; fn?.(); break; }
      case 'delFinding': {
        const f = c.findings.find(x => x.id === d.fid);
        if (!confirm(`Delete ${fNo(f)}? Its photos remain as evidence photos of the checklist item.`)) break;
        const ph = c.photos.filter(p => p.findingId === f.id); ph.forEach(p => { p.findingId = null; });
        await savePhotoMetas(ph);
        await tx(['findings'], 'readwrite', t => { t.objectStore('findings').delete(f.id); });
        c.findings = c.findings.filter(x => x.id !== f.id); await touch();
        location.hash = `#/s/${c.s.id}/i/${f.itemId}`; break;
      }
      case 'closeSession': {
        await flush(); const iss = checkIssues(c);
        if (iss.count && !c.s.closeReason?.trim()) { toast('Reason for open items required'); break; }
        if (!iss.count) c.s.closeReason = '';
        c.s.closedAt = nowISO(); await touch(); render(); break;
      }
      case 'reopen': c.s.closedAt = null; await touch(); render(); break;
      case 'buildZip': await buildZip(); break;
      case 'shareZip': await shareZip(); break;
      case 'downloadZip': downloadZip(); break;
      case 'delSession': {
        const exp = c.s.exportedAt && c.s.modifiedAt <= c.s.exportedAt;
        if (!confirm(`Permanently delete Physical ${c.s.reg} with ${c.photos.length} photos?`)) break;
        if (!exp && !confirm('WARNING: The current state has NOT been exported. Delete anyway?')) break;
        await deleteSession(); break;
      }
      case 'vClose': closeViewer(); break;
      case 'vOrig': await openViewer(viewer.pid, viewer.ctx, !viewer.orig); break;
      case 'vEdit': await openEditor(viewer.pid); break;
      case 'edTool': edTool = d.v; edBar(); break;
      case 'edColor': edColor = d.v; edBar(); break;
      case 'edUndo': ed.shapes.pop(); edDraw(); edBar(); break;
      case 'edClear': ed.shapes = []; edDraw(); edBar(); break;
      case 'edCancel': closeEditor(); break;
      case 'edSave': await edSave(); break;
      case 'vPrev': await viewerStep(-1); break;
      case 'vNext': await viewerStep(1); break;
      case 'vDel': {
        if (!confirm('Delete photo?')) break;
        const list = viewerList(), i = list.findIndex(x => x.id === viewer.pid), nxt = list[i + 1] || list[i - 1];
        const p = c.photos.find(x => x.id === viewer.pid); const ctx = viewer.ctx;
        await deletePhotos([p]);
        if (nxt) await openViewer(nxt.id, ctx); else closeViewer();
        break;
      }
    }
  } catch (err) { console.error(err); toast('Error: ' + err.message); }
});

async function onField(el, commit) {
  const f = el.dataset.field, c = cur; if (!f || !c) return;
  const v = el.type === 'checkbox' ? el.checked : el.value;
  const fi = el.dataset.fid && c.findings.find(x => x.id === el.dataset.fid);
  switch (f) {
    case 'naReason': itemState(c.s, el.dataset.id).reason = v; sessDirty = true; schedule(); if (commit) { await flush(); render(); } break;
    case 'itemNote': itemState(c.s, el.dataset.id).note = v; sessDirty = true; schedule(); break;
    case 'closeReason': c.s.closeReason = v; sessDirty = true; schedule(); break;
    case 'fText': fi.text = v; dirtyF.add(fi); schedule(); break;
    case 'fWO': fi.wo = v.trim(); dirtyF.add(fi); schedule(); break;
    case 'fRect': fi.rect = v; dirtyF.add(fi); schedule(); break;
    case 'fRectified': if (commit) { fi.rectified = v; await put('findings', fi); await touch(); render(); } break;
    case 'fItem': if (commit) {
      fi.itemId = v; const ph = c.photos.filter(p => p.findingId === fi.id); ph.forEach(p => { p.itemId = v; });
      await savePhotoMetas(ph); await put('findings', fi); await touch(); render(); toast(`${fNo(fi)} moved to ${v}`);
    } break;
    case 'sm_pn': case 'sm_sn': case 'sm_desc': case 'sm_row': case 'sm_side': {
      const sm = c.s.samples.find(x => x.id === el.dataset.sid); sm[f.slice(3)] = typeof v === 'string' ? v.trim() : v; sessDirty = true; schedule(); break;
    }
    case 'vNote': { const p = c.photos.find(x => x.id === viewer.pid); p.note = v; if (commit) { await savePhotoMetas([p]); await touch(); } break; }
    case 'vItem': if (commit) {
      const p = c.photos.find(x => x.id === viewer.pid); p.itemId = v;
      const fd = p.findingId && c.findings.find(x => x.id === p.findingId);
      if (fd && fd.itemId !== v) p.findingId = null;
      p.sampleId = null; p.docId = null;
      await savePhotoMetas([p]); await touch(); closeViewer(); toast(`Photo moved to ${v}`);
    } break;
    case 'vFinding': if (commit) {
      const p = c.photos.find(x => x.id === viewer.pid);
      if (v === '__new') { const nf = await createFinding(p.itemId); p.findingId = nf.id; await savePhotoMetas([p]); await touch(); closeViewer(); location.hash = `#/s/${c.s.id}/f/${nf.id}`; break; }
      p.findingId = v || null;
      if (v) p.itemId = c.findings.find(x => x.id === v).itemId;
      await savePhotoMetas([p]); await touch(); closeViewer(); toast(v ? 'Photo assigned to finding' : 'Photo set as evidence photo');
    } break;
  }
}
document.addEventListener('input', e => { if (e.target.dataset.field) onField(e.target, false).catch(console.error); });
document.addEventListener('change', e => { if (e.target.dataset.field) onField(e.target, true).catch(err => toast('Error: ' + err.message)); });

for (const id of ['camIn', 'libIn']) {
  const inp = $('#' + id);
  inp.addEventListener('change', async () => {
    const files = [...inp.files]; inp.value = '';
    const ctx = capture; capture = null;
    if (!files.length || !ctx) return;
    try { await addPhotos(files, ctx); } catch (err) { console.error(err); toast('Photo not saved: ' + err.message); }
  });
}

// Wischen im Foto-Viewer
let tx0 = null;
$('#viewer').addEventListener('touchstart', e => { if (e.target.closest('.v-img')) tx0 = e.touches[0].clientX; }, { passive: true });
$('#viewer').addEventListener('touchend', e => {
  if (tx0 === null) return; const dx = e.changedTouches[0].clientX - tx0; tx0 = null;
  if (Math.abs(dx) > 60) viewerStep(dx < 0 ? 1 : -1);
}, { passive: true });

window.addEventListener('hashchange', async () => { await flush(); closeEditor(); if (viewer) { const el = $('#viewer'); el.hidden = true; el.innerHTML = ''; if (viewer.url) URL.revokeObjectURL(viewer.url); viewer = null; document.body.classList.remove('noscroll'); } closeSheet(); render(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
    // iOS prüft bei Home-Screen-Apps selten auf Updates -> beim Öffnen/Zurückkehren aktiv prüfen
    reg.update().catch(() => {});
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      w?.addEventListener('statechange', () => {
        if (w.state === 'installed' && navigator.serviceWorker.controller) toast('Update available', 'Reload', () => location.reload());
      });
    });
  }).catch(() => {});
}
render();
