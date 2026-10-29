'use strict';
const IC = {
  plus: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>',
  list: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M12 11h4M12 16h4M8 11h.01M8 16h.01"/>',
  chart: '<path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3"/>',
  dash: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"/>',
  gear: '<path d="M20 7h-9M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>'
};
const ic = (n, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px">${IC[n]}</svg>`;
Object.assign(IC, {
  school: '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>',
  mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
  flask: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
  drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  wifi: '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>',
  rupee: '<path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/>',
  brief: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  cap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  dot: '<circle cx="12" cy="12" r="4"/>'
});
const CI = { classroom: 'school', seminar: 'mic', lab: 'flask', washroom: 'drop', canteen: 'food', library: 'book', network: 'wifi', accounts: 'rupee', nonteach: 'brief', staff: 'cap', campus: 'pin', bully: 'shield' };
const SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>';
const MOON = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>';
const curTheme = () => document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
Object.defineProperty(IC, 'theme', { get: () => curTheme() === 'dark' ? MOON : SUN, set: () => {} });
try { const sv = localStorage.getItem('cf_theme'); if (sv) document.documentElement.dataset.theme = sv; } catch (e) { /* ignore */ }
Object.assign(IC, {
  lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  hand: '<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
  user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  down: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'
});
const EMO = { '🔒': 'lock', '🚨': 'alert', '🙋': 'hand', '🏆': 'trophy', '👤': 'user', '🕶': 'user', '👷': 'user', '🛠': 'gear', '💬': 'chat', '🔔': 'bell', '⬇': 'down', '✅': 'check', '🥇': '#1', '🥈': '#2', '🥉': '#3', '🎉': '', '🔎': '', '📷': '', '🆕': '', '📌': '', '🔧': '', '📝': '' };
const EMR = new RegExp('(' + Object.keys(EMO).join('|') + ')\\uFE0F?', 'g');
const hasEmo = s => Object.keys(EMO).some(k => s.includes(k));
function swapEmoji() {
  if (!document.body) return;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), hit = [];
  while (w.nextNode()) if (hasEmo(w.currentNode.nodeValue)) hit.push(w.currentNode);
  hit.forEach(n => {
    const s = document.createElement('span');
    s.innerHTML = E(n.nodeValue).replace(EMR, (m, k) => { const v = EMO[k]; return v === '' ? '' : v[0] === '#' ? v.slice(1) : '<span style="pointer-events:none">' + ic(v, 16) + '</span>'; });
    n.replaceWith(s);
  });
  document.querySelectorAll('[placeholder]').forEach(i => { i.placeholder = i.placeholder.replace('🔎 ', ''); });
}
new MutationObserver(swapEmoji).observe(document.documentElement, { childList: true, subtree: true });
Object.assign(IC, {
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  theme: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'
});
const $ = (s, r = document) => r.querySelector(s);
const E = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const API = (window.CF_API || '').replace(/\/$/, ''); // backend URL, set in config.js
const ST = ['Reported', 'Assigned', 'In Progress', 'Fixed'], now = () => Date.now();
let T = localStorage.getItem('cf_t'), U = null, M = null, tab = '', role = 'student', mode = 'login', rep = { cat: null, sub: null, pri: 'Normal', photo: null };
let F = { status: '', category: '', q: '', dept: false };

const toast = m => { const t = document.createElement('div'); t.className = 'toast g'; t.textContent = String(m).replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '').trim(); document.body.appendChild(t); setTimeout(() => t.remove(), 3500); };
async function api(p, o = {}) {
  const r = await fetch(API + '/api' + p, { method: o.method || (o.body ? 'POST' : 'GET'), headers: { 'Content-Type': 'application/json', ...(T ? { Authorization: 'Bearer ' + T } : {}) }, body: o.body ? JSON.stringify(o.body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { if (r.status === 401 && T && !p.startsWith('/auth')) logout(); throw new Error(j.error || 'Request failed'); }
  return j;
}
const ago = ms => { const m = Math.max(1, Math.round(ms / 6e4)); return m < 60 ? m + 'm' : m < 2880 ? Math.round(m / 60) + 'h' : Math.round(m / 1440) + 'd'; };
const stPct = i => (ST.indexOf(i.status) + 1) * 25;
const slaPct = i => Math.round(((i.fixed || now()) - i.created) / (M.cats[i.category].sla * (i.priority === 'Urgent' ? .5 : 1) * 36e5) * 100);
const good = p => p >= 75 ? 'var(--ok)' : p >= 40 ? 'var(--wa)' : 'var(--er)';
function ring(p, sz = 92, col = 'var(--pr)') {
  p = Math.max(0, Math.min(100, Math.round(p))); const r = sz / 2 - 8, c = 2 * Math.PI * r;
  return `<div class="rg" style="width:${sz}px;height:${sz}px"><svg width="${sz}" height="${sz}"><circle cx="${sz / 2}" cy="${sz / 2}" r="${r}" class="rb"/><circle cx="${sz / 2}" cy="${sz / 2}" r="${r}" class="rf" style="stroke:${col};stroke-dasharray:${c};stroke-dashoffset:${c}" data-off="${c * (1 - p / 100)}"/></svg><b style="font-size:${sz / 4.4}px">${p}%</b></div>`;
}
const anim = () => requestAnimationFrame(() => document.querySelectorAll('.rf').forEach(e => e.style.strokeDashoffset = e.dataset.off));
function compress(f) { // FileReader (data: URL) works under the server's security rules, unlike blob: URLs
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, 800 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * k; c.height = im.height * k; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', .7)); }; im.onerror = rej; im.src = fr.result; };
    fr.onerror = rej; fr.readAsDataURL(f);
  });
}
const opts = a => a.map(x => `<option>${E(x)}</option>`).join('');

// ---------- auth ----------
const CONTACT = 'campusfix.support@gmail.com';
function showLegal(w) {
  const h = '<h3 style="margin-top:14px">', p = w === 'privacy';
  const body = p ? `<h2>Privacy Policy</h2><p class="mu">Last updated: October 2026</p>
  ${h}What we collect</h3><p>Students: name, PRN, year, branch, division, class incharge and password. Admins: name, user ID, department and password. We also keep the complaints you submit (category, location, details, optional photos), your comments and your notifications.</p>
  ${h}Why we collect it</h3><p>Only to run CampusFix: to log you in, send your complaint to the right department, show its progress and notify you about it.</p>
    ${h}Who can see it</h3><p>If you report anonymously, admins will not see your name. Confidential categories (such as Teaching Staff and Bullying / Ragging) are visible only to you and the college administration. Other reports can be seen by other CampusFix users, so do not write phone numbers or other private details in the description. If you file normal reports (not anonymous, not confidential), your name, year and branch can appear on the Rank page for other users.</p>
  ${h}Where it is stored</h3><p>Your data is stored on cloud services used to run this app (database and hosting). We do not sell your data and we do not show ads.</p>
  ${h}How long we keep it</h3><p>While your account is active. You can ask us to delete it at any time.</p>
  ${h}Your choices</h3><p>You can ask us to correct or delete your data, or ask any privacy question, by email: <b>${E(CONTACT)}</b></p>
  ${h}Under 18?</h3><p>If you are under 18, please use CampusFix with the knowledge of your parent or guardian.</p>
  ${h}Changes</h3><p>If we change this policy, the date above will change.</p>`
  : `<h2>Terms of Use</h2><p class="mu">Last updated: October 2026</p>
  ${h}1. Use it for real campus issues</h3><p>CampusFix is only for reporting genuine college issues.</p>
  ${h}2. Be truthful and respectful</h3><p>Do not post false reports, abuse, spam, or any illegal or inappropriate photos or messages.</p>
  ${h}3. Your account</h3><p>Keep your password private. You are responsible for everything done from your account.</p>
  ${h}4. Admin rights</h3><p>Admins may update, merge or remove reports that break these terms, and may suspend accounts that misuse CampusFix.</p>
  ${h}5. Fix times</h3><p>The fix times (SLA) shown in the app are targets, not guarantees.</p>
  ${h}6. Emergencies</h3><p>For fire, medical emergencies or any threat to safety, contact college security or emergency services directly. Do not wait for this app.</p>
  ${h}7. Availability</h3><p>CampusFix is provided as it is and may sometimes be unavailable.</p>
  ${h}8. Changes and contact</h3><p>We may update these terms. Questions: <b>${E(CONTACT)}</b></p>`;
  $('#md').innerHTML = `<div class="back" data-close role="dialog" aria-modal="true"><div class="sheet g">${body}<p><button class="btn" data-close style="width:100%">Close</button></p></div></div>`;
}
function logout() { clearInterval(window._np); localStorage.removeItem('cf_t'); T = null; U = null; authScreen(); }
function confirmLogout() {
  $('#md').innerHTML = `<div class="back" data-close role="dialog" aria-modal="true" aria-labelledby="lgt"><div class="sheet g" style="max-width:380px"><h2 id="lgt">Confirm Logout</h2><p class="mu">Are you sure you want to log out?</p><div class="row" style="flex-wrap:nowrap;margin-top:16px"><button class="btn o" data-close>Cancel</button><button class="btn" id="lgo">Logout</button></div></div></div>`;
  $('#lgo').focus();
}
function authScreen() {
  const s = role === 'student', reg = mode === 'reg';
    $('#app').innerHTML = `<div class="auth g"><div class="logo big"><span style="color:var(--pr)">${ic('wrench', 30)}</span> Campus<b>Fix</b></div><p class="mu" style="text-align:center">College issue reporting platform</p>
    <div class="seg"><button data-role="student" class="${s ? 'on' : ''}">${ic('cap', 16)} Student</button><button data-role="admin" class="${!s ? 'on' : ''}">${ic('gear', 16)} Admin</button></div>
  <form id="af" autocomplete="on">
  ${reg ? '<label>Full name</label><input name="name" required maxlength="60">' : ''}
  <label>${s ? 'PRN number' : 'Admin user ID'}</label><input name="login" required maxlength="20" autocomplete="username" placeholder="${s ? 'Enter your PRN number' : 'Enter your user ID'}">
  ${reg && s ? `<div class="row"><div><label>Year</label><select name="year">${opts(M.years)}</select></div><div><label>Division</label><input name="division" required maxlength="10" placeholder="e.g. A"></div></div>
   <label>Branch</label><select name="branch">${opts(M.branches)}</select><label>Class incharge</label><input name="incharge" required maxlength="60" placeholder="Name of your class incharge">` : ''}
  ${reg && !s ? `<label>Department</label><select name="dept">${opts(M.depts)}</select><label>Admin invite code</label><input name="invite" required placeholder="Given by the college administration">` : ''}
  <label>Password</label><input name="password" type="password" required minlength="8" autocomplete="${reg ? 'new-password' : 'current-password'}" placeholder="${reg ? 'Set a password (min 8 characters)' : 'Enter your password'}">
  ${reg ? '<label>Confirm password</label><input name="password2" type="password" required minlength="8">' : ''}
    ${reg ? '<label style="display:flex;gap:8px;align-items:flex-start;text-transform:none;font-size:13px;letter-spacing:0;color:var(--tx)"><input type="checkbox" name="agree" required style="width:auto;margin-top:3px"><span>I agree to the <a data-legal="privacy">Privacy Policy</a> and <a data-legal="terms">Terms of Use</a></span></label>' : ''}
  <button class="btn" style="width:100%;margin-top:18px">${reg ? 'Create account' : 'Sign in'}</button></form>
    <p class="mu" style="text-align:center;margin-top:14px">${reg ? 'Already have an account?' : 'New here?'} <a id="sw">${reg ? 'Sign in' : 'Create your account'}</a></p>
  <p class="mu" style="text-align:center;font-size:12px"><a data-legal="privacy">Privacy Policy</a> · <a data-legal="terms">Terms</a></p></div>`;
}
document.addEventListener('submit', async e => {
  if (e.target.id !== 'af') return; e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target)), s = role === 'student';
  try {
    let r;
    if (mode === 'reg') {
      if (f.password !== f.password2) throw new Error('Passwords do not match');
      r = await api(s ? '/auth/register-student' : '/auth/register-admin', { body: s ? { prn: f.login, name: f.name, password: f.password, year: f.year, branch: f.branch, division: f.division, incharge: f.incharge } : { userId: f.login, name: f.name, password: f.password, dept: f.dept, inviteCode: f.invite } });
    } else r = await api('/auth/login', { body: { login: f.login, password: f.password, role } });
    T = r.token; localStorage.setItem('cf_t', T); U = r.user; shell();
  } catch (x) { toast(x.message); }
});

// ---------- shell ----------
function shell() {
  const adm = U.role === 'admin', tabs = adm ? [['console', ic('gear') + ' Console'], ['stats', ic('chart') + ' Analytics']] : [['report', ic('plus') + ' Report'], ['feed', ic('compass') + ' Explore'], ['mine', ic('list') + ' My reports'], ['stats', ic('dash') + ' Dashboard'], ['rank', ic('trophy') + ' Rank']];
  if (!tabs.some(t => t[0] === tab)) tab = tabs[0][0];
    $('#app').innerHTML = `<header class="g"><div class="logo"><span style="color:var(--pr)">${ic('wrench', 20)}</span> Campus<b>Fix</b></div><div class="who"><b>${E(U.name)}</b><span class="mu">${adm ? E(U.dept) + ' · Admin' : E(U.year) + ' · ' + E(U.branch) + ' · Div ' + E(U.division)}</span></div><button class="ib" id="bell" title="Notifications" style="position:relative">${ic('bell')}<i id="bd" style="display:none;position:absolute;top:-5px;right:-5px;background:var(--er);color:var(--onp);font:700 10px/16px system-ui;min-width:16px;padding:0 3px;border-radius:9px;text-align:center;font-style:normal"></i></button><button class="ib" id="th" title="Theme"><span style="pointer-events:none;display:grid">${ic('theme')}</span></button><button class="ib" id="lo" title="Sign out"><span style="pointer-events:none;display:grid">${ic('out')}</span></button></header>
  <nav class="g">${tabs.map(([k, n]) => `<button data-t="${k}" class="${k === tab ? 'on' : ''}">${n}</button>`).join('')}</nav><main id="v"></main>`;
  draw(); startNotif();
}
async function draw() {
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
  try { await ({ report: vReport, feed: vFeed, mine: vFeed, stats: vStats, rank: vRank, console: vConsole }[tab])(); anim(); } catch (e) { toast(e.message); }
}

// ---------- report ----------
function vReport() {
  const cs = M.cats;
  if (!cs[rep.cat]) rep.cat = null;
  window.scrollTo(0, 0);
  if (!rep.cat) {
    rep.photo = null;
    $('#v').innerHTML = `<div class="c g"><h2>Report an issue</h2><p class="mu">College campus issues only. Similar open reports are merged automatically.</p>
    <label>What is it about?</label><div class="cg">${Object.entries(cs).map(([k, c]) => `<div class="cat" data-cat="${k}"><span>${c.icon}</span>${E(c.label)}</div>`).join('')}</div></div>`;
    return;
  }
  const c = cs[rep.cat];
  $('#v').innerHTML = `<div class="c g"><button class="btn s o" data-cat="none">← Back</button><h2>${c.icon} ${E(c.label)}</h2>
  ${c.conf ? '<div class="warn">🔒 Confidential: only you and the college administration can see this complaint.' + (c.forceAnon ? ' Your identity stays hidden.' : '') + '</div>' : ''}
  <label>Specific problem</label><div class="chips" id="subs">${c.subs.map(s => `<span class="chip ${rep.sub === s ? 'on' : ''}" data-sub="${E(s)}">${E(s)}</span>`).join('')}</div>
  <div class="row"><div><label>Location</label><select id="bld">${opts(M.buildings)}</select></div><div><label>Room / spot</label><input id="room" maxlength="60" placeholder="e.g. Room 304, Lab 2, Counter 1"></div></div>
  <label>Details</label><textarea id="det" maxlength="600" placeholder="Describe the problem..."></textarea>
  <label>Priority</label><div class="chips" id="pri">${['Normal', 'Urgent'].map(p => `<span class="chip ${rep.pri === p ? 'on' : ''}" data-pri="${p}">${p === 'Urgent' ? '🚨 Urgent' : 'Normal'}</span>`).join('')}</div>
  <label>Photo (optional)</label><input type="file" id="ph" accept="image/*">
  <label style="display:flex;gap:8px;align-items:center;text-transform:none;font-size:14px;color:var(--tx)"><input type="checkbox" id="anon" style="width:auto" ${c.forceAnon ? 'checked disabled' : ''}> Report anonymously (admins will not see my name)</label>
  <p><button class="btn" id="go" style="width:100%">Submit report</button></p></div>`;
}
async function submitReport() {
  if (!rep.cat || !rep.sub) return toast('Choose the category and the specific problem');
  try {
    const r = await api('/issues', { body: { category: rep.cat, sub: rep.sub, building: $('#bld').value, room: $('#room').value, details: $('#det').value, priority: rep.pri, anon: $('#anon').checked, photo: rep.photo } });
    toast(r.duplicate ? 'Already reported: your “Me too” was added ✅' : 'Report submitted 🎉'); rep = { cat: null, sub: null, pri: 'Normal', photo: null }; tab = 'feed'; draw();
  } catch (x) { toast(x.message); }
}

// ---------- feed ----------
const card = i => {
  const c = M.cats[i.category];
  return `<div class="c g hv" data-open="${i.id}"><div class="top"><div><b>${c.icon} ${E(c.label)}</b> <small class="mu">#${i.code}</small> ${i.priority === 'Urgent' ? '<span class="pill urg">URGENT</span>' : ''}${i.conf ? ' 🔒' : ''}
  <div class="mu">${E(i.sub)} · ${E(i.building)}${i.room ? ' · ' + E(i.room) : ''}</div></div>${ring(stPct(i), 60, i.status === 'Fixed' ? 'var(--ok)' : 'var(--pr)')}</div>
  <p style="margin:8px 0">${E(i.details).slice(0, 100)}</p><div class="top" style="align-items:center"><span class="mu">${i.status} · ${i.status === 'Fixed' ? 'fixed in ' + ago(i.fixed - i.created) : 'SLA used ' + slaPct(i) + '%'}</span>
  ${U.role === 'student' ? `<button class="btn s o" data-vote="${i.id}">🙋 ${i.votes}</button>` : `<span class="mu">🙋 ${i.votes}</span>`}</div></div>`;
};
const qs = o => new URLSearchParams(Object.entries(o).filter(([, v]) => v)).toString();
function filters(adm) {
  return `<div class="c g"><div class="row"><input id="fq" placeholder="🔎 Search" value="${E(F.q)}" style="flex:2"><select id="fs"><option value="">All status</option>${opts(ST)}</select><select id="fc"><option value="">All categories</option>${Object.entries(M.cats).map(([k, c]) => `<option value="${k}">${E(c.label)}</option>`).join('')}</select>
  ${adm ? `<select id="fd"><option value="">All departments</option>${opts(M.depts)}</select>` : ''}</div></div>`;
}
function bindF() { $('#fs').value = F.status; $('#fc').value = F.category; if ($('#fd')) $('#fd').value = F.dept || ''; }
async function vFeed() {
  const l = await api('/issues?' + qs({ status: F.status, category: F.category, q: F.q, mine: tab === 'mine' ? 1 : 0 }));
  $('#v').innerHTML = (tab === 'mine' ? '' : filters(false)) + `<div class="grid">${l.map(card).join('') || '<p class="mu" style="grid-column:1/-1;text-align:center;padding:40px">Nothing here yet 🎉</p>'}</div>`;
  if (tab !== 'mine') bindF();
}

// ---------- stats ----------
async function rings() {
  const s = await api('/stats');
  return [s, `<div class="rings"><div class="c g">${ring(s.resolution, 110, good(s.resolution))}<b>Resolution rate</b><span class="mu">${s.total - s.open} of ${s.total} fixed</span></div>
  <div class="c g">${ring(s.sla, 110, good(s.sla))}<b>SLA compliance</b><span class="mu">fixed or pending within deadline</span></div>
  <div class="c g">${ring(s.satisfaction, 110, good(s.satisfaction))}<b>Satisfaction</b><span class="mu">from student ratings</span></div>
  <div class="c g">${ring(s.total ? s.open / s.total * 100 : 0, 110, 'var(--wa)')}<b>Open workload</b><span class="mu">${s.open} open · ${s.urgentOpen} urgent</span></div></div>`];
}
async function vStats() {
  const [s, html] = await rings(), mx = Math.max(1, ...s.last14.map(d => d.n)), cat = Object.entries(s.byCategory).sort((a, b) => b[1] - a[1]);
  $('#v').innerHTML = html + `<div class="two"><div class="c g"><h3>Where problems come from</h3>${cat.map(([k, n]) => `<div style="margin:9px 0"><div class="top mu"><span>${M.cats[k].icon} ${E(M.cats[k].label)}</span><b>${Math.round(n / s.total * 100)}%</b></div><div class="bar"><i style="width:${n / s.total * 100}%"></i></div></div>`).join('') || '<p class="mu">No data yet</p>'}</div>
  <div class="c g"><h3>Last 14 days</h3><svg viewBox="0 0 280 110" width="100%">${s.last14.map((d, k) => `<rect x="${k * 20 + 3}" y="${95 - d.n / mx * 80}" width="14" height="${d.n / mx * 80 + 1}" rx="4" fill="#7c6cff"/><text x="${k * 20 + 10}" y="108" font-size="8" text-anchor="middle" fill="currentColor">${d.day}</text>`).join('')}</svg><p class="mu">Average fix time: <b>${s.avgFixHours}h</b></p></div></div>`;
}
async function vRank() {
  const l = await api('/leaderboard');
  $('#v').innerHTML = `<div class="c g"><h2>🏆 Campus leaderboard</h2>${l.map((u, k) => `<div class="pod"><b style="width:28px">${['🥇', '🥈', '🥉'][k] || k + 1}</b><span style="flex:1">${E(u.name)}<br><span class="mu">${E(u.year)} · ${E(u.branch)}</span></span><b>${u.xp} XP</b></div>`).join('') || '<p class="mu">File the first report to claim #1!</p>'}<p class="mu">+10 XP per report · +15 when fixed · +2 per “Me too”. Anonymous and confidential reports earn no XP.</p></div>`;
}

// ---------- admin console ----------
async function vConsole() {
  const [, html] = await rings(), l = await api('/issues?' + qs({ status: F.status, category: F.category, q: F.q, dept: F.dept }));
  $('#v').innerHTML = html + filters(true) + `<div class="c g" style="overflow:auto"><div class="top" style="align-items:center;margin-bottom:8px"><h3 style="margin:0">Issues (${l.length})</h3><span class="row" style="flex:none"><button class="btn s o" id="mydept">My department: ${E(U.dept)}</button><button class="btn s" id="csv">⬇ Export CSV</button></span></div>
  <table><tr><th>ID</th><th>Issue</th><th>Location</th><th>Status</th><th>Progress</th><th>SLA</th><th>🙋</th></tr>${l.map(i => `<tr data-open="${i.id}"><td>${i.code}</td><td>${M.cats[i.category].icon} ${E(i.sub)}${i.priority === 'Urgent' ? ' 🚨' : ''}${i.conf ? ' 🔒' : ''}</td><td>${E(i.building)} ${E(i.room)}</td><td>${i.status}</td><td>${stPct(i)}%</td><td style="color:${slaPct(i) >= 100 && i.status !== 'Fixed' ? 'var(--er)' : 'inherit'}">${slaPct(i)}%</td><td>${i.votes}</td></tr>`).join('')}</table></div>`;
  bindF();
}

// ---------- detail ----------
async function openIssue(id) {
  const i = await api('/issues/' + id), c = M.cats[i.category], adm = U.role === 'admin', sp = slaPct(i);
  $('#md').innerHTML = `<div class="back" data-close><div class="sheet g"><div class="top"><div><h2>${c.icon} ${E(c.label)} <small class="mu">#${i.code}</small></h2><div class="mu">${E(i.sub)} · ${E(i.building)} · ${E(i.room)}</div></div></div>
  <div class="row" style="align-items:center;margin:12px 0"><div style="text-align:center">${ring(stPct(i), 84, i.status === 'Fixed' ? 'var(--ok)' : 'var(--pr)')}<div class="mu">${i.status}</div></div><div style="text-align:center">${ring(Math.min(100, sp), 84, i.status === 'Fixed' ? good(100 - sp + 40) : sp >= 100 ? 'var(--er)' : sp > 70 ? 'var(--wa)' : 'var(--ok)')}<div class="mu">SLA time used</div></div></div>
  <p>${E(i.details)}</p>${i.reporter ? `<div class="warn">👤 ${E(i.reporter.name)} · PRN ${E(i.reporter.prn)} · ${E(i.reporter.year)} ${E(i.reporter.branch)} · Div ${E(i.reporter.division)} · Class incharge: ${E(i.reporter.incharge)}</div>` : adm ? '<div class="warn">🕶 Reported anonymously</div>' : ''}
  ${i.assigned ? `<p class="mu">👷 Assigned: <b>${E(i.assigned)}</b>${i.eta ? ' · ETA ' + E(i.eta) : ''}</p>` : ''}
  ${i.photo ? `<img class="thumb" src="${E(API + i.photo)}" alt="before">` : ''}${i.after ? `<img class="thumb" src="${E(API + i.after)}" alt="after"><p class="mu">After fix ✅</p>` : ''}
  <h3 style="margin-top:14px">Timeline</h3><div class="tl">${i.hist.map(h => `<div><b>${E(h.status)}</b> <span class="mu">${new Date(h.ts).toLocaleString()} · ${E(h.actor)}</span>${h.note ? `<div class="mu">${E(h.note)}</div>` : ''}</div>`).join('')}</div>
  ${!adm ? `<p><button class="btn s o" data-vote="${i.id}">🙋 Me too (${i.votes})</button></p>` : ''}
  ${i.mine && i.status === 'Fixed' && !i.rating ? `<h3>Rate this fix</h3><div class="chips">${[1, 2, 3, 4, 5].map(n => `<span class="chip" data-rate="${n}" data-id="${i.id}">★ ${n}</span>`).join('')}</div>` : ''}
  ${adm ? `<div class="c g"><h3>🛠 Update</h3><label>Status</label><select id="us">${opts(ST)}</select><div class="row"><div><label>Assign to</label><input id="ua" maxlength="60" placeholder="Team or person" value="${E(i.assigned || '')}"></div><div><label>ETA</label><input id="ue" type="date" value="${E(i.eta || '')}"></div></div>
  <label>Update note (visible in timeline)</label><input id="un" maxlength="200"><label>After photo (optional)</label><input type="file" id="uf" accept="image/*"><p><button class="btn" id="usv" data-id="${i.id}" style="width:100%">Save update</button></p></div>` : ''}
  <h3>💬 Conversation</h3>${i.comments.map(m => `<div class="msg ${m.role}"><div class="mu">${E(m.name)} · ${ago(now() - m.ts)} ago</div>${E(m.body)}</div>`).join('') || '<p class="mu">No messages yet.</p>'}
  <div class="row" style="flex-wrap:nowrap;margin-top:8px"><input id="cin" maxlength="500" placeholder="Write a message..."><button class="btn s" id="csn" data-id="${i.id}" style="flex:none">Send</button></div>
  <p><button class="btn o" data-close style="width:100%">Close</button></p></div></div>`;
  if (adm) $('#us').value = i.status; anim();
}

// ---------- notifications ----------
let nLast = null;
async function pollNotif() {
  if (!U) return;
  try {
    const r = await api('/notifications'), b = $('#bd');
    if (b) { b.textContent = r.unread > 9 ? '9+' : r.unread; b.style.display = r.unread ? 'block' : 'none'; }
    if (nLast !== null && r.unread > nLast && r.items[0]) {
      toast('🔔 ' + r.items[0].msg);
      if ('Notification' in window && Notification.permission === 'granted') new Notification('CampusFix', { body: r.items[0].msg });
    }
    nLast = r.unread;
  } catch (e) { /* ignore network hiccups */ }
}
function startNotif() { clearInterval(window._np); nLast = null; pollNotif(); window._np = setInterval(pollNotif, 20000); }
async function openNotifs() {
  if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
  const r = await api('/notifications');
  $('#md').innerHTML = `<div class="back" data-close><div class="sheet g"><h2>🔔 Notifications</h2>${r.items.map(n => `<div class="c g hv" data-open="${n.issue_id}"><b>${E(n.msg)}</b><div class="mu">${ago(now() - n.ts)} ago${n.seen ? '' : ' · NEW'}</div></div>`).join('') || '<p class="mu">No notifications yet.</p>'}<p><button class="btn o" data-close style="width:100%">Close</button></p></div></div>`;
  await api('/notifications/read', { method: 'POST', body: {} }); nLast = 0; pollNotif();
}

// ---------- events ----------
document.addEventListener('click', async e => {
  const t = e.target, d = t.closest('[data-role],[data-t],[data-cat],[data-sub],[data-pri],[data-vote],[data-open],[data-rate],[data-close]') || t;
  try {
    if (d.dataset?.role) { role = d.dataset.role; authScreen(); }
          else if (t.dataset?.legal) { e.preventDefault(); showLegal(t.dataset.legal); }
    else if (t.id === 'sw') { mode = mode === 'login' ? 'reg' : 'login'; authScreen(); }
    else if (d.dataset?.t) { tab = d.dataset.t; draw(); }
        else if (t.closest('#th')) { const n = curTheme() === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = n; try { localStorage.setItem('cf_theme', n); } catch (x) { /* ignore */ } $('#th span').innerHTML = ic('theme'); }
    else if (t.closest('#bell')) await openNotifs();
        else if (t.id === 'lo') confirmLogout();
    else if (t.id === 'lgo') { t.disabled = true; $('#md').innerHTML = ''; logout(); }
    else if (d.dataset?.cat) { rep.cat = d.dataset.cat; rep.sub = null; vReport(); }
    else if (d.dataset?.sub) { rep.sub = d.dataset.sub; document.querySelectorAll('#subs .chip').forEach(x => x.classList.toggle('on', x === d)); }
    else if (d.dataset?.pri) { rep.pri = d.dataset.pri; document.querySelectorAll('#pri .chip').forEach(x => x.classList.toggle('on', x === d)); }
    else if (t.id === 'go') await submitReport();
    else if (d.dataset?.vote) { e.stopPropagation(); await api(`/issues/${d.dataset.vote}/vote`, { method: 'POST', body: {} }); toast('“Me too” added 🙋'); $('#md').firstChild ? openIssue(d.dataset.vote) : draw(); }
    else if (d.dataset?.rate) { await api(`/issues/${t.dataset.id}/rate`, { body: { rating: +t.dataset.rate } }); toast('Thanks for your feedback ⭐'); openIssue(t.dataset.id); }
    else if (t.id === 'csn') { const v = $('#cin').value.trim(); if (v) { await api(`/issues/${t.dataset.id}/comments`, { body: { body: v } }); openIssue(t.dataset.id); } }
    else if (t.id === 'usv') {
      const b = { status: $('#us').value, assigned: $('#ua').value, eta: $('#ue').value, note: $('#un').value }, f = $('#uf').files[0];
      if (f) { b.after = await compress(f); b.status = 'Fixed'; }
      await api('/issues/' + t.dataset.id, { method: 'PATCH', body: b }); toast('Updated ✅'); openIssue(t.dataset.id); draw();
    }
    else if (t.id === 'mydept') { F.dept = F.dept ? false : U.dept; draw(); }
    else if (t.id === 'csv') { const r = await fetch(API + '/api/admin/export.csv', { headers: { Authorization: 'Bearer ' + T } }), a = document.createElement('a'); a.href = URL.createObjectURL(await r.blob()); a.download = 'campusfix-report.csv'; a.click(); }
    else if (t.closest('[data-open]') && !t.closest('[data-vote]')) await openIssue(t.closest('[data-open]').dataset.open);
    else if (t.matches('[data-close]') || t.closest('button[data-close]')) $('#md').innerHTML = '';
  } catch (x) { toast(x.message); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'fq') { F.q = e.target.value; clearTimeout(window._q); window._q = setTimeout(draw, 350); }
});
document.addEventListener('change', async e => {
  const t = e.target;
  if (t.id === 'fs') { F.status = t.value; draw(); } else if (t.id === 'fc') { F.category = t.value; draw(); } else if (t.id === 'fd') { F.dept = t.value; draw(); }
  else if (t.id === 'ph' && t.files[0]) { try { rep.photo = await compress(t.files[0]); toast('Photo attached 📷'); } catch (x) { toast('Could not read this photo. Please use a JPG or PNG image.'); } }
});
addEventListener('keydown', e => { if (e.key === 'Escape') $('#md').innerHTML = ''; });
setInterval(() => { if (U && !$('#md').firstChild && tab !== 'report' && !document.activeElement?.matches('input,textarea,select')) draw(); }, 25000);

(async () => {
  try { M = await api('/meta'); } catch (e) { return $('#app').innerHTML = `<div class="auth g"><h2>Cannot reach the backend</h2><p class="mu">Start the backend (<code>npm start</code>) and check <code>CF_API</code> in config.js. Current URL: <b>${E(API || location.origin)}</b></p></div>`; }
    Object.keys(M.cats).forEach(k => M.cats[k].icon = ic(CI[k] || 'dot', 20));
  if (T) try { U = (await api('/me')).user; } catch (e) { T = null; }
  U ? shell() : authScreen();
})();
