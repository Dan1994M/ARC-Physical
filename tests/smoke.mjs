// Smoke-Test: node tests/smoke.mjs  (benötigt: npm i -D playwright; Chromium via CHROMIUM_PATH oder Playwright-Default)
// Prüft: sw.js gültig + Version passend, App lädt, Foto/Finding/Sample, Finding-Report-PDF, ZIP (einteilig + mehrteilig).
import { chromium } from 'playwright';
import http from 'http'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let fail = 0; const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); if (!c) fail++; };

const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8'), sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const ver = app.match(/APP_VERSION = '([^']+)'/)?.[1];
ok(sw.includes("addEventListener('fetch'"), 'sw.js not empty, has fetch handler');
ok(sw.includes(`arc-physical-v${ver}`), `sw.js cache version = APP_VERSION (${ver})`);
for (const a of sw.match(/ASSETS = \[([^\]]+)\]/)[1].match(/'\.\/([^']*)'/g).map(x => x.slice(3, -1)).filter(Boolean)) ok(fs.existsSync(path.join(root, a)), `asset exists: ${a}`);

const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.png': 'image/png', '.webmanifest': 'application/json' };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); } }); }).listen(0);
const base = `http://localhost:${srv.address().port}/`;
// Testbild (JPEG) im Browser erzeugen statt Datei mitzuliefern
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = [];
pg.on('pageerror', e => errs.push(e.message)); pg.on('dialog', d => d.accept());
try {
  await pg.goto(base); await pg.waitForSelector('[data-act=newSession]');
  const jpg = Buffer.from(await pg.evaluate(async () => { const c = document.createElement('canvas'); c.width = 1600; c.height = 1200; const x = c.getContext('2d');
    x.fillStyle = '#888'; x.fillRect(0, 0, 1600, 1200); x.fillStyle = '#000'; x.font = '80px sans-serif'; x.fillText('P/N TEST-123', 100, 300);
    const bl = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.9)); return [...new Uint8Array(await bl.arrayBuffer())]; }));
  const img = { name: 't.jpg', mimeType: 'image/jpeg', buffer: jpg };
  await pg.click('[data-act=newSession]'); await pg.fill('#fReg', 'D-ATST'); await pg.fill('#fMsn', '9999'); await pg.selectOption('#fType', 'A320-214');
  await pg.click('[data-act=saveSession]'); await pg.waitForFunction(() => location.hash.startsWith('#/s/'));
  const sid = (await pg.evaluate(() => location.hash)).split('/')[2];
  await pg.evaluate(() => { HTMLInputElement.prototype.click = function () {}; }); // Kamera-Dialog unterdrücken
  const go = async h => { await pg.goto(`${base}#/s/${sid}/${h}`); await pg.waitForTimeout(250); };
  const shot = async () => { await pg.setInputFiles('#camIn', img); await pg.waitForTimeout(600); };
  await go('i/1.1'); await pg.click('.bbar [data-act=cam]'); await shot();
  ok(await pg.evaluate(() => cur.photos.length === 1), 'photo saved');
  await go('i/5.3.1'); await pg.click('[data-act=camFinding]'); await shot(); await pg.fill('[data-field=fText]', 'Test finding'); await pg.fill('[data-field=fWO]', 'WO1');
  await pg.waitForTimeout(600); ok(await pg.evaluate(() => cur.findings.length === 1 && cur.findings[0].wo === 'WO1'), 'finding with WO');
  await go('i/5.3.1'); await pg.click('[data-act=smNew]'); await pg.click('.sheet button.pri[data-act=smCreate]'); await shot();
  await pg.fill('#sheet [data-field=sm_pn]', 'PN1'); await pg.click('[data-act=smDone]'); await pg.waitForTimeout(300);
  ok(await pg.evaluate(() => cur.s.samples?.[0]?.pn === 'PN1'), 'component sample with P/N');
  await go('prep'); await pg.click('[data-field=prep][data-id=p9]'); await pg.waitForTimeout(300); await pg.click('[data-act=smPre][data-kind=mod]'); await pg.waitForTimeout(300);
  await pg.fill('.pre-sm [data-field=sm_name]', 'STC-TEST'); await pg.waitForTimeout(600);
  ok(await pg.evaluate(() => cur.s.samples.some(x => x.kind === 'mod' && x.pre && x.name === 'STC-TEST')), 'pre-selected MOD/STC sample');
  await go('prep'); await pg.click('[data-field=prep][data-id=p6]'); await pg.waitForTimeout(300); await pg.click('[data-act=smPre][data-kind=eel]'); await pg.waitForTimeout(300);
  await pg.selectOption('.pre-sm [data-field=sm_area]', '4.1.2'); await pg.fill('.pre-sm [data-field=sm_name]', 'EEL-X'); await pg.waitForTimeout(600);
  await go('i/4.1'); ok(await pg.evaluate(() => { const x = cur.s.samples.find(y => y.kind === 'eel'); return x?.pre && x.area === '4.1.2' && x.name === 'EEL-X'; }) && await pg.locator('main').innerText().then(t => t.includes('4.1.2 S01')), 'pre-selected EEL sample under 4.1.2');
  await go('i/6.4'); ok(await pg.locator('main').innerText().then(t => t.includes('Pre-selected')), 'pre-selected sample shown in 6.4');
  const pdf = await pg.evaluate(async () => { const bl = await buildReportPDF(cur); const a = new Uint8Array(await bl.arrayBuffer()); return String.fromCharCode(...a.slice(0, 5)) + '|' + a.length; });
  ok(pdf.startsWith('%PDF-'), `finding report PDF (${pdf.split('|')[1]} bytes)`);
  const z1 = await pg.evaluate(async () => { await buildZip(0); const z = await JSZip.loadAsync(exportReady.ready.blob); return { parts: exportReady.parts.length, files: Object.keys(z.files).filter(n => !n.endsWith('/')) }; });
  ok(z1.parts === 1 && z1.files.filter(f => /\.jpg$/.test(f)).length === 3, `single ZIP with 3 photos`);
  ok(['Findings.csv', 'Samples.csv', 'Pruefprotokoll.html', 'session.json'].every(n => z1.files.some(f => f.endsWith('/' + n))) && z1.files.some(f => f.endsWith('.pdf')), 'ZIP contains CSVs, protocol, json, report PDF');
  const z2 = await pg.evaluate(async () => { window.__partMax = 1; await touch(); const all = []; let n = 0;
    for (let i = 0; ; i++) { await buildZip(i); n = exportReady.parts.length; const z = await JSZip.loadAsync(exportReady.ready.blob); all.push(...Object.keys(z.files).filter(f => /\.jpg$/.test(f))); if (i + 1 >= n) break; }
    window.__partMax = 0; return { n, all }; });
  ok(z2.n === 3 && new Set(z2.all).size === 3, `multi-part ZIP: ${z2.n} parts, all photos exactly once`);
} catch (e) { ok(false, 'exception: ' + e.message); }
ok(!errs.length, 'no page errors' + (errs.length ? ': ' + errs.join(' | ') : ''));
await b.close(); srv.close();
console.log(fail ? `\n${fail} check(s) FAILED` : '\nall checks passed'); process.exit(fail ? 1 : 0);
