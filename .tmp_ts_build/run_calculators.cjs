const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'lib', 'calculators.ts');
const src = fs.readFileSync(file, 'utf8');

// Extract the calculatorLogic object literal
const startToken = 'export const calculatorLogic';
const start = src.indexOf(startToken);
if (start === -1) {
  console.error('calculatorLogic not found');
  process.exit(1);
}
const braceStart = src.indexOf('{', start);
let i = braceStart;
let depth = 0;
let end = -1;
for (; i < src.length; i++) {
  const ch = src[i];
  if (ch === '{') depth++;
  else if (ch === '}') {
    depth--;
    if (depth === 0) { end = i; break; }
  }
}
if (end === -1) { console.error('Could not find end of calculatorLogic'); process.exit(1); }
const objText = src.slice(braceStart, end + 1);

// Build a runnable JS module text. Provide dummy imports used at top.
const moduleText = `const Home = null; const IndianRupee = null; const Percent = null;\nconst calculatorLogic = ${objText};\nmodule.exports = { calculatorLogic };`;

// Write temp file and require it
const tmpFile = path.join(__dirname, 'calculator_logic_extracted.cjs');
fs.writeFileSync(tmpFile, moduleText, 'utf8');

const { calculatorLogic } = require(tmpFile);

function runAll() {
  const results = {};
  for (const [key, calc] of Object.entries(calculatorLogic)) {
    try {
      const defaults = {};
      if (calc && Array.isArray(calc.inputs)) {
        for (const input of calc.inputs) {
          defaults[input.id] = input.default;
        }
      }
      const out = calc.calculate(defaults);
      // Check for NaN or non-number where number expected
      const issues = [];
      for (const [k, v] of Object.entries(out)) {
        if (typeof v === 'number' && !isFinite(v)) issues.push(`${k}: ${v}`);
        if (typeof v === 'number' && Number.isNaN(v)) issues.push(`${k}: NaN`);
      }
      results[key] = { ok: issues.length === 0, output: out, issues };
    } catch (err) {
      results[key] = { ok: false, error: String(err) };
    }
  }
  return results;
}

const res = runAll();
const bad = Object.entries(res).filter(([, v]) => !v.ok);
console.log('Checked', Object.keys(res).length, 'calculators — failures:', bad.length);
if (bad.length > 0) {
  for (const [k, v] of bad) {
    console.log('\n----', k, '----');
    console.log(v.error ? 'ERROR:' : 'ISSUES:');
    console.log(v.error || v.issues);
    console.log('Output sample:', v.output);
  }
}

fs.unlinkSync(tmpFile);

process.exit(bad.length > 0 ? 1 : 0);
