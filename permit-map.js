/*! permit-map.js v1.0.0: drop-in <permit-map> web component (Shadow DOM). Leaflet 1.9 (BSD-2) loads from cdnjs; icons are Lucide (ISC).
    Built from the Permit Postcards app by embed/build_embed.py; see embed/README.md. */
(function () {
'use strict';
if (window.PermitMap && window.PermitMap.version) return;
const VERSION = "1.0.0";
const CSS_TEXT = ":host { all: initial; display: block; position: relative; contain: content; width: 100%; height: 720px; min-height: 480px; }\n:host([hidden]) { display: none; }\n:host {\n--bg: #F4F4F2;\n--surface: #FFFFFF;\n--sunk: #F0F0ED;\n--hair: #E6E6E2;\n--hair-strong: #D3D3CE;\n--text: #1B1D1F;\n--muted: #62666B;\n--faint: #9A9EA3;\n--accent: #F26B1D;\n--accent-ink: #C4510C;\n--accent-soft: rgba(242, 107, 29, .10);\n--btn: #C4510C;\n--on-btn: #FFFFFF;\n--link: #2F6FDB;\n--s-new: var(--accent); --s-contacted: #2F6FDB; --s-quoting: #D9A400; --s-won: #2E8B57; --s-lost: var(--faint);\n--t-hot: var(--accent); --t-warm: #D9A400; --t-cool: var(--faint);\n--dot: #C4C7CB;\n--water: #E3E6E9; --land: #F1F1EF; --covered: #E6E6E3;\n--shadow: 0 1px 2px rgba(20, 21, 26, .08), 0 8px 24px -6px rgba(20, 21, 26, .20);\n--shadow-edge: -8px 0 24px -10px rgba(20, 21, 26, .22);\n--sans: \"Geist\", system-ui, -apple-system, \"Segoe UI\", sans-serif;\n--mono: \"Geist Mono\", ui-monospace, \"SF Mono\", Menlo, Consolas, monospace;\n--r-sm: 6px; --r-md: 10px;\n--ease: cubic-bezier(0.23, 1, 0.32, 1);\n--top-h: 52px;\n--side-w: 360px;\n--card-paper: #F6F2EA; --card-ink: #1B1D1F; --card-pencil: #5F6368; --card-band: #1B1D1F; --card-accent: #C4510C; --card-stamp: #E05E12;\ncolor-scheme: light;\n}\n@media (prefers-color-scheme: dark) {\n:host(:not([data-theme=\"light\"])) {\n--bg: #111315; --surface: #181A1D; --sunk: #1F2225; --hair: #2A2D31; --hair-strong: #3A3E43;\n--text: #E8E9EA; --muted: #9BA0A6; --faint: #7C8187;\n--accent: #FF7A2E; --accent-ink: #FF8A47; --accent-soft: rgba(255, 122, 46, .14); --btn: #FF7A2E; --on-btn: #111315;\n--link: #7FA8F5; --s-contacted: #5C93F0; --s-quoting: #E6B800; --s-won: #4FBF86; --t-warm: #E6B800;\n--dot: #3A3E43; --water: #0E1113; --land: #1A1D20; --covered: #23272B;\n--shadow: 0 1px 2px rgba(0, 0, 0, .5), 0 10px 28px -6px rgba(0, 0, 0, .6);\n--shadow-edge: -8px 0 24px -10px rgba(0, 0, 0, .6);\ncolor-scheme: dark;\n}\n}\n:host([data-theme=\"dark\"]) {\n--bg: #111315; --surface: #181A1D; --sunk: #1F2225; --hair: #2A2D31; --hair-strong: #3A3E43;\n--text: #E8E9EA; --muted: #9BA0A6; --faint: #7C8187;\n--accent: #FF7A2E; --accent-ink: #FF8A47; --accent-soft: rgba(255, 122, 46, .14); --btn: #FF7A2E; --on-btn: #111315;\n--link: #7FA8F5; --s-contacted: #5C93F0; --s-quoting: #E6B800; --s-won: #4FBF86; --t-warm: #E6B800;\n--dot: #3A3E43; --water: #0E1113; --land: #1A1D20; --covered: #23272B;\n--shadow: 0 1px 2px rgba(0, 0, 0, .5), 0 10px 28px -6px rgba(0, 0, 0, .6);\n--shadow-edge: -8px 0 24px -10px rgba(0, 0, 0, .6);\ncolor-scheme: dark;\n}\n.s-new { --c: var(--s-new); } .s-contacted { --c: var(--s-contacted); } .s-quoting { --c: var(--s-quoting); }\n.s-won { --c: var(--s-won); } .s-lost { --c: var(--s-lost); }\n* { box-sizing: border-box; }\n.pp-frame {\nmargin: 0; background: var(--bg); color: var(--text);\nfont: 400 14px/1.45 var(--sans); font-variant-numeric: tabular-nums;\n-webkit-font-smoothing: antialiased; -webkit-tap-highlight-color: transparent;\n}\na { color: var(--link); text-underline-offset: 2px; }\nbutton, input, select, textarea { font: inherit; color: inherit; }\nbutton { cursor: pointer; }\n:focus-visible { outline: 2px solid var(--accent-ink); outline-offset: 2px; }\n.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }\n[hidden] { display: none !important; }\n.mono { font-family: var(--mono); }\nsvg.i { width: 16px; height: 16px; flex: none; stroke: currentColor; fill: none; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }\n[data-icon] { display: inline-flex; align-items: center; justify-content: center; flex: none; }\n.shell { display: flex; flex-direction: column; height: 100vh; height: 100dvh; min-height: 480px; position: relative; overflow: hidden; }\n.shell.no-anim *, .shell.no-anim *::before, .shell.no-anim *::after { transition: none !important; animation: none !important; }\n.icon-btn, .ctl {\nposition: relative; width: 32px; height: 32px; display: inline-grid; place-items: center; padding: 0;\nbackground: transparent; border: 0; border-radius: var(--r-sm); color: var(--muted);\ntransition: background-color 120ms, color 120ms, transform 160ms var(--ease);\n}\n.icon-btn:active, .ctl:active, .btn:active, .act:active, .kpi:active, .select-btn:active, .chip-btn:active { transform: scale(.97); }\n.btn {\nheight: 32px; padding: 0 12px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; white-space: nowrap;\nbackground: var(--btn); color: var(--on-btn); border: 1px solid transparent; border-radius: var(--r-sm); font: 500 13px/1 var(--sans);\ntransition: background-color 120ms, transform 160ms var(--ease), opacity 120ms;\n}\n.btn.ghost { background: var(--surface); color: var(--text); border-color: var(--hair-strong); }\n.btn.small { height: 28px; padding: 0 10px; font-size: 12px; }\n.btn:disabled, .icon-btn:disabled { opacity: .45; cursor: not-allowed; }\n.link-btn { background: none; border: 0; padding: 4px 0; font: 500 12px/1.2 var(--sans); color: var(--accent-ink); text-decoration: underline; text-underline-offset: 3px; text-decoration-color: transparent; }\n.link-btn:hover { text-decoration-color: currentColor; }\n@media (hover: hover) and (pointer: fine) {\n.icon-btn:hover, .ctl:hover { background: var(--sunk); color: var(--text); }\n.btn:hover { opacity: .92; }\n.btn.ghost:hover { background: var(--sunk); opacity: 1; }\n}\n[data-tip] { position: relative; }\n[data-tip]::after {\ncontent: attr(data-tip); position: absolute; z-index: 3000; left: 50%; top: calc(100% + 6px); white-space: pre; pointer-events: none;\npadding: 5px 8px; border-radius: var(--r-sm); background: var(--text); color: var(--bg); font: 500 12px/1.2 var(--sans);\nopacity: 0; visibility: hidden; transform: translate(-50%, -2px) scale(.96); transform-origin: 50% 0;\ntransition: opacity 125ms, transform 125ms var(--ease), visibility 0s 125ms;\n}\n.top-right [data-tip]::after { left: auto; right: 0; transform: translate(0, -2px) scale(.96); transform-origin: 100% 0; }\n.map-ctl [data-tip]::after { left: auto; right: calc(100% + 8px); top: 50%; transform: translate(4px, -50%) scale(.96); transform-origin: 100% 50%; }\n.d-nav [data-tip]::after { left: auto; right: 0; transform: translate(0, -2px) scale(.96); transform-origin: 100% 0; }\n.collapse-btn[data-tip]::after { left: auto; right: 0; transform: translate(0, -2px) scale(.96); transform-origin: 100% 0; }\n@media (hover: hover) and (pointer: fine) {\n[data-tip]:hover::after, [data-tip]:focus-visible::after { opacity: 1; visibility: visible; transition-delay: .3s, .3s, 0s; }\n.top-right [data-tip]:hover::after, .d-nav [data-tip]:hover::after, .collapse-btn[data-tip]:hover::after { transform: none; }\n.map-ctl [data-tip]:hover::after { transform: translate(0, -50%); }\n[data-tip]:hover::after { transform: translate(-50%, 0); }\n.tip-warm [data-tip]:hover::after { transition-duration: 0s; transition-delay: 0s; }\n}\n.top {\nflex: none; height: var(--top-h); padding: 0 12px; display: grid; grid-template-columns: 1fr minmax(260px, 520px) 1fr; align-items: center; gap: 12px;\nbackground: var(--surface); border-bottom: 1px solid var(--hair); position: relative; z-index: 1200;\n}\n.brand { display: flex; align-items: center; gap: 10px; min-width: 0; }\n.mark {\nflex: none; width: 24px; height: 24px; display: grid; place-items: center; border-radius: 4px;\nborder: 1.5px dashed var(--accent); outline: 1px solid var(--accent); outline-offset: -3.5px; transform: rotate(-3deg);\ncolor: var(--accent); font: 600 9px/1 var(--sans); letter-spacing: .02em;\n}\n.top h1 { margin: 0; font: 600 14px/1 var(--sans); letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.top-right { display: flex; align-items: center; justify-content: flex-end; gap: 4px; }\n.search-open, .search-close { display: none; }\n.select-btn {\nheight: 32px; padding: 0 8px 0 12px; display: inline-flex; align-items: center; gap: 6px; max-width: 200px;\nbackground: var(--surface); border: 1px solid var(--hair-strong); border-radius: var(--r-sm); font: 500 13px/1 var(--sans); margin-right: 4px;\ntransition: background-color 120ms, transform 160ms var(--ease);\n}\n.select-btn span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.select-btn [data-icon] { color: var(--muted); }\n@media (hover: hover) and (pointer: fine) { .select-btn:hover { background: var(--sunk); } }\n.search { position: relative; display: flex; align-items: center; height: 34px; }\n.search-ico { position: absolute; left: 10px; color: var(--faint); pointer-events: none; }\n.search input {\nwidth: 100%; height: 34px; padding: 0 56px 0 32px; background: var(--bg); border: 1px solid var(--hair); border-radius: var(--r-sm);\nfont: 400 13px/1 var(--sans); color: var(--text); transition: border-color 120ms, background-color 120ms, box-shadow 120ms;\n}\n.search input::placeholder { color: var(--muted); }\n.search input:focus { outline: none; background: var(--surface); border-color: var(--accent-ink); box-shadow: 0 0 0 3px var(--accent-soft); }\n.search kbd {\nposition: absolute; right: 8px; padding: 3px 6px; border: 1px solid var(--hair-strong); border-radius: 4px; background: var(--surface);\nfont: 500 11px/1 var(--mono); color: var(--muted); pointer-events: none;\n}\n.search-pop { position: absolute; z-index: 1600; top: calc(100% + 6px); left: 0; right: 0; }\n.listbox { display: flex; flex-direction: column; padding: 4px; max-height: min(60vh, 420px); overflow-y: auto; scrollbar-width: thin; }\n.lb-group { padding: 8px 8px 4px; font: 500 11px/1 var(--sans); letter-spacing: .06em; text-transform: uppercase; color: var(--faint); }\n.lb-item {\ndisplay: flex; align-items: center; gap: 10px; width: 100%; min-height: 36px; padding: 6px 8px; text-align: left; background: none; border: 0; border-radius: var(--r-sm); color: var(--text);\n}\n.lb-item .g { flex: none; width: 20px; height: 20px; display: grid; place-items: center; color: var(--muted); }\n.lb-item .t { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.lb-item .t small { display: block; font-size: 12px; color: var(--muted); }\n.lb-item .m { font: 400 12px/1 var(--mono); color: var(--muted); }\n.lb-item mark { background: none; color: var(--accent-ink); font-weight: 600; }\n.lb-item[aria-selected=\"true\"], .lb-item:focus-visible { background: var(--sunk); outline: none; box-shadow: inset 2px 0 0 var(--accent); }\n.lb-item[aria-current=\"true\"] .t { font-weight: 600; }\n.lb-none { padding: 16px 12px; text-align: center; color: var(--muted); font-size: 13px; }\n.pop, .search-pop {\nbackground: var(--surface); border: 1px solid var(--hair); border-radius: var(--r-md); box-shadow: var(--shadow);\nopacity: 0; visibility: hidden; transform: scale(.97); transform-origin: var(--ox, 50%) var(--oy, 0);\ntransition: opacity 160ms, transform 160ms var(--ease), visibility 0s 160ms;\n}\n.pop { position: fixed; z-index: 1500; top: 0; left: 0; }\n.pop.open, .search-pop.open { opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }\n.pop-trade { width: 280px; }\n.pop-area { width: 300px; padding: 14px; display: flex; flex-direction: column; gap: 8px; }\n.pop-settings { width: 320px; padding: 14px; display: flex; flex-direction: column; gap: 8px; }\n.pop-layers { width: 232px; padding: 6px; }\n.pop-search { display: flex; align-items: center; gap: 8px; padding: 0 12px; height: 40px; border-bottom: 1px solid var(--hair); color: var(--faint); }\n.pop-search input { flex: 1; min-width: 0; height: 100%; background: none; border: 0; outline: none; color: var(--text); font-size: 13px; }\n.f-label { font: 500 12px/1.3 var(--sans); color: var(--muted); display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }\n.f-label .hint { font-weight: 400; color: var(--faint); }\n.f-label output { font: 500 12px/1 var(--mono); color: var(--text); }\n.range-label { margin-top: 6px; }\n.field, .select-wrap select {\nwidth: 100%; height: 32px; padding: 0 10px; background: var(--surface); border: 1px solid var(--hair-strong); border-radius: var(--r-sm); font-size: 13px;\ntransition: border-color 120ms, box-shadow 120ms;\n}\n.field:focus, .select-wrap select:focus { outline: none; border-color: var(--accent-ink); box-shadow: 0 0 0 3px var(--accent-soft); }\n.field.narrow { width: 110px; }\n.f-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }\n.f-row > div { display: flex; flex-direction: column; gap: 6px; min-width: 0; }\n.select-wrap { position: relative; }\n.select-wrap select { appearance: none; -webkit-appearance: none; padding-right: 28px; }\n.select-wrap [data-icon] { position: absolute; right: 8px; top: 8px; color: var(--muted); pointer-events: none; }\ninput[type=range] { width: 100%; accent-color: var(--accent-ink); margin: 4px 0 0; }\n.facts { margin: 4px 0 0; padding: 10px 0 0; border-top: 1px solid var(--hair); display: grid; gap: 4px; font-size: 12px; }\n.facts > div { display: flex; justify-content: space-between; gap: 8px; }\n.facts dt { color: var(--muted); } .facts dd { margin: 0; font-family: var(--mono); }\n.pop-foot { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding-top: 10px; border-top: 1px solid var(--hair); }\n.save-mode { font-size: 12px; color: var(--muted); }\n.export { display: flex; flex-direction: column; gap: 6px; }\n.export-row { display: flex; flex-wrap: wrap; gap: 6px; }\n.check { display: flex; align-items: center; gap: 10px; min-height: 34px; padding: 4px 8px; border-radius: var(--r-sm); font-size: 13px; cursor: pointer; }\n.check input { position: absolute; opacity: 0; pointer-events: none; }\n.check .box { flex: none; width: 16px; height: 16px; border: 1.5px solid var(--hair-strong); border-radius: 4px; display: grid; place-items: center; transition: background-color 120ms, border-color 120ms; }\n.check input:checked + .box { background: var(--btn); border-color: var(--btn); }\n.check input:checked + .box::after { content: \"\"; width: 8px; height: 4px; border: solid var(--on-btn); border-width: 0 0 2px 2px; transform: translateY(-1px) rotate(-45deg); }\n.check input:focus-visible + .box { outline: 2px solid var(--accent-ink); outline-offset: 2px; }\n.check em { font-style: normal; font-size: 12px; color: var(--faint); }\n.check.off { opacity: .5; }\n@media (hover: hover) and (pointer: fine) { .check:hover { background: var(--sunk); } }\n.legend { margin-top: 4px; padding: 8px 8px 4px; border-top: 1px solid var(--hair); display: grid; grid-template-columns: 1fr 1fr; gap: 4px 8px; font-size: 12px; color: var(--muted); }\n.legend h4 { grid-column: 1 / -1; margin: 0; font: 500 11px/1 var(--sans); letter-spacing: .06em; text-transform: uppercase; color: var(--faint); }\n.legend > div { display: flex; align-items: center; gap: 8px; }\n.sdot { width: 8px; height: 8px; border-radius: 50%; background: var(--c); flex: none; }\n.sdot.s-lost { background: transparent; box-shadow: inset 0 0 0 1.5px var(--faint); }\n.legend .ramp { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; gap: 2px 0; }\n.legend .ramp span { grid-column: 1 / -1; }\n.legend .ramp i { grid-column: 1 / -1; height: 6px; border-radius: 3px; background: linear-gradient(90deg, #e8d9c6, #d9a066, #b0501c, #6b2a0c); }\n.legend .ramp em { font-style: normal; font-family: var(--mono); font-size: 11px; }\n.legend .ramp em:last-child { text-align: right; }\n.work { flex: 1; min-height: 0; display: flex; position: relative; }\n.stage { flex: 1; min-width: 0; position: relative; }\n#map { position: absolute; inset: 0; background: var(--water); }\n.side {\nflex: none; width: var(--side-w); background: var(--surface); border-right: 1px solid var(--hair); overflow: hidden; position: relative; z-index: 600;\ntransition: width 220ms var(--ease), border-color 220ms;\n}\n.shell[data-side=\"closed\"] .side { width: 0; border-right-color: transparent; }\n.side-inner { width: var(--side-w); height: 100%; display: flex; flex-direction: column; min-height: 0; }\n.grip { display: none; }\n.area { flex: none; display: flex; align-items: center; gap: 4px; padding: 12px 12px 8px 12px; }\n.area-btn {\nflex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 8px; text-align: left; background: none; border: 0; border-radius: var(--r-sm);\ntransition: background-color 120ms, transform 160ms var(--ease);\n}\n.area-btn > [data-icon] { color: var(--accent-ink); }\n.area-text { flex: 1; min-width: 0; display: flex; align-items: baseline; gap: 6px; overflow: hidden; white-space: nowrap; }\n.area-text b { font-weight: 600; font-size: 14px; overflow: hidden; text-overflow: ellipsis; }\n.area-text span { color: var(--muted); font-size: 13px; }\n.area-edit { font-size: 12px; font-weight: 500; color: var(--accent-ink); }\n.area-btn:active { transform: scale(.98); }\n@media (hover: hover) and (pointer: fine) { .area-btn:hover { background: var(--sunk); } }\n.kpis { flex: none; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 4px 12px 10px; }\n.kpi {\ndisplay: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 8px 10px; text-align: left; background: var(--surface);\nborder: 1px solid var(--hair); border-radius: var(--r-md); transition: background-color 120ms, border-color 120ms, transform 160ms var(--ease);\n}\n.kpi b { font: 500 20px/1.15 var(--mono); letter-spacing: -.02em; }\n.kpi span { font-size: 12px; color: var(--muted); }\n.kpi-hot b { color: var(--accent-ink); }\n.kpi[aria-pressed=\"true\"] { border-color: var(--accent-ink); background: var(--accent-soft); }\n@media (hover: hover) and (pointer: fine) { .kpi:hover { background: var(--sunk); } .kpi[aria-pressed=\"true\"]:hover { background: var(--accent-soft); } }\n.seg-scroll { flex: none; padding: 0 12px 8px; }\n.segs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2px; padding: 2px; background: var(--sunk); border-radius: 8px; }\n.segs button {\nmin-width: 0; height: 28px; padding: 0 10px; display: flex; align-items: center; justify-content: space-between; gap: 6px; white-space: nowrap;\nbackground: none; border: 0; border-radius: 6px; color: var(--muted); font: 500 12px/1 var(--sans); transition: background-color 120ms, color 120ms, box-shadow 120ms;\n}\n.segs button i { font: 400 11px/1 var(--mono); font-style: normal; color: var(--faint); }\n.segs button[aria-pressed=\"true\"] { background: var(--surface); color: var(--text); box-shadow: 0 0 0 1px var(--hair), 0 1px 1px rgba(0, 0, 0, .04); }\n.segs button[aria-pressed=\"true\"] i { color: var(--muted); }\n@media (hover: hover) and (pointer: fine) { .segs button:hover:not([aria-pressed=\"true\"]) { color: var(--text); } }\n.toolbar { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 0 12px; border-bottom: 1px solid var(--hair); }\n.sort { position: relative; display: inline-flex; align-items: center; }\n.sort select { appearance: none; -webkit-appearance: none; height: 32px; padding: 0 22px 0 0; background: none; border: 0; color: var(--text); font: 500 13px/1 var(--sans); cursor: pointer; border-radius: 4px; }\n.sort-caret { position: absolute; right: 0; color: var(--muted); pointer-events: none; }\n.tabs { display: flex; gap: 14px; }\n.tabs button { position: relative; height: 40px; padding: 0; background: none; border: 0; color: var(--muted); font: 500 13px/1 var(--sans); transition: color 120ms; }\n.tabs button i { font: 400 11px/1 var(--mono); font-style: normal; color: var(--faint); margin-left: 2px; }\n.tabs button[aria-selected=\"true\"] { color: var(--text); }\n.tabs button[aria-selected=\"true\"]::after { content: \"\"; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: var(--accent); border-radius: 2px; }\n.chips { flex: none; display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 12px 0; }\n.chip-x { display: inline-flex; align-items: center; gap: 4px; max-width: 100%; height: 24px; padding: 0 4px 0 10px; background: var(--accent-soft); color: var(--accent-ink); border: 0; border-radius: 12px; font: 500 12px/1 var(--sans); }\n.chip-x span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.chip-x [data-icon] { width: 18px; height: 18px; border-radius: 9px; }\n.chip-x svg.i { width: 12px; height: 12px; }\n@media (hover: hover) and (pointer: fine) { .chip-x:hover [data-icon] { background: rgba(0, 0, 0, .08); } }\n.note { margin: 8px 12px 0; font-size: 12px; line-height: 1.45; color: var(--muted); }\n.note.warn { padding: 8px 10px; background: var(--accent-soft); border-radius: var(--r-sm); color: var(--text); }\n.note.warn.quiet { background: none; padding: 0; color: var(--muted); }\n.prior { margin: -6px 0 0; font-size: 12px; line-height: 1.4; color: var(--muted); }\n.pane { flex: 1; min-height: 0; display: flex; flex-direction: column; }\n.list { position: relative; flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; outline: none; }\n.list-inner { position: relative; }\n.rows { position: absolute; top: 0; left: 0; right: 0; will-change: transform; }\n.row {\nposition: relative; display: grid; grid-template-columns: 18px minmax(0, 1fr) auto; grid-template-rows: 20px 18px; column-gap: 8px; align-content: center; align-items: center;\nwidth: 100%; height: 56px; padding: 0 12px 0 14px; text-align: left; background: none; border: 0; border-bottom: 1px solid var(--hair); border-radius: 0;\ntransition: background-color 100ms;\n}\n.row .dot { grid-row: 1 / 3; width: 10px; height: 10px; justify-self: center; border-radius: 50%; background: var(--c); }\n.row .dot.hot { box-shadow: 0 0 0 2px var(--surface), 0 0 0 3.5px var(--accent); }\n.row .dot.s-lost { background: transparent; box-shadow: inset 0 0 0 2px var(--faint); }\n.row .dot.s-lost.hot { box-shadow: inset 0 0 0 2px var(--faint), 0 0 0 2px var(--surface), 0 0 0 3.5px var(--accent); }\n.row .addr { font: 500 14px/20px var(--sans); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.row .val { font: 400 13px/20px var(--mono); text-align: right; }\n.row .sub { grid-column: 2 / 4; font: 400 12px/18px var(--sans); color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: flex; align-items: center; gap: 4px; }\n.row .sub .sep { color: var(--faint); }\n.row .sub .due { color: var(--accent-ink); font-weight: 500; }\n.row .sub .fire { color: var(--accent-ink); display: inline-flex; }\n.row .sub .fire svg.i { width: 12px; height: 12px; }\n.row[aria-current=\"true\"] { background: var(--accent-soft); box-shadow: inset 3px 0 0 var(--accent); }\n.row.hov { background: var(--sunk); }\n.row[aria-current=\"true\"].hov { background: var(--accent-soft); }\n.row:focus-visible { outline-offset: -2px; }\n.row { cursor: pointer; }\n.list:focus-visible .row.is-active { outline: 2px solid var(--accent); outline-offset: -2px; }\n.skel { position: absolute; inset: 0; background: var(--surface); }\n.srow { height: 56px; display: grid; grid-template-columns: 18px 1fr auto; column-gap: 8px; align-items: center; padding: 0 12px 0 14px; border-bottom: 1px solid var(--hair); }\n.srow i { width: 10px; height: 10px; border-radius: 50%; background: var(--sunk); justify-self: center; }\n.srow span { width: var(--w); height: 10px; border-radius: 5px; }\n.srow em { width: 44px; height: 10px; border-radius: 5px; }\n.srow span, .srow em, .srow i { background: linear-gradient(100deg, var(--sunk) 35%, var(--hair) 50%, var(--sunk) 65%) 100% 0 / 300% 100%; animation: sweep 1.3s linear infinite; }\n@keyframes sweep { to { background-position: -100% 0; } }\n.empty-state { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 24px; text-align: center; color: var(--muted); }\n.empty-state p { margin: 0; max-width: 28ch; font-size: 13px; }\n.empty-ico { width: 40px; height: 40px; border-radius: 20px; background: var(--sunk); }\n.empty-ico svg.i { width: 18px; height: 18px; }\n.brow { display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 8px; align-items: center; padding: 8px 8px 8px 14px; border-bottom: 1px solid var(--hair); }\n.brow .main { grid-column: 1; display: block; min-width: 0; text-align: left; background: none; border: 0; padding: 2px 0; border-radius: var(--r-sm); }\n.brow .name { display: block; font: 500 14px/20px var(--sans); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.brow .meta { display: block; font-size: 12px; line-height: 18px; color: var(--muted); }\n.brow .pline { grid-column: 1; font: 400 12px/18px var(--mono); color: var(--text); user-select: text; }\n.brow .icon-btn { grid-column: 2; grid-row: 1 / 3; }\n.brow[aria-current=\"true\"] { background: var(--accent-soft); box-shadow: inset 3px 0 0 var(--accent); }\n.b-empty { padding: 24px 16px; text-align: center; font-size: 13px; color: var(--muted); }\n@media (hover: hover) and (pointer: fine) { .row:hover { background: var(--sunk); } .row[aria-current=\"true\"]:hover { background: var(--accent-soft); } .brow:hover { background: var(--sunk); } }\n.reopen {\nposition: absolute; z-index: 500; top: 12px; left: 12px; display: none; align-items: center; gap: 8px; height: 34px; padding: 0 12px 0 10px;\nbackground: var(--surface); border: 1px solid var(--hair); border-radius: var(--r-sm); box-shadow: var(--shadow); font: 500 13px/1 var(--sans);\ntransition: transform 160ms var(--ease), background-color 120ms;\n}\n.reopen b { font: 500 12px/1 var(--mono); color: var(--muted); margin-left: 2px; }\n.reopen:active { transform: scale(.97); }\n.shell[data-side=\"closed\"] .reopen { display: inline-flex; }\n.map-hint { position: absolute; z-index: 500; top: 12px; left: 50%; transform: translateX(-50%); max-width: calc(100% - 200px); margin: 0; display: flex; align-items: center; gap: 2px; padding: 4px 4px 4px 12px; background: var(--surface); border: 1px solid var(--hair); border-radius: 999px; box-shadow: var(--shadow); font: 400 12px/1.3 var(--sans); color: var(--muted); }\n.map-hint[hidden] { display: none; }\n.hint-x { flex: none; width: 24px; height: 24px; display: grid; place-items: center; padding: 0; background: none; border: 0; border-radius: 50%; color: var(--faint); }\n.hint-x [data-icon] svg { width: 14px; height: 14px; }\n@media (hover: hover) and (pointer: fine) { .hint-x:hover { background: var(--sunk); color: var(--text); } }\n.map-ctl { position: absolute; z-index: 500; top: 12px; right: 12px; display: flex; flex-direction: column; gap: 8px; transition: transform 220ms var(--ease); }\n.ctl-group { display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--hair); border-radius: var(--r-sm); box-shadow: var(--shadow); }\n.ctl-group .ctl + .ctl { border-top: 1px solid var(--hair); border-radius: 0; }\n.ctl { width: 34px; height: 34px; color: var(--text); }\n.shell.has-detail .map-ctl { transform: translateX(-412px); }\n.shell.has-detail .leaflet-bottom.leaflet-right { transform: translateX(-400px); }\n.leaflet-bottom.leaflet-right { transition: transform 220ms var(--ease); }\n.detail {\nposition: absolute; z-index: 700; top: 0; right: 0; bottom: 0; width: 400px; max-width: 100%; display: flex; flex-direction: column;\nbackground: var(--surface); border-left: 1px solid var(--hair); box-shadow: var(--shadow-edge);\ntransform: translateX(100%); visibility: hidden; transition: transform 220ms var(--ease), visibility 0s 220ms;\n}\n.detail.open { transform: none; visibility: visible; transition-delay: 0s; }\n.d-head { flex: none; display: flex; align-items: flex-start; gap: 8px; padding: 14px 12px 12px 16px; border-bottom: 1px solid var(--hair); }\n.d-back { display: none; margin: -2px 0 0 -8px; }\n.d-title { flex: 1; min-width: 0; }\n.d-title h2 { margin: 0; font: 600 16px/22px var(--sans); letter-spacing: -.01em; overflow-wrap: anywhere; }\n.d-title p { margin: 0; font-size: 13px; color: var(--muted); }\n.d-nav { flex: none; display: flex; gap: 2px; }\n.d-scroll { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; padding: 12px 16px 24px; display: flex; flex-direction: column; gap: 14px; }\n.d-scroll .note { margin: 0; }\n.status-seg { position: relative; display: grid; grid-template-columns: repeat(5, 1fr); padding: 2px; background: var(--sunk); border-radius: 8px; }\n.status-seg .thumb {\nposition: absolute; top: 2px; bottom: 2px; left: 2px; width: calc((100% - 4px) / 5); border-radius: 6px; background: var(--surface);\nbox-shadow: 0 0 0 1px var(--hair), 0 1px 2px rgba(0, 0, 0, .06); transform: translateX(calc(var(--i, 0) * 100%)); transition: transform 220ms var(--ease);\n}\n.status-seg button {\nposition: relative; height: 32px; padding: 0 2px; display: inline-flex; align-items: center; justify-content: center; gap: 4px; background: none; border: 0; border-radius: 6px;\ncolor: var(--muted); font: 500 12px/1 var(--sans); transition: color 120ms;\n}\n.status-seg button i { width: 6px; height: 6px; border-radius: 50%; background: var(--c); flex: none; }\n.status-seg button.s-lost i { background: transparent; box-shadow: inset 0 0 0 1.5px var(--faint); }\n.status-seg button[aria-pressed=\"true\"] { color: var(--text); font-weight: 600; }\n.status-seg button:disabled { cursor: not-allowed; opacity: .55; }\n.shell.kbd .status-seg .thumb { transition: none; }\n.d-best { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; font-size: 14px; }\n.d-best b { font-weight: 600; }\n.tier {\ndisplay: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 8px 0 8px; background: var(--sunk); border: 0; border-radius: 12px;\nfont: 600 12px/1 var(--sans); color: var(--text); position: relative;\n}\n.tier i { width: 8px; height: 8px; border-radius: 50%; background: var(--tc); flex: none; }\n.t-hot { --tc: var(--t-hot); } .t-warm { --tc: var(--t-warm); } .t-cool { --tc: var(--t-cool); }\n.tier[data-tip]::after { left: 0; white-space: normal; width: max-content; max-width: 260px; transform: translate(0, -2px) scale(.96); transform-origin: 0 0; font-weight: 400; line-height: 1.4; }\n@media (hover: hover) and (pointer: fine) { .tier[data-tip]:hover::after { transform: none; } }\n.tier[data-tip]:focus::after { opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }\n.actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }\n.act {\ndisplay: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; height: 52px; padding: 0 2px; text-decoration: none;\nbackground: var(--surface); color: var(--text); border: 1px solid var(--hair-strong); border-radius: var(--r-sm); font: 500 11px/1 var(--sans);\ntransition: background-color 120ms, transform 160ms var(--ease);\n}\n.act svg.i { color: var(--muted); }\n@media (hover: hover) and (pointer: fine) { .act:hover { background: var(--sunk); } }\n.d-sec { padding-top: 14px; border-top: 1px solid var(--hair); }\n.d-sec h3 { margin: 0 0 8px; font: 500 11px/1.2 var(--sans); letter-spacing: .06em; text-transform: uppercase; color: var(--faint); display: flex; gap: 6px; }\n.d-sec h3 label { cursor: pointer; }\n.d-sec h3 i { font: 400 11px/1.2 var(--mono); font-style: normal; letter-spacing: 0; }\n.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }\n.tag { display: inline-flex; align-items: center; gap: 4px; height: 22px; padding: 0 8px; border-radius: 11px; background: var(--sunk); font: 500 12px/1 var(--sans); color: var(--text); }\n.tag.fire { background: var(--accent-soft); color: var(--accent-ink); }\n.tag svg.i { width: 12px; height: 12px; }\n.kv { margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 4px 16px; font-size: 13px; }\n.kv dt { color: var(--muted); }\n.kv dd { margin: 0; text-align: right; font-family: var(--mono); font-size: 13px; overflow-wrap: anywhere; user-select: text; }\n.desc { margin: 10px 0 0; font-size: 13px; line-height: 1.5; color: var(--muted); display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; line-clamp: 3; overflow: hidden; overflow-wrap: anywhere; }\n.desc.full { display: block; -webkit-line-clamp: unset; line-clamp: unset; }\n.desc:empty { display: none; }\n.con { display: flex; align-items: center; gap: 8px; }\n.con-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }\n.con-main b { font-weight: 500; overflow-wrap: anywhere; }\n.con-main .mono { font-size: 13px; color: var(--muted); user-select: text; }\n.follow { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }\n.follow input[type=date], .composer textarea {\nwidth: 100%; padding: 0 10px; background: var(--surface); border: 1px solid var(--hair-strong); border-radius: var(--r-sm); font-size: 13px; transition: border-color 120ms, box-shadow 120ms;\n}\n.follow input[type=date] { height: 32px; width: 170px; font-family: var(--mono); }\n.composer textarea { padding: 8px 10px; resize: vertical; min-height: 60px; line-height: 1.45; }\n.follow input:focus, .composer textarea:focus { outline: none; border-color: var(--accent-ink); box-shadow: 0 0 0 3px var(--accent-soft); }\n.quick { display: flex; flex-wrap: wrap; gap: 6px; }\n.chip-btn { height: 26px; padding: 0 10px; background: var(--surface); border: 1px solid var(--hair-strong); border-radius: 13px; font: 500 12px/1 var(--sans); transition: background-color 120ms, transform 160ms var(--ease); }\n@media (hover: hover) and (pointer: fine) { .chip-btn:hover { background: var(--sunk); } }\n.d-scroll :disabled { cursor: not-allowed; opacity: .55; }\n.composer-row { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }\n.hint { font-size: 12px; color: var(--faint); }\n.notes { list-style: none; margin: 12px 0 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }\n.notes li { padding-left: 10px; border-left: 2px solid var(--hair); }\n.n-top { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; color: var(--muted); }\n.n-top b { font-weight: 600; color: var(--text); }\n.notes p { margin: 2px 0 0; font-size: 13px; line-height: 1.5; white-space: pre-wrap; overflow-wrap: anywhere; user-select: text; }\n.notes .n-empty { border: 0; padding: 0; font-size: 13px; color: var(--muted); }\n.others { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; font-size: 13px; }\n.others li { display: grid; grid-template-columns: auto 1fr; gap: 2px 12px; color: var(--muted); }\n.others .mono { font-size: 12px; color: var(--text); }\n.d-foot { flex: none; display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 10px 16px; border-top: 1px solid var(--hair); font-size: 12px; color: var(--muted); }\n.saved { color: var(--s-won); font-weight: 500; opacity: 0; transition: opacity 200ms; }\n.saved.on { opacity: 1; }\n.toasts { position: fixed; z-index: 3500; left: 50%; bottom: calc(20px + env(safe-area-inset-bottom, 0px)); width: min(360px, calc(100vw - 24px)); height: 0; transform: translateX(-50%); pointer-events: none; }\n.toast {\nposition: absolute; left: 0; right: 0; bottom: 0; display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 8px 8px 8px 14px;\nbackground: var(--text); color: var(--bg); border-radius: var(--r-md); box-shadow: var(--shadow); font-size: 13px; pointer-events: auto;\ntransform-origin: 50% 100%; transform: translateY(calc(var(--i, 0) * -10px)) scale(calc(1 - var(--i, 0) * .05));\nopacity: calc(1 - var(--i, 0) * .3); z-index: calc(10 - var(--i, 0));\ntransition: transform 320ms var(--ease), opacity 200ms;\nanimation: toast-in 320ms var(--ease);\n}\n.toast.out { opacity: 0 !important; transform: translateY(8px) scale(.97); transition-duration: 160ms; }\n.toast span { flex: 1; min-width: 0; }\n.toast button { background: none; border: 0; padding: 6px 8px; border-radius: var(--r-sm); font: 600 13px/1 var(--sans); color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }\n:host([data-theme=\"dark\"]) .toast button { color: var(--btn); }\n.toast.err { background: #B3261E; color: #fff; }\n.toasts:hover .toast { transform: translateY(calc(var(--i, 0) * -52px)); opacity: 1; }\n@keyframes toast-in { from { opacity: 0; transform: translateY(16px) scale(.97); } }\ndialog.modal { padding: 0; border: 1px solid var(--hair); border-radius: var(--r-md); background: var(--surface); color: var(--text); box-shadow: var(--shadow); max-height: calc(100dvh - 32px); }\ndialog.modal[open] { animation: dlg-in 180ms var(--ease); }\ndialog.modal::backdrop { background: rgba(10, 11, 14, .45); }\n@keyframes dlg-in { from { opacity: 0; transform: translateY(6px) scale(.98); } }\n.card-dialog { width: min(640px, calc(100vw - 24px)); }\n.about-dialog { width: min(520px, calc(100vw - 24px)); }\n.keys-dialog { width: min(420px, calc(100vw - 24px)); }\n.m-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 8px 8px 16px; border-bottom: 1px solid var(--hair); }\n.m-head h2 { margin: 0; font: 600 14px/1.2 var(--sans); }\n.card-body { padding: 16px; background: var(--bg); }\n.card-for { margin: 0 0 12px; font: 400 12px/1.4 var(--mono); color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.card-actions { display: flex; justify-content: space-between; gap: 8px; margin-top: 16px; }\n.card-actions .btn { flex: 1; }\n.empty { margin: 12px 0 0; font-size: 13px; color: var(--muted); }\n.about-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; font-size: 13px; color: var(--muted); }\n.about-body p { margin: 0; }\n.fresh { display: flex; flex-wrap: wrap; gap: 6px; font: 400 12px/1.3 var(--mono); }\n.src { display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; border-radius: 999px; background: var(--bg); border: 1px solid var(--hair); color: var(--text); white-space: nowrap; }\n.src i { width: 6px; height: 6px; border-radius: 50%; background: var(--s-won); }\n.src em { font-style: normal; color: var(--muted); }\n.src.total { background: var(--text); color: var(--bg); border-color: var(--text); font-weight: 500; }\n.src.off { color: var(--faint); border-style: dashed; background: transparent; }\n.foot { font: 400 12px/1.6 var(--mono); }\n.keys { margin: 0; padding: 8px 16px 16px; display: grid; gap: 2px; }\n.keys > div { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 36px; border-bottom: 1px solid var(--hair); font-size: 13px; }\n.keys > div:last-child { border-bottom: 0; }\n.keys dt { flex: none; display: flex; align-items: center; gap: 4px; }\n.keys dd { margin: 0; color: var(--muted); text-align: right; }\nkbd { display: inline-block; min-width: 22px; padding: 3px 6px; text-align: center; border: 1px solid var(--hair-strong); border-bottom-width: 2px; border-radius: 5px; background: var(--surface); font: 500 11px/1 var(--mono); color: var(--text); }\n.card-wrap { perspective: 1400px; }\n.postcard { position: relative; width: 100%; aspect-ratio: 3 / 2; container-type: inline-size; transform-style: preserve-3d; transition: transform .6s cubic-bezier(.2, .7, .2, 1); }\n.postcard.flipped { transform: rotateY(180deg); }\n.face {\nposition: absolute; inset: 0; overflow: hidden; border-radius: 1.2cqw; color: var(--card-ink);\nbackface-visibility: hidden; -webkit-backface-visibility: hidden;\nbackground-color: var(--card-paper);\nbackground-image:\nurl(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .28 0 0 0 0 .2 0 0 0 .16 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\"),\nradial-gradient(120% 90% at 20% 10%, rgba(255, 255, 255, .55), transparent 60%),\nlinear-gradient(180deg, rgba(120, 95, 50, .05), rgba(120, 95, 50, .12));\nbox-shadow: 0 .4cqw 1.6cqw rgba(0, 0, 0, .22), 0 .1cqw .3cqw rgba(0, 0, 0, .18), inset 0 0 0 .25cqw rgba(60, 45, 20, .1);\n}\n.face.back { transform: rotateY(180deg); }\n.front { display: flex; flex-direction: column; padding: 5cqw 5.5cqw 0; }\n.front .tag { font: 500 2.1cqw/1 var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--card-accent); background: none; padding: 0; height: auto; border-radius: 0; }\n.front .head { margin: 2.2cqw 0 0; font: 600 6.2cqw/1.1 var(--sans); letter-spacing: -.03em; text-wrap: balance; }\n.front .offer { margin: 2.6cqw 0 0; font: 400 2.9cqw/1.4 var(--sans); color: var(--card-pencil); max-width: 36ch; }\n.front .where { margin-top: auto; padding-bottom: 2.4cqw; font: 400 1.9cqw/1.3 var(--mono); color: var(--card-pencil); }\n.front .band { margin: 0 -5.5cqw; padding: 2.6cqw 5.5cqw; background: var(--card-band); color: #F6F2EA; display: flex; align-items: baseline; justify-content: space-between; gap: 3cqw; }\n.front .biz { font: 600 4cqw/1.1 var(--sans); letter-spacing: -.02em; }\n.front .contact { font: 400 2.1cqw/1.5 var(--mono); text-align: right; white-space: nowrap; }\n.back { display: grid; grid-template-columns: 1fr 1fr; padding: 4.5cqw 5cqw; gap: 0; }\n.back .left { padding-right: 4cqw; border-right: .25cqw solid rgba(20, 21, 26, .35); display: flex; flex-direction: column; }\n.back .msg { font: 400 2.8cqw/1.45 var(--sans); margin: 0; }\n.back .msg b { font-weight: 600; }\n.back .legal { margin: auto 0 0; font: 400 1.75cqw/1.45 var(--mono); color: var(--card-pencil); }\n.back .right { padding-left: 4cqw; display: flex; flex-direction: column; align-items: flex-end; }\n.stamp {\nwidth: 15cqw; height: 18cqw; display: grid; place-items: center; text-align: center; color: var(--card-stamp);\nfont: 500 1.7cqw/1.3 var(--mono); letter-spacing: .08em; text-transform: uppercase;\nborder: .5cqw dashed var(--card-stamp); outline: .35cqw solid var(--card-stamp); outline-offset: -1.6cqw; transform: rotate(2deg);\n}\n.stamp i { display: block; font: normal 600 4.4cqw/1 var(--sans); letter-spacing: 0; margin-bottom: .6cqw; }\n.addr-block { margin-top: auto; align-self: stretch; padding-bottom: 6cqw; }\n.addr-block .to { font: 400 1.8cqw/1.3 var(--mono); color: var(--card-pencil); text-transform: uppercase; letter-spacing: .08em; }\n.addr-block .line { font: 500 3.2cqw/1.35 var(--sans); text-transform: uppercase; letter-spacing: .02em; border-bottom: .2cqw solid rgba(20, 21, 26, .3); padding: .6cqw 0; }\n.leaflet-container { font-family: var(--sans); background: var(--water); }\n.leaflet-popup-content-wrapper { background: var(--surface); color: var(--text); border-radius: var(--r-md); box-shadow: var(--shadow); }\n.leaflet-popup-tip { background: var(--surface); }\n.leaflet-popup-content { margin: 14px 16px; font: 400 13px/1.4 var(--sans); min-width: 230px; }\n.leaflet-container a.leaflet-popup-close-button { color: var(--muted); top: 6px; right: 6px; }\n.pp strong { font: 600 14px/1.3 var(--sans); display: block; }\n.pp .k { font: 500 12px/1.3 var(--sans); color: var(--accent-ink); margin: 3px 0 8px; }\n.pp dl { margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 3px 12px; font: 400 12px/1.4 var(--mono); }\n.pp dt { color: var(--muted); } .pp dd { margin: 0; }\n.pp p { margin: 8px 0 0; padding-top: 8px; border-top: 1px solid var(--hair); font-size: 12px; color: var(--muted); }\n.leaflet-control-attribution { background: color-mix(in srgb, var(--surface) 85%, transparent) !important; color: var(--muted) !important; font: 400 10.5px/1.6 var(--sans); }\n.leaflet-control-attribution a { color: var(--muted) !important; }\n.leaflet-tooltip.dot-tip {\npadding: 6px 8px; background: var(--surface); color: var(--text); border: 1px solid var(--hair); border-radius: var(--r-sm); box-shadow: var(--shadow);\nfont: 400 12px/1.35 var(--sans); white-space: nowrap;\n}\n.leaflet-tooltip.dot-tip::before { display: none; }\n.dot-tip b { font-weight: 600; }\n.dot-tip span { color: var(--muted); }\n.city-label { background: none; border: 0; }\n.city-label span {\ndisplay: inline-block; transform: translate(-50%, -50%); white-space: nowrap;\nfont: 500 10.5px/1 var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--muted);\ntext-shadow: 0 0 3px var(--land), 0 0 3px var(--land);\n}\n.pin { background: none; border: 0; }\n.pin svg { display: block; filter: drop-shadow(0 1px 1.5px rgba(0, 0, 0, .35)); }\n.leaflet-marker-draggable.pin { cursor: grab; }\n.leaflet-dragging .leaflet-marker-draggable.pin, .leaflet-marker-draggable.pin:active { cursor: grabbing; }\n.shell[data-tiles=\"light\"] .leaflet-tile-pane { filter: grayscale(1) contrast(1.05) brightness(.98); opacity: .85; }\n.shell[data-tiles=\"dark\"] .leaflet-tile-pane { filter: invert(1) grayscale(1) contrast(1.25) brightness(.9); }\n@container pp (min-width: 768px) and (max-width: 1023px) {\n.stage { position: absolute; inset: 0; }\n.side { position: absolute; left: 0; top: 0; bottom: 0; box-shadow: var(--shadow); }\n.shell[data-side=\"closed\"] .side { box-shadow: none; }\n.reopen { top: 12px; }\n.detail { width: min(400px, 100%); }\n.top { grid-template-columns: auto minmax(200px, 1fr) auto; }\n.top h1 { display: none; }\n}\n@container pp (max-width: 767px) {\n.shell { --top-h: 52px; }\n.top { grid-template-columns: auto 1fr; padding: 0 8px 0 12px; padding-top: env(safe-area-inset-top, 0px); height: calc(var(--top-h) + env(safe-area-inset-top, 0px)); }\n.top h1, .hide-phone, .collapse-btn, .reopen, .zoom-grp { display: none !important; }\n.top .search { display: none; }\n.search-open { display: inline-grid; }\n.shell.search-on .search { display: flex; position: fixed; z-index: 4000; inset: 0; height: auto; align-items: flex-start; background: var(--surface); padding: calc(8px + env(safe-area-inset-top, 0px)) 8px 0 8px; flex-wrap: wrap; align-content: flex-start; gap: 8px; }\n.shell.search-on .search input { flex: 1; height: 44px; font-size: 16px; padding-left: 36px; padding-right: 12px; width: auto; }\n.shell.search-on .search-ico { left: 20px; top: calc(8px + env(safe-area-inset-top, 0px) + 14px); }\n.shell.search-on .search kbd { display: none; }\n.shell.search-on .search-close { display: inline-grid; width: 44px; height: 44px; }\n.shell.search-on .search-pop { position: static; flex-basis: 100%; border: 0; box-shadow: none; background: none; border-top: 1px solid var(--hair); border-radius: 0; }\n.shell.search-on .search-pop .listbox { max-height: none; }\n.work { position: relative; }\n.stage { position: absolute; inset: 0; }\n.side {\nposition: fixed; z-index: 800; left: 0; right: 0; bottom: 0; top: calc(var(--top-h) + env(safe-area-inset-top, 0px) + 8px); width: auto;\nborder: 1px solid var(--hair); border-bottom: 0; border-radius: 14px 14px 0 0; box-shadow: 0 -6px 24px -8px rgba(0, 0, 0, .25);\ntransform: translateY(var(--y, 100%)); transition: transform 220ms var(--ease);\n}\n.shell[data-side=\"closed\"] .side { width: auto; border-right-color: var(--hair); }\n.side.dragging { transition: none; }\n.side-inner { width: 100%; padding-bottom: var(--hid, 0px); }\n.grip { display: flex; flex: none; justify-content: center; align-items: flex-start; width: 100%; height: 44px; margin: 0 0 -20px; padding: 10px 0 0; background: none; border: 0; position: relative; z-index: 1; cursor: grab; touch-action: none; }\n.grip i { width: 36px; height: 4px; border-radius: 2px; background: var(--hair-strong); }\n.area { padding-top: 0; }\n.side[data-snap=\"peek\"] .list, .side[data-snap=\"peek\"] .toolbar, .side[data-snap=\"peek\"] .seg-scroll { pointer-events: none; }\n.map-ctl { top: 12px; right: 12px; }\n.shell.has-detail .map-ctl, .shell.has-detail .leaflet-bottom.leaflet-right { transform: none; }\n.leaflet-bottom.leaflet-right, .leaflet-bottom.leaflet-left { margin-bottom: 0; }\n.detail {\nposition: fixed; z-index: 900; left: 0; right: 0; bottom: 0; top: calc(var(--top-h) + env(safe-area-inset-top, 0px)); width: auto; max-width: none; border-left: 0;\ntransform: translateY(100%); padding-bottom: env(safe-area-inset-bottom, 0px);\n}\n.detail.open { transform: none; }\n.d-back { display: inline-grid; }\n.d-close { display: none; }\n.icon-btn, .ctl, .btn, .act, .chip-btn, .select-btn, .lb-item, .check, .kpi, .segs button, .status-seg button, .tabs button, .area-btn, .sort select { min-height: 44px; }\n.icon-btn, .ctl { min-width: 44px; }\n.btn.small { min-height: 44px; }\n.chip-btn { min-height: 44px; padding: 0 14px; border-radius: 22px; }\n.segs button { height: 44px; }\n.status-seg button { height: 44px; }\n.field, .select-wrap select, .follow input[type=date], .composer textarea, .pop-search input { font-size: 16px; }\n.field, .select-wrap select, .follow input[type=date] { height: 44px; }\n.select-wrap [data-icon] { top: 14px; }\n.follow input[type=date] { width: 100%; }\n.row { height: 56px; min-height: 56px; }\n.tabs button { height: 44px; }\n.toasts { bottom: calc(132px + env(safe-area-inset-bottom, 0px)); }\n.pop-trade, .pop-area, .pop-settings, .pop-layers { max-width: calc(100vw - 16px); }\n.actions { grid-template-columns: repeat(4, 1fr); }\n.act { height: 56px; }\n}\n@media (prefers-reduced-motion: reduce) {\n.side, .map-ctl, .leaflet-bottom.leaflet-right, .status-seg .thumb, .postcard { transition: none; }\n.detail { transform: none !important; opacity: 0; transition: opacity 120ms, visibility 0s 120ms; }\n.detail.open { opacity: 1; transition: opacity 120ms; }\n.pop, .search-pop { transform: none; transition: opacity 120ms, visibility 0s 120ms; }\n.pop.open, .search-pop.open { transition: opacity 120ms; }\ndialog.modal[open] { animation: none; }\n.toast { animation: none; transition: opacity 160ms; transform: none; }\n.srow span, .srow em, .srow i { animation: none; }\n}\n.detail:focus { outline: none; }\n.pp-frame { container: pp / inline-size; position: relative; width: 100%; height: 100%; overflow: hidden; contain: layout paint; isolation: isolate; }\n.shell { height: 100%; min-height: 0; }\n.toasts { width: min(360px, calc(100% - 24px)); }\ndialog.modal { position: absolute; inset: 0; z-index: 4500; max-height: calc(100% - 24px); box-shadow: var(--shadow), 0 0 0 4000px rgba(10, 11, 14, .45); }\n.card-dialog { width: min(640px, calc(100% - 24px)); }\n.about-dialog { width: min(520px, calc(100% - 24px)); }\n.keys-dialog { width: min(420px, calc(100% - 24px)); }\n.pop-trade, .pop-area, .pop-settings, .pop-layers { max-width: calc(100% - 16px); }\n.pp-error { position: absolute; inset: 0; z-index: 5000; display: grid; place-content: center; justify-items: center; gap: 12px; padding: 24px; text-align: center; background: var(--bg); }\n.pp-error p { margin: 0; max-width: 40ch; color: var(--muted); }\n.leaflet-image-layer,.leaflet-layer,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-pane,.leaflet-pane>canvas,.leaflet-pane>svg,.leaflet-tile,.leaflet-tile-container,.leaflet-zoom-box{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:0 0}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important}.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer{max-width:none!important;max-height:none!important;width:auto;padding:0}.leaflet-container img.leaflet-tile{mix-blend-mode:plus-lighter}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51,181,229,.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-bottom,.leaflet-top{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity .2s linear;-moz-transition:opacity .2s linear;transition:opacity .2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}svg.leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform .25s cubic-bezier(0,0,.25,1);-moz-transition:-moz-transform .25s cubic-bezier(0,0,.25,1);transition:transform .25s cubic-bezier(0,0,.25,1)}.leaflet-pan-anim .leaflet-tile,.leaflet-zoom-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-control,.leaflet-popup-pane{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-image-layer,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-image-layer.leaflet-interactive,.leaflet-marker-icon.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline-offset:1px}.leaflet-container a{color:#0078a8}.leaflet-zoom-box{border:2px dotted #38f;background:rgba(255,255,255,.5)}.leaflet-container{font-family:\"Helvetica Neue\",Arial,Helvetica,sans-serif;font-size:12px;font-size:.75rem;line-height:1.5}.leaflet-bar{box-shadow:0 1px 5px rgba(0,0,0,.65);border-radius:4px}.leaflet-bar a{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:#000}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:focus,.leaflet-bar a:hover{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:bold 18px 'Lucida Console',Monaco,monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px rgba(0,0,0,.4);background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(images/layers.png);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(images/layers-2x.png);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block;font-size:13px;font-size:1.08333em}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(images/marker-icon.png)}.leaflet-container .leaflet-control-attribution{background:#fff;background:rgba(255,255,255,.8);margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333;line-height:1.4}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:focus,.leaflet-control-attribution a:hover{text-decoration:underline}.leaflet-attribution-flag{display:inline!important;vertical-align:baseline!important;width:1em;height:.6669em}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;white-space:nowrap;-moz-box-sizing:border-box;box-sizing:border-box;background:rgba(255,255,255,.8);text-shadow:1px 1px #fff}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-bar,.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers{box-shadow:none}.leaflet-touch .leaflet-bar,.leaflet-touch .leaflet-control-layers{border:2px solid rgba(0,0,0,.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 24px 13px 20px;line-height:1.3;font-size:13px;font-size:1.08333em;min-height:1px}.leaflet-popup-content p{margin:17px 0;margin:1.3em 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-top:-1px;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;pointer-events:auto;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:#fff;color:#333;box-shadow:0 3px 14px rgba(0,0,0,.4)}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;border:none;text-align:center;width:24px;height:24px;font:16px/24px Tahoma,Verdana,sans-serif;color:#757575;text-decoration:none;background:0 0}.leaflet-container a.leaflet-popup-close-button:focus,.leaflet-container a.leaflet-popup-close-button:hover{color:#585858}.leaflet-popup-scrolled{overflow:auto}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto}.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px rgba(0,0,0,.4)}.leaflet-tooltip.leaflet-interactive{cursor:pointer;pointer-events:auto}.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before,.leaflet-tooltip-top:before{position:absolute;pointer-events:none;border:6px solid transparent;background:0 0;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}@media print{.leaflet-control{-webkit-print-color-adjust:exact;print-color-adjust:exact}}";
const TEMPLATE_HTML = "<div class=\"pp-frame\"><div class=\"shell\" id=\"shell\"><header class=\"top\"><div class=\"brand\"><span class=\"mark\" aria-hidden=\"true\"><span>PP</span></span><h1>Permit Postcards</h1></div><div class=\"search\" id=\"search-wrap\"><span class=\"search-ico\" data-icon=\"search\"></span><input id=\"search\" type=\"text\" role=\"combobox\" aria-expanded=\"false\" aria-controls=\"search-list\" aria-autocomplete=\"list\" aria-label=\"Search address, city or permit number\" placeholder=\"Search address, city or permit #\" autocomplete=\"off\" spellcheck=\"false\"><kbd id=\"search-kbd\">\u2318K</kbd><button type=\"button\" class=\"icon-btn search-close\" id=\"search-close\" aria-label=\"Close search\"><span data-icon=\"x\"></span></button><div class=\"search-pop\" id=\"search-pop\" hidden><div class=\"listbox\" id=\"search-list\" role=\"listbox\" aria-label=\"Search results\"></div></div></div><div class=\"top-right\"><button type=\"button\" class=\"icon-btn search-open\" id=\"search-open\" aria-label=\"Search\"><span data-icon=\"search\"></span></button><button type=\"button\" class=\"select-btn\" id=\"trade-btn\" aria-haspopup=\"listbox\" aria-expanded=\"false\" aria-controls=\"trade-pop\"><span id=\"trade-label\">Trade</span><span data-icon=\"chevronDown\"></span></button><button type=\"button\" class=\"icon-btn\" id=\"settings-btn\" aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-controls=\"settings-pop\" data-tip=\"Settings\" aria-label=\"Settings\"><span data-icon=\"settings\"></span></button><button type=\"button\" class=\"icon-btn hide-phone\" id=\"help-btn\" data-tip=\"Shortcuts  ?\" aria-label=\"Keyboard shortcuts\"><span data-icon=\"helpCircle\"></span></button><button type=\"button\" class=\"icon-btn\" id=\"theme-toggle\" data-tip=\"Theme\" aria-label=\"Switch colour theme\"><span data-icon=\"moon\"></span></button></div></header><div class=\"work\" id=\"work\"><aside class=\"side\" id=\"side\" aria-label=\"Leads\"><div class=\"side-inner\"><button type=\"button\" class=\"grip\" id=\"grip\" aria-label=\"Lead list size\" aria-expanded=\"false\" aria-controls=\"list\"><i></i></button><div class=\"area\"><button type=\"button\" class=\"area-btn\" id=\"area-btn\" aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-controls=\"area-pop\"><span data-icon=\"mapPin\"></span><span class=\"area-text\"><b id=\"area-place\">\u2013</b><span id=\"area-radius\"></span></span><span class=\"area-edit\">Edit</span></button><button type=\"button\" class=\"icon-btn collapse-btn\" id=\"side-collapse\" data-tip=\"Hide list  [\" aria-label=\"Hide the lead list\" aria-controls=\"side\"><span data-icon=\"panelLeft\"></span></button></div><div class=\"kpis\" id=\"kpis\" role=\"group\" aria-label=\"Quick filters\"><button type=\"button\" class=\"kpi\" id=\"kpi-new\" data-f=\"new\" aria-pressed=\"false\"><b id=\"k-new\">\u2013</b><span>New</span></button><button type=\"button\" class=\"kpi kpi-hot\" id=\"kpi-hot\" data-f=\"hot\" aria-pressed=\"false\"><b id=\"k-hot\">\u2013</b><span>Hot</span></button><button type=\"button\" class=\"kpi\" id=\"kpi-due\" data-f=\"due\" aria-pressed=\"false\" title=\"Follow-ups due today or overdue\"><b id=\"k-due\">\u2013</b><span>Due</span></button></div><div class=\"seg-scroll\"><div class=\"segs\" id=\"segs\" role=\"group\" aria-label=\"Show leads by status\"><button type=\"button\" data-s=\"all\" aria-pressed=\"true\">All <i id=\"n-all\">\u2013</i></button><button type=\"button\" data-s=\"new\" aria-pressed=\"false\">New <i id=\"n-new\">\u2013</i></button><button type=\"button\" data-s=\"contacted\" aria-pressed=\"false\">Contacted <i id=\"n-contacted\">\u2013</i></button><button type=\"button\" data-s=\"quoting\" aria-pressed=\"false\">Quoting <i id=\"n-quoting\">\u2013</i></button><button type=\"button\" data-s=\"won\" aria-pressed=\"false\">Won <i id=\"n-won\">\u2013</i></button><button type=\"button\" data-s=\"lost\" aria-pressed=\"false\">Lost <i id=\"n-lost\">\u2013</i></button></div></div><div class=\"toolbar\"><label class=\"sort\"><span class=\"sr\">Sort by</span><select id=\"sort\"><option value=\"best\">Best leads</option><option value=\"date\">Newest</option><option value=\"val\">Biggest project</option><option value=\"follow\">Follow-up date</option></select><span class=\"sort-caret\" data-icon=\"chevronDown\"></span></label><div class=\"tabs\" role=\"tablist\" aria-label=\"Show\"><button type=\"button\" role=\"tab\" id=\"tab-leads\" aria-selected=\"true\" aria-controls=\"pane-leads\" data-t=\"leads\">Leads <i id=\"tab-leads-n\"></i></button><button type=\"button\" role=\"tab\" id=\"tab-builders\" aria-selected=\"false\" aria-controls=\"pane-builders\" data-t=\"builders\" tabindex=\"-1\">Builders <i id=\"tab-builders-n\"></i></button></div></div><div class=\"chips\" id=\"chips\" hidden></div><p class=\"note warn\" id=\"store-note\" role=\"status\" hidden></p><div class=\"pane\" id=\"pane-leads\" role=\"tabpanel\" aria-labelledby=\"tab-leads\"><div class=\"list\" id=\"list\" role=\"listbox\" aria-label=\"Leads\" tabindex=\"0\"><div class=\"list-inner\" id=\"list-inner\"><div class=\"rows\" id=\"rows\"></div></div><div class=\"skel\" id=\"skel\" aria-hidden=\"true\"><div class=\"srow\"><i></i><span style=\"--w:62%\"></span><em></em></div><div class=\"srow\"><i></i><span style=\"--w:48%\"></span><em></em></div><div class=\"srow\"><i></i><span style=\"--w:70%\"></span><em></em></div><div class=\"srow\"><i></i><span style=\"--w:55%\"></span><em></em></div><div class=\"srow\"><i></i><span style=\"--w:66%\"></span><em></em></div><div class=\"srow\"><i></i><span style=\"--w:44%\"></span><em></em></div><div class=\"srow\"><i></i><span style=\"--w:58%\"></span><em></em></div><div class=\"srow\"><i></i><span style=\"--w:52%\"></span><em></em></div></div><div class=\"empty-state\" id=\"empty\" hidden><span class=\"empty-ico\" data-icon=\"mapPin\"></span><p id=\"empty-text\">No leads here.</p><button type=\"button\" class=\"btn small\" id=\"empty-act\">Widen the radius</button></div></div></div><div class=\"pane\" id=\"pane-builders\" role=\"tabpanel\" aria-labelledby=\"tab-builders\" hidden><div class=\"list\" id=\"blist\"></div></div></div></aside><main class=\"stage\" id=\"stage\"><div id=\"map\" role=\"region\" aria-label=\"Map of permits\"></div><p class=\"map-hint\" id=\"map-hint\" hidden><span>Click the map or drag the pin to move your area.</span><button type=\"button\" class=\"hint-x\" id=\"map-hint-x\" aria-label=\"Dismiss tip\"><span data-icon=\"x\"></span></button></p><button type=\"button\" class=\"reopen\" id=\"side-open\" aria-controls=\"side\"><span data-icon=\"panelLeft\"></span><span>Leads <b id=\"reopen-n\"></b></span></button><div class=\"map-ctl\" id=\"map-ctl\"><div class=\"ctl-group zoom-grp\"><button type=\"button\" class=\"ctl\" id=\"zoom-in\" data-tip=\"Zoom in\" aria-label=\"Zoom in\"><span data-icon=\"plus\"></span></button><button type=\"button\" class=\"ctl\" id=\"zoom-out\" data-tip=\"Zoom out\" aria-label=\"Zoom out\"><span data-icon=\"minus\"></span></button></div><div class=\"ctl-group\"><button type=\"button\" class=\"ctl\" id=\"recenter\" data-tip=\"Back to my area\" aria-label=\"Back to my area\"><span data-icon=\"crosshair\"></span></button><button type=\"button\" class=\"ctl\" id=\"layers-btn\" data-tip=\"Map layers\" aria-label=\"Map layers\" aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-controls=\"layers-pop\"><span data-icon=\"layers\"></span></button></div></div></main><aside class=\"detail\" id=\"lead-panel\" tabindex=\"-1\" aria-label=\"Lead details\" aria-hidden=\"true\"><div class=\"d-head\"><button type=\"button\" class=\"icon-btn d-back\" id=\"lp-back\" aria-label=\"Back to the list\"><span data-icon=\"chevronLeft\"></span></button><div class=\"d-title\"><h2 id=\"lp-addr\"></h2><p id=\"lp-city\"></p></div><div class=\"d-nav\"><button type=\"button\" class=\"icon-btn\" id=\"lp-prev\" data-tip=\"Previous  K\" aria-label=\"Previous lead\"><span data-icon=\"chevronLeft\"></span></button><button type=\"button\" class=\"icon-btn\" id=\"lp-next\" data-tip=\"Next  J\" aria-label=\"Next lead\"><span data-icon=\"chevronRight\"></span></button><button type=\"button\" class=\"icon-btn d-close\" id=\"lp-close\" data-tip=\"Close  Esc\" aria-label=\"Close lead\"><span data-icon=\"x\"></span></button></div></div><div class=\"d-scroll\" id=\"d-scroll\"><p class=\"note warn\" id=\"lp-notice\" role=\"status\" hidden></p><div class=\"status-seg\" id=\"lp-status\" role=\"group\" aria-label=\"Status\" style=\"--i:0\"><span class=\"thumb\" aria-hidden=\"true\"></span><button type=\"button\" class=\"s-new\" data-s=\"new\" aria-pressed=\"false\"><i></i>New</button><button type=\"button\" class=\"s-contacted\" data-s=\"contacted\" aria-pressed=\"false\"><i></i>Contacted</button><button type=\"button\" class=\"s-quoting\" data-s=\"quoting\" aria-pressed=\"false\"><i></i>Quoting</button><button type=\"button\" class=\"s-won\" data-s=\"won\" aria-pressed=\"false\"><i></i>Won</button><button type=\"button\" class=\"s-lost\" data-s=\"lost\" aria-pressed=\"false\"><i></i>Lost</button></div><p class=\"prior\" id=\"lp-prior\" hidden></p><div class=\"d-best\" id=\"lp-best\"></div><div class=\"actions\"><button type=\"button\" class=\"act\" id=\"lp-card\"><span data-icon=\"mail\"></span>Postcard</button><a class=\"act\" id=\"lp-dir\" href=\"#\" target=\"_blank\" rel=\"noopener\"><span data-icon=\"navigation\"></span>Directions</a><a class=\"act\" id=\"lp-street\" href=\"#\" target=\"_blank\" rel=\"noopener\"><span data-icon=\"eye\"></span>Street view</a><button type=\"button\" class=\"act\" id=\"lp-copy\"><span data-icon=\"copy\"></span><span id=\"lp-copy-l\">Copy</span></button></div><section class=\"d-sec\"><h3>Project</h3><div class=\"tags\" id=\"lp-kinds\"></div><dl class=\"kv\" id=\"lp-kv\"></dl><p class=\"desc\" id=\"lp-desc\"></p><button type=\"button\" class=\"link-btn\" id=\"lp-more\" hidden>More</button></section><section class=\"d-sec\" id=\"lp-hood-sec\" hidden><h3>Neighborhood</h3><dl class=\"kv\" id=\"lp-hood\"></dl></section><section class=\"d-sec\" id=\"lp-con-sec\" hidden><h3>Contractor</h3><div class=\"con\"><div class=\"con-main\"><b id=\"lp-con-name\"></b><span class=\"mono\" id=\"lp-con-phone\"></span></div><button type=\"button\" class=\"icon-btn\" id=\"lp-con-copy\" data-tip=\"Copy phone\" aria-label=\"Copy contractor phone\"><span data-icon=\"copy\"></span></button></div></section><section class=\"d-sec\"><h3><label for=\"lp-follow\">Follow up</label></h3><div class=\"follow\"><input id=\"lp-follow\" type=\"date\"><div class=\"quick\" id=\"lp-quick\"><button type=\"button\" class=\"chip-btn\" data-d=\"1\">Tomorrow</button><button type=\"button\" class=\"chip-btn\" data-d=\"7\">Next week</button><button type=\"button\" class=\"chip-btn\" data-d=\"clear\">Clear</button></div></div></section><section class=\"d-sec\"><h3><label for=\"lp-note-in\">Notes</label></h3><div class=\"composer\"><textarea id=\"lp-note-in\" rows=\"2\" maxlength=\"2000\" placeholder=\"Left a voicemail, quote sent\u2026\"></textarea><div class=\"composer-row\"><span class=\"hint\">\u2318\u21b5 to add</span><button type=\"button\" class=\"btn small\" id=\"lp-note-add\">Add note</button></div></div><ul class=\"notes\" id=\"lp-notes\"></ul></section><section class=\"d-sec\" id=\"lp-others-sec\" hidden><h3>Other permits here <i id=\"lp-others-n\"></i></h3><ul class=\"others\" id=\"lp-others-list\"></ul></section></div><div class=\"d-foot\"><span id=\"lp-foot\"></span><span class=\"saved\" id=\"lp-saved\" aria-live=\"polite\"></span></div></aside><!-- popovers --><div class=\"pop pop-trade\" id=\"trade-pop\" role=\"dialog\" aria-label=\"Choose your trade\" hidden><div class=\"pop-search\"><span data-icon=\"search\"></span><input id=\"trade-q\" type=\"text\" placeholder=\"Find a trade\" aria-label=\"Find a trade\" autocomplete=\"off\"></div><div class=\"listbox\" id=\"trade-list\" role=\"listbox\" aria-label=\"Trades\"></div></div><div class=\"pop pop-area\" id=\"area-pop\" role=\"dialog\" aria-label=\"Where you work\" hidden><label class=\"f-label\" for=\"place\">Where you work</label><div class=\"select-wrap\"><select id=\"place\"></select><span data-icon=\"chevronDown\"></span></div><label class=\"f-label range-label\" for=\"radius\">How far you travel <output id=\"radius-out\" for=\"radius\">10 mi</output></label><input id=\"radius\" type=\"range\" min=\"2\" max=\"25\" step=\"1\" value=\"10\"></div><div class=\"pop pop-settings\" id=\"settings-pop\" role=\"dialog\" aria-label=\"Settings\" hidden><label class=\"f-label\" for=\"biz\">Business name on the card</label><input class=\"field\" id=\"biz\" type=\"text\" value=\"Your Business\" maxlength=\"48\" autocomplete=\"off\"><div class=\"f-row\"><div><label class=\"f-label\" for=\"phone\">Phone</label><input class=\"field\" id=\"phone\" type=\"text\" maxlength=\"24\" autocomplete=\"off\"></div><div><label class=\"f-label\" for=\"url\">Web address</label><input class=\"field\" id=\"url\" type=\"text\" maxlength=\"40\" autocomplete=\"off\"></div></div><label class=\"f-label\" for=\"rate\">Cost per card <span class=\"hint\">placeholder</span></label><input class=\"field narrow\" id=\"rate\" type=\"number\" min=\"0\" step=\"0.01\" value=\"0.95\" inputmode=\"decimal\"><dl class=\"facts\"><div><dt>Mail them all</dt><dd id=\"s-cost\">\u2013</dd></div><div><dt>New leads a week</dt><dd id=\"s-week\">\u2013</dd></div><div><dt>Typical project</dt><dd id=\"s-median\">\u2013</dd></div></dl><div class=\"export\" id=\"export-sec\" hidden><span class=\"f-label\">Export</span><div class=\"export-row\"><button type=\"button\" class=\"btn ghost small\" id=\"export-csv\">Download CSV</button><button type=\"button\" class=\"btn ghost small\" id=\"export-ics\">Follow-ups to calendar</button></div></div><div class=\"pop-foot\"><span class=\"save-mode\" id=\"save-mode\"></span><button type=\"button\" class=\"link-btn\" id=\"about-open\">About the data</button></div></div><div class=\"pop pop-layers\" id=\"layers-pop\" role=\"dialog\" aria-label=\"Map layers\" hidden><label class=\"check\"><input type=\"checkbox\" id=\"lay-all\" checked><span class=\"box\"></span><span>All permits</span></label><label class=\"check\" id=\"lay-hood-row\"><input type=\"checkbox\" id=\"lay-hood\"><span class=\"box\"></span><span>Neighborhood value</span></label><label class=\"check\" id=\"lay-fire-row\"><input type=\"checkbox\" id=\"lay-fire\" checked><span class=\"box\"></span><span>Fire areas <em id=\"lay-fire-note\"></em></span></label><div class=\"legend\"><h4>Status</h4><div><i class=\"sdot s-new\"></i>New</div><div><i class=\"sdot s-contacted\"></i>Contacted</div><div><i class=\"sdot s-quoting\"></i>Quoting</div><div><i class=\"sdot s-won\"></i>Won</div><div><i class=\"sdot s-lost\"></i>Lost</div><div class=\"ramp\" id=\"ramp\" hidden><span>Home value</span><i></i><em>$400k</em><em>$1.2M+</em></div></div></div></div><div class=\"toasts\" id=\"toasts\" role=\"status\" aria-live=\"polite\"></div><dialog class=\"modal card-dialog\" id=\"drawer\" aria-labelledby=\"h-card\"><div class=\"m-head\"><h2 id=\"h-card\">Postcard preview</h2><button type=\"button\" class=\"icon-btn\" id=\"collapse\" aria-label=\"Close\"><span data-icon=\"x\"></span></button></div><div class=\"card-body\" id=\"drawer-body\"><p class=\"card-for\" id=\"card-for\"></p><div class=\"card-wrap\" id=\"card-wrap\"><div class=\"postcard\" id=\"postcard\"><div class=\"face front\" id=\"face-front\" aria-label=\"Postcard front\"></div><div class=\"face back\" id=\"face-back\" aria-label=\"Postcard back\"></div></div></div><p class=\"empty\" id=\"card-empty\" hidden>No lead is open. Pick one from the list first.</p><div class=\"card-actions\"><button type=\"button\" class=\"btn ghost\" id=\"prev-card\"><span data-icon=\"chevronLeft\"></span>Previous</button><button type=\"button\" class=\"btn\" id=\"flip\" aria-pressed=\"false\">Flip to back</button><button type=\"button\" class=\"btn ghost\" id=\"next-card\">Next<span data-icon=\"chevronRight\"></span></button></div></div></dialog><dialog class=\"modal about-dialog\" id=\"about\" aria-labelledby=\"h-about\"><div class=\"m-head\"><h2 id=\"h-about\">About the data</h2><button type=\"button\" class=\"icon-btn\" id=\"about-close\" aria-label=\"Close\"><span data-icon=\"x\"></span></button></div><div class=\"about-body\"><p>Every dot is a real building permit from a city's public records. When someone pulls a permit for a kitchen, a pool or a new home, the trades that come after it (countertops, fencing, landscaping and so on) are the ones who get a postcard.</p><p class=\"fresh\" id=\"fresh\">Loading permit data\u2026</p><p>Each dot that matches your trade is a lead. Set its status, add a follow-up date and notes, and they stay with it. Leads are ranked Hot, Warm or Cool from how well the timing fits your trade, the project size and the neighborhood (public Census numbers), compared with the other leads in your area. Statuses and notes are shared with everyone who can open this page; if you opened a local copy, they are saved on this device only.</p><p class=\"foot\" id=\"credits\">Prototype; no mail is sent.</p></div></dialog><dialog class=\"modal keys-dialog\" id=\"keys\" aria-labelledby=\"h-keys\"><div class=\"m-head\"><h2 id=\"h-keys\">Keyboard shortcuts</h2><button type=\"button\" class=\"icon-btn\" id=\"keys-close\" aria-label=\"Close\"><span data-icon=\"x\"></span></button></div><dl class=\"keys\"><div><dt><kbd class=\"k-cmd\">\u2318K</kbd> <kbd>/</kbd></dt><dd>Search</dd></div><div><dt><kbd>[</kbd></dt><dd>Show or hide the list</dd></div><div><dt><kbd>J</kbd> <kbd>K</kbd></dt><dd>Next or previous lead</dd></div><div><dt><kbd>1</kbd>\u2013<kbd>5</kbd></dt><dd>Set status: New, Contacted, Quoting, Won, Lost</dd></div><div><dt><kbd>N</kbd></dt><dd>Add a note</dd></div><div><dt><kbd>F</kbd></dt><dd>Follow up tomorrow</dd></div><div><dt><kbd>P</kbd></dt><dd>Postcard</dd></div><div><dt><kbd>Esc</kbd></dt><dd>Close</dd></div></dl></dialog></div></div>";
const PPCore = (function (PP_EMBED) {
  'use strict';

  const DEFAULT_CONFIG = {
    brandName: 'Permit Postcards',
    logoText: 'PP',
    businessName: 'Your Business',   // printed on the postcard
    phone: '(310) 555-0142',                    // printed on the postcard
    url: 'yourshop.example',                    // printed on the postcard
    defaultTrade: 'countertops',
    defaultPlace: null,                         // a preset id (e.g. 'anaheim'); null = first place with data
    radiusMiles: 10,
    accent: null                                // CSS colour; overrides the accent in both themes when set
  };

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
  const titleCase = (s) => s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());


  const safeId = (s) => s.replace(/[^A-Za-z0-9_\-.~:@+]/g, '-');
  const citySlug = (c) => String(c).toLowerCase().replace(/\s+/g, '-');
  const addrKey = (a) => String(a).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const leadId = (r) => safeId(citySlug(r.city) + '~' + addrKey(r.addr));
  const legacyId = (city, nbr) => safeId(citySlug(city) + '~' + nbr);

  const TIER_LABEL = { hot: 'Hot', warm: 'Warm', cool: 'Cool' };
  const TIMING_RANK = { now: 3, soon: 2, early: 1, late: 0, unknown: -1 };
  const SOON_WEEKS = 3;
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const weeksSince = (iso, now) => {
    const [y, m, d] = iso.split('-').map(Number);
    return (new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(y, m - 1, d)) / 604800000;
  };
  function leadTiming(r, trade, intel, now = new Date()) {
    const weeks = weeksSince(r.date, now);
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
  function timingPhrase(t) {
    if (t.state === 'now') return 'now';
    if (t.state === 'soon' || t.state === 'early') return `in about ${t.inWeeks} week${t.inWeeks === 1 ? '' : 's'}`;
    if (t.state === 'late') return 'probably already done';
    return 'not sure yet';
  }
  const shortMoney = (n) => (n >= 1e6 ? '$' + +(n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? '$' + Math.round(n / 1e3) + 'k' : '$' + Math.round(n));
  const homeLabel = (k) => (k >= 2000 ? '$2M+' : k >= 1000 ? '$' + +(k / 1000).toFixed(1) + 'M' : '$' + k + 'k');
  const ABS_HOT = 67, ABS_WARM = 49;
  function leadScore(r, trade, intel, now = new Date()) {
    const t = leadTiming(r, trade, intel, now);
    let score;
    if (t.state === 'now') score = 40 - 8 * clamp((t.weeks - t.from) / Math.max(1, t.to - t.from), 0, 1);
    else if (t.state === 'soon') score = 24 - (t.inWeeks || 0);
    else if (t.state === 'early') score = clamp(14 - ((t.inWeeks || 0) - SOON_WEEKS) * 0.5, 4, 14);
    else if (t.state === 'late') score = 0;
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
    reasons.push({ now: 'right timing', soon: 'timing coming up', early: 'a bit early', late: 'probably already done', unknown: 'timing unclear' }[t.state]);
    if (r.homeK != null && r.homeK >= 800) reasons.push('high-value area');
    if (r.fire) reasons.push('fire rebuild');
    return { score, bucket: score >= ABS_HOT ? 'hot' : score >= ABS_WARM ? 'warm' : 'cool', reasons, timing: t };
  }
  const TIER_HOT_SHARE = 0.12, TIER_COOL_SHARE = 0.25, HOT_FLOOR = 45, TIER_MIN = 8;
  function assignTiers(list) {
    const n = list.length;
    if (n < TIER_MIN) return list;
    const order = list.slice().sort((a, b) => b.intel.score - a.intel.score || b.date.localeCompare(a.date) || b.val - a.val);
    const hotN = Math.round(n * TIER_HOT_SHARE), coolN = Math.round(n * TIER_COOL_SHARE);
    order.forEach((r, i) => {
      r.intel.bucket = i < hotN && r.intel.score >= HOT_FLOOR ? 'hot' : i >= n - coolN ? 'cool' : 'warm';
    });
    return list;
  }
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
  function mergeNotes(a, b) {
    const seen = new Set(), out = [];
    (a || []).concat(b || []).forEach((n) => { const k = noteKey(n); if (!seen.has(k)) { seen.add(k); out.push(n); } });
    out.sort((x, y) => (x.at < y.at ? -1 : x.at > y.at ? 1 : 0));
    return out.slice(-NOTE_CAP);
  }
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
  const isStale = (rec, date) => !!rec && (rec.status === 'won' || rec.status === 'lost') && DATE_RE.test(rec.permitDate || '') && DATE_RE.test(date || '') && dayNum(date) - dayNum(rec.permitDate) > STALE_DAYS;
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
  if (!PP_EMBED) window.PP_STORE = { createStore, ops, normalizeRec, mergeNotes, isStale };

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

  async function defaultLoad() {
    if (window.PERMIT_DATA) return { permits: window.PERMIT_DATA.permits, meta: window.PERMIT_DATA.meta };
    const [pRes, mRes] = await Promise.all([fetch('data/permits.json'), fetch('data/meta.json')]);
    if (!pRes.ok || !mRes.ok) throw new Error('data files missing. Run: python3 pipeline/fetch.py');
    return { permits: await pRes.json(), meta: await mRes.json() };
  }

  const CSV_COLS = [['Address', 'address'], ['City', 'city'], ['ZIP', 'zip'], ['Status', 'status'], ['Follow-up', 'followUp'], ['Score', 'score'],
    ['Timing', 'timing'], ['Project', 'project'], ['Value', 'value'], ['Permit #', 'permit'], ['Issued', 'issued'], ['Contractor', 'contractor'], ['Notes', 'notes']];
  function csvCell(v) {
    let s = v == null ? '' : String(v);
    if (typeof v === 'string' && /^[=+\-@\t\r]/.test(s)) s = "'" + s;   // a spreadsheet must not read text as a formula
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function leadsToCsv(rows) {
    return [CSV_COLS.map((c) => c[0]).join(',')].concat(rows.map((r) => CSV_COLS.map((c) => csvCell(r[c[1]])).join(','))).join('\r\n') + '\r\n';
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

    const LS_SIDE = 'pp-side' + NS;
    const ROW_H = 56;
    const state = {
      trade: CONFIG.defaultTrade, biz: CONFIG.businessName, phone: CONFIG.phone, url: CONFIG.url, preset: 'santa-monica', placeLabel: '',
      base: { lat: PRESETS[0].lat, lng: PRESETS[0].lng }, radius: CONFIG.radiusMiles, sort: 'best', rate: 0.95,
      selected: null, ghost: null, flipped: false, filter: null, builder: null, panel: false, tab: 'leads'
    };
    const layers = { all: true, hood: false, fire: true };
    let meta, intel, tracts = [], rows = [], matches = [], pool = [], counts = {}, dueCount = 0, hotCount = 0, builders = [], panelId = null, presets = PRESETS;
    let fireLayer, fireShown = false, hoverMarker = null, ready = false, tradeOrder = [];
    let lastDot = 0, lastDragEnd = 0, areaPending = 0, areaError = null;
    let map, tiles, canvas, dotLayer, hitLayer, selMarker, baseMarker, radiusCircle, popup, dotTip;
    const mqPhone = win.matchMedia('(max-width: 767px)');
    const mqDesk = win.matchMedia('(min-width: 1024px)');
    const mqReduce = win.matchMedia('(prefers-reduced-motion: reduce)');
    const shell = $('shell');
    const frameEl = embed ? root.querySelector('.pp-frame') : null;
    let lastW = 1024;
    const fw = () => { if (embed && frameEl.clientWidth) lastW = frameEl.clientWidth; return embed ? lastW : win.innerWidth; };
    const isPhone = () => (embed ? fw() < 768 : mqPhone.matches);
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

    function noAnim(fn) {
      shell.classList.add('no-anim');
      try { fn(); } finally { requestAnimationFrame(() => requestAnimationFrame(() => shell.classList.remove('no-anim'))); }
    }
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
    function effRec(r) {
      const rec = recFor(r);
      if (!isStale(rec, r.date)) return rec;
      return Object.assign({}, rec, { status: 'new', followUp: null, prior: { status: rec.status, at: rec.statusAt || rec.updatedAt || '' } });
    }
    const leadInfo = (r) => ({ date: r.date, permits: [r.nbr].concat(r.others.map((o) => o.nbr)) });
    function seedFor(r) {
      const rec = recFor(r);
      return rec ? clone(rec) : { status: 'new', followUp: null, notes: [], trade: state.trade, addr: titleCase(r.addr), city: r.city };
    }
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
      if (!tiles && !options.noTiles) tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
      shell.dataset.tiles = t;
      styleBasemap();
      paintDots();
      styleOverlays();
      if (baseMarker) baseMarker.setIcon(pinIcon());
    }
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

    const STATUS_VAR = { new: '--s-new', contacted: '--s-contacted', quoting: '--s-quoting', won: '--s-won', lost: '--s-lost' };
    function hitStyle(r) {
      const c = cssVar(STATUS_VAR[r.status] || '--s-new');
      return r.status === 'lost'
        ? { color: c, weight: 2, fillColor: c, fillOpacity: 0, radius: 5 }
        : { color: cssVar('--surface'), weight: 1.5, fillColor: c, fillOpacity: 0.95, radius: 5 };
    }
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

    function miles(lat1, lon1, lat2, lon2) {
      const rad = Math.PI / 180, dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
      return 3958.8 * 2 * Math.asin(Math.sqrt(a));
    }

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
          homeK: tr && tr[0] >= 0 ? tr[0] : null, ownPct: tr && tr[1] >= 0 ? tr[1] : null, fire: ['', 'Eaton', 'Palisades'][a[12] || 0], others, intel: null };
      });
      intel = { timing: meta.timing || {}, fitPrimary: meta.fit_primary || {}, kinds: meta.kinds };
      const seen = new Set();
      rows.forEach((r) => {
        let id = leadId(r);
        if (seen.has(id)) id = safeId(id + '~' + r.nbr);
        seen.add(id);
        r.id = id;
        r.legacy = [legacyId(r.city, r.nbr)].concat(r.others.map((o) => legacyId(r.city, o.nbr)));
      });
    }

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
      r.dot = L.circleMarker([r.lat, r.lng], { renderer: canvas, radius: 2.6, weight: 0, fillColor: cssVar('--dot'), fillOpacity: 0.8, interactive: false });
      dotLayer.addLayer(r.dot);
    }

    function fitBase() {
      const phone = isPhone();
      const pw = !phone && state.panel ? Math.min(400, $('stage').clientWidth) : 0;   // keep the circle clear of the open detail panel
      const c = map.getCenter();
      const far = miles(c.lat, c.lng, state.base.lat, state.base.lng) > 40;
      map.fitBounds(radiusCircle.getBounds(), phone
        ? { paddingTopLeft: [16, 16], paddingBottomRight: [16, 150], animate: false }
        : { paddingTopLeft: [24, 24], paddingBottomRight: [24 + pw, 24], animate: !far && !mqReduce.matches });
    }
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
        `<dl><dt>Issued</dt><dd>${esc(fmtDate(r.date))}</dd><dt>Valuation</dt><dd>${r.val > 0 ? money(r.val) : 'not listed'}</dd><dt>Permit</dt><dd>${esc(r.nbr)}</dd></dl>` +
        (r.desc ? `<p>${esc(trunc(r.desc, 200))}</p>` : '') + '</div>';
    }
    function showPopup(r) { popup.setLatLng([r.lat, r.lng]).setContent(popupHtml(r)).openOn(map); }
    function onDotClick(r) {
      lastDot = Date.now();
      if (matches.includes(r)) { map.closePopup(); openLead(r, 'keep'); } else showPopup(r);
    }
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
    function moveBase(lat, lng) { dismissHint(); setBase(lat, lng, null, false); }
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

    let pending = 0;
    function refresh() { clearTimeout(pending); pending = setTimeout(compute, 40); }

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
      const keep = state.selected && (matches.includes(state.selected) || (state.panel && pool.includes(state.selected)));
      if (!keep) { state.selected = null; state.panel = false; }
      if (state.selected && !matches.includes(state.selected)) { if (oldIdx >= 0) state.ghost = oldIdx; } else state.ghost = null;
      const ai = act.id ? matches.findIndex((r) => r.id === act.id) : -1;
      if (ai >= 0) act.idx = ai; else act.id = matches.length ? matches[clamp(act.idx, 0, matches.length - 1)].id : null;
      const vk = [state.filter, state.sort, state.builder, key].join('|');
      if (vk !== viewKey) { viewKey = vk; $('list').scrollTop = 0; }

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
      const chips = [];
      if (state.filter === 'hot') chips.push(['f', 'Hot leads']);
      if (state.filter === 'due') chips.push(['f', 'Follow-ups due']);
      if (state.builder) {
        const b = builders.find((x) => x.key === state.builder);
        chips.push(['b', `Showing ${titleCase(b ? b.name : 'this builder')}’s jobs`]);
      }
      $('chips').hidden = !chips.length;
      $('chips').innerHTML = chips.map(([k, t]) => `<button type="button" class="chip-x" data-chip="${k}" aria-label="Remove filter: ${esc(t)}"><span>${esc(t)}</span><span data-icon="x">${icon('x')}</span></button>`).join('');
      const week = n ? (perWeek >= 10 ? Math.round(perWeek) : perWeek.toFixed(1)) : '0';
      $('s-week').textContent = week;
      $('s-median').textContent = med === null ? 'not listed' : money(med);
      $('s-cost').textContent = money(n * (state.rate || 0));
      $('save-mode').textContent = store.mode === 'shared' ? 'Shared with your team' : store.mode === 'readonly' ? 'View only' : 'Saved on this device';
      renderNotice();
    }

    const TIMING_SHORT = (t) => (t.state === 'now' ? 'now' : t.state === 'soon' || t.state === 'early' ? `in ${t.inWeeks} wk` : t.state === 'late' ? 'late' : '');
    const kindsLabel = (r, sep) => r.kinds.map((k) => (meta.kinds[k] || { label: 'Other' }).label).join(sep);
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

    function select(r, mode) {
      state.selected = r;
      if (r && matches.includes(r)) { state.ghost = null; act.id = r.id; act.idx = matches.indexOf(r); }
      renderSelection();
      updateRowSelection();
      if (!r) return;
      if (mode === 'fly') {
        const z = Math.max(map.getZoom(), 14), c = viewFor(r, z);
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
      $('lp-dir').href = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(`${addr}, ${r.city}, ${r.state || 'CA'} ${r.zip}`.trim());
      $('lp-street').href = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${r.lat},${r.lng}`;
      const it = r.intel || leadScore(r, state.trade, intel);
      const why = it.reasons.join(' · ');
      $('lp-best').innerHTML = `<span>Best time to reach out: <b>${esc(timingPhrase(it.timing))}</b></span>` +
        `<button type="button" class="tier t-${it.bucket}" data-tip="${esc(why)}" aria-label="${TIER_LABEL[it.bucket]} lead. ${esc(why)}"><i></i>${TIER_LABEL[it.bucket]}</button>`;
      $('lp-kinds').innerHTML = r.kinds.map((k) => `<span class="tag">${esc((meta.kinds[k] || { label: 'Other' }).label)}</span>`).join('') +
        (r.fire ? `<span class="tag fire">${icon('flame')}Fire rebuild</span>` : '');
      $('lp-kv').innerHTML = kvRow('Issued', fmtDate(r.date)) + kvRow('Project value', r.val > 0 ? money(r.val) : 'Not listed') + kvRow('Permit', r.nbr);
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
    function copyAddress() {
      const r = state.selected;
      if (r) copyText(`${titleCase(r.addr)}, ${r.city}, ${r.state || 'CA'} ${r.zip}`.trim(), 'Copied address', $('lp-addr'));
    }

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


    function exportRow(r) {
      const rec = effRec(r), con = splitContractor(r.contractor);
      return { id: r.id, address: titleCase(r.addr), city: r.city, zip: r.zip || '', status: STATUS_LABEL[r.status] || r.status, followUp: r.follow || '',
        score: r.intel ? r.intel.score : '', timing: r.intel ? timingPhrase(r.intel.timing) : '', project: kindsLabel(r, ' + '), value: r.val > 0 ? r.val : '',
        permit: r.nbr, issued: r.date, contractor: con.name ? con.name + (con.phone ? ' · ' + con.phone : '') : '', notes: rec && rec.notes ? rec.notes.length : 0 };
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
      const head = `${copy.head} Let’s talk ${noun}.`;
      const offer = copy.offer.replace('{trade}', noun);
      const biz = state.biz.trim() || 'Your business name';
      const street = titleCase(r.addr);
      $('card-for').textContent = `Permit ${r.nbr} · ${fmtDate(r.date)} · ${street}`;
      $('face-front').innerHTML =
        `<div class="tag">Permit notice · issued ${esc(fmtDate(r.date, false))}</div>` +
        `<p class="head">${esc(head)}</p><p class="offer">${esc(offer)}</p>` +
        `<div class="where">Re: ${esc(street)}</div>` +
        `<div class="band"><span class="biz">${esc(biz)}</span><span class="contact">${esc(state.phone)}<br>${esc(state.url)}</span></div>`;
      $('face-back').innerHTML =
        `<div class="left"><p class="msg"><b>${esc(biz)}</b> works on ${esc(noun)} right after the permit stage. One call or one click gets you a written quote.</p>` +
        `<p class="legal">You’re receiving this because building permits are public record. Not affiliated with the City of ${esc(r.city)}.</p></div>` +
        `<div class="right"><div class="stamp"><span><i>★</i>Postage<br>here</span></div>` +
        `<div class="addr-block"><div class="to">To the homeowner at</div><div class="line">${esc(r.addr)}</div><div class="line">${esc(r.city)}, ${esc(r.state || 'CA')} ${esc(r.zip)}</div></div></div>`;
    }
    function setFlip(on) {
      state.flipped = on;
      $('postcard').classList.toggle('flipped', on);
      $('flip').setAttribute('aria-pressed', String(on));
      $('flip').textContent = on ? 'Flip to front' : 'Flip to back';
      $('face-front').setAttribute('aria-hidden', String(on));
      $('face-back').setAttribute('aria-hidden', String(!on));
    }

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
      Object.keys(POPS).forEach((key) => {
        const [btn, pop] = POPS[key];
        $(pop).addEventListener('focusout', (e) => { const to = e.relatedTarget; if (openKey === key && to && !$(pop).contains(to) && to !== $(btn)) closePop(); });
      });

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

      $('side-collapse').addEventListener('click', () => setSide(false, true));
      $('side-open').addEventListener('click', () => setSide(true, true));
      $('tab-leads').addEventListener('click', () => setTab('leads'));
      $('tab-builders').addEventListener('click', () => setTab('builders'));
      root.querySelector('.tabs').addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); setTab(state.tab === 'leads' ? 'builders' : 'leads'); $('tab-' + state.tab).focus(); }
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

      $('lp-close').addEventListener('click', () => { closeLead(); });
      $('lp-back').addEventListener('click', () => { closeLead(); });
      $('lp-prev').addEventListener('click', () => step(-1));
      $('lp-next').addEventListener('click', () => step(1));
      $('lp-status').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setStatus(b.dataset.s); });
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
      ['drawer', 'about', 'keys'].forEach((id) => $(id).addEventListener('click', (e) => { if (e.target === $(id)) closeDialog($(id)); }));
      $('prev-card').addEventListener('click', () => step(-1));
      $('next-card').addEventListener('click', () => step(1));
      $('flip').addEventListener('click', () => setFlip(!state.flipped));
      $('theme-toggle').addEventListener('click', () => setTheme(currentTheme() === 'dark' ? 'light' : 'dark'));
      listen(mq, 'change', applyTheme);

      let tipOff = 0;
      listen(root, 'pointerover', (e) => {
        if (e.target.closest && e.target.closest('[data-tip]')) { shell.classList.add('tip-warm'); clearTimeout(tipOff); tipOff = setTimeout(() => shell.classList.remove('tip-warm'), 700); }
      });

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
      const chips = src.map((s) => `<span class="src"><i></i>${esc(s.city)} <em>${esc(fmtDate(s.date_min, false))} – ${esc(fmtDate(s.date_max, false))}</em></span>`);
      const fails = (meta.sources_failed || []).map((s) => `<span class="src off" title="Portal blocked automated access this run">${esc(s.city)} <em>unavailable</em></span>`);
      el.innerHTML = `<span class="src total">${meta.total_rows.toLocaleString('en-US')} permits</span>` + chips.join('') + fails.join('');
    }
    function renderFooter() {
      const links = (meta.sources || []).map((s) => `<a href="${esc(s.credit.url)}" target="_blank" rel="noopener">${esc(s.credit.name)}</a>`);
      $('credits').innerHTML = links.length ? 'Data: ' + links.join('; ') + '. Prototype; no mail is sent.' : 'Prototype; no mail is sent.';
    }

    if (!embed) {
      try { const t = localStorage.getItem('pp-theme'); if (t === 'dark' || t === 'light') themeEl.setAttribute('data-theme', t); } catch (e) { /* ignore */ }
      doc.title = CONFIG.brandName;
    }
    root.querySelector('.top h1').textContent = CONFIG.brandName;
    root.querySelector('.mark span').textContent = CONFIG.logoText;
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
        if (have.size) presets = PRESETS.filter((p) => have.has(p.city));
        if (!presets.length && !embed) presets = PRESETS;
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
})(true);
  const TAG = 'permit-map';
  const LEAFLET_VERSION = '1.9.4';
  const LEAFLET_JS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/' + LEAFLET_VERSION + '/leaflet.min.js';
  const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap';
  const DEFAULT_TRADE = 'countertops';
  const DEFAULT_HEIGHT = '720px';
  const warned = new Set();
  const warn = (msg) => { if (!warned.has(msg)) { warned.add(msg); console.warn('[permit-map] ' + msg); } };

  const SCRIPT_DIR = (() => {
    let src = document.currentScript && document.currentScript.src;
    if (!src) { const s = document.querySelector('script[src*="permit-map"]'); src = s && s.src; }
    return src ? src.replace(/[#?].*$/, '').replace(/[^/]*$/, '') : '';
  })();

  const toMiles = (a, b, c, d) => {
    const r = Math.PI / 180, x = Math.sin((c - a) * r / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin((d - b) * r / 2) ** 2;
    return 3958.8 * 2 * Math.asin(Math.sqrt(x));
  };
  const hash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
  const initials = (name) => (String(name).match(/[A-Za-z0-9]+/g) || ['PP']).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  function postWebhook(url, payload, fetchImpl, delays) {
    const f = fetchImpl || ((u, o) => window.fetch(u, o)), wait = delays || [800, 2500], body = JSON.stringify(payload);
    const attempt = (i) => Promise.resolve().then(() => f(url, { method: 'POST', body, headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, keepalive: true, mode: 'no-cors', credentials: 'omit' }))
      .then((res) => { if (res && res.type !== 'opaque' && res.ok === false) throw new Error('HTTP ' + res.status); })
      .catch((e) => {
        if (i < wait.length) return new Promise((r) => setTimeout(r, wait[i])).then(() => attempt(i + 1));
        warn('webhook delivery failed after retries: ' + (e && e.message || e));
      });
    return attempt(0);
  }

  function ensureFont() {
    if (document.getElementById('pp-geist-font') || !document.head) return;   // fonts do not load from inside a shadow root
    const l = document.createElement('link');
    l.id = 'pp-geist-font'; l.rel = 'stylesheet'; l.href = FONT_CSS;
    document.head.appendChild(l);
  }
  let leafletP = null;
  function ensureLeaflet() {
    if (window.L && window.L.map) {
      const v = String(window.L.version || '').split('.').map(Number);
      if (v[0] < 1 || (v[0] === 1 && v[1] < 7)) warn('this page already has Leaflet ' + window.L.version + ' (older than 1.7); the map will use it, which may misbehave.');
      return Promise.resolve();
    }
    if (!leafletP) {
      leafletP = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = LEAFLET_JS; s.async = true;
        s.onload = () => (window.L && window.L.map ? resolve() : reject(new Error('The map library loaded but did not start.')));
        s.onerror = () => { leafletP = null; reject(new Error('Could not load the map library (' + LEAFLET_JS + ').')); };
        document.head.appendChild(s);
      });
    }
    return leafletP;
  }

  const jsonCache = new Map();
  function getJSON(url) {
    if (!jsonCache.has(url)) {
      const p = window.fetch(url).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url); return r.json(); });
      p.catch(() => jsonCache.delete(url));
      jsonCache.set(url, p);
    }
    return jsonCache.get(url);
  }
  function pickPlaces(index, cfg) {
    let chosen = [], center = cfg.center;
    cfg.places.forEach((id) => {
      const p = index.find((x) => x.id === id);
      if (p) chosen.push(p); else warn('unknown place "' + id + '". Known places: ' + index.map((x) => x.id).join(', '));
    });
    if (!chosen.length) {
      if (!center) center = { lat: index[0].lat, lng: index[0].lng };   // index is sorted biggest first
      chosen = index.filter((p) => toMiles(center.lat, center.lng, p.lat, p.lng) <= cfg.radius + p.radiusMi);
      if (!chosen.length) {
        const near = index.slice().sort((a, b) => toMiles(center.lat, center.lng, a.lat, a.lng) - toMiles(center.lat, center.lng, b.lat, b.lng))[0];
        warn('no covered place within ' + cfg.radius + ' mi of that center; showing ' + near.name + ' instead.');
        chosen = [near];
        center = { lat: near.lat, lng: near.lng };
      }
    }
    if (!center) center = { lat: chosen[0].lat, lng: chosen[0].lng };
    const label = chosen.slice().sort((a, b) => toMiles(center.lat, center.lng, a.lat, a.lng) - toMiles(center.lat, center.lng, b.lat, b.lng))[0].name;
    return { chosen, center, label };
  }
  function mergePlaces(files) {
    const first = files[0], kinds = first.kinds.slice(), tracts = [], rows = [];
    const meta = { kinds: first.meta.kinds, trades: first.meta.trades, timing: first.meta.timing, fit_primary: first.meta.fit_primary,
      sources: [], sources_failed: [], counts_by_trade: {}, total_rows: 0, date_min: '', date_max: '' };
    files.forEach((f) => {
      const km = f.kinds.map((k) => { let i = kinds.indexOf(k); if (i < 0) { kinds.push(k); i = kinds.length - 1; } return i; });
      const same = km.every((v, i) => v === i), off = tracts.length;
      f.tracts.forEach((t) => tracts.push(t));
      f.rows.forEach((r) => {
        const c = r.slice();
        if (c[11] >= 0) c[11] += off;
        if (!same) c[7] = c[7].map((i) => km[i]);
        rows.push(c);
      });
      const m = f.meta;
      m.sources.forEach((s) => meta.sources.push(s));
      Object.keys(m.counts_by_trade).forEach((t) => { meta.counts_by_trade[t] = (meta.counts_by_trade[t] || 0) + m.counts_by_trade[t]; });
      meta.total_rows += m.total_rows;
      if (!meta.date_min || m.date_min < meta.date_min) meta.date_min = m.date_min;
      if (m.date_max > meta.date_max) meta.date_max = m.date_max;
      if (m.fire_perimeters && !meta.fire_perimeters) meta.fire_perimeters = m.fire_perimeters;
    });
    meta.counts_by_trade = Object.fromEntries(Object.entries(meta.counts_by_trade).sort((a, b) => b[1] - a[1]));
    return { permits: { fields: first.fields, kinds, tracts, rows }, meta };
  }

  function readConfig(el) {
    const get = (n) => { const v = el.getAttribute(n); return v == null ? '' : v.trim(); };
    const cfg = {};
    cfg.dataSrc = (get('data-src') || (SCRIPT_DIR ? SCRIPT_DIR + 'data' : 'data')).replace(/\/+$/, '');
    cfg.trade = get('trade') || DEFAULT_TRADE;
    cfg.places = get('places').split(',').map((s) => s.trim()).filter(Boolean);
    cfg.lockPlaces = el.hasAttribute('lock-places');   // places="" is only the starting set, unless this is present
    cfg.center = null;
    if (get('center')) {
      const m = get('center').match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
      if (m && Math.abs(+m[1]) <= 90 && Math.abs(+m[2]) <= 180) cfg.center = { lat: +m[1], lng: +m[2] };
      else warn('center="' + get('center') + '" is not "lat,lng"; using the default.');
    }
    cfg.radius = 10;
    if (get('radius')) {
      const n = Number(get('radius'));
      if (isFinite(n) && n > 0) cfg.radius = Math.min(25, Math.max(2, Math.round(n)));
      else warn('radius="' + get('radius') + '" is not a number of miles; using 10.');
      if (isFinite(n) && (n < 2 || n > 25)) warn('radius is limited to 2 to 25 miles; using ' + cfg.radius + '.');
    }
    cfg.businessName = get('business-name');
    cfg.phone = el.hasAttribute('phone') ? get('phone') : null;
    cfg.url = el.hasAttribute('url') ? get('url') : null;
    cfg.accent = null;
    if (get('accent')) {
      const v = get('accent');
      if (window.CSS && CSS.supports ? CSS.supports('color', v) : /^(#[0-9a-f]{3,8}|[a-z]+|(rgb|hsl)a?\([\d\s.,%/-]+\))$/i.test(v)) cfg.accent = v;
      else warn('accent="' + get('accent') + '" is not a CSS colour; using the default orange.');
    }
    cfg.theme = 'auto';
    if (get('theme')) { if (['auto', 'light', 'dark'].includes(get('theme'))) cfg.theme = get('theme'); else warn('theme="' + get('theme') + '" must be auto, light or dark; using auto.'); }
    cfg.storage = 'local';
    if (get('storage')) {
      if (['local', 'webhook'].includes(get('storage'))) cfg.storage = get('storage');
      else warn('storage="' + get('storage') + '" must be local or webhook' + (get('storage') === 'supabase' ? ' (supabase is not built yet)' : '') + '; using local.');
    }
    cfg.webhook = get('webhook');
    if (cfg.storage === 'webhook' && !/^https?:\/\//i.test(cfg.webhook)) { warn('storage="webhook" needs webhook="https://..."; saving on this device only.'); cfg.storage = 'local'; }
    cfg.height = DEFAULT_HEIGHT;
    if (get('height')) { if (/^\d+(\.\d+)?(px|vh|rem|em|%)$/.test(get('height'))) cfg.height = get('height'); else warn('height="' + get('height') + '" must be a length like 720px; using ' + DEFAULT_HEIGHT + '.'); }
    cfg.basemap = 'tiles';
    if (get('basemap')) { if (get('basemap') === 'outlines' || get('basemap') === 'tiles') cfg.basemap = get('basemap'); else warn('basemap="' + get('basemap') + '" must be tiles or outlines; using tiles.'); }
    cfg.brand = get('brand') || cfg.businessName || 'Permit Postcards';
    cfg.logo = get('logo') || (get('brand') || cfg.businessName ? initials(cfg.brand) : 'PP');
    return cfg;
  }

  const OBSERVED = ['data-src', 'trade', 'places', 'center', 'radius', 'business-name', 'phone', 'url', 'accent', 'theme', 'storage', 'webhook', 'height', 'basemap', 'brand', 'logo', 'lock-places'];
  const REMOUNT = new Set(['data-src', 'places', 'basemap', 'lock-places']);
  const LIVE = new Set(['business-name', 'phone', 'url', 'accent', 'brand', 'logo', 'theme']);

  class PermitMap extends HTMLElement {
    static get observedAttributes() { return OBSERVED; }
    constructor() {
      super();
      this._root = this.attachShadow({ mode: 'open' });
      this._app = null; this._gen = 0; this._cfg = null;
    }
    connectedCallback() {
      if (!this.hasAttribute('role')) this.setAttribute('role', 'region');
      if (!this.hasAttribute('aria-label')) this.setAttribute('aria-label', 'Permit map');
      this._mount();
    }
    disconnectedCallback() { this._unmount(); }
    attributeChangedCallback(name, old, val) {
      if (!this.isConnected || old === val || !this._cfg) return;
      this._changed(name);
    }
    get app() { return this._app; }

    _unmount() {
      this._gen++;
      if (this._app) { this._app.destroy(); this._app = null; }
    }
    _setHeight(h) {
      let st = this._root.getElementById('pp-dyn');
      if (!st) { st = document.createElement('style'); st.id = 'pp-dyn'; this._root.insertBefore(st, this._root.firstChild); }
      st.textContent = ':host{height:' + h + '}';
    }
    _applyTheme(cfg) {
      if (cfg.theme === 'auto') this.removeAttribute('data-theme'); else this.setAttribute('data-theme', cfg.theme);
    }
    _mount() {
      this._unmount();
      const gen = this._gen, cfg = readConfig(this);
      this._cfg = cfg;
      ensureFont();
      this._root.innerHTML = '<style>' + CSS_TEXT + '</style><style id="pp-dyn"></style>' + TEMPLATE_HTML;
      this._setHeight(cfg.height);
      this._applyTheme(cfg);
      const have = new Map();
      let index = [];
      const mergedNow = () => mergePlaces(index.filter((p) => have.has(p.id)).map((p) => have.get(p.id)));
      const fetchPlace = (p) => getJSON(cfg.dataSrc + '/' + p.file).then((f) => { have.set(p.id, f); });
      const plan = getJSON(cfg.dataSrc + '/index.json').then((idx) => {
        if (!Array.isArray(idx) || !idx.length) throw new Error('data/index.json lists no places.');
        index = idx;
        const pick = pickPlaces(index, cfg);
        pick.locked = cfg.lockPlaces ? pick.chosen.map((p) => p.id) : null;
        return Promise.all(pick.chosen.map(fetchPlace)).then(() => ({ pick, data: mergedNow() }));
      });
      const ensure = (lat, lng, radius) => {
        const need = index.filter((p) => !have.has(p.id) && toMiles(lat, lng, p.lat, p.lng) <= radius + p.radiusMi);
        if (!need.length) return null;
        return { names: need.map((p) => p.name), promise: Promise.all(need.map(fetchPlace)).then(mergedNow) };
      };
      const opts = {
        config: { brandName: cfg.brand, logoText: cfg.logo, defaultTrade: cfg.trade, radiusMiles: cfg.radius, accent: cfg.accent,
          businessName: cfg.businessName, phone: cfg.phone || '', url: cfg.url || '' },   // a client's cards never carry someone else's name
        namespace: hash((cfg.places.join(',') || 'auto') + '|' + cfg.trade),
        exportTools: true, noTiles: cfg.basemap === 'outlines',
        onEvent: (name, detail) => this._emit(name, detail),
        loadData: () => Promise.all([ensureLeaflet(), plan, cfg.basemap === 'outlines' ? getJSON(cfg.dataSrc + '/basemap.json').catch(() => { opts.noTiles = false; warn('outline data missing; using map tiles.'); return null; }) : null])
          .then(([, p, bm]) => {
            if (gen !== this._gen) throw new Error('replaced');
            opts.center = p.pick.center; opts.placeLabel = p.pick.label; opts.basemap = bm;
            opts.places = index.filter((x) => !p.pick.locked || p.pick.locked.includes(x.id));
            if (!p.pick.locked) opts.ensureData = ensure;
            const meta = p.data.meta;
            if (!meta.trades[cfg.trade]) warn('trade="' + cfg.trade + '" has no permits here; known trades: ' + Object.keys(meta.trades).join(', '));
            return p.data;
          })
      };
      this._app = PPCore.createPermitMap(this._root, opts);
      this._app.loaded.catch((err) => { if (gen === this._gen && !(err && err.message === 'replaced')) this._fail(err); });
    }
    _fail(err) {
      const frame = this._root.querySelector('.pp-frame');
      if (!frame) return;
      const box = document.createElement('div');
      box.className = 'pp-error'; box.setAttribute('role', 'alert');
      const p = document.createElement('p'), b = document.createElement('button');
      p.textContent = 'The permit map could not load. ' + (err && err.message ? err.message : '');
      b.type = 'button'; b.className = 'btn'; b.textContent = 'Retry';
      b.addEventListener('click', () => { jsonCache.clear(); this._mount(); });
      box.append(p, b);
      frame.appendChild(box);
      b.focus({ preventScroll: true });
    }
    _emit(name, detail) {
      this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
      if (name === 'lead-change') ADAPTERS[this._cfg.storage](this._cfg, detail);
    }
    _changed(name) {
      const next = readConfig(this), app = this._app;
      this._cfg = next;
      if (REMOUNT.has(name)) { this._mount(); return; }
      if (name === 'height') this._setHeight(next.height);
      else if (name === 'trade') { if (app && !app.setTrade(next.trade)) warn('trade="' + next.trade + '" has no permits here.'); }
      else if (name === 'center' || name === 'radius') {   // the app fetches any place files the new area touches
        if (name === 'radius' && app) app.setRadius(next.radius);
        else if (app && next.center) app.setCenter(next.center.lat, next.center.lng);
      } else if (LIVE.has(name)) {
        if (name === 'theme') this._applyTheme(next);
        if (app) app.setOptions({ businessName: next.businessName, phone: next.phone || '', url: next.url || '', accent: next.accent, brandName: next.brand, logoText: next.logo, theme: next.theme });
      }
    }
  }

  const ADAPTERS = {
    local: () => {},
    webhook: (cfg, detail) => { postWebhook(cfg.webhook, detail); }
  };

  if (!window.customElements.get(TAG)) window.customElements.define(TAG, PermitMap);
  window.PermitMap = {
    version: VERSION,
    create(container, opts) {
      const el = document.createElement(TAG);
      Object.keys(opts || {}).forEach((k) => { if (opts[k] != null) el.setAttribute(k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()), String(opts[k])); });
      container.appendChild(el);
      return el;
    },
    util: Object.assign({ postWebhook, mergePlaces, pickPlaces, readConfig }, PPCore.util)
  };

})();
