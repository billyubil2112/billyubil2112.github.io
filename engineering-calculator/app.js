const $ = (id) => document.getElementById(id);

function num(v) { const n = parseFloat(v); return isFinite(n) ? n : NaN; }
function fmt(n) {
    if (!isFinite(n)) return '—';
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-4)) return n.toExponential(3);
    return parseFloat(n.toPrecision(6)).toString();
}

// --- Tabs ---
const tabs = document.querySelectorAll('.tabs button');
const tools = document.querySelectorAll('.tool');
tabs.forEach((btn) => btn.addEventListener('click', () => {
    tabs.forEach((b) => b.classList.remove('active'));
    tools.forEach((t) => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tool-' + btn.dataset.tool).classList.add('active');
}));

// --- Unit converter ---
const UNITS = {
    length:   { 'Millimeter': 0.001, 'Centimeter': 0.01, 'Meter': 1, 'Kilometer': 1000, 'Inch': 0.0254, 'Foot': 0.3048, 'Yard': 0.9144 },
    mass:     { 'Gram': 0.001, 'Kilogram': 1, 'Metric ton': 1000, 'Pound (lb)': 0.45359237, 'Ounce (oz)': 0.028349523 },
    pressure: { 'Pascal': 1, 'kPa': 1000, 'MPa': 1e6, 'Bar': 1e5, 'psi': 6894.757, 'atm': 101325 },
    volume:   { 'Milliliter': 1e-6, 'Liter': 0.001, 'Cubic meter': 1, 'Cubic inch': 1.63871e-5, 'Cubic foot': 0.0283168, 'US gallon': 0.00378541 },
    energy:   { 'Joule': 1, 'Kilojoule': 1000, 'Calorie': 4.184, 'Kilocalorie': 4184, 'Watt-hour': 3600, 'Kilowatt-hour': 3.6e6 }
};
const TEMP_UNITS = ['Celsius', 'Fahrenheit', 'Kelvin'];

function fillUnits(cat, sel, prefer) {
    sel.innerHTML = '';
    const names = cat === 'temperature' ? TEMP_UNITS : Object.keys(UNITS[cat]);
    names.forEach((n) => {
        const o = document.createElement('option');
        o.value = n; o.textContent = n;
        if (n === prefer) o.selected = true;
        sel.appendChild(o);
    });
}

function setCat() {
    const cat = $('uc-cat').value;
    const fromDefault = cat === 'length' ? 'Meter' : cat === 'mass' ? 'Kilogram' : cat === 'pressure' ? 'MPa' : cat === 'volume' ? 'Liter' : cat === 'energy' ? 'Joule' : 'Celsius';
    const toDefault = cat === 'length' ? 'Millimeter' : cat === 'mass' ? 'Gram' : cat === 'pressure' ? 'kPa' : cat === 'volume' ? 'Cubic meter' : cat === 'energy' ? 'Kilowatt-hour' : 'Fahrenheit';
    fillUnits(cat, $('uc-from'), fromDefault);
    fillUnits(cat, $('uc-to'), toDefault);
    convert();
}

function toBase(cat, v, u) {
    if (cat === 'temperature') {
        if (u === 'Celsius') return v + 273.15;
        if (u === 'Fahrenheit') return (v - 32) * 5 / 9 + 273.15;
        return v;
    }
    return v * UNITS[cat][u];
}
function fromBase(cat, k, u) {
    if (cat === 'temperature') {
        if (u === 'Celsius') return k - 273.15;
        if (u === 'Fahrenheit') return (k - 273.15) * 9 / 5 + 32;
        return k;
    }
    return k / UNITS[cat][u];
}

function convert() {
    const cat = $('uc-cat').value;
    const v = num($('uc-value').value);
    const from = $('uc-from').value, to = $('uc-to').value;
    if (isNaN(v)) { $('uc-out').textContent = '—'; return; }
    const res = fromBase(cat, toBase(cat, v, from), to);
    $('uc-out').textContent = fmt(res);
    $('uc-out-unit').textContent = to;
}

$('uc-cat').addEventListener('change', setCat);
$('uc-from').addEventListener('change', convert);
$('uc-to').addEventListener('change', convert);
$('uc-value').addEventListener('input', convert);

// --- Bolt torque ---
function calcTorque() {
    const K = num($('bt-k').value), F = num($('bt-f').value), d = num($('bt-d').value);
    if (isNaN(K) || isNaN(F) || isNaN(d) || F <= 0 || d <= 0) { $('bt-out').textContent = '—'; return; }
    const T = K * F * 1000 * (d / 1000);
    $('bt-out').textContent = fmt(T);
    $('bt-out-unit').innerHTML = 'N&middot;m &nbsp;&middot;&nbsp; ' + fmt(T / 9.80665) + ' kgf&middot;m &nbsp;&middot;&nbsp; ' + fmt(T / 1.35582) + ' lbf&middot;ft';
}
['bt-k', 'bt-f', 'bt-d'].forEach((id) => $(id).addEventListener('input', calcTorque));

// --- Beam deflection ---
function calcBeam() {
    const W = num($('bd-w').value), L = num($('bd-l').value), b = num($('bd-b').value), h = num($('bd-h').value), E = num($('bd-e').value);
    if (isNaN(W) || isNaN(L) || isNaN(b) || isNaN(h) || isNaN(E) || W <= 0 || L <= 0 || b <= 0 || h <= 0 || E <= 0) { $('bd-out').textContent = '—'; return; }
    const I = b * Math.pow(h, 3) / 12;
    const dlt = W * Math.pow(L, 3) / (48 * E * 1000 * I);
    const sig = (W * L / 4) * (h / 2) / I;
    $('bd-out').textContent = fmt(dlt);
    $('bd-out-unit').innerHTML = 'mm deflection at mid-span &nbsp;&middot;&nbsp; ' + fmt(sig) + ' MPa max bending stress (I = ' + fmt(I) + ' mm&sup4;)';
}
['bd-w', 'bd-l', 'bd-b', 'bd-h', 'bd-e'].forEach((id) => $(id).addEventListener('input', calcBeam));

// --- Cylinder / pipe volume ---
function setVolumeMode() {
    const mode = $('cv-mode').value;
    $('cv-r-wrap').style.display = mode === 'cyl' ? 'flex' : 'none';
    $('cv-od-wrap').style.display = mode === 'pipe' ? 'flex' : 'none';
    $('cv-id-wrap').style.display = mode === 'pipe' ? 'flex' : 'none';
    calcVolume();
}
function calcVolume() {
    const L = num($('cv-l').value), d = num($('cv-d').value);
    const mode = $('cv-mode').value;
    let A = NaN;
    if (mode === 'cyl') {
        const r = num($('cv-r').value);
        A = Math.PI * r * r;
    } else {
        const od = num($('cv-od').value), id = num($('cv-id').value);
        A = Math.PI * (Math.pow(od / 2, 2) - Math.pow(id / 2, 2));
    }
    if (isNaN(A) || isNaN(L) || isNaN(d) || A <= 0 || L <= 0) { $('cv-out').textContent = '—'; return; }
    const Vmm3 = A * L;
    $('cv-out').textContent = fmt(Vmm3 / 1e6);
    $('cv-out-unit').innerHTML = 'litres &nbsp;&middot;&nbsp; ' + fmt(Vmm3) + ' mm&sup3; &nbsp;&middot;&nbsp; ' + fmt(Vmm3 / 1e9 * d) + ' kg (at ' + fmt(d) + ' kg/m&sup3;)';
}
$('cv-mode').addEventListener('change', setVolumeMode);
['cv-r', 'cv-od', 'cv-id', 'cv-l', 'cv-d'].forEach((id) => $(id).addEventListener('input', calcVolume));

// --- Hoop stress ---
function calcHoop() {
    const P = num($('hs-p').value), D = num($('hs-d').value), t = num($('hs-t').value);
    if (isNaN(P) || isNaN(D) || isNaN(t) || P < 0 || D <= 0 || t <= 0) { $('hs-out').textContent = '—'; return; }
    const hoop = P * D / (2 * t);
    const long = P * D / (4 * t);
    const ratio = D / t;
    const ok = ratio >= 20;
    $('hs-out').textContent = fmt(hoop);
    $('hs-out-unit').innerHTML = 'MPa hoop &nbsp;&middot;&nbsp; ' + fmt(long) + ' MPa longitudinal &nbsp;&middot;&nbsp; <span class="' + (ok ? '' : 'warn') + '">D/t = ' + fmt(ratio) + (ok ? ' (thin-wall assumption OK)' : ' &mdash; thick wall, use Lame\u2019s equation') + '</span>';
}
['hs-p', 'hs-d', 'hs-t'].forEach((id) => $(id).addEventListener('input', calcHoop));

// --- Axial stress ---
function setAxialShape() {
    const shape = $('as-shape').value;
    $('as-d').closest('.field').style.display = shape === 'round' ? 'flex' : 'none';
    $('as-r-wrap').style.display = shape === 'rect' ? 'flex' : 'none';
    $('as-h-wrap').style.display = shape === 'rect' ? 'flex' : 'none';
    calcAxial();
}
function calcAxial() {
    const F = num($('as-f').value), y = num($('as-y').value);
    const shape = $('as-shape').value;
    let A = NaN;
    if (shape === 'round') {
        const d = num($('as-d').value);
        A = Math.PI * d * d / 4;
    } else {
        const b = num($('as-b').value), h = num($('as-h').value);
        A = b * h;
    }
    if (isNaN(F) || isNaN(A) || isNaN(y) || A <= 0 || y <= 0) { $('as-out').textContent = '—'; return; }
    const sig = F * 1000 / A;
    const sf = y / sig;
    $('as-out').textContent = fmt(sig);
    $('as-out-unit').innerHTML = 'MPa tensile &nbsp;&middot;&nbsp; safety factor <span class="' + (sf >= 1 ? '' : 'warn') + '">' + fmt(sf) + '</span>' + (sf < 1 ? ' &mdash; FAILS' : '');
}
$('as-shape').addEventListener('change', setAxialShape);
['as-f', 'as-d', 'as-b', 'as-h', 'as-y'].forEach((id) => $(id).addEventListener('input', calcAxial));

// --- Init ---
setCat();
setVolumeMode();
setAxialShape();
calcTorque();
calcBeam();
calcVolume();
calcHoop();
calcAxial();