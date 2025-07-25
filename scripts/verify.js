const { run } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(60));
  console.log("Contract Verification Script");
  console.log("=".repeat(60));

  // Get network name
  const networkName = network.name;
  console.log(`\nNetwork: ${networkName}`);

  // Load latest deployment info
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const latestFile = path.join(deploymentsDir, `${networkName}_latest.json`);

  if (!fs.existsSync(latestFile)) {
    console.error(`\n❌ Error: No deployment found for network ${networkName}`);
    console.error(`   Please deploy the contract first using: npm run deploy:${networkName}`);
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(latestFile, "utf8"));
  const contractAddress = deploymentInfo.contractAddress;

  console.log(`Contract address: ${contractAddress}`);

  // Check if Etherscan API key is configured
  if (!process.env.ETHERSCAN_API_KEY) {
    console.error("\n❌ Error: ETHERSCAN_API_KEY not found in .env file");
    console.error("   Please add your Etherscan API key to .env file");
    process.exit(1);
  }

  console.log("\n" + "-".repeat(60));
  console.log("Starting verification process...");
  console.log("-".repeat(60));

  try {
    // Verify the contract
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
      contract: "contracts/PrivateRestaurantRating.sol:PrivateRestaurantRating",
    });

    console.log("\n" + "=".repeat(60));
    console.log("✅ Contract verified successfully!");
    console.log("=".repeat(60));

    // Display Etherscan link
    if (networkName === "sepolia") {
      console.log(`\n📊 View verified contract at:`);
      console.log(`   https://sepolia.etherscan.io/address/${contractAddress}#code`);
    }

    // Update deployment info with verification status
    deploymentInfo.verified = true;
    deploymentInfo.verificationTime = new Date().toISOString();
    fs.writeFileSync(latestFile, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n📄 Deployment info updated with verification status`);

  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✅ Contract is already verified!");

      // Display Etherscan link
      if (networkName === "sepolia") {
        console.log(`\n📊 View verified contract at:`);
        console.log(`   https://sepolia.etherscan.io/address/${contractAddress}#code`);
      }
    } else {
      console.error("\n❌ Verification failed:");
      console.error(error.message);
      process.exit(1);
    }
  }

  console.log("\n" + "=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Script failed:");
    console.error(error);
    process.exit(1);
  });
