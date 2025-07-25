const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('⛽ Running Gas Analysis...\n');

// Run tests with gas reporting
console.log('Running tests with gas reporting...');
try {
  execSync('REPORT_GAS=true npm test', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to run gas analysis');
  process.exit(1);
}

// Parse gas report
const gasReportPath = path.join(__dirname, '..', '..', 'gas-report.txt');
if (fs.existsSync(gasReportPath)) {
  console.log('\n📊 Gas Report Summary:\n');
  const report = fs.readFileSync(gasReportPath, 'utf8');
  console.log(report);
  
  // Check for high gas usage
  const lines = report.split('\n');
  let warnings = [];
  
  lines.forEach(line => {
    // Look for functions using more than 1M gas
    if (line.includes('gas:') && parseInt(line.match(/\d+/)?.[0] || 0) > 1000000) {
      warnings.push(line);
    }
  });
  
  if (warnings.length > 0) {
    console.log('\n⚠️  High gas usage detected:');
    warnings.forEach(w => console.log('  ' + w));
  }
}

console.log('\n✅ Gas analysis complete');
