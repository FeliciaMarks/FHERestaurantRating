const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Security Audit Script
 * Performs comprehensive security checks on smart contracts
 */

async function performSecurityAudit() {
  console.log("=".repeat(60));
  console.log("Security Audit - Private Restaurant Rating System");
  console.log("=".repeat(60));

  const results = {
    timestamp: new Date().toISOString(),
    checks: [],
    passed: 0,
    failed: 0,
    warnings: 0,
  };

  // Check 1: Contract Compilation
  console.log("\n1. Checking contract compilation...");
  try {
    await hre.run("compile");
    addResult(results, "Contract Compilation", "PASS", "Contracts compile successfully");
  } catch (error) {
    addResult(results, "Contract Compilation", "FAIL", error.message);
  }

  // Check 2: Storage Layout Analysis
  console.log("\n2. Analyzing storage layout...");
  try {
    const artifacts = await hre.artifacts.readArtifact("PrivateRestaurantRating");
    const storageLayout = artifacts.storageLayout;

    if (storageLayout) {
      addResult(results, "Storage Layout", "PASS", "Storage layout properly defined");
    } else {
      addResult(results, "Storage Layout", "WARN", "Storage layout not available");
    }
  } catch (error) {
    addResult(results, "Storage Layout", "WARN", error.message);
  }

  // Check 3: Access Control
  console.log("\n3. Checking access control patterns...");
  const contractSource = fs.readFileSync(
    path.join(__dirname, "../contracts/PrivateRestaurantRating.sol"),
    "utf8"
  );

  const hasModifiers = contractSource.includes("modifier");
  const hasOnlyOwner = contractSource.includes("onlyOwner");

  if (hasModifiers && hasOnlyOwner) {
    addResult(results, "Access Control", "PASS", "Access control modifiers implemented");
  } else {
    addResult(results, "Access Control", "WARN", "Limited access control patterns detected");
  }

  // Check 4: Reentrancy Protection
  console.log("\n4. Checking for reentrancy protection...");
  const hasChecksEffectsInteractions = !contractSource.match(/call\{value:/g);
  const hasReentrancyGuard = contractSource.includes("ReentrancyGuard") ||
                             contractSource.includes("nonReentrant");

  if (hasReentrancyGuard) {
    addResult(results, "Reentrancy Protection", "PASS", "ReentrancyGuard detected");
  } else if (hasChecksEffectsInteractions) {
    addResult(results, "Reentrancy Protection", "PASS", "No external calls with value transfers");
  } else {
    addResult(results, "Reentrancy Protection", "WARN", "Consider adding reentrancy protection");
  }

  // Check 5: Integer Overflow/Underflow
  console.log("\n5. Checking Solidity version for overflow protection...");
  const solidityVersion = contractSource.match(/pragma solidity \^?(\d+\.\d+\.\d+)/);

  if (solidityVersion && parseFloat(solidityVersion[1]) >= 0.8) {
    addResult(results, "Overflow Protection", "PASS", "Solidity 0.8+ provides built-in protection");
  } else {
    addResult(results, "Overflow Protection", "FAIL", "Upgrade to Solidity 0.8+ for overflow protection");
  }

  // Check 6: DoS Protection
  console.log("\n6. Checking for DoS vulnerabilities...");
  const hasUnboundedLoops = contractSource.match(/for\s*\(/g);
  const hasPullPayment = contractSource.includes("withdraw");

  if (!hasUnboundedLoops) {
    addResult(results, "DoS Protection", "PASS", "No unbounded loops detected");
  } else if (hasPullPayment) {
    addResult(results, "DoS Protection", "PASS", "Pull payment pattern implemented");
  } else {
    addResult(results, "DoS Protection", "WARN", "Review loops for potential DoS vectors");
  }

  // Check 7: Event Emission
  console.log("\n7. Checking event emission...");
  const hasEvents = contractSource.includes("event ");
  const emitsEvents = contractSource.includes("emit ");

  if (hasEvents && emitsEvents) {
    addResult(results, "Event Emission", "PASS", "Events properly defined and emitted");
  } else {
    addResult(results, "Event Emission", "WARN", "Consider adding more events for transparency");
  }

  // Check 8: Input Validation
  console.log("\n8. Checking input validation...");
  const hasRequireStatements = (contractSource.match(/require\(/g) || []).length;

  if (hasRequireStatements >= 5) {
    addResult(results, "Input Validation", "PASS", `${hasRequireStatements} require statements found`);
  } else {
    addResult(results, "Input Validation", "WARN", "Consider adding more input validation");
  }

  // Check 9: External Call Safety
  console.log("\n9. Checking external calls...");
  const hasExternalCalls = contractSource.match(/\.call\(|\.delegatecall\(|\.staticcall\(/g);

  if (!hasExternalCalls) {
    addResult(results, "External Calls", "PASS", "No low-level external calls detected");
  } else {
    addResult(results, "External Calls", "WARN", "Review external calls for security");
  }

  // Check 10: Secure Randomness
  console.log("\n10. Checking for insecure randomness...");
  const hasBlockTimestamp = contractSource.includes("block.timestamp");
  const hasBlockNumber = contractSource.includes("block.number");
  const usedForRandomness = contractSource.match(/random|rand/gi);

  if (usedForRandomness && (hasBlockTimestamp || hasBlockNumber)) {
    addResult(results, "Randomness", "WARN", "Avoid using block properties for randomness");
  } else {
    addResult(results, "Randomness", "PASS", "No insecure randomness patterns detected");
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("Security Audit Summary");
  console.log("=".repeat(60));
  console.log(`Total Checks: ${results.checks.length}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Warnings: ${results.warnings}`);
  console.log(`Failed: ${results.failed}`);
  console.log("=".repeat(60));

  // Save results
  const auditDir = path.join(__dirname, "../audits");
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
  }

  const auditFile = path.join(auditDir, `security-audit-${Date.now()}.json`);
  fs.writeFileSync(auditFile, JSON.stringify(results, null, 2));
  console.log(`\nAudit report saved to: ${auditFile}`);

  // Exit with appropriate code
  if (results.failed > 0) {
    console.log("\n❌ Security audit failed!");
    process.exit(1);
  } else if (results.warnings > 0) {
    console.log("\n⚠️  Security audit passed with warnings.");
    process.exit(0);
  } else {
    console.log("\n✅ Security audit passed!");
    process.exit(0);
  }
}

function addResult(results, checkName, status, message) {
  const check = {
    name: checkName,
    status: status,
    message: message,
    timestamp: new Date().toISOString(),
  };

  results.checks.push(check);

  if (status === "PASS") {
    results.passed++;
    console.log(`   ✅ ${checkName}: ${message}`);
  } else if (status === "WARN") {
    results.warnings++;
    console.log(`   ⚠️  ${checkName}: ${message}`);
  } else {
    results.failed++;
    console.log(`   ❌ ${checkName}: ${message}`);
  }
}

// Run the audit
performSecurityAudit()
  .then(() => {
    // Completed
  })
  .catch((error) => {
    console.error("\n" + "=".repeat(60));
    console.error("Security Audit Error");
    console.error("=".repeat(60));
    console.error(error);
    process.exit(1);
  });
