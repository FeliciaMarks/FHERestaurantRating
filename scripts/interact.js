const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify readline question
function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function loadContract() {
  const networkName = network.name;
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const latestFile = path.join(deploymentsDir, `${networkName}_latest.json`);

  if (!fs.existsSync(latestFile)) {
    throw new Error(`No deployment found for network ${networkName}`);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(latestFile, "utf8"));
  const contractAddress = deploymentInfo.contractAddress;

  const PrivateRestaurantRating = await ethers.getContractFactory("PrivateRestaurantRating");
  const contract = PrivateRestaurantRating.attach(contractAddress);

  return { contract, contractAddress, deploymentInfo };
}

async function displayMenu() {
  console.log("\n" + "=".repeat(60));
  console.log("Private Restaurant Rating System - Interactive Menu");
  console.log("=".repeat(60));
  console.log("\n1. View contract information");
  console.log("2. Register a new restaurant");
  console.log("3. View restaurant details");
  console.log("4. Submit a review");
  console.log("5. Check if user has reviewed a restaurant");
  console.log("6. View user's reviews");
  console.log("7. Get total counts");
  console.log("8. Verify a review");
  console.log("9. Toggle restaurant status");
  console.log("0. Exit");
  console.log("\n" + "=".repeat(60));
}

async function viewContractInfo(contract, contractAddress, deploymentInfo) {
  console.log("\n" + "-".repeat(60));
  console.log("Contract Information");
  console.log("-".repeat(60));
  console.log(`Address: ${contractAddress}`);
  console.log(`Network: ${deploymentInfo.network}`);
  console.log(`Chain ID: ${deploymentInfo.chainId}`);
  console.log(`Deployed: ${deploymentInfo.deploymentTime}`);

  const owner = await contract.owner();
  const counts = await contract.getTotalCounts();

  console.log(`\nOwner: ${owner}`);
  console.log(`Total Restaurants: ${counts.totalRestaurants}`);
  console.log(`Total Reviews: ${counts.totalReviews}`);
}

async function registerRestaurant(contract, signer) {
  console.log("\n" + "-".repeat(60));
  console.log("Register New Restaurant");
  console.log("-".repeat(60));

  const name = await question("Enter restaurant name: ");
  const location = await question("Enter restaurant location: ");

  console.log(`\nRegistering restaurant "${name}" at "${location}"...`);

  try {
    const tx = await contract.registerRestaurant(name, location);
    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log(`✅ Restaurant registered successfully!`);
    console.log(`Block number: ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);

    // Get restaurant ID from event
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed && parsed.name === "RestaurantRegistered";
      } catch {
        return false;
      }
    });

    if (event) {
      const parsed = contract.interface.parseLog(event);
      console.log(`Restaurant ID: ${parsed.args.restaurantId}`);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function viewRestaurant(contract) {
  console.log("\n" + "-".repeat(60));
  console.log("View Restaurant Details");
  console.log("-".repeat(60));

  const restaurantId = await question("Enter restaurant ID: ");

  try {
    const restaurant = await contract.getRestaurant(restaurantId);
    console.log(`\nRestaurant #${restaurantId}:`);
    console.log(`Name: ${restaurant.name}`);
    console.log(`Location: ${restaurant.location}`);
    console.log(`Owner: ${restaurant.restaurantOwner}`);
    console.log(`Active: ${restaurant.isActive}`);
    console.log(`Total Reviews: ${restaurant.totalReviews}`);
    console.log(`Created: ${new Date(Number(restaurant.createdAt) * 1000).toLocaleString()}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function submitReview(contract) {
  console.log("\n" + "-".repeat(60));
  console.log("Submit Review");
  console.log("-".repeat(60));

  const restaurantId = await question("Enter restaurant ID: ");
  console.log("\nEnter ratings (1-10):");
  const foodQuality = await question("Food Quality: ");
  const service = await question("Service: ");
  const atmosphere = await question("Atmosphere: ");
  const priceValue = await question("Price/Value: ");
  const overallRating = await question("Overall Rating: ");
  const comment = await question("Comment: ");

  console.log("\nSubmitting review...");

  try {
    const tx = await contract.submitReview(
      restaurantId,
      parseInt(foodQuality),
      parseInt(service),
      parseInt(atmosphere),
      parseInt(priceValue),
      parseInt(overallRating),
      comment
    );
    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log(`✅ Review submitted successfully!`);
    console.log(`Block number: ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);

    // Get review ID from event
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed && parsed.name === "ReviewSubmitted";
      } catch {
        return false;
      }
    });

    if (event) {
      const parsed = contract.interface.parseLog(event);
      console.log(`Review ID: ${parsed.args.reviewId}`);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function checkUserReview(contract) {
  console.log("\n" + "-".repeat(60));
  console.log("Check User Review Status");
  console.log("-".repeat(60));

  const restaurantId = await question("Enter restaurant ID: ");
  const userAddress = await question("Enter user address: ");

  try {
    const hasReviewed = await contract.hasReviewed(restaurantId, userAddress);
    console.log(`\nHas user reviewed this restaurant? ${hasReviewed ? "Yes" : "No"}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function viewUserReviews(contract) {
  console.log("\n" + "-".repeat(60));
  console.log("View User Reviews");
  console.log("-".repeat(60));

  const userAddress = await question("Enter user address: ");

  try {
    const reviewIds = await contract.getUserReviews(userAddress);
    console.log(`\nUser has ${reviewIds.length} review(s):`);
    reviewIds.forEach((id, index) => {
      console.log(`${index + 1}. Review ID: ${id}`);
    });
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function getTotalCounts(contract) {
  console.log("\n" + "-".repeat(60));
  console.log("Total Counts");
  console.log("-".repeat(60));

  try {
    const counts = await contract.getTotalCounts();
    console.log(`\nTotal Restaurants: ${counts.totalRestaurants}`);
    console.log(`Total Reviews: ${counts.totalReviews}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function verifyReview(contract) {
  console.log("\n" + "-".repeat(60));
  console.log("Verify Review");
  console.log("-".repeat(60));

  const reviewId = await question("Enter review ID: ");

  try {
    const tx = await contract.verifyReview(reviewId);
    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log(`✅ Review verified successfully!`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function toggleRestaurantStatus(contract) {
  console.log("\n" + "-".repeat(60));
  console.log("Toggle Restaurant Status");
  console.log("-".repeat(60));

  const restaurantId = await question("Enter restaurant ID: ");

  try {
    const tx = await contract.toggleRestaurantStatus(restaurantId);
    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log(`✅ Restaurant status toggled successfully!`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("Private Restaurant Rating System - Contract Interaction");
  console.log("=".repeat(60));

  try {
    const { contract, contractAddress, deploymentInfo } = await loadContract();
    const [signer] = await ethers.getSigners();

    console.log(`\nConnected to contract at: ${contractAddress}`);
    console.log(`Using account: ${signer.address}`);

    let exit = false;
    while (!exit) {
      await displayMenu();
      const choice = await question("\nSelect an option: ");

      switch (choice) {
        case "1":
          await viewContractInfo(contract, contractAddress, deploymentInfo);
          break;
        case "2":
          await registerRestaurant(contract, signer);
          break;
        case "3":
          await viewRestaurant(contract);
          break;
        case "4":
          await submitReview(contract);
          break;
        case "5":
          await checkUserReview(contract);
          break;
        case "6":
          await viewUserReviews(contract);
          break;
        case "7":
          await getTotalCounts(contract);
          break;
        case "8":
          await verifyReview(contract);
          break;
        case "9":
          await toggleRestaurantStatus(contract);
          break;
        case "0":
          exit = true;
          console.log("\nGoodbye!");
          break;
        default:
          console.log("\n❌ Invalid option. Please try again.");
      }
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  } finally {
    rl.close();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
