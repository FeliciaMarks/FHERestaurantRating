const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Performance Testing Script
 * Measures gas costs and execution times for contract operations
 */

async function runPerformanceTests() {
  console.log("=".repeat(60));
  console.log("Performance Testing - Private Restaurant Rating System");
  console.log("=".repeat(60));

  const [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

  console.log("\nDeploying contract...");
  const PrivateRestaurantRating = await ethers.getContractFactory("PrivateRestaurantRating");
  const contract = await PrivateRestaurantRating.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`Contract deployed at: ${contractAddress}`);

  const performanceResults = {
    timestamp: new Date().toISOString(),
    contractAddress: contractAddress,
    network: network.name,
    tests: [],
    summary: {
      totalGasUsed: 0,
      averageGasPerOperation: 0,
      totalOperations: 0,
    },
  };

  // Test 1: Restaurant Registration
  console.log("\n" + "-".repeat(60));
  console.log("Test 1: Restaurant Registration Performance");
  console.log("-".repeat(60));

  const registrationTests = [];
  for (let i = 0; i < 5; i++) {
    const startTime = Date.now();
    const tx = await contract.connect(owner).registerRestaurant(
      `Restaurant ${i + 1}`,
      `Location ${i + 1}`
    );
    const receipt = await tx.wait();
    const endTime = Date.now();

    const gasUsed = Number(receipt.gasUsed);
    const executionTime = endTime - startTime;

    registrationTests.push({
      operation: `Register Restaurant ${i + 1}`,
      gasUsed: gasUsed,
      executionTime: executionTime,
    });

    console.log(`  Restaurant ${i + 1}:`);
    console.log(`    Gas Used: ${gasUsed.toLocaleString()}`);
    console.log(`    Execution Time: ${executionTime}ms`);
  }

  const avgRegistrationGas =
    registrationTests.reduce((sum, test) => sum + test.gasUsed, 0) / registrationTests.length;

  performanceResults.tests.push({
    name: "Restaurant Registration",
    iterations: registrationTests.length,
    averageGas: avgRegistrationGas,
    tests: registrationTests,
  });

  console.log(`\nAverage Registration Gas: ${avgRegistrationGas.toLocaleString()}`);

  // Test 2: Review Submission
  console.log("\n" + "-".repeat(60));
  console.log("Test 2: Review Submission Performance");
  console.log("-".repeat(60));

  const reviewTests = [];
  const users = [user1, user2, user3, user4, user5];

  for (let i = 0; i < users.length; i++) {
    const startTime = Date.now();
    const tx = await contract.connect(users[i]).submitReview(
      1, // Restaurant ID
      8, // Food quality
      9, // Service
      7, // Atmosphere
      8, // Price/value
      8, // Overall rating
      `Great experience at restaurant 1 by user ${i + 1}`
    );
    const receipt = await tx.wait();
    const endTime = Date.now();

    const gasUsed = Number(receipt.gasUsed);
    const executionTime = endTime - startTime;

    reviewTests.push({
      operation: `Submit Review ${i + 1}`,
      gasUsed: gasUsed,
      executionTime: executionTime,
    });

    console.log(`  Review ${i + 1}:`);
    console.log(`    Gas Used: ${gasUsed.toLocaleString()}`);
    console.log(`    Execution Time: ${executionTime}ms`);
  }

  const avgReviewGas = reviewTests.reduce((sum, test) => sum + test.gasUsed, 0) / reviewTests.length;

  performanceResults.tests.push({
    name: "Review Submission",
    iterations: reviewTests.length,
    averageGas: avgReviewGas,
    tests: reviewTests,
  });

  console.log(`\nAverage Review Gas: ${avgReviewGas.toLocaleString()}`);

  // Test 3: Data Retrieval
  console.log("\n" + "-".repeat(60));
  console.log("Test 3: Data Retrieval Performance");
  console.log("-".repeat(60));

  const retrievalTests = [];

  // Get restaurant
  let startTime = Date.now();
  await contract.getRestaurant(1);
  let endTime = Date.now();
  retrievalTests.push({
    operation: "Get Restaurant",
    gasUsed: 0, // View function, no gas
    executionTime: endTime - startTime,
  });
  console.log(`  Get Restaurant: ${endTime - startTime}ms`);

  // Get total counts
  startTime = Date.now();
  await contract.getTotalCounts();
  endTime = Date.now();
  retrievalTests.push({
    operation: "Get Total Counts",
    gasUsed: 0,
    executionTime: endTime - startTime,
  });
  console.log(`  Get Total Counts: ${endTime - startTime}ms`);

  // Check has reviewed
  startTime = Date.now();
  await contract.hasReviewed(1, user1.address);
  endTime = Date.now();
  retrievalTests.push({
    operation: "Check Has Reviewed",
    gasUsed: 0,
    executionTime: endTime - startTime,
  });
  console.log(`  Check Has Reviewed: ${endTime - startTime}ms`);

  performanceResults.tests.push({
    name: "Data Retrieval",
    iterations: retrievalTests.length,
    averageGas: 0,
    tests: retrievalTests,
  });

  // Calculate summary
  const totalGasUsed = [...registrationTests, ...reviewTests].reduce(
    (sum, test) => sum + test.gasUsed,
    0
  );
  const totalOperations = registrationTests.length + reviewTests.length;

  performanceResults.summary.totalGasUsed = totalGasUsed;
  performanceResults.summary.averageGasPerOperation = totalGasUsed / totalOperations;
  performanceResults.summary.totalOperations = totalOperations;

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("Performance Test Summary");
  console.log("=".repeat(60));
  console.log(`Total Operations: ${totalOperations}`);
  console.log(`Total Gas Used: ${totalGasUsed.toLocaleString()}`);
  console.log(`Average Gas per Operation: ${Math.round(performanceResults.summary.averageGasPerOperation).toLocaleString()}`);
  console.log("=".repeat(60));

  // Gas cost analysis (assuming 50 Gwei gas price and $3000 ETH)
  const gasPrice = 50; // Gwei
  const ethPrice = 3000; // USD
  const avgCostWei = performanceResults.summary.averageGasPerOperation * gasPrice * 1e9;
  const avgCostEth = avgCostWei / 1e18;
  const avgCostUsd = avgCostEth * ethPrice;

  console.log("\nCost Analysis (50 Gwei gas price, $3000 ETH):");
  console.log(`  Average Cost per Operation: $${avgCostUsd.toFixed(4)} USD`);
  console.log(`  Average Cost per Operation: ${avgCostEth.toFixed(6)} ETH`);

  // Performance ratings
  console.log("\nPerformance Ratings:");
  if (avgRegistrationGas < 300000) {
    console.log("  ✅ Restaurant Registration: EXCELLENT");
  } else if (avgRegistrationGas < 500000) {
    console.log("  ✅ Restaurant Registration: GOOD");
  } else {
    console.log("  ⚠️  Restaurant Registration: NEEDS OPTIMIZATION");
  }

  if (avgReviewGas < 400000) {
    console.log("  ✅ Review Submission: EXCELLENT");
  } else if (avgReviewGas < 600000) {
    console.log("  ✅ Review Submission: GOOD");
  } else {
    console.log("  ⚠️  Review Submission: NEEDS OPTIMIZATION");
  }

  // Save results
  const performanceDir = path.join(__dirname, "../performance");
  if (!fs.existsSync(performanceDir)) {
    fs.mkdirSync(performanceDir, { recursive: true });
  }

  const performanceFile = path.join(performanceDir, `performance-test-${Date.now()}.json`);
  fs.writeFileSync(performanceFile, JSON.stringify(performanceResults, null, 2));
  console.log(`\n📊 Performance report saved to: ${performanceFile}`);

  console.log("\n✅ Performance testing completed!");
}

runPerformanceTests()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Performance testing failed:");
    console.error(error);
    process.exit(1);
  });
