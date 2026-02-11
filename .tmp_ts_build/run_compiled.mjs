import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const modulePath = `./calculators.js`;
const calculatorsModule = await import(modulePath);
const calc = calculatorsModule.calculatorLogic;

function runAll() {
  const results = {};
  for (const [key, c] of Object.entries(calc)) {
    try {
      const defaults = {};
      if (c && Array.isArray(c.inputs)) {
        for (const input of c.inputs) defaults[input.id] = input.default;
      }
      const out = c.calculate(defaults);
      const issues = [];
      if (out == null) issues.push('No output (null/undefined)');
      else {
        for (const [k, v] of Object.entries(out)) {
          if (v === null || v === undefined) issues.push(`${k}: ${v}`);
          if (typeof v === 'number' && !isFinite(v)) issues.push(`${k}: ${v}`);
          if (typeof v === 'number' && Number.isNaN(v)) issues.push(`${k}: NaN`);
        }
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
    if (v.error) console.log('ERROR:', v.error);
    else console.log('ISSUES:', v.issues);
    console.log('Output sample:', v.output);
  }
}

fs.writeFileSync(path.join(__dirname,'report.json'), JSON.stringify(res, null, 2));
process.exit(bad.length>0?1:0);
