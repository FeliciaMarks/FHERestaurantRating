const fs = require('fs');
const path = require('path');

console.log('🛡️  Checking for DoS Vulnerabilities...\n');

const contractsDir = path.join(__dirname, '..', '..', 'contracts');
const files = getAllSolidityFiles(contractsDir);

const dosPatterns = [
  {
    name: 'Unbounded Loop',
    pattern: /for\s*\([^)]*;\s*[^;]*\.length\s*;/g,
    severity: 'HIGH',
    description: 'Loops over dynamic arrays can cause DoS'
  },
  {
    name: 'External Call in Loop',
    pattern: /for\s*\([^}]*\.call\([^}]*\)/gs,
    severity: 'CRITICAL',
    description: 'External calls in loops can be exploited'
  },
  {
    name: 'Transfer in Loop',
    pattern: /for\s*\([^}]*\.transfer\([^}]*\)/gs,
    severity: 'HIGH',
    description: 'Multiple transfers can cause DoS'
  },
  {
    name: 'Unbounded Array Push',
    pattern: /\.push\(/g,
    severity: 'MEDIUM',
    description: 'Array growth without bounds check'
  }
];

let findings = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const fileName = path.basename(file);
  
  dosPatterns.forEach(pattern => {
    const matches = content.match(pattern.pattern);
    if (matches) {
      findings.push({
        file: fileName,
        pattern: pattern.name,
        severity: pattern.severity,
        description: pattern.description,
        count: matches.length
      });
    }
  });
});

// Display findings
if (findings.length === 0) {
  console.log('✅ No obvious DoS vulnerabilities detected\n');
} else {
  console.log('⚠️  Potential DoS vulnerabilities found:\n');
  
  findings.forEach(finding => {
    console.log(`[${finding.severity}] ${finding.file}`);
    console.log(`  Issue: ${finding.pattern}`);
    console.log(`  Description: ${finding.description}`);
    console.log(`  Occurrences: ${finding.count}\n`);
  });
  
  const critical = findings.filter(f => f.severity === 'CRITICAL');
  if (critical.length > 0) {
    console.error('❌ CRITICAL DoS vulnerabilities found!');
    process.exit(1);
  }
}

function getAllSolidityFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllSolidityFiles(file));
    } else if (file.endsWith('.sol')) {
      results.push(file);
    }
  });
  
  return results;
}

console.log('✅ DoS check complete');
