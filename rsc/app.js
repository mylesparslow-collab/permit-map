(function (PP_EMBED) {
  'use strict';

  // ---- client settings: everything specific to one contractor lives here ---------------------
  // Override any of it before this script loads: window.PP_CONFIG = { businessName: '...', accent: '#0a7' }
  // (the <permit-map> embed passes the same keys from its attributes)
  const DEFAULT_CONFIG = {
    brandName: 'Permit Postcards',
    logoText: 'PP',
    businessName: 'Your Business',   // printed on the postcard
    phone: '(310) 555-0142',                    // printed on the postcard
    url: 'yourshop.example',                    // printed on the postcard
    defaultTrade: 'countertops',
    defaultPlace: null,                         // a preset id (e.g. 'anaheim'); null = first place with data
    radiusMiles: 10,
    accent: null,                               // CSS colour; overrides the accent in both themes when set
    state: 'CA',                                // printed in postcard / directions addresses
    title: null,                                // browser tab title (defaults to brandName)
    presets: null,                              // [{id,label,lat,lng,city,region}] replaces the built-in places (client instances)
    aboutText: null,                            // replaces the first About paragraph (client instances whose data is not permits)
    appCopy: null,                              // {head, offer} postcard text for planning-stage rows: {street} {biz} are filled in
    mailRelay: '',                              // URL of the postalytics/relay worker; when set, the lead panel gets a "Mail postcard" button
    mailCost: 1.08                              // dollars per card, shown in the confirm dialog
  };

  // ---- copy templates (short, plain, no hype) --------------------------------
  const COPY = {
    kitchen:    { head: 'Your kitchen permit just came through.',      offer: 'Free measure and a written quote on your {trade}, before the work gets far along.' },
    bath:       { head: 'Your bathroom permit just came through.',     offer: 'Free measure and a written quote on your {trade}. Most jobs fit your build schedule.' },
    roof:       { head: 'Your re-roof permit just came through.',      offer: 'A free estimate on {trade} while the crew is already on site.' },
    pool_spa:   { head: 'Your pool permit just came through.',         offer: 'Free site visit and a written quote on {trade}, timed to your build.' },
    adu:        { head: 'Your ADU permit just came through.',          offer: 'Free quote on {trade} for your new unit, scheduled around construction.' },
    addition:   { head: 'Your addition permit just came through.',     offer: 'Free quote on {trade} for the new space, scheduled around your contractor.' },
    new_home:   { head: 'Your new home permit just came through.',     offer: 'Free quote on {trade}. We can plan it with your builder from the start.' },
    solar:      { head: 'Your solar permit just came through.',        offer: 'Free quote on {trade}, designed to go with your new system.' },
    demolition: { head: 'Your demolition permit just came through.',   offer: 'Free quote on {trade} for the clean-up and whatever you build next.' },
    hvac:       { head: 'Your HVAC permit just came through.',         offer: 'Free quote on {trade} while the walls and ceilings are open.' },
    other:      { head: 'Your building permit just came through.',     offer: 'Free quote on {trade}. No obligation.' }
  };
  const TRADE_NOUN = {
    countertops: 'countertops', cabinets: 'cabinets', appliances: 'appliances', flooring: 'flooring', tile: 'tile',
    shower_glass: 'shower glass', plumbing_fixtures: 'plumbing fixtures', fencing: 'fencing', landscaping: 'landscaping',
    pool_service: 'pool service', solar_pool_heating: 'solar pool heating', furniture: 'furniture',
    windows_blinds: 'windows and blinds', gutters: 'gutters', solar: 'solar', dumpsters: 'dumpster rental',
    battery_ev: 'battery and EV charging', insulation: 'insulation'
  };

  // all non-lead permits are one quiet grey (the --dot token)
  const PRESETS = [
    { id: 'santa-monica', label: 'Santa Monica', lat: 34.0195, lng: -118.4912, city: 'Los Angeles', region: 'Los Angeles area' },
    { id: 'van-nuys', label: 'Van Nuys', lat: 34.1899, lng: -118.4514, city: 'Los Angeles', region: 'Los Angeles area' },
    { id: 'downtown', label: 'Downtown LA', lat: 34.0522, lng: -118.2437, city: 'Los Angeles', region: 'Los Angeles area' },
    { id: 'san-pedro', label: 'San Pedro', lat: 33.7358, lng: -118.2923, city: 'Los Angeles', region: 'Los Angeles area' },
    { id: 'altadena', label: 'Altadena', lat: 34.1897, lng: -118.1311, city: 'LA County (unincorporated)', region: 'Los Angeles area' },
    { id: 'anaheim', label: 'Anaheim', lat: 33.8353, lng: -117.9145, city: 'Anaheim', region: 'Orange County' },
    { id: 'newport-beach', label: 'Newport Beach', lat: 33.6189, lng: -117.9289, city: 'Newport Beach', region: 'Orange County' },
    { id: 'costa-mesa', label: 'Costa Mesa', lat: 33.6411, lng: -117.9187, city: 'Costa Mesa', region: 'Orange County' },
    { id: 'lake-forest', label: 'Lake Forest', lat: 33.6469, lng: -117.6892, city: 'Lake Forest', region: 'Orange County' },
    { id: 'lake-elsinore', label: 'Lake Elsinore', lat: 33.6681, lng: -117.3273, city: 'Lake Elsinore', region: 'Inland Empire' },
    { id: 'north-park', label: 'North Park', lat: 32.7410, lng: -117.1294, city: 'San Diego', region: 'San Diego' },
    { id: 'willow-glen', label: 'Willow Glen', lat: 37.3043, lng: -121.8999, city: 'San Jose', region: 'Bay Area' },
    { id: 'sunset-sf', label: 'Sunset, San Francisco', lat: 37.7536, lng: -122.4939, city: 'San Francisco', region: 'Bay Area' },
    { id: 'east-sacramento', label: 'East Sacramento', lat: 38.5700, lng: -121.4600, city: 'Sacramento', region: 'Sacramento area' },
    { id: 'elk-grove', label: 'Elk Grove', lat: 38.4088, lng: -121.3716, city: 'Elk Grove', region: 'Sacramento area' },
    { id: 'clovis', label: 'Clovis', lat: 36.8252, lng: -119.7029, city: 'Clovis', region: 'Central Valley' }
  ];
  const REGIONS = ['Los Angeles area', 'Orange County', 'Inland Empire', 'San Diego', 'Bay Area', 'Sacramento area', 'Central Valley'];
  const MI = 1609.344;
  const STATUSES = ['new', 'contacted', 'quoting', 'won', 'lost'];
  const STATUS_LABEL = { new: 'New', contacted: 'Contacted', quoting: 'Quoting', won: 'Won', lost: 'Lost' };
  const LS_KEY = 'pp-leads-v1';
  const NOTE_CAP = 50;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtDate = (iso, year = true) => {
    const [y, m, d] = iso.split('-').map(Number);
    return `${MONTHS[m - 1]} ${d}${year ? ', ' + y : ''}`;
  };
  const trunc = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const pad2 = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return ymd(d); };
  const ago = (iso) => {
    const t = new Date(iso), s = (Date.now() - t) / 1000;
    if (isNaN(t)) return '';
    if (s < 60) return 'Just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    if (s < 604800) return Math.floor(s / 86400) + 'd ago';
    return `${MONTHS[t.getMonth()]} ${t.getDate()}` + (t.getFullYear() === new Date().getFullYear() ? '' : ', ' + t.getFullYear());
  };
  const dateLabel = (r) => (r.stage === 'application' ? (r.dateKind === 'filed' ? 'Filed' : 'On agenda') : 'Issued');   // planning filings are not permits
  const titleCase = (s) => s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());

  // ---- lead intelligence: pure functions over lead rows (no DOM) ---------------------------------
  // A lead row (see load()): { nbr, addr, city, val, date, kinds[], trades:Set, homeK (median home value in $1000s, null if unknown),
  // ownPct (owner-occupied %, null), fire ('Eaton'|'Palisades'|''), others:[{nbr,date,desc}], contractor:'Name · phone' }.
  // `intel` carries what the data file provides: { timing: {kind:{trade:[fromWk,toWk]}}, fitPrimary: {kind:[trade]}, kinds: meta.kinds }.

  // Lead id = <city-slug>~<normalized address>, so a newer permit at the same address stays the same lead.
  // The old id was <city-slug>~<permit number>; legacyId() rebuilds it so saved records can be found (read side only).
  const safeId = (s) => s.replace(/[^A-Za-z0-9_\-.~:@+]/g, '-');
  const citySlug = (c) => String(c).toLowerCase().replace(/\s+/g, '-');
  const addrKey = (a) => String(a).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const leadId = (r) => safeId(citySlug(r.city) + '~' + addrKey(r.addr));
  const legacyId = (city, nbr) => safeId(citySlug(city) + '~' + nbr);

  const TIER_LABEL = { hot: 'Hot', warm: 'Warm', cool: 'Cool' };
  const TIMING_RANK = { now: 3, soon: 2, early: 1, late: 0, unknown: -1 };
  const SOON_WEEKS = 3;
  const APP_NOW_DAYS = 60, APP_SOON_DAYS = 180;   // planning-stage filings: age limits for 'now, before they hire' and 'soon, likely still planning'
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const weeksSince = (iso, now) => {
    const [y, m, d] = iso.split('-').map(Number);
    return (new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(y, m - 1, d)) / 604800000;
  };
  // Best timing window across the lead's project kinds for this trade.
  // -> { state: 'now'|'soon'|'early'|'late'|'unknown', weeks, from, to, inWeeks (soon/early only), kind }
  function leadTiming(r, trade, intel, now = new Date()) {
    const weeks = weeksSince(r.date, now);
    if (r.stage === 'application') {   // a planning / zoning filing, aged by its date: <= 60 days they have not hired anyone (now), 61-180 still likely planning (soon), older probably underway
      const k = r.kinds.find((x) => intel.timing && intel.timing[x] && intel.timing[x][trade]);
      const days = Math.round(weeks * 7);
      const state = !k ? 'unknown' : days <= APP_NOW_DAYS ? 'now' : days <= APP_SOON_DAYS ? 'soon' : 'late';
      return { state, weeks, from: state === 'soon' ? APP_NOW_DAYS / 7 : 0, to: (state === 'soon' ? APP_SOON_DAYS : APP_NOW_DAYS) / 7, inWeeks: null, kind: k || null, app: true };
    }
    let best = { state: 'unknown', weeks, from: null, to: null, inWeeks: null, kind: null };
    r.kinds.forEach((k) => {
      const w = intel.timing && intel.timing[k] && intel.timing[k][trade];
      if (!w) return;
      let state = 'late', inWeeks = null;
      if (weeks < w[0]) { inWeeks = Math.max(1, Math.ceil(w[0] - weeks)); state = w[0] - weeks <= SOON_WEEKS ? 'soon' : 'early'; }
      else if (weeks <= w[1]) state = 'now';
      const cand = { state, weeks, from: w[0], to: w[1], inWeeks, kind: k };
      if (TIMING_RANK[state] > TIMING_RANK[best.state]) best = cand;
    });
    return best;
  }
  // Plain-words phrase for "Best time to reach out: ..."
  function timingPhrase(t) {
    if (t.state === 'now') return t.app ? 'now, before they hire' : 'now';
    if (t.app) return t.state === 'soon' ? 'soon, likely still planning' : t.state === 'late' ? 'probably underway' : 'not sure yet';
    if (t.state === 'soon' || t.state === 'early') return `in about ${t.inWeeks} week${t.inWeeks === 1 ? '' : 's'}`;
    if (t.state === 'late') return 'probably already done';
    return 'not sure yet';
  }
  const shortMoney = (n) => (n >= 1e6 ? '$' + +(n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? '$' + Math.round(n / 1e3) + 'k' : '$' + Math.round(n));
  const homeLabel = (k) => (k >= 2000 ? '$2M+' : k >= 1000 ? '$' + +(k / 1000).toFixed(1) + 'M' : '$' + k + 'k');
  // Points (0..~100) -> { score, bucket, reasons[], timing }.
  // Timing is graded (earlier in the window and closer to it scores higher), value is on a log scale, so the scores spread
  // out instead of piling up at a few fixed values. `bucket` here is the absolute call (>= 67 Hot, >= 49 Warm); the app then
  // re-ranks every lead in the current trade + area with assignTiers() so Hot always means "the best of what is near you".
  const ABS_HOT = 67, ABS_WARM = 49;
  function leadScore(r, trade, intel, now = new Date()) {
    const t = leadTiming(r, trade, intel, now);
    let score;
    if (t.state === 'now') score = 40 - 8 * clamp((t.weeks - t.from) / Math.max(1, t.to - t.from), 0, 1);
    else if (t.state === 'soon' && t.app) score = 28 - 12 * clamp((t.weeks - t.from) / Math.max(1, t.to - t.from), 0, 1);   // 28 at 61 days -> 16 at 180
    else if (t.state === 'soon') score = 24 - (t.inWeeks || 0);
    else if (t.state === 'early') score = clamp(14 - ((t.inWeeks || 0) - SOON_WEEKS) * 0.5, 4, 14);
    else if (t.state === 'late') score = t.app ? 6 : 0;   // an old filing stays on the list, ranked low
    else score = 10;
    score += r.val > 0 ? clamp(Math.log10(r.val / 4000) * 12, 0, 26) : 6;
    const fit = r.kinds.some((k) => (intel.fitPrimary[k] || []).includes(trade)) ? 14
      : r.kinds.some((k) => (intel.kinds[k] ? intel.kinds[k].trades : []).includes(trade)) ? 7 : 0;
    score += fit;
    if (r.homeK != null) score += clamp((r.homeK - 400) / 800 * 12, 0, 12);
    if (r.ownPct != null && r.ownPct >= 60) score += 4;
    score = Math.round(score * 10) / 10;
    const reasons = [];
    const kind = t.kind || r.kinds.find((k) => (intel.kinds[k] ? intel.kinds[k].trades : []).includes(trade)) || r.kinds[0];
    reasons.push((intel.kinds[kind] || { label: 'Other' }).label);
    reasons.push(r.val > 0 ? shortMoney(r.val) : 'value not listed');
    reasons.push(t.app ? { now: 'planning stage, before they hire', soon: 'planning stage, likely still planning', late: 'filed a while ago, probably underway', unknown: 'timing unclear' }[t.state] : { now: 'right timing', soon: 'timing coming up', early: 'a bit early', late: 'probably already done', unknown: 'timing unclear' }[t.state]);
    if (r.homeK != null && r.homeK >= 800) reasons.push('high-value area');
    if (r.fire) reasons.push('fire rebuild');
    return { score, bucket: score >= ABS_HOT ? 'hot' : score >= ABS_WARM ? 'warm' : 'cool', reasons, timing: t };
  }
  // Rank leads against each other: the top ~12% are Hot (and must score at least HOT_FLOOR), the bottom ~25% are Cool.
  // Each item needs { intel:{score,bucket}, date, val }. Too few leads to rank (< 8) keeps the absolute bucket.
  const TIER_HOT_SHARE = 0.12, TIER_COOL_SHARE = 0.25, HOT_FLOOR = 45, TIER_MIN = 8;
  function assignTiers(list) {
    // an old planning filing (probably underway) is always Cool and does not count toward the Hot / Cool shares of the rest
    const late = (r) => r.intel.timing && r.intel.timing.app && r.intel.timing.state === 'late';
    list.filter(late).forEach((r) => { r.intel.bucket = 'cool'; });
    const rest = list.filter((r) => !late(r));
    const n = rest.length;
    if (n < TIER_MIN) return list;
    const order = rest.slice().sort((a, b) => b.intel.score - a.intel.score || b.date.localeCompare(a.date) || b.val - a.val);
    const hotN = Math.round(n * TIER_HOT_SHARE), coolN = Math.round(n * TIER_COOL_SHARE);
    order.forEach((r, i) => {
      r.intel.bucket = i < hotN && r.intel.score >= HOT_FLOOR ? 'hot' : i >= n - coolN ? 'cool' : 'warm';
    });
    return list;
  }
  // Contractor grouping. Owner-builders / blanks excluded. -> [{ key, name, phone, jobs, newest, leads[] }] busiest first
  const NOT_BUILDER = /^(OWNER|OWNERS|OWNER BUILDER|OWNER-BUILDER|HOMEOWNER|HOME OWNER|SELF|NONE|N\/?A|NA|TBD|UNKNOWN|NOT LISTED|NO CONTRACTOR)$/;
  function splitContractor(raw) {
    const [name, ...rest] = String(raw || '').split(' · ');
    return { name: name.trim(), phone: rest.join(' · ').trim() };
  }
  function builderKey(name) {
    const k = name.toUpperCase().replace(/&/g, ' AND ').replace(/[^A-Z0-9 ]/g, ' ')
      .replace(/\b(INC|LLC|CORP|CORPORATION|CO|COMPANY|LTD|LP|THE)\b/g, ' ').replace(/\s+/g, ' ').trim();
    return NOT_BUILDER.test(k) || NOT_BUILDER.test(name.toUpperCase().trim()) ? '' : k;
  }
  function buildersNear(leads) {
    const by = new Map();
    leads.forEach((r) => {
      const c = splitContractor(r.contractor), key = builderKey(c.name);
      if (!key) return;
      let b = by.get(key);
      if (!b) { b = { key, name: c.name, phone: '', jobs: 0, newest: '', leads: [] }; by.set(key, b); }
      if (!b.phone && c.phone) b.phone = c.phone;
      b.jobs++; b.leads.push(r);
      if (r.date > b.newest) b.newest = r.date;
    });
    return [...by.values()].sort((a, b) => b.jobs - a.jobs || b.newest.localeCompare(a.newest));
  }
  if (!PP_EMBED) window.PP_LOGIC = { leadTiming, timingPhrase, leadScore, assignTiers, buildersNear, builderKey, leadId, legacyId };
  // ---- end lead intelligence ----


  // ---- lead store (shared db in the published page, localStorage otherwise) --------
  // store.all() Map leadId -> record · store.update(id, op, seed) Promise<{ok,message?}> · store.onChange(fn) · store.mode shared|local|readonly
  // store.loading is true until the first confirmed snapshot (and the user id) have arrived: nothing is written before that.
  // Every edit is an OPERATION (set status / set follow-up / add note), never a whole-record write: at write time the op is applied to
  // the newest copy we know of, and when a snapshot arrives while edits are unsaved they are re-applied on top of it. Notes merge by
  // at|by|text, and a note of ours that a concurrent writer's whole-document set dropped is put back (heal), so two people adding
  // notes at once keep both. Status and follow-up stay last-writer-wins.
  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  const STALE_DAYS = 180;
  const stamp = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  const blankSaved = () => ({ status: 'new', followUp: null, notes: [] });
  const noteKey = (n) => n.at + '|' + (n.by || '') + '|' + n.text;
  function cleanNotes(v) {
    if (!Array.isArray(v)) return [];
    const out = [];
    v.forEach((n) => {
      if (!n || typeof n !== 'object' || typeof n.at !== 'string' || typeof n.text !== 'string') return;
      if (n.by != null && typeof n.by !== 'string') return;
      out.push({ at: n.at, text: n.text, by: n.by == null ? null : n.by });
    });
    return out.slice(-NOTE_CAP);
  }
  // union by at|by|text, oldest first, newest NOTE_CAP kept
  function mergeNotes(a, b) {
    const seen = new Set(), out = [];
    (a || []).concat(b || []).forEach((n) => { const k = noteKey(n); if (!seen.has(k)) { seen.add(k); out.push(n); } });
    out.sort((x, y) => (x.at < y.at ? -1 : x.at > y.at ? 1 : 0));
    return out.slice(-NOTE_CAP);
  }
  // Anything read from the shared db is untrusted: build a clean record or return null.
  function normalizeRec(d) {
    if (!d || typeof d !== 'object' || Array.isArray(d)) return null;
    const rec = {
      status: STATUSES.includes(d.status) ? d.status : 'new',
      followUp: typeof d.followUp === 'string' && DATE_RE.test(d.followUp) ? d.followUp : null,
      notes: cleanNotes(d.notes)
    };
    ['trade', 'addr', 'city', 'updatedAt', 'statusAt'].forEach((k) => { if (typeof d[k] === 'string') rec[k] = d[k]; });
    if (typeof d.updatedBy === 'string') rec.updatedBy = d.updatedBy;
    if (typeof d.permitDate === 'string' && DATE_RE.test(d.permitDate)) rec.permitDate = d.permitDate;
    if (Array.isArray(d.permits)) rec.permits = d.permits.filter((x) => typeof x === 'string').slice(0, 30);
    if (d.prior && typeof d.prior === 'object' && STATUSES.includes(d.prior.status)) rec.prior = { status: d.prior.status, at: typeof d.prior.at === 'string' ? d.prior.at : '' };
    return rec;
  }
  const dayNum = (iso) => { const [y, m, d] = iso.split('-').map(Number); return Date.UTC(y, m - 1, d) / 86400000; };
  // A Won/Lost record saved for an old project at this address, when the lead's newest permit is 180+ days newer.
  const isStale = (rec, date) => !!rec && (rec.status === 'won' || rec.status === 'lost') && DATE_RE.test(rec.permitDate || '') && DATE_RE.test(date || '') && dayNum(date) - dayNum(rec.permitDate) > STALE_DAYS;
  // Run first by every op: a stale Won/Lost starts over as New (remembering what it was), and the record notes which permits it covers.
  function touch(rec, lead) {
    if (!Array.isArray(rec.notes)) rec.notes = [];
    if (!lead) return;
    if (isStale(rec, lead.date)) {
      rec.prior = { status: rec.status, at: rec.statusAt || rec.updatedAt || '' };
      rec.status = 'new'; rec.followUp = null;
    }
    rec.permits = lead.permits.slice(0, 30);
    rec.permitDate = lead.date;
  }
  const ops = {
    status: (st, lead) => { const at = stamp(); return { kind: 'status', apply(rec) { touch(rec, lead); if (rec.status !== st) { rec.status = st; rec.statusAt = at; } } }; },
    follow: (v, lead) => ({ kind: 'follow', apply(rec) { touch(rec, lead); rec.followUp = v || null; } }),
    note: (text, by, lead) => {
      const n = { at: stamp(), by: by || null, text };
      return { kind: 'note', note: n, apply(rec) { touch(rec, lead); rec.notes = mergeNotes(rec.notes, [n]); } };
    },
    keep: (n) => ({ kind: 'note', note: n, apply(rec) { if (!Array.isArray(rec.notes)) rec.notes = []; rec.notes = mergeNotes(rec.notes, [n]); } })
  };

  function createStore(env) {
    const lsKey = env.lsKey || LS_KEY;   // the embed namespaces this per place set + trade
    const server = new Map(), recs = new Map(), queue = new Map(), chains = new Map(), mine = new Map(), healTimers = new Map();
    const profiles = new Map(), asked = new Set();
    const notices = { unreach: '', fail: '', ro: '' };
    const subs = new Set();
    let db = null, user = null, uid = null, readonly = false;
    let local = !(env.claude && typeof env.claude.use === 'function');
    let snapOk = false, idOk = false, sawSnap = false, grace = false, seq = 0, invalid = 0, unreachTimer = 0, resolveReady;
    const ready = new Promise((r) => { resolveReady = r; });
    const cl = (o) => JSON.parse(JSON.stringify(o));
    const emit = (kind) => subs.forEach((fn) => { try { fn(kind); } catch (e) { console.error(e); } });
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    const loading = () => !local && !readonly && !(snapOk && idOk);

    // recs = last saved copy + this session's unsaved ops on top
    function view(id) {
      const q = queue.get(id);
      if (!q || !q.length) { const s = server.get(id); if (s) recs.set(id, s); else recs.delete(id); return; }
      const rec = cl(server.get(id) || q[0].seed || blankSaved());
      q.forEach((e) => e.op.apply(rec));
      recs.set(id, rec);
    }
    function rebuild() {
      recs.clear();
      server.forEach((v, k) => recs.set(k, v));
      queue.forEach((_, id) => view(id));
    }
    function finish(rec) {
      rec.updatedAt = stamp();
      rec.updatedBy = uid;
      if (rec.notes.length > NOTE_CAP) rec.notes = rec.notes.slice(-NOTE_CAP);
    }

    // ---- this device only
    function readLocal() {
      try {
        const o = JSON.parse(env.storage().getItem(lsKey) || '{}');
        return o && typeof o === 'object' && !Array.isArray(o) ? o : {};
      } catch (e) { return {}; }   // storage unavailable or corrupt: start empty
    }
    function loadLocal() {
      const o = readLocal();
      server.clear();
      Object.keys(o).forEach((id) => { const v = normalizeRec(o[id]); if (v) server.set(id, v); });
      rebuild();
    }
    // re-read storage and change only this id, so another tab's edits to other leads survive
    function writeLocal(id, entry) {
      const o = readLocal();
      const base = normalizeRec(o[id]) || cl(server.get(id) || entry.seed || blankSaved());
      entry.op.apply(base);
      finish(base);
      o[id] = base;
      server.set(id, base);
      try { env.storage().setItem(lsKey, JSON.stringify(o)); notices.fail = ''; return { ok: true }; } catch (e) {
        notices.fail = 'Your browser blocked saving here, so changes last only until you close this page.';
        return { ok: false, kept: true };
      }
    }

    // ---- shared db
    function setReadonly(msg) { readonly = true; notices.ro = msg || 'You can view these leads but not change them.'; }
    function onWriteError(e) {
      const code = e && e.code;
      let message = 'Couldn’t save this lead.';
      if (code === 'revoked' || code === 'not_granted' || code === 'capability_disabled') setReadonly();
      else if (code === 'invalid_argument') {   // one bad write is a failed write; only a repeat (or no write permission) locks the page
        if (++invalid >= 2) setReadonly();
        else Promise.resolve(user && user.can ? user.can('data.write') : null).then((ok) => { if (ok === false) { setReadonly(); emit(); } }).catch(() => {});
      } else if (code === 'quota_exceeded' || code === 'resource_exhausted') {
        message = 'This page has reached its saving limit, so your last change was not saved.';
        notices.fail = message;
      } else message = 'Could not save that change. Check your connection and try again.';
      return { ok: false, message, reason: code || 'error' };
    }
    async function write(id, entry) {
      const ref = db.collection('leads').doc(id), seq0 = seq;
      const base = cl(server.get(id) || entry.seed || blankSaved());   // newest copy we know of, read now
      entry.op.apply(base);
      finish(base);
      let err = null;
      try { await ref.set(base); } catch (e) {
        err = e;
        if (e && e.code === 'unavailable') {   // retry once
          await delay(300 + Math.random() * 900);
          err = null;
          try { await ref.set(base); } catch (e2) { err = e2; }
        }
      }
      if (err) return onWriteError(err);
      invalid = 0; notices.fail = '';
      if (seq === seq0) server.set(id, base);
      else { const cur = cl(server.get(id) || base); entry.op.apply(cur); server.set(id, cur); }   // a snapshot came in meanwhile: keep it, plus our edit
      if (entry.op.note) {
        if (!mine.has(id)) mine.set(id, new Map());
        const k = noteKey(entry.op.note), t = mine.get(id).get(k);
        if (t) t.at = Date.now(); else mine.get(id).set(k, { note: entry.op.note, tries: 0, at: Date.now() });
      }
      return { ok: true };
    }
    // A concurrent writer's whole-document set can drop a note we saved. Put back our own notes that are missing (at most 3 tries each).
    function heal(id) {
      const m = mine.get(id), doc = server.get(id);
      if (!m || !doc || (queue.get(id) || []).length) return;
      const have = new Set(doc.notes.map(noteKey)), settle = env.settleMs == null ? 1500 : env.settleMs;
      m.forEach((t, key) => {
        if (have.has(key) || t.tries >= 3) return;
        if (doc.notes.length >= NOTE_CAP && t.note.at < doc.notes[0].at) return;   // aged out by the cap, not overwritten
        const wait = settle - (Date.now() - t.at);
        if (wait > 0) {   // our own write may not have reached this snapshot yet: look again shortly
          if (!healTimers.has(id)) healTimers.set(id, setTimeout(() => { healTimers.delete(id); heal(id); }, wait + 20));
          return;
        }
        t.tries++;
        update(id, ops.keep(t.note));
      });
    }
    async function persist(id, entry) {
      let res;
      try {
        await ready;
        if (local) res = writeLocal(id, entry);
        else if (!readonly) res = await write(id, entry);
        else res = { ok: false, reason: 'readonly' };
      } catch (e) { res = onWriteError(e); }
      const q = queue.get(id);
      if (q) { const i = q.indexOf(entry); if (i >= 0) q.splice(i, 1); if (!q.length) queue.delete(id); }
      view(id);   // a failed edit falls back to the last saved copy
      emit();
      return res;
    }
    function update(id, op, seed) {
      if (readonly) return Promise.resolve({ ok: false, reason: 'readonly' });
      if (loading()) return Promise.resolve({ ok: false, reason: 'loading' });
      if (op.note && !op.note.by && uid) op.note.by = uid;
      if (!queue.has(id)) queue.set(id, []);
      queue.get(id).push({ op, seed: seed ? cl(seed) : null });
      const entry = queue.get(id)[queue.get(id).length - 1];
      view(id); emit();
      const p = (chains.get(id) || Promise.resolve()).then(() => persist(id, entry));   // one write at a time per doc
      chains.set(id, p);
      const done = () => { if (chains.get(id) === p) chains.delete(id); };
      p.then(done, done);
      return p;
    }
    // whole-record callers still work: applied as an operation, so notes merge instead of being replaced
    function save(id, rec) {
      const keep = normalizeRec(rec) || blankSaved();
      return update(id, { kind: 'save', apply(r) { r.status = keep.status; r.followUp = keep.followUp; r.notes = mergeNotes(r.notes, keep.notes); } }, keep);
    }

    function want(id) {
      if (!user || !user.profiles || profiles.has(id) || asked.has(id)) return;
      asked.add(id);
      Promise.resolve(user.profiles([id])).then((m) => { if (m && m[id]) { profiles.set(id, m[id]); emit('profiles'); } }).catch(() => {});
    }
    function author(by) {
      if (!by) return local ? 'You' : 'Someone';
      if (by === uid) return 'You';
      const p = profiles.get(by);
      if (!p) { want(by); return 'Someone'; }
      return p.isMe ? 'You' : (p.name || 'Someone');
    }
    function onSnapshot(snap) {
      const cache = !!(snap.metadata && snap.metadata.fromCache);
      sawSnap = true;
      if (!cache) { clearTimeout(unreachTimer); notices.unreach = ''; snapOk = true; } else if (grace) snapOk = true;
      server.clear();
      (snap.docs || []).forEach((d) => {
        try { if (d.exists === false) return; const v = normalizeRec(d.data()); if (v) server.set(d.id, v); } catch (e) { console.error(e); }
      });
      seq++;
      rebuild();   // unsaved edits are re-applied on top of the new server copy
      mine.forEach((_, id) => heal(id));
      emit();
    }
    function onSnapshotError() {
      clearTimeout(unreachTimer);
      notices.unreach = 'Saved leads could not be loaded. Reload the page to try again.';
      setReadonly(notices.unreach);   // never write over data we could not read
      emit();
    }
    function listenStorage() {
      if (env.onStorage) env.onStorage((e) => { if (e.key === null || e.key === lsKey) { loadLocal(); emit(); } });
    }
    async function start() {
      if (local) { loadLocal(); listenStorage(); resolveReady(); emit(); return; }
      try { db = await env.claude.use('db'); } catch (e) { db = null; }
      if (!db) { local = true; loadLocal(); listenStorage(); resolveReady(); emit(); return; }
      try { user = await env.claude.use('user'); } catch (e) { user = null; }
      unreachTimer = setTimeout(() => {
        notices.unreach = 'Saved leads can’t be reached yet.';
        grace = true;                      // a cached snapshot that never gets confirmed is good enough to work from
        if (sawSnap) snapOk = true;
        emit();
      }, env.graceMs || 10000);
      db.collection('leads').onSnapshot(onSnapshot, onSnapshotError);   // subscribed once
      try {
        if (user) {
          uid = await user.id();
          if ((await user.can('data.write')) === false) setReadonly();
        }
      } catch (e) { /* unknown: keep inputs, decide on the first rejected write */ }
      idOk = true;
      resolveReady();
      emit();
    }
    return {
      start, update, save, ops, author,
      stop() { clearTimeout(unreachTimer); healTimers.forEach((t) => clearTimeout(t)); healTimers.clear(); subs.clear(); },
      all: () => recs,
      onChange: (fn) => { subs.add(fn); return () => subs.delete(fn); },
      get mode() { return readonly ? 'readonly' : (local ? 'local' : 'shared'); },
      get notice() { return notices.ro || notices.fail || notices.unreach || (loading() ? 'Loading saved leads…' : ''); },
      get noticeQuiet() { return !notices.ro && !notices.fail && !notices.unreach && loading(); },
      get loading() { return loading(); },
      get uid() { return uid; },
      get busy() { return queue.size > 0; }
    };
  }
  // ---- end lead store ----
  if (!PP_EMBED) window.PP_STORE = { createStore, ops, normalizeRec, mergeNotes, isStale };

  // ---- icons (Lucide, ISC licence) --------------------------------------------------------------
  const ICONS = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    panelLeft: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
    layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    crosshair: '<circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mapPin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    navigation: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    helpCircle: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    stickyNote: '<path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/>'
  };
  const icon = (name) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;
  function paintIcons(root) {
    (root || document).querySelectorAll('[data-icon]').forEach((el) => { if (!el.firstChild) el.innerHTML = icon(el.dataset.icon); });
  }

  // ---- default data source: the page's own files (an embed passes options.loadData instead) ----------
  async function defaultLoad() {
    if (window.PERMIT_DATA) return { permits: window.PERMIT_DATA.permits, meta: window.PERMIT_DATA.meta };
    const [pRes, mRes] = await Promise.all([fetch('data/permits.json'), fetch('data/meta.json')]);
    if (!pRes.ok || !mRes.ok) throw new Error('data files missing. Run: python3 pipeline/fetch.py');
    return { permits: await pRes.json(), meta: await mRes.json() };
  }

  // ---- export helpers (pure: rows in, text out) -------------------------------------------------------------
  // A row: { id, address, city, zip, status, followUp, score, timing, project, value, permit, issued, contractor, notes, board? (planning filings only) }
  const CSV_COLS = [['Address', 'address'], ['City', 'city'], ['ZIP', 'zip'], ['Status', 'status'], ['Follow-up', 'followUp'], ['Score', 'score'],
    ['Timing', 'timing'], ['Project', 'project'], ['Value', 'value'], ['Permit #', 'permit'], ['Issued', 'issued'], ['Contractor', 'contractor'], ['Notes', 'notes']];
  // planning / zoning filings (rows with a board) have no permit: 'Issued' becomes 'Filed', 'Permit #' the case number, and the board gets a column
  const CSV_COLS_APP = [['Address', 'address'], ['City', 'city'], ['ZIP', 'zip'], ['Status', 'status'], ['Follow-up', 'followUp'], ['Score', 'score'],
    ['Timing', 'timing'], ['Project', 'project'], ['Filed', 'issued'], ['Board', 'board'], ['Case #', 'permit'], ['Notes', 'notes']];
  function csvCell(v) {
    let s = v == null ? '' : String(v);
    if (typeof v === 'string' && /^[=+\-@\t\r]/.test(s)) s = "'" + s;   // a spreadsheet must not read text as a formula
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function leadsToCsv(rows) {
    const cols = rows.some((r) => r.board) ? CSV_COLS_APP : CSV_COLS;
    return [cols.map((c) => c[0]).join(',')].concat(rows.map((r) => cols.map((c) => csvCell(r[c[1]])).join(','))).join('\r\n') + '\r\n';
  }
  const icsText = (s) => String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  const utf8len = (ch) => { const c = ch.codePointAt(0); return c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4; };
  function icsFold(line) {   // lines are at most 75 octets; continuation lines start with one space
    const out = []; let cur = '', n = 0;
    for (const ch of line) {
      const b = utf8len(ch);
      if (n + b > (out.length ? 74 : 75)) { out.push(cur); cur = ch; n = b; } else { cur += ch; n += b; }
    }
    out.push(cur);
    return out.join('\r\n ');
  }
  const compactDate = (iso) => iso.replace(/-/g, '');
  function nextDate(iso) {
    const [y, m, d] = iso.split('-').map(Number), t = new Date(Date.UTC(y, m - 1, d + 1));
    return `${t.getUTCFullYear()}${pad2(t.getUTCMonth() + 1)}${pad2(t.getUTCDate())}`;
  }
  // One all-day event per row that has a follow-up date.
  function followUpsToIcs(rows, now) {
    const stampNow = (now || new Date()).toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Permit Postcards//Permit Map//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
    rows.filter((r) => DATE_RE.test(r.followUp || '')).forEach((r) => {
      const where = [r.address, r.city, r.zip].filter(Boolean).join(', ');
      lines.push('BEGIN:VEVENT', `UID:${safeId(r.id || r.permit)}-${compactDate(r.followUp)}@permit-map`, `DTSTAMP:${stampNow}`,
        `DTSTART;VALUE=DATE:${compactDate(r.followUp)}`, `DTEND;VALUE=DATE:${nextDate(r.followUp)}`,
        `SUMMARY:${icsText('Follow up: ' + r.address)}`,
        `DESCRIPTION:${icsText([r.project, r.permit ? 'Permit ' + r.permit : '', r.value > 0 ? 'Project value ' + money(r.value) : ''].filter(Boolean).join('. '))}`,
        `LOCATION:${icsText(where)}`, `URL:https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(where)}`, 'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.map(icsFold).join('\r\n') + '\r\n';
  }
  const UTIL = { leadsToCsv, followUpsToIcs, csvCell, icsFold };

  // ---- the app: one instance per root --------------------------------------------------------------------------
  // `root` is `document` (the standalone page and the Artifact) or a <permit-map>'s ShadowRoot. Every lookup goes through root,
  // nothing is written to the page outside it, and global listeners are scoped (see listen()). options (all optional):
  //   config {brandName, logoText, businessName, phone, url, defaultTrade, defaultPlace, radiusMiles, accent}
  //   claude (the shared-db host; the embed never passes it) · loadData() -> {permits, meta} · noTiles · basemap (outline geojson)
  //   center {lat, lng} · placeLabel · namespace (suffix for localStorage keys) · exportTools · download(name, mime, text)
  //   onEvent(name, detail) for lead-open / lead-change
  //   places [{id, name, region, lat, lng}] (the area list, replacing the built-in neighborhoods) · ensureData(lat, lng, miles) -> null when nothing
  //   more is needed, else {names, promise -> {permits, meta}} with every place loaded so far (the embed loads place files lazily)
  function createPermitMap(root, options) {
    options = options || {};
    const embed = !!root.host;
    const doc = root.ownerDocument || root;
    const win = doc.defaultView || window;
    const themeEl = embed ? root.host : doc.documentElement;
    const CONFIG = Object.assign({}, DEFAULT_CONFIG, options.config || {});
    const NS = options.namespace ? ':' + options.namespace : '';
    const $ = (id) => root.getElementById(id);
    const store = createStore({ claude: options.claude, storage: () => win.localStorage, lsKey: options.namespace ? 'pp-leads:' + options.namespace : null, onStorage: (fn) => listen(win, 'storage', fn) });
    const openDialog = (d) => { if (embed && typeof d.show === 'function') d.show(); else if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', ''); };
    const closeDialog = (d) => { if (typeof d.close === 'function') d.close(); else d.removeAttribute('open'); };
    let destroyed = false;

    // ---- state ---------------------------------------------------------------------------------------
    const LS_SIDE = 'pp-side' + NS;
    const ROW_H = 56;
    const state = {
      trade: CONFIG.defaultTrade, biz: CONFIG.businessName, phone: CONFIG.phone, url: CONFIG.url, preset: 'santa-monica', placeLabel: '',
      base: { lat: PRESETS[0].lat, lng: PRESETS[0].lng }, radius: CONFIG.radiusMiles, sort: 'best', rate: 0.95,
      selected: null, ghost: null, flipped: false, filter: null, builder: null, panel: false, tab: 'leads'
    };
    const layers = { all: true, hood: false, fire: true };
    let meta, intel, tracts = [], rows = [], matches = [], pool = [], counts = {}, dueCount = 0, hotCount = 0, builders = [], panelId = null, presets = CONFIG.presets || PRESETS;
    let fireLayer, fireShown = false, hoverMarker = null, ready = false, tradeOrder = [];
    let lastDot = 0, lastDragEnd = 0, areaPending = 0, areaError = null;
    let map, tiles, canvas, dotLayer, hitLayer, selMarker, baseMarker, radiusCircle, popup, dotTip;
    const mqPhone = win.matchMedia('(max-width: 767px)');
    const mqDesk = win.matchMedia('(min-width: 1024px)');
    const mqReduce = win.matchMedia('(prefers-reduced-motion: reduce)');
    // Standalone: the window decides phone / tablet / desktop (CSS media queries). Embedded: the component's own width does
    // (CSS container queries), so the same layout rules apply inside a narrow column of a client's page.
    const shell = $('shell');
    const frameEl = embed ? root.querySelector('.pp-frame') : null;
    let lastW = 1024;
    const fw = () => { if (embed && frameEl.clientWidth) lastW = frameEl.clientWidth; return embed ? lastW : win.innerWidth; };
    const isPhone = () => (embed ? fw() < 768 : mqPhone.matches);
    // the box popovers / the sheet are placed in: the window, or the component
    const vbox = () => {
      if (!embed) return { left: 0, top: 0, w: win.innerWidth, h: win.innerHeight };
      const r = frameEl.getBoundingClientRect();
      return { left: r.left, top: r.top, w: r.width || fw(), h: r.height || 600 };
    };
    const resizeFns = [];
    const onResize = (fn) => { resizeFns.push(fn); };
    const offs = [];   // everything attached outside the component, so destroy() can take it back
    function listen(target, type, fn, opt) { target.addEventListener(type, fn, opt); offs.push(() => target.removeEventListener(type, fn, opt)); }
    const fire = (name, detail) => { if (options.onEvent) { try { options.onEvent(name, detail); } catch (e) { console.error(e); } } };
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');

    // run a state change with every transition switched off (for keyboard-triggered actions)
    function noAnim(fn) {
      shell.classList.add('no-anim');
      try { fn(); } finally { requestAnimationFrame(() => requestAnimationFrame(() => shell.classList.remove('no-anim'))); }
    }
    // saved record for a lead: its address id first, else the saved records under old permit-number ids (newest one, notes merged)
    function legacyRecs(r) {
      const recs = store.all(), out = [];
      for (const id of r.legacy) { const x = recs.get(id); if (x) out.push(x); }
      return out;
    }
    function recFor(r) {
      const own = store.all().get(r.id);
      if (own) return own;
      const old = legacyRecs(r);
      if (!old.length) return null;
      old.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
      if (old.length === 1) return old[0];
      const rec = clone(old[0]);
      rec.notes = old.reduce((n, x) => mergeNotes(n, x.notes), []);
      return rec;
    }
    // what the app shows: a Won/Lost from a project 180+ days older than this lead's newest permit counts as New again
    function effRec(r) {
      const rec = recFor(r);
      if (!isStale(rec, r.date)) return rec;
      return Object.assign({}, rec, { status: 'new', followUp: null, prior: { status: rec.status, at: rec.statusAt || rec.updatedAt || '' } });
    }
    const leadInfo = (r) => ({ date: r.date, permits: [r.nbr].concat(r.others.map((o) => o.nbr)) });
    // starting record for a lead with nothing saved under its address id: old permit-number records fold in (their notes merge)
    function seedFor(r) {
      const rec = recFor(r);
      return rec ? clone(rec) : { status: 'new', followUp: null, notes: [], trade: state.trade, addr: titleCase(r.addr), city: r.city };
    }
    // ---- theme ---------------------------------------------------------------------------------------
    const mq = win.matchMedia('(prefers-color-scheme: dark)');
    function currentTheme() {
      const t = themeEl.getAttribute('data-theme');
      return t === 'dark' || t === 'light' ? t : (mq.matches ? 'dark' : 'light');
    }
    function setTheme(t) {
      themeEl.setAttribute('data-theme', t);
      if (!embed) { try { localStorage.setItem('pp-theme', t); } catch (e) { /* storage unavailable */ } }
      applyTheme();
    }
    function cssVar(name) { return win.getComputedStyle(themeEl).getPropertyValue(name).trim(); }
    function applyTheme() {
      const t = currentTheme();
      const tb = $('theme-toggle');
      tb.firstElementChild.innerHTML = icon(t === 'dark' ? 'sun' : 'moon');
      tb.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      tb.dataset.tip = t === 'dark' ? 'Light theme' : 'Dark theme';
      if (!map) return;
      // OSM standard tiles (Carto basemaps now need an API key). The paper / dark look comes from a CSS filter on the tile pane.
      // Published Artifacts can't load outside images, so there we draw Census city/county outlines instead.
      if (!tiles && !options.noTiles) tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
      shell.dataset.tiles = t;
      styleBasemap();
      paintDots();
      styleOverlays();
      if (baseMarker) baseMarker.setIcon(pinIcon());
    }
    // ---- vector basemap (Census TIGERweb outlines) -----------------------------------------------------
    let baseCounties, basePlaces;
    function initBasemap() {
      const bm = options.basemap;
      if (!bm || !options.noTiles) return;
      map.createPane('base');
      map.getPane('base').style.zIndex = 250;
      map.getPane('base').style.pointerEvents = 'none';
      const covered = new Set((meta.sources || []).map((s) => s.city));
      baseCounties = L.geoJSON(bm.counties, { pane: 'base', interactive: false }).addTo(map);
      basePlaces = L.geoJSON(bm.places, { pane: 'base', interactive: false }).addTo(map);
      basePlaces.eachLayer((l) => {
        l.covered = covered.has(l.feature.properties.n);
        if (l.covered) {
          L.marker(l.getBounds().getCenter(), {
            pane: 'base', interactive: false, keyboard: false,
            icon: L.divIcon({ className: 'city-label', html: `<span>${esc(l.feature.properties.n)}</span>`, iconSize: null })
          }).addTo(map);
        }
      });
      map.attributionControl.addAttribution('Outlines: US Census Bureau TIGERweb');
    }
    function styleBasemap() {
      if (!baseCounties) return;
      $('map').style.background = cssVar('--water');
      baseCounties.setStyle({ color: cssVar('--hair-strong'), weight: 1.2, fillColor: cssVar('--land'), fillOpacity: 1 });
      basePlaces.eachLayer((l) => l.setStyle(l.covered
        ? { color: cssVar('--muted'), weight: 1, fillColor: cssVar('--covered'), fillOpacity: 1 }
        : { color: cssVar('--hair-strong'), weight: 0.6, fillOpacity: 0 }));
    }

    // lead dots are coloured by status; Lost is a hollow ring
    const STATUS_VAR = { new: '--s-new', contacted: '--s-contacted', quoting: '--s-quoting', won: '--s-won', lost: '--s-lost' };
    function hitStyle(r) {
      const c = cssVar(STATUS_VAR[r.status] || '--s-new');
      return r.status === 'lost'
        ? { color: c, weight: 2, fillColor: c, fillOpacity: 0, radius: 5 }
        : { color: cssVar('--surface'), weight: 1.5, fillColor: c, fillOpacity: 0.95, radius: 5 };
    }
    // "Neighborhood value" layer: permit dots shaded by the census tract's median home value
    const HOOD_STOPS = [[232, 217, 198], [217, 160, 102], [176, 80, 28], [107, 42, 12]];
    function hoodColor(k) {
      const t = clamp((k - 400) / 800, 0, 1) * (HOOD_STOPS.length - 1), i = Math.min(HOOD_STOPS.length - 2, Math.floor(t)), f = t - i;
      const a = HOOD_STOPS[i], b = HOOD_STOPS[i + 1];
      return `rgb(${[0, 1, 2].map((j) => Math.round(a[j] + (b[j] - a[j]) * f)).join(',')})`;
    }
    function paintDots() {
      if (!rows.length) return;
      const base = cssVar('--dot');
      rows.forEach((r) => {
        if (layers.hood && r.homeK != null) r.dot.setStyle({ fillColor: hoodColor(r.homeK), radius: 5, fillOpacity: 0.6 });
        else r.dot.setStyle({ fillColor: base, radius: 2.6, fillOpacity: 0.8 });
      });
    }
    function styleOverlays() {
      const ink = cssVar('--text'), acc = cssVar('--accent-ink');
      if (radiusCircle) radiusCircle.setStyle({ color: acc, fillColor: acc });
      if (selMarker) selMarker.setStyle({ color: ink, fillColor: 'transparent' });
      if (hoverMarker) hoverMarker.setStyle({ color: cssVar('--accent') });
      if (hitLayer) hitLayer.eachLayer((m) => m.setStyle(hitStyle(m.lead)));
      if (fireLayer) fireLayer.eachLayer((l) => l.setStyle({ color: cssVar('--muted'), fillColor: cssVar('--muted') }));
    }
    function pinIcon() {
      return L.divIcon({
        className: 'pin', iconSize: [28, 28], iconAnchor: [14, 26],
        html: `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="${'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0'}" style="fill:${cssVar('--text')};stroke:${cssVar('--surface')};stroke-width:1.5"/><circle cx="12" cy="10" r="3" style="fill:${cssVar('--surface')}"/></svg>`
      });
    }

    // ---- geo -----------------------------------------------------------------------------------------
    function miles(lat1, lon1, lat2, lon2) {
      const rad = Math.PI / 180, dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
      return 3958.8 * 2 * Math.asin(Math.sqrt(a));
    }

    // ---- data ----------------------------------------------------------------------------------------
    async function load() {
      ingest(await (options.loadData || defaultLoad)());
    }
    function ingest(data) {
      const raw = data.permits;
      meta = data.meta;
      tracts = raw.tracts || [];
      rows = raw.rows.filter((a) => String(a[1] || '').trim()).map((a) => {   // a lead needs a street address
        const kinds = a[7].map((i) => raw.kinds[i]);
        const trades = new Set();
        kinds.forEach((k) => (meta.kinds[k] ? meta.kinds[k].trades : []).forEach((t) => trades.add(t)));
        const tr = a[11] >= 0 && tracts.length ? tracts[a[11]] : null;   // [median home value in $1000s | -1, owner % | -1]
        const others = (a[13] || []).map((o) => ({ nbr: o[0], date: o[1], desc: o[2] }));
        return { nbr: a[0], addr: a[1], zip: a[2], city: a[9] || 'Los Angeles', date: a[3], val: a[4], lat: a[5], lng: a[6], kinds, desc: a[8], trades, primary: kinds[0], d: 0, contractor: a[10] || '', status: 'new', follow: null, isDue: false,
          homeK: tr && tr[0] >= 0 ? tr[0] : null, ownPct: tr && tr[1] >= 0 ? tr[1] : null, fire: ['', 'Eaton', 'Palisades'][a[12] || 0], others, intel: null,
          stage: a[14] || 'permit', board: a[15] || '', approx: !!a[16], url: a[17] || '', applicant: a[18] || '', dateKind: a[19] || '' };
      });
      intel = { timing: meta.timing || {}, fitPrimary: meta.fit_primary || {}, kinds: meta.kinds };
      // address-based ids; a second row at the same address (outside the merge window) gets its permit number appended so ids never collide
      const seen = new Set();
      rows.forEach((r) => {
        let id = leadId(r);
        if (seen.has(id)) id = safeId(id + '~' + r.nbr);
        seen.add(id);
        r.id = id;
        r.legacy = [legacyId(r.city, r.nbr)].concat(r.others.map((o) => legacyId(r.city, o.nbr)));
      });
    }

    // ---- map -----------------------------------------------------------------------------------------
    function initMap() {
      canvas = L.canvas({ padding: 0.3 });
      map = L.map($('map'), { preferCanvas: true, renderer: canvas, zoomControl: false, minZoom: 8 }).setView([state.base.lat, state.base.lng], 10);
      map.attributionControl.setPrefix(false);
      initBasemap();
      dotLayer = L.layerGroup().addTo(map);
      hitLayer = L.layerGroup().addTo(map);
      rows.forEach(addDot);
      radiusCircle = L.circle([state.base.lat, state.base.lng], { radius: state.radius * MI, weight: 1, dashArray: '4 6', fillOpacity: 0.035, interactive: false }).addTo(map);
      baseMarker = L.marker([state.base.lat, state.base.lng], { icon: pinIcon(), draggable: true, keyboard: false, zIndexOffset: 400 }).addTo(map);
      baseMarker.on('drag', () => radiusCircle.setLatLng(baseMarker.getLatLng()));
      baseMarker.on('dragend', () => { lastDragEnd = Date.now(); const ll = baseMarker.getLatLng(); moveBase(ll.lat, ll.lng); });
      hoverMarker = L.circleMarker([state.base.lat, state.base.lng], { renderer: canvas, radius: 9, weight: 2, fillOpacity: 0, interactive: false });
      dotTip = L.tooltip({ direction: 'top', offset: [0, -8], opacity: 1, className: 'dot-tip' });
      // clicking empty map moves the pin (lead dots and the pin itself do not bubble here); a pan or a click that closed a popup does not
      let downPt = null, popupWasOpen = false;
      map.on('mousedown', (e) => { const o = e.originalEvent; downPt = o ? { x: o.clientX, y: o.clientY } : null; });
      map.on('preclick', () => { popupWasOpen = popup.isOpen(); });
      map.on('click', (e) => {
        const o = e.originalEvent, moved = downPt && o && Math.hypot(o.clientX - downPt.x, o.clientY - downPt.y) >= 5, now = Date.now();
        downPt = null;
        if (moved || popupWasOpen || now - lastDot < 250 || now - lastDragEnd < 250) return;
        moveBase(e.latlng.lat, e.latlng.lng);
      });
      popup = L.popup({ maxWidth: 300 });
      applyTheme();
      fitBase();
      if (window.ResizeObserver) {
        let raf = 0;
        new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => map.invalidateSize({ animate: false })); }).observe($('map'));
      }
    }

    function addDot(r) {
      // Background permits are context only: not clickable, so a click anywhere that isn't one of YOUR leads moves the pin.
      r.dot = L.circleMarker([r.lat, r.lng], { renderer: canvas, radius: 2.6, weight: 0, fillColor: cssVar('--dot'), fillOpacity: 0.8, interactive: false });
      dotLayer.addLayer(r.dot);
    }

    function fitBase() {
      const phone = isPhone();
      const pw = !phone && state.panel ? Math.min(400, $('stage').clientWidth) : 0;   // keep the circle clear of the open detail panel
      // jumps between metros (e.g. LA -> Sacramento) are instant; only short moves animate
      const c = map.getCenter();
      const far = miles(c.lat, c.lng, state.base.lat, state.base.lng) > 40;
      map.fitBounds(radiusCircle.getBounds(), phone
        ? { paddingTopLeft: [16, 16], paddingBottomRight: [16, 150], animate: false }
        : { paddingTopLeft: [24, 24], paddingBottomRight: [24 + pw, 24], animate: !far && !mqReduce.matches });
    }
    // where to centre a lead so it is not hidden under the detail panel
    function viewFor(r, z) {
      const pw = state.panel && !isPhone() ? Math.min(400, $('stage').clientWidth) : 0;
      if (!pw) return [r.lat, r.lng];
      const p = map.project([r.lat, r.lng], z);
      p.x += pw / 2;
      return map.unproject(p, z);
    }
    function ensureVisible(r, animate) {
      if (isPhone()) return;
      const sz = map.getSize(), pw = state.panel ? Math.min(400, $('stage').clientWidth) : 0, p = map.latLngToContainerPoint([r.lat, r.lng]);
      if (p.x > 40 && p.x < sz.x - pw - 40 && p.y > 70 && p.y < sz.y - 40) return;
      map.setView(viewFor(r, map.getZoom()), map.getZoom(), { animate: !!animate && !mqReduce.matches });
    }

    function popupHtml(r) {
      const kinds = r.kinds.map((k) => (meta.kinds[k] || { label: 'Other' }).label).join(', ');
      return `<div class="pp"><strong>${esc(titleCase(r.addr))}, ${esc(r.city)} ${esc(r.zip)}</strong><div class="k">${esc(kinds)}</div>` +
        `<dl><dt>${dateLabel(r)}</dt><dd>${esc(fmtDate(r.date))}</dd>` + (r.stage === 'application' ? `<dt>Board</dt><dd>${esc(r.board)}</dd><dt>Case</dt><dd>${esc(r.nbr)}</dd></dl>` : `<dt>Valuation</dt><dd>${r.val > 0 ? money(r.val) : 'not listed'}</dd><dt>Permit</dt><dd>${esc(r.nbr)}</dd></dl>`) +
        (r.desc ? `<p>${esc(trunc(r.desc, 200))}</p>` : '') + '</div>';
    }
    function showPopup(r) { popup.setLatLng([r.lat, r.lng]).setContent(popupHtml(r)).openOn(map); }
    function onDotClick(r) {
      lastDot = Date.now();
      if (matches.includes(r)) { map.closePopup(); openLead(r, 'keep'); } else showPopup(r);
    }
    // hover tooltip on lead dots: 200ms the first time, instant while moving between dots
    let tipTimer = 0, tipWarm = false, warmTimer = 0;
    function tipHtml(r) {
      const k = r.kinds.map((x) => (meta.kinds[x] || { label: 'Other' }).label).join(' + ');
      return `<b>${esc(titleCase(r.addr))}</b><br><span>${esc(k)}${r.val > 0 ? ' · ' + esc(shortMoney(r.val)) : ''}</span>`;
    }
    function showTip(r) {
      clearTimeout(tipTimer); clearTimeout(warmTimer);
      const go = () => { dotTip.setLatLng([r.lat, r.lng]).setContent(tipHtml(r)); map.openTooltip(dotTip); tipWarm = true; };
      if (tipWarm) go(); else tipTimer = setTimeout(go, 200);
    }
    function hideTip() {
      clearTimeout(tipTimer);
      if (dotTip) dotTip.close();
      clearTimeout(warmTimer);
      warmTimer = setTimeout(() => { tipWarm = false; }, 400);
    }
    function setHover(r) {
      if (!hoverMarker) return;
      if (!r) { if (map.hasLayer(hoverMarker)) map.removeLayer(hoverMarker); return; }
      hoverMarker.setLatLng([r.lat, r.lng]).setStyle({ color: cssVar('--accent') });
      if (!map.hasLayer(hoverMarker)) hoverMarker.addTo(map);
    }

    // ---- area ----------------------------------------------------------------------------------------
    function setBase(lat, lng, presetId, fit, label) {
      state.base = { lat, lng };
      state.preset = presetId;
      const p = presetId && presets.find((x) => x.id === presetId);
      state.placeLabel = label || (p ? p.label : nameNear(lat, lng));
      radiusCircle.setLatLng([lat, lng]);
      baseMarker.setLatLng([lat, lng]);
      if (fit) fitBase();
      $('place').value = presetId || 'custom';
      refresh();
      ensureArea();
    }
    // a pin the user placed: it keeps no preset, and its label is the nearest covered place ("Near Elk Grove")
    function moveBase(lat, lng) { dismissHint(); setBase(lat, lng, null, false); }
    // the one-line tip on the map: gone for good once dismissed or once the pin has been moved
    const HINT_KEY = 'pp-hint-move';
    function hintSeen() { try { return !!win.localStorage.getItem(HINT_KEY); } catch (e) { return false; } }
    function dismissHint() {
      const el = $('map-hint');
      if (!el || el.hidden) return;
      el.hidden = true;
      try { win.localStorage.setItem(HINT_KEY, '1'); } catch (e) { /* storage unavailable */ }
    }
    function nameNear(lat, lng) {
      let best = null, bd = 30;
      const test = (name, c) => { const d = c ? miles(lat, lng, c.lat, c.lng) : Infinity; if (d < bd) { bd = d; best = name; } };
      presets.forEach((x) => test(x.label, x));
      (meta.sources || []).forEach((x) => test(x.city, cityCenter(x.city)));
      return best ? (bd < 0.3 ? best : 'Near ' + best) : 'Custom spot';
    }
    // the embed loads place files on demand: when the area moves or widens, fetch what it newly touches and swap the data in
    function ensureArea() {
      if (!options.ensureData || destroyed) return;
      const job = options.ensureData(state.base.lat, state.base.lng, state.radius);
      if (!job) return;
      areaPending++; areaError = null;
      const names = job.names.join(', ');
      job.promise.then((data) => { areaPending--; if (!destroyed) swapData(data); }, () => {
        areaPending--;
        if (destroyed) return;
        areaError = names;
        toast('Could not load ' + names + '.', { error: true, action: { label: 'Retry', fn: retryArea } });
        refresh();
      });
    }
    function retryArea() { areaError = null; ensureArea(); refresh(); }
    // new rows arrived: rebuild the dots and leads, keep the open lead (by id) and everything else as it was
    function swapData(data) {
      const sel = state.selected && state.selected.id;
      hideTip(); setHover(null);
      dotLayer.clearLayers(); hitLayer.clearLayers();
      hitShown = new Set(); prevPool = []; poolKey = ''; cityCenters.clear();
      ingest(data);
      rows.forEach(addDot);
      tradeOrder = Object.keys(meta.counts_by_trade);
      state.selected = sel ? rows.find((r) => r.id === sel) || null : null;
      if (!state.selected) state.panel = false;
      paintDots(); renderFresh(); renderFooter();
      compute();
    }
    function setRadius(v) {
      state.radius = clamp(Math.round(v), 2, 25);
      $('radius').value = state.radius;
      $('radius-out').textContent = state.radius + ' mi';
      radiusCircle.setRadius(state.radius * MI);
      refresh();
      ensureArea();
    }

    // ---- compute: state -> matches -> UI -------------------------------------------------------------
    let pending = 0;
    function refresh() { clearTimeout(pending); pending = setTimeout(compute, 40); }

    // One map marker per lead row, created on first use. compute() only adds/removes markers when the set of matches changes and
    // restyles the ones whose status changed, so a saved-leads snapshot costs a recolour, not a rebuild.
    let poolKey = '', viewKey = '', prevPool = [], lastBuilder, hitShown = new Set();
    function hitFor(r) {
      if (!r.hit) {
        r.hit = L.circleMarker([r.lat, r.lng], Object.assign({ renderer: canvas, bubblingMouseEvents: false }, hitStyle(r)))
          .on('click', () => onDotClick(r))
          .on('mouseover', () => showTip(r))
          .on('mouseout', hideTip);
        r.hit.lead = r;
        r.hitStatus = r.status;
      }
      return r.hit;
    }
    function syncHits() {
      const want = new Set(matches);
      let cleared = false;
      hitShown.forEach((r) => {
        if (want.has(r)) return;
        if (!cleared) { hideTip(); cleared = true; }   // a tooltip may belong to a marker that is about to go
        hitLayer.removeLayer(r.hit);
        hitShown.delete(r);
      });
      matches.forEach((r) => {
        const m = hitFor(r);
        if (!hitShown.has(r)) { m.setStyle(hitStyle(r)); r.hitStatus = r.status; hitLayer.addLayer(m); hitShown.add(r); }   // restyle on add: the theme may have changed while it was off the map
        else if (r.hitStatus !== r.status) { m.setStyle(hitStyle(r)); r.hitStatus = r.status; }
      });
    }

    function compute() {
      if (destroyed || !map) return;
      ready = true;
      const { lat, lng } = state.base;
      const today = ymd(new Date());
      // trade / area / radius decide the pool (distance + scores + tiers over every permit); a store change skips that pass
      const key = state.trade + '|' + lat + '|' + lng + '|' + state.radius;
      const poolChanged = key !== poolKey;
      if (poolChanged) {
        poolKey = key;
        pool = [];
        for (const r of rows) {
          if (!r.trades.has(state.trade)) { r.d = Infinity; continue; }
          r.d = miles(lat, lng, r.lat, r.lng);
          if (r.d <= state.radius) pool.push(r);
        }
        const now = new Date();
        pool.forEach((r) => { r.intel = leadScore(r, state.trade, intel, now); });
        assignTiers(pool);
        builders = buildersNear(pool);
      }
      counts = { new: 0, contacted: 0, quoting: 0, won: 0, lost: 0 };
      dueCount = 0; hotCount = 0;
      pool.forEach((r) => {
        const rec = effRec(r);
        r.status = rec ? rec.status : 'new';
        r.follow = (rec && rec.followUp) || null;
        r.isDue = !!r.follow && r.follow <= today && r.status !== 'won' && r.status !== 'lost';
        counts[r.status]++;
        if (r.isDue) dueCount++;
        if (r.status === 'new' && r.intel.bucket === 'hot') hotCount++;
      });
      if (state.builder && !builders.some((b) => b.key === state.builder)) state.builder = null;
      const oldIdx = state.selected ? matches.indexOf(state.selected) : -1;
      const f = state.filter;
      matches = f ? pool.filter((r) => (f === 'due' ? r.isDue : f === 'hot' ? (r.status === 'new' && r.intel.bucket === 'hot') : r.status === f)) : pool.slice();
      if (state.builder) matches = matches.filter((r) => builderKey(splitContractor(r.contractor).name) === state.builder);
      if (state.sort === 'best') matches.sort((a, b) => b.intel.score - a.intel.score || b.date.localeCompare(a.date) || b.val - a.val);
      else if (state.sort === 'val') matches.sort((a, b) => b.val - a.val || b.date.localeCompare(a.date));
      else if (state.sort === 'follow') matches.sort((a, b) => (a.follow || '9999').localeCompare(b.follow || '9999') || b.date.localeCompare(a.date));
      else matches.sort((a, b) => b.date.localeCompare(a.date) || b.val - a.val);
      // an open lead stays open even if the filter now hides it (so a status click doesn't make it vanish)
      const keep = state.selected && (matches.includes(state.selected) || (state.panel && pool.includes(state.selected)));
      if (!keep) { state.selected = null; state.panel = false; }
      // J / K from a lead the filter just dropped continue from where it was
      if (state.selected && !matches.includes(state.selected)) { if (oldIdx >= 0) state.ghost = oldIdx; } else state.ghost = null;
      // roving focus in the list: keep the active row by lead id, else the nearest slot
      const ai = act.id ? matches.findIndex((r) => r.id === act.id) : -1;
      if (ai >= 0) act.idx = ai; else act.id = matches.length ? matches[clamp(act.idx, 0, matches.length - 1)].id : null;
      // a different filter / sort / trade / area starts at the top of the list
      const vk = [state.filter, state.sort, state.builder, key].join('|');
      if (vk !== viewKey) { viewKey = vk; $('list').scrollTop = 0; }

      // leads hidden by the filter lose their muted dot too
      const shown = new Set(matches);
      if (poolChanged) {
        const inPool = new Set(pool);
        prevPool.forEach((r) => { if (r.hidden && !inPool.has(r)) { dotLayer.addLayer(r.dot); r.hidden = false; } });
        prevPool = pool;
      }
      pool.forEach((r) => {
        const hide = !shown.has(r);
        if (hide && !r.hidden) { dotLayer.removeLayer(r.dot); r.hidden = true; }
        else if (!hide && r.hidden) { dotLayer.addLayer(r.dot); r.hidden = false; }
      });

      syncHits();
      renderChrome();
      renderList();
      if (poolChanged || lastBuilder !== state.builder) { renderBuilders(); lastBuilder = state.builder; }
      if (poolChanged) renderFire();
      renderSelection();
    }

    function renderChrome() {
      const n = pool.length;
      const days = Math.max(1, (new Date(meta.date_max) - new Date(meta.date_min)) / 86400000 + 1);
      const perWeek = counts.new / (days / 7);
      const vals = pool.map((r) => r.val).filter((v) => v > 0).sort((a, b) => a - b);
      const med = vals.length ? (vals.length % 2 ? vals[(vals.length - 1) / 2] : (vals[vals.length / 2 - 1] + vals[vals.length / 2]) / 2) : null;
      const fmt = (x) => x.toLocaleString('en-US');
      $('area-place').textContent = state.placeLabel;
      $('area-radius').textContent = `within ${state.radius} mi`;
      $('k-new').textContent = fmt(counts.new);
      $('k-hot').textContent = fmt(hotCount);
      $('k-due').textContent = fmt(dueCount);
      $('kpi-new').setAttribute('aria-pressed', String(state.filter === 'new'));
      $('kpi-hot').setAttribute('aria-pressed', String(state.filter === 'hot'));
      $('kpi-due').setAttribute('aria-pressed', String(state.filter === 'due'));
      $('n-all').textContent = fmt(n);
      STATUSES.forEach((st) => { $('n-' + st).textContent = fmt(counts[st]); });
      $('segs').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.s === 'all' ? !state.filter : state.filter === b.dataset.s)));
      $('sort').value = state.sort;
      $('tab-leads-n').textContent = fmt(matches.length);
      $('tab-builders-n').textContent = fmt(builders.length);
      $('reopen-n').textContent = '(' + fmt(n) + ')';
      // chips
      const chips = [];
      if (state.filter === 'hot') chips.push(['f', 'Hot leads']);
      if (state.filter === 'due') chips.push(['f', 'Follow-ups due']);
      if (state.builder) {
        const b = builders.find((x) => x.key === state.builder);
        chips.push(['b', `Showing ${titleCase(b ? b.name : 'this builder')}’s jobs`]);
      }
      $('chips').hidden = !chips.length;
      $('chips').innerHTML = chips.map(([k, t]) => `<button type="button" class="chip-x" data-chip="${k}" aria-label="Remove filter: ${esc(t)}"><span>${esc(t)}</span><span data-icon="x">${icon('x')}</span></button>`).join('');
      // settings facts
      const week = n ? (perWeek >= 10 ? Math.round(perWeek) : perWeek.toFixed(1)) : '0';
      $('s-week').textContent = week;
      $('s-median').textContent = med === null ? 'not listed' : money(med);
      $('s-cost').textContent = money(n * (state.rate || 0));
      $('save-mode').textContent = store.mode === 'shared' ? 'Shared with your team' : store.mode === 'readonly' ? 'View only' : 'Saved on this device';
      renderNotice();
    }

    // ---- lead list (virtualized: only the rows in view exist) ---------------------------------------
    const TIMING_SHORT = (t) => (t.state === 'now' ? 'now' : t.app ? (t.state === 'soon' ? 'planning' : t.state === 'late' ? 'underway' : '') : t.state === 'soon' || t.state === 'early' ? `in ${t.inWeeks} wk` : t.state === 'late' ? 'late' : '');
    const kindsLabel = (r, sep) => r.kinds.map((k) => (meta.kinds[k] || { label: 'Other' }).label).join(sep);
    // The list is one tab stop (a listbox). Arrow keys move the "active" row, Enter opens it; the active row is tracked by lead id,
    // so rebuilding the visible rows never loses it, and rows are not focusable themselves (a rebuild cannot drop focus).
    const act = { id: null, idx: 0 };
    function rowHtml(r, i) {
      const sub = [esc(kindsLabel(r, ' + ')), esc(TIMING_SHORT(r.intel.timing)), esc(r.d.toFixed(1)) + ' mi'].filter(Boolean).join('<span class="sep">·</span>');
      const hot = r.intel.bucket === 'hot', sel = r === state.selected;
      return `<div class="row${r.id === act.id ? ' is-active' : ''}" role="option" id="lr-${esc(r.id)}" data-i="${i}" aria-selected="${sel}"${sel ? ' aria-current="true"' : ''}>` +
        `<span class="dot s-${r.status}${hot ? ' hot' : ''}"></span>` +
        `<span class="addr">${hot ? '<span class="sr">Hot lead. </span>' : ''}${esc(titleCase(r.addr))}</span><span class="val">${r.val > 0 ? esc(shortMoney(r.val)) : '–'}</span>` +
        `<span class="sub">${r.fire ? `<span class="fire" title="Fire rebuild">${icon('flame')}</span>` : ''}${sub}` +
        `${r.follow ? `<span class="sep">·</span><span class="${r.isDue ? 'due' : ''}">Follow up ${esc(fmtDate(r.follow, false))}</span>` : ''}</span></div>`;
    }
    let vwin = { s: -1, e: -1, sig: '' };
    function syncActive() {
      const el = act.id ? $('lr-' + act.id) : null;
      if (el) $('list').setAttribute('aria-activedescendant', el.id); else $('list').removeAttribute('aria-activedescendant');
    }
    // Rebuilds the rows in view only when something in that window changed (position, status, follow-up, selection, active row).
    function paintRows() {
      const list = $('list');
      const top = list.scrollTop, h = list.clientHeight || 600;
      const s = Math.max(0, Math.floor(top / ROW_H) - 6), e = Math.min(matches.length, Math.ceil((top + h) / ROW_H) + 6);
      const slice = matches.slice(s, e);
      const sig = s + '#' + slice.map((r) => `${r.id}:${r.status}:${r.follow || ''}:${r.isDue ? 1 : 0}:${r.intel.bucket}:${r === state.selected ? 1 : 0}:${r.id === act.id ? 1 : 0}`).join('|');
      if (sig === vwin.sig) return;
      vwin = { s, e, sig };
      $('rows').style.transform = `translateY(${s * ROW_H}px)`;
      $('rows').innerHTML = slice.map((r, k) => rowHtml(r, s + k)).join('');
      syncActive();
    }
    function renderList() {
      const empty = !matches.length;
      const wait = empty && areaPending > 0;   // a place file is still on its way
      $('skel').hidden = !wait;
      $('empty').hidden = !empty || wait;
      $('list-inner').style.height = matches.length * ROW_H + 'px';
      if (empty) {
        const none = !pool.length, failed = none && areaError;
        $('empty-text').textContent = failed ? `Could not load ${areaError}.` : none ? `Nothing within ${state.radius} miles yet.` : 'No leads match that filter.';
        const btn = $('empty-act');
        btn.dataset.act = failed ? 'retry' : none ? 'widen' : 'clear';
        btn.textContent = failed ? 'Retry' : none ? 'Widen the radius' : 'Clear filters';
        btn.hidden = none && !failed && state.radius >= 25;
      }
      $('list').scrollTop = Math.min($('list').scrollTop, Math.max(0, matches.length * ROW_H - $('list').clientHeight));
      paintRows();
    }
    function updateRowSelection() { paintRows(); }
    function setActive(r) {
      const i = matches.indexOf(r);
      if (i < 0) return;
      act.id = r.id; act.idx = i;
      scrollRowIntoView(r);
      paintRows();
      syncActive();
    }
    function scrollRowIntoView(r) {
      const i = matches.indexOf(r);
      if (i < 0 || state.tab !== 'leads') return;
      const list = $('list'), top = i * ROW_H, h = list.clientHeight;
      if (top < list.scrollTop) list.scrollTop = top;
      else if (top + ROW_H > list.scrollTop + h) list.scrollTop = top + ROW_H - h;
    }

    // ---- builders near you (list tab) and fire perimeters (map) ----------------------------------------
    function renderBuilders() {
      const el = $('blist');
      if (!builders.length) { el.innerHTML = '<p class="b-empty">No builders are listed on the permits in your area.</p>'; return; }
      el.innerHTML = builders.slice(0, 100).map((b) =>
        `<div class="brow" data-k="${esc(b.key)}"${b.key === state.builder ? ' aria-current="true"' : ''}>` +
        `<button type="button" class="main" data-act="pick"><span class="name">${esc(titleCase(b.name))}</span>` +
        `<span class="meta">${b.jobs} job${b.jobs === 1 ? '' : 's'} nearby · newest ${esc(fmtDate(b.newest, false))}</span></button>` +
        (b.phone ? `<span class="pline">${esc(b.phone)}</span><button type="button" class="icon-btn" data-act="copy" data-phone="${esc(b.phone)}" aria-label="Copy phone for ${esc(titleCase(b.name))}">${icon('copy')}</button>` : '') +
        '</div>').join('');
    }
    // draw the 2025 Eaton / Palisades outlines only when a fire-rebuild lead is inside the current radius
    function renderFire() {
      const any = pool.some((r) => r.fire) && !!meta.fire_perimeters;
      $('lay-fire-row').classList.toggle('off', !any);
      $('lay-fire-note').textContent = any ? '' : '(none in your area)';
      const want = any && layers.fire;
      if (!want) { if (fireShown) { map.removeLayer(fireLayer); fireShown = false; } return; }
      if (!fireLayer) {
        fireLayer = L.layerGroup();
        Object.keys(meta.fire_perimeters).forEach((name) => {
          meta.fire_perimeters[name].forEach((ring) => {
            L.polygon(ring.map((p) => [p[1], p[0]]), { renderer: canvas, interactive: false, weight: 1.5, dashArray: '2 5', fillOpacity: 0.05 }).addTo(fireLayer);
          });
        });
      }
      fireLayer.eachLayer((l) => l.setStyle({ color: cssVar('--muted'), fillColor: cssVar('--muted') }));
      if (!fireShown) { fireLayer.addTo(map); fireShown = true; if (hitLayer) hitLayer.eachLayer((m) => m.bringToFront()); }
    }

    // ---- selection and the detail panel ------------------------------------------------------------------
    // mode: 'fly' (animated zoom to it), 'keep' (only pan if it is hidden), 'jump' (same, never animated: keyboard)
    function select(r, mode) {
      state.selected = r;
      if (r && matches.includes(r)) { state.ghost = null; act.id = r.id; act.idx = matches.indexOf(r); }
      renderSelection();
      updateRowSelection();
      if (!r) return;
      if (mode === 'fly') {
        const z = Math.max(map.getZoom(), 14), c = viewFor(r, z);
        // Background tabs pause animation frames, which can freeze Leaflet mid-zoom; jump instead when not visible.
        if (document.hidden || mqReduce.matches) map.setView(c, z, { animate: false });
        else map.flyTo(c, z, { duration: 0.6 });
      } else ensureVisible(r, mode === 'keep');
    }
    let opener = null;   // what had focus when the detail panel opened, so closing it can give focus back
    function openLead(r, mode) {
      const was = state.panel;
      if (!was) { const a = root.activeElement; opener = a && a !== doc.body && !$('lead-panel').contains(a) ? a : null; }
      state.panel = true;
      select(r, mode);
      scrollRowIntoView(r);
      if (!was) $('lead-panel').focus({ preventScroll: true });
    }
    const canFocus = (el) => !!el && el.isConnected && !el.disabled && !el.closest('[inert]') && el.getClientRects().length > 0;
    function closeLead() {
      const ae = root.activeElement, hadFocus = $('lead-panel').contains(ae) || (!embed && ae === doc.body);   // embedded: never take focus the page has elsewhere
      state.panel = false;
      renderPanel();
      if (!hadFocus) { opener = null; return; }
      // focus goes back to what opened the panel, else the selected row (the list, with that row active), else the map
      const list = $('list');
      const tgt = canFocus(opener) ? opener : canFocus(list) ? list : (map && map.getContainer());
      opener = null;
      if (tgt === list && state.selected && matches.includes(state.selected)) setActive(state.selected);
      if (tgt) tgt.focus({ preventScroll: true });
    }
    function step(dir, mode) {
      if (!matches.length) return;
      const i = matches.indexOf(state.selected);
      let next;
      if (i < 0 && state.ghost != null) next = matches[clamp(dir > 0 ? state.ghost : state.ghost - 1, 0, matches.length - 1)];   // the lead we left was filtered out: carry on from its slot
      else next = matches[i < 0 ? (dir > 0 ? 0 : matches.length - 1) : (i + dir + matches.length) % matches.length];
      if (state.panel || mode === 'jump') { state.panel = true; }
      select(next, mode || 'keep');
      scrollRowIntoView(next);
    }

    function renderSelection() {
      const r = state.selected;
      if (r) {
        const ring = [r.lat, r.lng];
        if (!selMarker) selMarker = L.circleMarker(ring, { renderer: canvas, radius: 9, weight: 2, fillOpacity: 0, interactive: false }).addTo(map);
        else selMarker.setLatLng(ring);
        selMarker.setStyle({ color: cssVar('--text') }).bringToFront();
      } else if (selMarker) { selMarker.remove(); selMarker = null; }
      renderPostcard();
      renderPanel();
    }

    function renderNotice() {
      const n = store.notice;
      $('store-note').hidden = !n;
      $('store-note').textContent = n;
      $('lp-notice').hidden = !n;
      $('lp-notice').textContent = n;
      ['store-note', 'lp-notice'].forEach((id) => $(id).classList.toggle('quiet', store.noticeQuiet));
    }

    function kvRow(label, value) { return `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`; }
    function renderPanel() {
      const r = state.panel ? state.selected : null;
      const panel = $('lead-panel');
      panel.classList.toggle('open', !!r);
      panel.inert = !r;
      panel.setAttribute('aria-hidden', String(!r));
      shell.classList.toggle('has-detail', !!r);
      if (!r) { panelId = null; return; }
      const rec = effRec(r);
      const ro = store.mode === 'readonly' || store.loading;   // nothing is editable until the saved leads have loaded
      const status = rec ? rec.status : 'new';
      const addr = titleCase(r.addr);
      $('lp-addr').textContent = addr;
      $('lp-city').textContent = `${r.city}${r.zip ? ' · ' + r.zip : ''}`;
      $('lp-dir').href = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(`${addr}, ${r.city}, ${r.state || CONFIG.state} ${r.zip}`.trim());
      $('lp-mail').hidden = !CONFIG.mailRelay;
      $('lp-street').href = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${r.lat},${r.lng}`;
      const it = r.intel || leadScore(r, state.trade, intel);
      const why = it.reasons.join(' · ');
      $('lp-best').innerHTML = `<span>Best time to reach out: <b>${esc(timingPhrase(it.timing))}</b></span>` +
        `<button type="button" class="tier t-${it.bucket}" data-tip="${esc(why)}" aria-label="${TIER_LABEL[it.bucket]} lead. ${esc(why)}"><i></i>${TIER_LABEL[it.bucket]}</button>`;
      $('lp-kinds').innerHTML = r.kinds.map((k) => { const m = meta.kinds[k] || { label: 'Other' }; return m.hint ? `<span class="tag hint">${esc(m.label)} \u2014 ${esc(m.hint)}</span>` : `<span class="tag">${esc(m.label)}</span>`; }).join('') +
        (r.fire ? `<span class="tag fire">${icon('flame')}Fire rebuild</span>` : '') + (r.approx ? '<span class="tag">Street only: approximate spot</span>' : '');
      $('lp-kv').innerHTML = r.stage === 'application'
        ? kvRow(dateLabel(r), fmtDate(r.date)) + kvRow('Board', r.board) + kvRow('Case', r.nbr) + (r.applicant ? kvRow('Applicant', r.applicant) : '')
        : kvRow('Issued', fmtDate(r.date)) + kvRow('Project value', r.val > 0 ? money(r.val) : 'Not listed') + kvRow('Permit', r.nbr);
      $('lp-others-h').textContent = r.stage === 'application' ? 'Other filings here ' : 'Other permits here ';
      const dsc = $('lp-desc');
      if (panelId !== r.id) { dsc.classList.remove('full'); }
      dsc.textContent = r.desc || '';
      $('lp-more').hidden = !r.desc || (!dsc.classList.contains('full') && dsc.scrollHeight <= dsc.clientHeight + 1);
      $('lp-more').textContent = dsc.classList.contains('full') ? 'Less' : 'More';
      const hood = [];
      if (r.homeK != null) hood.push(kvRow('Median home value', homeLabel(r.homeK)));
      if (r.ownPct != null) hood.push(kvRow('Owner-occupied', r.ownPct + '%'));
      $('lp-hood-sec').hidden = !hood.length;
      $('lp-hood').innerHTML = hood.join('');
      const con = splitContractor(r.contractor);
      $('lp-con-sec').hidden = !con.name;
      $('lp-con-name').textContent = con.name;
      $('lp-con-phone').textContent = con.phone;
      $('lp-con-copy').hidden = !con.phone;
      $('lp-con-copy').dataset.phone = con.phone;
      $('lp-others-sec').hidden = !r.others.length;
      $('lp-others-n').textContent = r.others.length;
      $('lp-others-list').innerHTML = r.others.map((o) => `<li><span class="mono">${esc(fmtDate(o.date, false))}</span><span>${esc(trunc(o.desc || 'No description', 90))}<br><span class="mono">${esc(o.nbr)}</span></span></li>`).join('');
      const idx = Math.max(0, STATUSES.indexOf(status));
      $('lp-status').style.setProperty('--i', idx);
      $('lp-status').querySelectorAll('button').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.s === status));
        b.disabled = ro;
      });
      const pl = $('lp-prior'), pr = rec && rec.prior;
      pl.hidden = !pr;
      if (pr) {
        const dt = pr.at ? new Date(pr.at) : null, nn = rec.notes ? rec.notes.length : 0;
        pl.textContent = `Previously ${STATUS_LABEL[pr.status]}${dt && !isNaN(dt) ? ` (${MONTHS[dt.getMonth()]} ${dt.getFullYear()})` : ''}${nn ? ` · ${nn} note${nn === 1 ? '' : 's'}` : ''}`;
      }
      const fu = $('lp-follow');
      if (root.activeElement !== fu) fu.value = (rec && rec.followUp) || '';
      fu.disabled = ro;
      $('lp-quick').querySelectorAll('button').forEach((b) => { b.disabled = ro; });
      const notes = rec && rec.notes ? rec.notes.slice().reverse() : [];
      $('lp-notes').innerHTML = notes.length
        ? notes.map((n) => `<li><div class="n-top"><b>${esc(store.author(n.by))}</b><time datetime="${esc(n.at)}">${esc(ago(n.at))}</time></div><p>${esc(n.text)}</p></li>`).join('')
        : '<li class="n-empty">No notes yet.</li>';
      if (panelId !== r.id) { panelId = r.id; $('lp-note-in').value = drafts.get(r.id) || ''; $('d-scroll').scrollTop = 0; fire('lead-open', { lead: leadPayload(r) }); }
      $('lp-note-in').disabled = ro;
      $('lp-note-add').disabled = ro;
      $('lp-prev').disabled = $('lp-next').disabled = matches.length < 2;
      $('lp-foot').textContent = store.mode === 'shared' ? 'Shared with your team' : store.mode === 'readonly' ? 'View only' : 'Saved on this device';
      renderNotice();
    }

    // every change goes through here as an operation (see the store): nothing is written until the saved leads have loaded
    const drafts = new Map();   // unsent note text per lead id
    function commit(make, r) {
      r = r || state.selected;
      if (!r || store.mode === 'readonly' || store.loading) return null;
      const op = make(leadInfo(r));
      const p = store.update(r.id, op, seedFor(r));
      p.then(onSaved);
      p.then((res) => { if (res && res.ok) changed(r, op); });
      return { r, p };
    }
    // DOM events / webhook payload for a saved change (see the README for the shape)
    const EVENT_NAME = { status: 'lead.status_changed', follow: 'lead.follow_up_set', note: 'lead.note_added' };
    function leadPayload(r) {
      const rec = effRec(r), it = r.intel || leadScore(r, state.trade, intel);
      return {
        id: r.id, address: titleCase(r.addr), city: r.city, zip: r.zip || '', lat: r.lat, lng: r.lng, permit: r.nbr, issued: r.date, value: r.val,
        kind: kindsLabel(r, ' + '), trade: state.trade, status: rec ? rec.status : 'new', followUp: (rec && rec.followUp) || null,
        score: it.score, bucket: it.bucket, timing: it.timing.state
      };
    }
    function changed(r, op) {
      const name = EVENT_NAME[op.kind];
      if (!name) return;
      const d = { event: name, lead: leadPayload(r), at: new Date().toISOString(), business: state.biz };
      if (op.note) d.note = op.note.text;
      fire('lead-change', d);
    }
    function onSaved(res) {
      if (res && res.ok) flashSaved();
      else if (res && res.message) toast(res.message, { error: true });
    }
    // Undo puts back only the status that was changed, on the record as it is now (a note added since stays).
    function undoStatus(r, prev) {
      if (store.mode === 'readonly' || store.loading) return;
      const op = store.ops.status(prev, leadInfo(r));
      const p = store.update(r.id, op, seedFor(r));
      p.then(onSaved);
      p.then((res) => { if (res && res.ok) changed(r, op); });
    }
    function setStatus(st) {
      const sel = state.selected;
      if (!sel) return;
      const cur = effRec(sel), prev = cur ? cur.status : 'new';
      if (prev === st) return;
      const res = commit((lead) => store.ops.status(st, lead));
      if (res) toast(`Marked ${STATUS_LABEL[st]}`, { undo: () => undoStatus(res.r, prev) });
    }
    const validDate = (v) => DATE_RE.test(v) && +v.slice(0, 4) >= 2000;
    function setFollow(v, say, r) {
      r = r || state.selected;
      if (v && !validDate(v)) return;
      const cur = r && effRec(r);
      if ((cur && cur.followUp || null) === (v || null)) return;
      if (!cur && !v) return;
      if (commit((lead) => store.ops.follow(v, lead), r) && say) toast(v ? `Follow up set for ${fmtDate(v, false)}` : 'Follow-up cleared');
    }
    function addNote() {
      const box = $('lp-note-in'), text = box.value.trim();
      if (!text) return;
      if (commit((lead) => store.ops.note(text.slice(0, 2000), store.uid, lead))) {
        box.value = '';
        if (panelId) drafts.delete(panelId);
        toast('Note added');
      }
    }
    function copyText(text, ok, selectEl) {
      const fallback = () => {   // select the visible text so Cmd/Ctrl+C works
        if (selectEl) {
          const sel = win.getSelection(), range = doc.createRange();
          range.selectNodeContents(selectEl);
          sel.removeAllRanges(); sel.addRange(range);
        }
        toast('Press Ctrl/Cmd+C to copy', { error: true });
      };
      try { navigator.clipboard.writeText(text).then(() => toast(ok), fallback); } catch (e) { fallback(); }
    }
    // ---- mail a real postcard through the relay (postalytics/relay) ----------------------------------
    let mailing = false, mailLead = null;
    const PIN_KEY = 'pp-mail-pin';
    const getPin = () => { try { return win.localStorage.getItem(PIN_KEY) || ''; } catch (e) { return ''; } };
    const setPin = (v) => { try { if (v) win.localStorage.setItem(PIN_KEY, v); else win.localStorage.removeItem(PIN_KEY); } catch (e) { /* storage unavailable */ } };
    function syncPin() {
      const have = !!getPin();
      $('mail-pin-row').hidden = have; $('mail-forget').hidden = !have;
      $('mail-yes').disabled = !have && !$('mail-pin').value.trim();
    }
    function askMail() {
      const r = state.selected;
      if (!r || mailing) return;
      mailLead = r;
      $('mail-msg').textContent = `Mail a postcard to ${titleCase(r.addr)}, ${r.city}? About $${(+CONFIG.mailCost || 0).toFixed(2)}.`;
      $('mail-pin').value = '';
      syncPin();
      openDialog($('mail-confirm'));
    }
    async function sendMail() {
      const r = mailLead, typed = $('mail-pin').value.trim(), pin = getPin() || typed;
      if (!pin) return;
      closeDialog($('mail-confirm'));
      if (!r || mailing) return;
      mailing = true;
      const btn = $('lp-mail'), label = $('lp-mail-l');
      btn.disabled = true; label.textContent = 'Sending\u2026';
      try {
        const lead = Object.assign(leadPayload(r), { state: r.state || CONFIG.state });
        const res = await fetch(CONFIG.mailRelay.replace(/\/+$/, '') + '/mail', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Mail-Pin': pin }, body: JSON.stringify({ lead, business: state.biz })
        });
        let body = null;
        try { body = await res.json(); } catch (e) { /* not JSON */ }
        if (res.status === 401) { setPin(''); toast('Wrong PIN', { error: true }); return; }
        setPin(pin);
        if (!res.ok) { toast((body && (body.error || body.message)) || `Could not mail the postcard (${res.status})`, { error: true }); return; }
        if (body && body.dryRun) { toast('Test only: nothing mailed'); return; }
        toast(`Postcard on its way to ${titleCase(r.addr)}`);
        const rec = effRec(r);
        commit((l) => store.ops.note(`Postcard mailed ${ymd(new Date())}`, store.uid, l), r);
        if (!rec || rec.status === 'new') commit((l) => store.ops.status('contacted', l), r);
      } catch (e) {
        toast('Could not reach the mailing service', { error: true });
      } finally {
        mailing = false; btn.disabled = false; label.textContent = 'Mail postcard';
      }
    }
    function copyAddress() {
      const r = state.selected;
      if (r) copyText(`${titleCase(r.addr)}, ${r.city}, ${r.state || CONFIG.state} ${r.zip}`.trim(), 'Copied address', $('lp-addr'));
    }

    // ---- saved indicator + toasts --------------------------------------------------------------------
    let savedTimer = 0;
    function flashSaved() {
      if (store.busy) return;
      const el = $('lp-saved');
      el.textContent = 'Saved';
      el.classList.add('on');
      clearTimeout(savedTimer);
      savedTimer = setTimeout(() => el.classList.remove('on'), 1000);
    }
    const toastList = [];
    function dismissToast(el) {
      clearTimeout(el._t);
      const i = toastList.indexOf(el);
      if (i < 0) return;
      toastList.splice(i, 1);
      el.classList.add('out');
      setTimeout(() => el.remove(), 200);
      layoutToasts();
    }
    function layoutToasts() { toastList.forEach((el, i) => el.style.setProperty('--i', i)); }
    function toast(msg, opts) {
      opts = opts || {};
      const el = doc.createElement('div');
      el.className = 'toast' + (opts.error ? ' err' : '');
      el.innerHTML = `<span>${esc(msg)}</span>` + (opts.undo || opts.action ? `<button type="button">${opts.action ? esc(opts.action.label) : 'Undo'}</button>` : '');
      if (opts.undo || opts.action) el.querySelector('button').addEventListener('click', () => { (opts.action ? opts.action.fn : opts.undo)(); dismissToast(el); });
      toastList.unshift(el);
      $('toasts').appendChild(el);
      while (toastList.length > 3) dismissToast(toastList[toastList.length - 1]);
      layoutToasts();
      el._t = setTimeout(() => dismissToast(el), opts.error ? 5000 : 3000);
    }


    // ---- export (embed): CSV of the current list, .ics of the follow-ups --------------------------------------------
    function exportRow(r) {
      const rec = effRec(r), con = splitContractor(r.contractor);
      return { id: r.id, address: titleCase(r.addr), city: r.city, zip: r.zip || '', status: STATUS_LABEL[r.status] || r.status, followUp: r.follow || '',
        score: r.intel ? r.intel.score : '', timing: r.intel ? timingPhrase(r.intel.timing) : '', project: kindsLabel(r, ' + '), value: r.val > 0 ? r.val : '',
        permit: r.nbr, issued: r.date, board: r.stage === 'application' ? r.board : '', contractor: con.name ? con.name + (con.phone ? ' · ' + con.phone : '') : '', notes: rec && rec.notes ? rec.notes.length : 0 };
    }
    function saveFile(name, mime, text) {
      if (options.download) { options.download(name, mime, text); return; }
      const url = win.URL.createObjectURL(new win.Blob([text], { type: mime + ';charset=utf-8' }));
      const a = doc.createElement('a');
      a.href = url; a.download = name; a.style.display = 'none';
      shell.appendChild(a); a.click(); a.remove();
      setTimeout(() => win.URL.revokeObjectURL(url), 4000);
    }
    function exportCsv() {
      if (!matches.length) { toast('No leads to export', { error: true }); return; }
      saveFile(`permit-leads-${state.trade}-${ymd(new Date())}.csv`, 'text/csv', leadsToCsv(matches.map(exportRow)));
      toast(`Downloaded ${matches.length.toLocaleString('en-US')} leads`);
    }
    function exportIcs() {
      const rows = pool.filter((r) => r.follow && r.status !== 'won' && r.status !== 'lost').map(exportRow);
      if (!rows.length) { toast('No follow-up dates set yet', { error: true }); return; }
      saveFile(`follow-ups-${ymd(new Date())}.ics`, 'text/calendar', followUpsToIcs(rows));
      toast(`Added ${rows.length} follow-up${rows.length === 1 ? '' : 's'} to the file`);
    }

    // ---- postcard -------------------------------------------------------------------------------------
    function renderPostcard() {
      const r = state.selected;
      $('card-wrap').hidden = !r;
      $('card-empty').hidden = !!r;
      $('card-for').hidden = !r;
      $('flip').disabled = !r;
      $('prev-card').disabled = $('next-card').disabled = matches.length < 2;
      if (!r) return;
      const trade = state.trade;
      const kind = r.kinds.find((k) => meta.kinds[k] && meta.kinds[k].trades.includes(trade)) || r.kinds[0];
      const copy = COPY[kind] || COPY.other;
      const noun = TRADE_NOUN[trade] || (meta.trades[trade] || trade).toLowerCase();
      const biz = state.biz.trim() || 'Your business name';
      const street = titleCase(r.addr);
      // planning-stage rows: neutral copy that never mentions the board, the agenda or the filing
      const app = r.stage === 'application', ac = CONFIG.appCopy || { head: 'Planning a project at {street}?', offer: '{biz} can help. Free estimate.' };
      const fill = (t) => t.replace('{street}', street).replace('{biz}', biz);
      const head = app ? fill(ac.head) : `${copy.head} Let’s talk ${noun}.`;
      const offer = app ? fill(ac.offer) : copy.offer.replace('{trade}', noun);
      $('card-for').textContent = app ? `${dateLabel(r)} ${fmtDate(r.date)} · ${street}` : `Permit ${r.nbr} · ${fmtDate(r.date)} · ${street}`;
      $('face-front').innerHTML =
        `<div class="tag">${app ? 'Free estimate' : 'Permit notice · issued ' + esc(fmtDate(r.date, false))}</div>` +
        `<p class="head">${esc(head)}</p><p class="offer">${esc(offer)}</p>` +
        `<div class="where">Re: ${esc(street)}</div>` +
        `<div class="band"><span class="biz">${esc(biz)}</span><span class="contact">${esc(state.phone)}<br>${esc(state.url)}</span></div>`;
      $('face-back').innerHTML =
        `<div class="left"><p class="msg"><b>${esc(biz)}</b> ${app ? 'builds and remodels homes' : 'works on ' + esc(noun) + ' right after the permit stage'}. One call or one click gets you a written quote.</p>` +
        `<p class="legal">${app ? 'Sent to homeowners in ' + esc(r.city) + '. Call or email to be left off future mailings.' : 'You’re receiving this because building permits are public record. Not affiliated with the City of ' + esc(r.city) + '.'}</p></div>` +
        `<div class="right"><div class="stamp"><span><i>★</i>Postage<br>here</span></div>` +
        `<div class="addr-block"><div class="to">To the homeowner at</div><div class="line">${esc(r.addr)}</div><div class="line">${esc(r.city)}, ${esc(r.state || CONFIG.state)} ${esc(r.zip)}</div></div></div>`;
    }
    function setFlip(on) {
      state.flipped = on;
      $('postcard').classList.toggle('flipped', on);
      $('flip').setAttribute('aria-pressed', String(on));
      $('flip').textContent = on ? 'Flip to front' : 'Flip to back';
      $('face-front').setAttribute('aria-hidden', String(on));
      $('face-back').setAttribute('aria-hidden', String(!on));
    }

    // ---- popovers ---------------------------------------------------------------------------------------
    const POPS = { trade: ['trade-btn', 'trade-pop'], area: ['area-btn', 'area-pop'], settings: ['settings-btn', 'settings-pop'], layers: ['layers-btn', 'layers-pop'] };
    let openKey = null;
    function placePop(key) {
      const btn = $(POPS[key][0]), el = $(POPS[key][1]);
      const bx = vbox(), r0 = btn.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight, vw = bx.w, vh = bx.h;
      const rect = { left: r0.left - bx.left, right: r0.right - bx.left, top: r0.top - bx.top, bottom: r0.bottom - bx.top, width: r0.width };
      let left, top, ox, oy;
      if (key === 'layers') {
        left = rect.left - w - 8; top = rect.top; ox = '100%'; oy = '20px';
        if (left < 8) { left = clamp(rect.left, 8, vw - w - 8); top = rect.bottom + 6; ox = '50%'; oy = '0'; }
      } else if (key === 'area') {
        left = rect.left; top = rect.bottom + 6; ox = '24px'; oy = '0';
      } else {
        left = rect.right - w; top = rect.bottom + 6; ox = (rect.left + rect.width / 2 - left) + 'px'; oy = '0';
      }
      left = clamp(left, 8, Math.max(8, vw - w - 8));
      if (top + h > vh - 8) top = Math.max(8, vh - h - 8);
      el.style.left = left + 'px';
      el.style.top = top + 'px';
      el.style.setProperty('--ox', ox);
      el.style.setProperty('--oy', oy);
    }
    function openPop(key) {
      if (openKey === key) { closePop(); return; }
      closePop();
      closeSearch();
      placePop(key);
      $(POPS[key][1]).classList.add('open');
      $(POPS[key][0]).setAttribute('aria-expanded', 'true');
      openKey = key;
      if (key === 'trade') {
        $('trade-q').value = ''; renderTradeList('');
        $('trade-q').setAttribute('aria-expanded', 'true');
        if (!isPhone()) $('trade-q').focus({ preventScroll: true });   // on a phone that would raise the keyboard
        else $('trade-list').focus({ preventScroll: true });
      } else {
        const first = $(POPS[key][1]).querySelector('select, input, button, a[href]');
        if (first) first.focus({ preventScroll: true });
      }
      if (key === 'settings') renderChrome();
    }
    function closePop(restoreFocus) {
      if (!openKey) return;
      const [b, p] = POPS[openKey];
      $(p).classList.remove('open');
      $(b).setAttribute('aria-expanded', 'false');
      if (openKey === 'trade') $('trade-q').setAttribute('aria-expanded', 'false');
      openKey = null;
      if (restoreFocus) $(b).focus({ preventScroll: true });
    }

    // trade picker: an input that controls a listbox (aria-activedescendant); arrow keys move the active option, Enter picks it
    let tradeItems = [], tradeAct = 0;
    function markTrade() {
      $('trade-list').querySelectorAll('.lb-item').forEach((el, i) => el.setAttribute('aria-selected', String(i === tradeAct)));
      const cur = $('trade-list').querySelector('[aria-selected="true"]');
      if (cur) { $('trade-q').setAttribute('aria-activedescendant', cur.id); cur.scrollIntoView({ block: 'nearest' }); } else $('trade-q').removeAttribute('aria-activedescendant');
    }
    function renderTradeList(q) {
      const needle = q.trim().toLowerCase();
      tradeItems = tradeOrder.filter((t) => (meta.trades[t] || t).toLowerCase().includes(needle));
      tradeAct = Math.max(0, needle ? 0 : tradeItems.indexOf(state.trade));
      $('trade-list').innerHTML = tradeItems.length
        ? tradeItems.map((t, i) => `<div class="lb-item" role="option" id="to-${i}" data-t="${esc(t)}" aria-selected="false"${t === state.trade ? ' aria-current="true"' : ''}><span class="t">${esc(meta.trades[t] || t)}</span></div>`).join('')
        : '<p class="lb-none">No trade matches that.</p>';
      markTrade();
    }
    function pickTrade(t) {
      if (!t) return;
      state.trade = t;
      state.selected = null; state.panel = false;
      $('trade-label').textContent = meta.trades[t] || t;
      closePop(true);
      refresh();
    }

    // ---- search (combobox: leads by address / permit #, then places) ------------------------------------
    const cityCenters = new Map();
    function cityCenter(name) {
      if (!cityCenters.has(name)) {
        const rs = rows.filter((r) => r.city === name);
        const med = (a) => { a.sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };
        cityCenters.set(name, rs.length ? { lat: med(rs.map((r) => r.lat)), lng: med(rs.map((r) => r.lng)) } : null);
      }
      return cityCenters.get(name);
    }
    const hl = (text, q) => {
      const i = q ? text.toLowerCase().indexOf(q) : -1;
      return i < 0 ? esc(text) : esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
    };
    const search = { items: [], active: -1 };
    function searchItems(raw) {
      const q = raw.trim().toLowerCase();
      const leads = [];
      if (q) {
        for (const r of pool) {
          const a = titleCase(r.addr).toLowerCase(), ia = a.indexOf(q), inb = r.nbr.toLowerCase().indexOf(q);
          const rank = ia === 0 || inb === 0 ? 0 : ia > 0 ? 1 : inb > 0 ? 2 : r.city.toLowerCase().includes(q) || (r.zip && r.zip.startsWith(q)) ? 3 : -1;
          if (rank >= 0) leads.push([rank, r]);
        }
        leads.sort((x, y) => x[0] - y[0] || y[1].intel.score - x[1].intel.score);
      }
      const places = [];
      const seen = new Set();
      presets.forEach((p) => {
        if (!q || p.label.toLowerCase().includes(q) || p.city.toLowerCase().includes(q)) { places.push({ type: 'place', label: p.label, sub: p.region, id: p.id, lat: p.lat, lng: p.lng }); seen.add(p.label.toLowerCase()); }
      });
      if (q) {
        (meta.sources || []).forEach((s) => {
          if (s.city.toLowerCase().includes(q) && !seen.has(s.city.toLowerCase())) {
            const c = cityCenter(s.city);
            if (c) { places.push({ type: 'place', label: s.city, sub: 'City', id: null, lat: c.lat, lng: c.lng }); seen.add(s.city.toLowerCase()); }
          }
        });
      }
      return { q, leads: leads.slice(0, 8).map((x) => ({ type: 'lead', r: x[1] })), places: places.slice(0, q ? 5 : 6) };
    }
    function renderSearch() {
      const { q, leads, places } = searchItems($('search').value);
      search.items = leads.concat(places);
      search.active = search.items.length ? 0 : -1;
      let html = '', n = 0;
      if (leads.length) {
        html += '<div class="lb-group">Leads</div>';
        leads.forEach((it) => {
          const r = it.r;
          html += `<div class="lb-item" role="option" id="so-${n}" data-n="${n}" aria-selected="false"><span class="g">${icon('mapPin')}</span><span class="t">${hl(titleCase(r.addr), q)}<small>${esc(r.city)} · ${hl(r.nbr, q)}</small></span><span class="m">${r.val > 0 ? esc(shortMoney(r.val)) : ''}</span></div>`;
          n++;
        });
      }
      if (places.length) {
        html += '<div class="lb-group">Places</div>';
        places.forEach((it) => {
          html += `<div class="lb-item" role="option" id="so-${n}" data-n="${n}" aria-selected="false"><span class="g">${icon('crosshair')}</span><span class="t">${hl(it.label, q)}<small>${esc(it.sub)}</small></span></div>`;
          n++;
        });
      }
      if (!n) html = `<p class="lb-none">${q ? 'Nothing matches that. Try a street name, a permit number or a city.' : 'Start typing an address, city or permit number.'}</p>`;
      $('search-list').innerHTML = html;
      markActive();
    }
    function markActive() {
      $('search-list').querySelectorAll('.lb-item').forEach((el) => el.setAttribute('aria-selected', String(+el.dataset.n === search.active)));
      const cur = $('search-list').querySelector('[aria-selected="true"]');
      if (cur) { $('search').setAttribute('aria-activedescendant', cur.id); cur.scrollIntoView({ block: 'nearest' }); } else $('search').removeAttribute('aria-activedescendant');
    }
    function openSearch() {
      closePop();
      renderSearch();
      $('search-pop').classList.add('open');
      $('search').setAttribute('aria-expanded', 'true');
    }
    function closeSearch() {
      $('search-pop').classList.remove('open');
      $('search').setAttribute('aria-expanded', 'false');
      $('search').removeAttribute('aria-activedescendant');
    }
    function endSearch() {
      closeSearch();
      shell.classList.remove('search-on');
      $('search').value = '';
      $('search').blur();
    }
    function chooseSearch(n) {
      const it = search.items[n];
      if (!it) return;
      endSearch();
      if (it.type === 'lead') goLead(it.r);
      else setBase(it.lat, it.lng, it.id, true, it.label);
    }
    function goLead(r) {
      setTab('leads');
      if (!matches.includes(r)) { state.filter = null; state.builder = null; compute(); }
      openLead(r, 'fly');
    }
    function focusSearch() {
      if (isPhone()) shell.classList.add('search-on');
      $('search').focus();
      $('search').select();
    }

    // ---- list tabs / filters / sidebar ----------------------------------------------------------------------
    function setTab(t) {
      state.tab = t;
      $('tab-leads').setAttribute('aria-selected', String(t === 'leads'));
      $('tab-builders').setAttribute('aria-selected', String(t === 'builders'));
      $('tab-leads').tabIndex = t === 'leads' ? 0 : -1;
      $('tab-builders').tabIndex = t === 'builders' ? 0 : -1;
      $('pane-leads').hidden = t !== 'leads';
      $('pane-builders').hidden = t !== 'builders';
      if (t === 'leads') paintRows();
    }
    function setFilter(f) {
      state.filter = f === 'all' || state.filter === f ? null : f;
      compute();
    }
    function sideDefault() {
      let v = null;
      try { v = localStorage.getItem(LS_SIDE); } catch (e) { /* storage unavailable */ }
      if (v === '0') return false;
      if (v === '1') return true;
      return vbox().w >= 1024;   // tablets start with the list closed
    }
    function setSide(open, persist) {
      shell.dataset.side = open ? 'open' : 'closed';
      const side = $('side');
      side.inert = !open && !isPhone();
      $('side-collapse').setAttribute('aria-expanded', String(open));
      $('side-open').setAttribute('aria-expanded', String(open));
      if (persist) { try { localStorage.setItem(LS_SIDE, open ? '1' : '0'); } catch (e) { /* storage unavailable */ } }
    }
    const sideOpen = () => shell.dataset.side !== 'closed';

    // ---- phone bottom sheet (peek / half / full) -----------------------------------------------------------------
    const sheet = { snap: 'peek', probe: null };
    function sheetPos() {
      const h = $('side').offsetHeight;
      if (!sheet.probe) {
        sheet.probe = doc.createElement('div');
        sheet.probe.style.cssText = 'position:fixed;left:0;top:0;visibility:hidden;pointer-events:none;padding-bottom:env(safe-area-inset-bottom,0px)';
        shell.appendChild(sheet.probe);
      }
      const safe = parseFloat(getComputedStyle(sheet.probe).paddingBottom) || 0;
      return { full: 0, half: Math.max(0, h - Math.round(vbox().h * 0.52)), peek: Math.max(0, h - (182 + safe)) };
    }
    function setSnap(name) {
      const side = $('side'), pos = sheetPos();
      sheet.snap = name;
      side.dataset.snap = name;
      $('grip').setAttribute('aria-expanded', String(name !== 'peek'));
      $('list').inert = name === 'peek';   // the list is only partly visible at peek: keep it out of the tab order
      side.style.setProperty('--y', pos[name] + 'px');
      side.style.setProperty('--hid', (name === 'full' ? 0 : pos[name]) + 'px');
    }
    function initSheet() {
      const grip = $('grip'), side = $('side');
      let drag = null;
      grip.addEventListener('pointerdown', (e) => {
        if (!isPhone()) return;
        const pos = sheetPos();
        drag = { id: e.pointerId, y0: e.clientY, from: pos[sheet.snap], pos, s: [{ t: e.timeStamp, y: e.clientY }], v: 0, moved: false };
        grip.setPointerCapture(e.pointerId);
        side.classList.add('dragging');
      });
      grip.addEventListener('pointermove', (e) => {
        if (!drag || e.pointerId !== drag.id) return;
        const dy = e.clientY - drag.y0;
        if (Math.abs(dy) > 4) drag.moved = true;
        drag.s.push({ t: e.timeStamp, y: e.clientY });
        side.style.setProperty('--y', clamp(drag.from + dy, 0, drag.pos.peek) + 'px');
      });
      const end = (e) => {
        if (!drag || e.pointerId !== drag.id) return;
        const d = drag; drag = null;
        side.classList.remove('dragging');
        if (!d.moved) { setSnap(sheet.snap === 'peek' ? 'half' : 'peek'); return; }
        // speed over the last ~100ms only (px per ms, positive = down): a drag that stops and then lets go is not a flick
        const recent = d.s.filter((q) => q.t >= e.timeStamp - 100), a = recent[0], z = recent[recent.length - 1];
        d.v = recent.length >= 2 ? (z.y - a.y) / Math.max(1, z.t - a.t) : 0;
        const y = clamp(d.from + (e.clientY - d.y0), 0, d.pos.peek);
        const snaps = ['full', 'half', 'peek'].sort((a, b) => d.pos[a] - d.pos[b]);
        let target;
        if (Math.abs(d.v) > 0.11) {   // flick: go to the next snap point in the direction of travel
          target = d.v > 0 ? snaps.find((s) => d.pos[s] > y + 1) || snaps[snaps.length - 1] : [...snaps].reverse().find((s) => d.pos[s] < y - 1) || snaps[0];
        } else target = snaps.reduce((best, s) => (Math.abs(d.pos[s] - y) < Math.abs(d.pos[best] - y) ? s : best), snaps[0]);
        setSnap(target);
      };
      grip.addEventListener('pointerup', end);
      grip.addEventListener('pointercancel', end);
      grip.addEventListener('click', (e) => {   // keyboard / assistive activation (pointer taps are handled above): peek -> half -> full -> peek
        if (e.detail !== 0 || !isPhone()) return;
        const order = ['peek', 'half', 'full'];
        setSnap(order[(order.indexOf(sheet.snap) + 1) % order.length]);
      });
      onResize(() => { if (isPhone()) setSnap(sheet.snap); });
    }
    function applyMode() {
      if (isPhone()) {
        $('side').inert = false;
        setSnap(sheet.snap);
      } else {
        const s = $('side');
        s.style.removeProperty('--y'); s.style.removeProperty('--hid'); delete s.dataset.snap;
        $('list').inert = false;
        setSide(sideOpen() ? true : sideDefault(), false);
      }
      if (map) { map.invalidateSize({ animate: false }); }
    }

    // ---- controls ---------------------------------------------------------------------------------------------
    function renderPresets() {
      const opt = (p) => `<option value="${p.id}">${esc(p.label)}</option>`;
      const names = REGIONS.concat([...new Set(presets.map((p) => p.region))].filter((n) => !REGIONS.includes(n)));
      const groups = names.map((name) => [name, presets.filter((p) => p.region === name)]);
      $('place').innerHTML = groups.filter(([, ps]) => ps.length)
        .map(([name, ps]) => `<optgroup label="${name}">${ps.map(opt).join('')}</optgroup>`).join('') +
        '<option value="custom" hidden disabled>Custom spot</option>';
      $('place').value = state.preset || 'custom';
    }

    function wire() {
      tradeOrder = Object.keys(meta.counts_by_trade);
      if (!tradeOrder.includes(state.trade)) state.trade = tradeOrder[0];
      $('trade-label').textContent = meta.trades[state.trade] || state.trade;

      // popovers
      [['trade-btn', 'trade'], ['area-btn', 'area'], ['settings-btn', 'settings'], ['layers-btn', 'layers']].forEach(([id, key]) => $(id).addEventListener('click', () => openPop(key)));
      listen(doc, 'pointerdown', (e) => {
        const path = e.composedPath ? e.composedPath() : [e.target], inside = (el) => path.includes(el);
        if (openKey) {
          const [b, p] = POPS[openKey];
          if (!inside($(p)) && !inside($(b))) closePop();
        }
        if (!isPhone() && $('search-pop').classList.contains('open') && !inside($('search-wrap'))) closeSearch();
        if (embed) { const d = root.querySelector('dialog[open]'); if (d && !inside(d)) closeDialog(d); }   // dialogs are not modal when embedded
      });
      onResize(() => { if (openKey) placePop(openKey); });
      $('trade-q').addEventListener('input', (e) => renderTradeList(e.target.value));
      const tq = $('trade-q');
      tq.setAttribute('role', 'combobox'); tq.setAttribute('aria-controls', 'trade-list'); tq.setAttribute('aria-expanded', 'false'); tq.setAttribute('aria-autocomplete', 'list');
      $('trade-list').tabIndex = -1;
      tq.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); if (tradeItems[tradeAct]) pickTrade(tradeItems[tradeAct]); }
        else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          if (tradeItems.length) { tradeAct = clamp(tradeAct + (e.key === 'ArrowDown' ? 1 : -1), 0, tradeItems.length - 1); markTrade(); }
        }
      });
      $('trade-list').addEventListener('click', (e) => { const b = e.target.closest('.lb-item'); if (b) pickTrade(b.dataset.t); });
      // a popover closes when focus moves out of it (to anything but its own trigger, whose click toggles it)
      Object.keys(POPS).forEach((key) => {
        const [btn, pop] = POPS[key];
        $(pop).addEventListener('focusout', (e) => { const to = e.relatedTarget; if (openKey === key && to && !$(pop).contains(to) && to !== $(btn)) closePop(); });
      });

      // settings
      $('biz').addEventListener('input', (e) => { state.biz = e.target.value; renderPostcard(); });
      $('phone').addEventListener('input', (e) => { state.phone = e.target.value; renderPostcard(); });
      $('url').addEventListener('input', (e) => { state.url = e.target.value; renderPostcard(); });
      $('rate').addEventListener('input', (e) => { state.rate = Math.max(0, parseFloat(e.target.value) || 0); renderChrome(); });
      $('radius').addEventListener('input', (e) => setRadius(+e.target.value));
      $('place').addEventListener('change', (e) => {
        const p = presets.find((x) => x.id === e.target.value);
        setBase(p.lat, p.lng, p.id, true);
      });
      $('sort').addEventListener('change', (e) => { state.sort = e.target.value; refresh(); });
      $('map-hint').hidden = hintSeen();
      $('map-hint-x').addEventListener('click', dismissHint);

      // search
      $('search-kbd').textContent = isMac ? '⌘K' : 'Ctrl K';
      root.querySelectorAll('.k-cmd').forEach((k) => { k.textContent = isMac ? '⌘K' : 'Ctrl K'; });
      $('search').addEventListener('focus', () => { if (ready) openSearch(); });
      $('search').addEventListener('input', () => { if (ready) { if (!$('search-pop').classList.contains('open')) openSearch(); else renderSearch(); } });
      $('search').addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          if (!search.items.length) return;
          search.active = (search.active + (e.key === 'ArrowDown' ? 1 : -1) + search.items.length) % search.items.length;
          markActive();
        } else if (e.key === 'Enter') { e.preventDefault(); chooseSearch(search.active); }
        else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); if ($('search').value) { $('search').value = ''; renderSearch(); } else endSearch(); }
      });
      $('search').addEventListener('blur', () => { if (!isPhone()) closeSearch(); });
      $('search-pop').addEventListener('mousedown', (e) => e.preventDefault());   // keep focus in the input
      $('search-pop').addEventListener('click', (e) => { const it = e.target.closest('.lb-item'); if (it) chooseSearch(+it.dataset.n); });
      $('search-open').addEventListener('click', focusSearch);
      $('search-close').addEventListener('click', endSearch);

      // sidebar, tabs, filters
      $('side-collapse').addEventListener('click', () => setSide(false, true));
      $('side-open').addEventListener('click', () => setSide(true, true));
      $('tab-leads').addEventListener('click', () => setTab('leads'));
      $('tab-builders').addEventListener('click', () => setTab('builders'));
      root.querySelector('.tabs').addEventListener('keydown', (e) => {
        if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !$('tab-builders').hidden) { e.preventDefault(); setTab(state.tab === 'leads' ? 'builders' : 'leads'); $('tab-' + state.tab).focus(); }
      });
      $('kpis').addEventListener('click', (e) => { const b = e.target.closest('.kpi'); if (b) setFilter(b.dataset.f); });
      $('segs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setFilter(b.dataset.s); });
      $('chips').addEventListener('click', (e) => {
        const b = e.target.closest('.chip-x');
        if (!b) return;
        if (b.dataset.chip === 'b') state.builder = null; else state.filter = null;
        compute();
      });
      $('empty-act').addEventListener('click', () => {
        if ($('empty-act').dataset.act === 'retry') retryArea();
        else if ($('empty-act').dataset.act === 'widen') setRadius(state.radius + 5);
        else { state.filter = null; state.builder = null; compute(); }
      });

      // the lead list (one listener each: rows are created on scroll)
      $('list').addEventListener('scroll', () => paintRows(), { passive: true });
      $('list').addEventListener('focus', () => { if (!act.id && matches.length) setActive(matches[0]); else syncActive(); });
      $('list').addEventListener('keydown', (e) => {
        if (!matches.length || e.altKey || e.ctrlKey || e.metaKey) return;
        const i = Math.max(0, matches.findIndex((r) => r.id === act.id)), page = Math.max(1, Math.floor($('list').clientHeight / ROW_H) - 1);
        let n;
        if (e.key === 'ArrowDown') n = i + 1;
        else if (e.key === 'ArrowUp') n = i - 1;
        else if (e.key === 'PageDown') n = i + page;
        else if (e.key === 'PageUp') n = i - page;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = matches.length - 1;
        else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLead(matches[i], 'fly'); return; }
        else return;
        e.preventDefault();
        setActive(matches[clamp(n, 0, matches.length - 1)]);
      });
      $('rows').addEventListener('click', (e) => { const b = e.target.closest('.row'); if (b) openLead(matches[+b.dataset.i], 'fly'); });
      $('rows').addEventListener('mouseover', (e) => { const b = e.target.closest('.row'); setHover(b ? matches[+b.dataset.i] : null); });
      $('rows').addEventListener('mouseleave', () => setHover(null));
      $('blist').addEventListener('click', (e) => {
        const copyBtn = e.target.closest('[data-act="copy"]');
        if (copyBtn) { copyText(copyBtn.dataset.phone, 'Copied phone'); return; }
        const row = e.target.closest('.brow');
        if (!row || !e.target.closest('[data-act="pick"]')) return;
        state.builder = state.builder === row.dataset.k ? null : row.dataset.k;
        if (state.builder) setTab('leads');
        compute();
      });
      onResize(() => { if (state.tab === 'leads') { vwin.sig = ''; paintRows(); } });

      // map controls
      $('zoom-in').addEventListener('click', () => map.zoomIn());
      $('zoom-out').addEventListener('click', () => map.zoomOut());
      $('recenter').addEventListener('click', fitBase);
      $('lay-all').addEventListener('change', (e) => {
        layers.all = e.target.checked;
        if (layers.all) dotLayer.addTo(map); else map.removeLayer(dotLayer);
        hitLayer.eachLayer((m) => m.bringToFront());
      });
      $('lay-hood').addEventListener('change', (e) => { layers.hood = e.target.checked; $('ramp').hidden = !layers.hood; paintDots(); });
      $('lay-fire').addEventListener('change', (e) => { layers.fire = e.target.checked; renderFire(); });
      $('lay-hood-row').hidden = !tracts.length;

      // detail panel
      $('lp-close').addEventListener('click', () => { closeLead(); });
      $('lp-back').addEventListener('click', () => { closeLead(); });
      $('lp-prev').addEventListener('click', () => step(-1));
      $('lp-next').addEventListener('click', () => step(1));
      $('lp-status').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setStatus(b.dataset.s); });
      // the date is saved when it is finished (change / Enter / leaving the field, or 600ms after a complete date), never on a partial year
      let fuTimer = 0;
      const fu = $('lp-follow');
      fu.addEventListener('input', () => {
        clearTimeout(fuTimer);
        const v = fu.value, r = state.selected;
        if (v && validDate(v)) fuTimer = setTimeout(() => setFollow(v, true, r), 600);
      });
      const finishFollow = () => { clearTimeout(fuTimer); if (!(fu.validity && fu.validity.badInput)) setFollow(fu.value, true); };   // a half-typed date reads as '' but is not "cleared"
      fu.addEventListener('change', finishFollow);
      fu.addEventListener('keydown', (e) => { if (e.key === 'Enter') finishFollow(); });
      fu.addEventListener('blur', () => { finishFollow(); renderPanel(); });
      $('lp-quick').addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        clearTimeout(fuTimer);
        const v = b.dataset.d === 'clear' ? '' : addDays(+b.dataset.d);
        fu.value = v;
        setFollow(v, true);
      });
      $('lp-note-in').addEventListener('input', (e) => { if (panelId) { if (e.target.value) drafts.set(panelId, e.target.value); else drafts.delete(panelId); } });
      $('lp-note-add').addEventListener('click', addNote);
      $('lp-note-in').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); addNote(); } });
      $('lp-copy').addEventListener('click', copyAddress);
      $('lp-mail').addEventListener('click', askMail);
      $('mail-yes').addEventListener('click', sendMail);
      $('mail-pin').addEventListener('input', syncPin);
      $('mail-pin').addEventListener('keydown', (e) => { if (e.key === 'Enter' && !$('mail-yes').disabled) sendMail(); });
      $('mail-forget').addEventListener('click', () => { setPin(''); $('mail-pin').value = ''; syncPin(); $('mail-pin').focus(); });
      ['mail-no', 'mail-x'].forEach((id) => $(id).addEventListener('click', () => closeDialog($('mail-confirm'))));
      $('lp-con-copy').addEventListener('click', () => copyText($('lp-con-copy').dataset.phone, 'Copied phone'));
      $('lp-more').addEventListener('click', () => {
        const d = $('lp-desc');
        d.classList.toggle('full');
        $('lp-more').textContent = d.classList.contains('full') ? 'Less' : 'More';
      });
      store.onChange((kind) => {
        if (!map) return;
        if (kind === 'profiles') renderPanel(); else { refresh(); renderPanel(); }
        renderNotice();
      });

      // dialogs
      const openCard = () => { setFlip(false); renderPostcard(); openDialog($('drawer')); };
      $('lp-card').addEventListener('click', openCard);
      $('collapse').addEventListener('click', () => closeDialog($('drawer')));
      $('about-open').addEventListener('click', () => { closePop(); openDialog($('about')); });
      $('export-sec').hidden = !options.exportTools;
      $('export-csv').addEventListener('click', exportCsv);
      $('export-ics').addEventListener('click', exportIcs);
      $('about-close').addEventListener('click', () => closeDialog($('about')));
      $('help-btn').addEventListener('click', () => openDialog($('keys')));
      $('keys-close').addEventListener('click', () => closeDialog($('keys')));
      ['drawer', 'about', 'keys', 'mail-confirm'].forEach((id) => $(id).addEventListener('click', (e) => { if (e.target === $(id)) closeDialog($(id)); }));
      $('prev-card').addEventListener('click', () => step(-1));
      $('next-card').addEventListener('click', () => step(1));
      $('flip').addEventListener('click', () => setFlip(!state.flipped));
      $('theme-toggle').addEventListener('click', () => setTheme(currentTheme() === 'dark' ? 'light' : 'dark'));
      listen(mq, 'change', applyTheme);

      // tooltips: after the first one, the rest are instant for a moment
      let tipOff = 0;
      listen(root, 'pointerover', (e) => {
        if (e.target.closest && e.target.closest('[data-tip]')) { shell.classList.add('tip-warm'); clearTimeout(tipOff); tipOff = setTimeout(() => shell.classList.remove('tip-warm'), 700); }
      });

      // keyboard
      listen(root, 'keydown', (e) => {   // standalone: the whole page; embedded: only while focus is inside the component
        const t = e.target, typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
        const dialogOpen = !!root.querySelector('dialog[open]');
        if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          if (dialogOpen) return;
          noAnim(focusSearch);
          return;
        }
        if (e.key === 'Escape') {
          if (dialogOpen) { if (embed) { e.preventDefault(); closeDialog(root.querySelector('dialog[open]')); } return; }   // the browser closes modal dialogs itself
          if (openKey) { e.preventDefault(); closePop(true); return; }
          if ($('search-pop').classList.contains('open') || shell.classList.contains('search-on')) { endSearch(); return; }
          if (typing && t !== $('search')) { t.blur(); return; }
          if (state.panel) { e.preventDefault(); noAnim(closeLead); }
          return;
        }
        if (typing || dialogOpen || e.metaKey || e.ctrlKey || e.altKey) return;
        const k = e.key;
        if (k === '/') { e.preventDefault(); noAnim(focusSearch); }
        else if (k === '?') { e.preventDefault(); openDialog($('keys')); }
        else if (k === '[') { e.preventDefault(); if (!isPhone()) noAnim(() => setSide(!sideOpen(), true)); }
        else if (k === 'j' || k === 'J' || k === 'k' || k === 'K') {
          e.preventDefault();
          shell.classList.add('kbd');
          noAnim(() => step(k.toLowerCase() === 'j' ? 1 : -1, 'jump'));
          setTimeout(() => shell.classList.remove('kbd'), 100);
        } else if (state.selected && state.panel) {
          if (k >= '1' && k <= '5') { e.preventDefault(); shell.classList.add('kbd'); noAnim(() => setStatus(STATUSES[+k - 1])); setTimeout(() => shell.classList.remove('kbd'), 100); }
          else if (k === 'n' || k === 'N') { e.preventDefault(); $('lp-note-in').focus(); }
          else if (k === 'f' || k === 'F') { e.preventDefault(); setFollow(addDays(1), true); }
          else if (k === 'p' || k === 'P') { e.preventDefault(); openCard(); }
        }
      });
      if (!embed) { listen(mqPhone, 'change', applyMode); listen(mqDesk, 'change', applyMode); }

      renderPresets();
      setFlip(false);
    }

    function renderFresh() {
      const el = $('fresh');
      const src = meta.sources || [];
      const chips = src.map((s) => `<span class="src"><i></i>${esc(s.city)} <em>${s.date_min ? esc(fmtDate(s.date_min, false)) + ' – ' + esc(fmtDate(s.date_max, false)) : 'none in window'}</em></span>`);
      const fails = (meta.sources_failed || []).map((s) => `<span class="src off" title="Portal blocked automated access this run">${esc(s.city)} <em>unavailable</em></span>`);
      el.innerHTML = `<span class="src total">${meta.total_rows.toLocaleString('en-US')} ${meta.stage === 'application' ? 'filings' : 'permits'}</span>` + chips.join('') + fails.join('');
    }
    function renderFooter() {
      const links = (meta.sources || []).map((s) => `<a href="${esc(s.credit.url)}" target="_blank" rel="noopener">${esc(s.credit.name)}</a>`);
      $('credits').innerHTML = links.length ? 'Data: ' + links.join('; ') + '. Prototype; no mail is sent.' : 'Prototype; no mail is sent.';
    }

    // ---- boot ------------------------------------------------------------------------------------------------
    if (!embed) {
      try { const t = localStorage.getItem('pp-theme'); if (t === 'dark' || t === 'light') themeEl.setAttribute('data-theme', t); } catch (e) { /* ignore */ }
      doc.title = CONFIG.title || CONFIG.brandName;
    }
    root.querySelector('.top h1').textContent = CONFIG.brandName;
    root.querySelector('.mark span').textContent = CONFIG.logoText;
    if (CONFIG.aboutText) $('about-lead').textContent = CONFIG.aboutText;
    paintIcons(root);
    root.querySelectorAll('.pop').forEach((p) => { p.hidden = false; });
    $('search-pop').hidden = false;
    $('biz').value = state.biz;
    $('phone').value = state.phone;
    $('url').value = state.url;
    $('radius').value = state.radius;
    $('radius-out').textContent = state.radius + ' mi';
    if (CONFIG.accent) applyAccent(CONFIG.accent);
    setSide(sideDefault(), false);
    initSheet();
    if (isPhone()) setSnap('peek');
    applyTheme();
    // size changes: the window (standalone) or the component box (embedded) re-lays out the sheet, popovers and list
    const modeOf = () => (fw() < 768 ? 'p' : fw() < 1024 ? 't' : 'd');
    if (embed && win.ResizeObserver) {
      let mode = modeOf();
      const ro = new win.ResizeObserver(() => {
        const m = modeOf();
        if (m !== mode) { mode = m; applyMode(); }
        resizeFns.forEach((fn) => fn());
      });
      ro.observe(frameEl);
      offs.push(() => ro.disconnect());
    } else listen(win, 'resize', () => resizeFns.forEach((fn) => fn()));
    const loaded = load().then(() => {
      const have = new Set((meta.sources || []).map((s) => s.city));
      if (options.places && options.places.length) presets = options.places.map((p) => ({ id: p.id, label: p.name, city: p.name, region: p.region || 'Other', lat: p.lat, lng: p.lng }));
      else {
        if (CONFIG.presets) presets = CONFIG.presets.filter((p) => rows.some((r) => r.city === p.city));   // only places that have data
        else if (have.size) presets = PRESETS.filter((p) => have.has(p.city));
        if (!presets.length && !embed) presets = CONFIG.presets || PRESETS;
      }
      const start = presets.find((p) => p.id === CONFIG.defaultPlace) || presets[0];
      if (options.center) {
        const c = options.center, near = presets.find((p) => miles(p.lat, p.lng, c.lat, c.lng) < 0.3);
        state.preset = near ? near.id : null;
        state.placeLabel = near ? near.label : (options.placeLabel || 'Your area');
        state.base = { lat: c.lat, lng: c.lng };
      } else if (start) {
        state.preset = start.id;
        state.placeLabel = start.label;
        state.base = { lat: start.lat, lng: start.lng };
      }
      renderFresh();
      renderFooter();
      if (!rows.some((r) => r.contractor)) $('tab-builders').hidden = true;   // no contractor data (planning filings): nothing to list
      initMap();
      wire();
      compute();
    }).catch((err) => {
      $('fresh').textContent = 'Could not load permit data: ' + err.message;
      $('skel').hidden = true;
      $('empty').hidden = false;
      $('empty-text').textContent = 'Could not load permit data. ' + err.message;
      $('empty-act').hidden = true;
      throw err;
    });
    loaded.catch(() => {});
    store.start();

    // ---- public handle ----------------------------------------------------------------------------------------------
    function applyAccent(c) {
      const st = themeEl.style, keys = ['--accent', '--accent-ink', '--btn', '--s-new', '--accent-soft'];
      if (!c) { keys.forEach((p) => st.removeProperty(p)); } else {
        ['--accent', '--accent-ink', '--btn', '--s-new'].forEach((p) => st.setProperty(p, c));
        st.setProperty('--accent-soft', `color-mix(in srgb, ${c} 12%, transparent)`);
      }
      if (map) { styleOverlays(); paintDots(); if (baseMarker) baseMarker.setIcon(pinIcon()); }
    }
    function setTrade(t) {
      if (!meta) { state.trade = t; return true; }
      if (!meta.trades[t]) return false;
      if (t === state.trade) return true;
      state.trade = t;
      state.selected = null; state.panel = false;
      $('trade-label').textContent = meta.trades[t];
      refresh();
      return true;
    }
    function setOptions(o) {
      if (o.businessName != null) { state.biz = o.businessName; $('biz').value = state.biz; }
      if (o.phone != null) { state.phone = o.phone; $('phone').value = state.phone; }
      if (o.url != null) { state.url = o.url; $('url').value = state.url; }
      if ('accent' in o) applyAccent(o.accent);
      if (o.brandName != null) root.querySelector('.top h1').textContent = o.brandName;
      if (o.logoText != null) root.querySelector('.mark span').textContent = o.logoText;
      if (o.theme === 'light' || o.theme === 'dark') setTheme(o.theme);
      else if (o.theme === 'auto') { themeEl.removeAttribute('data-theme'); applyTheme(); }
      renderPostcard();
    }
    function destroy() {
      destroyed = true;
      offs.forEach((f) => f()); offs.length = 0;
      [pending, tipTimer, warmTimer, savedTimer].forEach((t) => clearTimeout(t));
      toastList.forEach((el) => clearTimeout(el._t));
      store.stop();
      if (map) { try { map.remove(); } catch (e) { /* already gone */ } map = null; }
    }
    const api = {
      loaded,
      setTrade, setOptions, destroy,
      setCenter(lat, lng, label) { if (map) setBase(lat, lng, null, true, label); },
      setRadius(v) { if (map) setRadius(v); else state.radius = clamp(Math.round(v), 2, 25); },
      state: () => ({ trade: state.trade, radius: state.radius, base: Object.assign({}, state.base), leads: matches.length })
    };
    return api;
  }   // end createPermitMap

  if (PP_EMBED) return { createPermitMap, util: UTIL, normalizeRec };
  createPermitMap(document, {
    config: window.PP_CONFIG, claude: window.claude, noTiles: !!window.PP_NO_TILES, basemap: window.PP_BASEMAP
  });
})(false);
