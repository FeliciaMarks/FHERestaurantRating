const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔒 Running Security Checks...\n');

const checks = [
  {
    name: 'NPM Audit',
    command: 'npm audit --audit-level=moderate',
    critical: false
  },
  {
    name: 'Solidity Linting',
    command: 'npm run lint:sol',
    critical: true
  },
  {
    name: 'Check for console.log in contracts',
    fn: checkConsoleLog,
    critical: true
  },
  {
    name: 'Check for TODO comments',
    fn: checkTodos,
    critical: false
  },
  {
    name: 'Check .env file',
    fn: checkEnvFile,
    critical: true
  }
];

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    return false;
  }
}

function checkConsoleLog() {
  const contractsDir = path.join(__dirname, '..', '..', 'contracts');
  const files = getAllSolidityFiles(contractsDir);
  
  let found = false;
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('console.log') || content.includes('console.error')) {
      console.error(`❌ Found console.log in ${file}`);
      found = true;
    }
  });
  
  if (!found) {
    console.log('✅ No console.log statements found');
  }
  
  return !found;
}

function checkTodos() {
  const contractsDir = path.join(__dirname, '..', '..', 'contracts');
  const files = getAllSolidityFiles(contractsDir);
  
  let count = 0;
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(/\/\/\s*TODO/gi) || [];
    count += matches.length;
  });
  
  if (count > 0) {
    console.log(`⚠️  Found ${count} TODO comment(s) in contracts`);
  } else {
    console.log('✅ No TODO comments found');
  }
  
  return true; // Non-critical
}

function checkEnvFile() {
  const envPath = path.join(__dirname, '..', '..', '.env');
  
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file exists - ensure it contains no sensitive data in repo');
    
    // Check if .env is in .gitignore
    const gitignorePath = path.join(__dirname, '..', '..', '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignore = fs.readFileSync(gitignorePath, 'utf8');
      if (!gitignore.includes('.env')) {
        console.error('❌ .env is not in .gitignore!');
        return false;
      }
    }
  }
  
  console.log('✅ .env configuration OK');
  return true;
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

// Run all checks
let failed = false;
checks.forEach(check => {
  console.log(`\n🔍 ${check.name}...`);
  
  let result;
  if (check.command) {
    result = runCommand(check.command);
  } else if (check.fn) {
    result = check.fn();
  }
  
  if (!result && check.critical) {
    console.error(`❌ CRITICAL: ${check.name} failed!`);
    failed = true;
  }
});

console.log('\n' + '='.repeat(60));
if (failed) {
  console.error('❌ Security checks FAILED!');
  process.exit(1);
} else {
  console.log('✅ All security checks PASSED!');
  process.exit(0);
}
