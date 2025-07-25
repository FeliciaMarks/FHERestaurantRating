const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

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

  return { contract, contractAddress };
}

async function simulateRestaurantRegistration(contract, signers) {
  console.log("\n" + "=".repeat(60));
  console.log("Simulating Restaurant Registration");
  console.log("=".repeat(60));

  const restaurants = [
    { name: "The Golden Fork", location: "123 Main St, New York, NY" },
    { name: "Ocean Breeze Seafood", location: "456 Harbor Rd, Seattle, WA" },
    { name: "Bella Italia Trattoria", location: "789 Vine St, San Francisco, CA" },
    { name: "Sakura Sushi House", location: "321 Cherry Ln, Los Angeles, CA" },
    { name: "La Maison Française", location: "654 Boulevard Ave, Chicago, IL" },
  ];

  const registeredRestaurants = [];

  for (let i = 0; i < restaurants.length && i < signers.length; i++) {
    const restaurant = restaurants[i];
    const signer = signers[i];

    console.log(`\n${i + 1}. Registering "${restaurant.name}"...`);
    console.log(`   Owner: ${signer.address}`);

    try {
      const tx = await contract.connect(signer).registerRestaurant(
        restaurant.name,
        restaurant.location
      );

      const receipt = await tx.wait();

      // Get restaurant ID from event
      const event = receipt.logs.find(log => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed && parsed.name === "RestaurantRegistered";
        } catch {
          return false;
        }
      });

      let restaurantId;
      if (event) {
        const parsed = contract.interface.parseLog(event);
        restaurantId = parsed.args.restaurantId;
      }

      console.log(`   ✅ Registered with ID: ${restaurantId}`);
      console.log(`   Gas used: ${receipt.gasUsed.toString()}`);

      registeredRestaurants.push({
        id: restaurantId,
        name: restaurant.name,
        location: restaurant.location,
        owner: signer.address,
      });
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }

  return registeredRestaurants;
}

async function simulateReviewSubmission(contract, signers, restaurants) {
  console.log("\n" + "=".repeat(60));
  console.log("Simulating Review Submissions");
  console.log("=".repeat(60));

  const reviews = [];
  let reviewCount = 0;

  // Each non-owner user submits reviews for restaurants they don't own
  for (let i = 0; i < Math.min(signers.length, 10); i++) {
    const reviewer = signers[i];

    for (const restaurant of restaurants) {
      // Skip if this is the restaurant owner
      if (restaurant.owner === reviewer.address) {
        continue;
      }

      // Randomly decide whether to submit a review (70% chance)
      if (Math.random() < 0.7) {
        // Generate random ratings (6-10 for realistic positive bias)
        const foodQuality = Math.floor(Math.random() * 5) + 6;
        const service = Math.floor(Math.random() * 5) + 6;
        const atmosphere = Math.floor(Math.random() * 5) + 6;
        const priceValue = Math.floor(Math.random() * 5) + 6;
        const overallRating = Math.floor((foodQuality + service + atmosphere + priceValue) / 4);

        const comments = [
          "Excellent dining experience!",
          "Great food and service.",
          "Would definitely recommend.",
          "Amazing atmosphere and delicious food.",
          "Good value for money.",
          "Wonderful experience, will come again!",
          "Outstanding quality.",
          "Highly satisfied with the meal.",
        ];
        const comment = comments[Math.floor(Math.random() * comments.length)];

        console.log(`\n${++reviewCount}. Submitting review for "${restaurant.name}"...`);
        console.log(`   Reviewer: ${reviewer.address.substring(0, 10)}...`);
        console.log(`   Ratings: Food=${foodQuality}, Service=${service}, Atmosphere=${atmosphere}, Price=${priceValue}, Overall=${overallRating}`);

        try {
          const tx = await contract.connect(reviewer).submitReview(
            restaurant.id,
            foodQuality,
            service,
            atmosphere,
            priceValue,
            overallRating,
            comment
          );

          const receipt = await tx.wait();

          // Get review ID from event
          const event = receipt.logs.find(log => {
            try {
              const parsed = contract.interface.parseLog(log);
              return parsed && parsed.name === "ReviewSubmitted";
            } catch {
              return false;
            }
          });

          let reviewId;
          if (event) {
            const parsed = contract.interface.parseLog(event);
            reviewId = parsed.args.reviewId;
          }

          console.log(`   ✅ Review submitted with ID: ${reviewId}`);
          console.log(`   Gas used: ${receipt.gasUsed.toString()}`);

          reviews.push({
            id: reviewId,
            restaurantId: restaurant.id,
            reviewer: reviewer.address,
            ratings: { foodQuality, service, atmosphere, priceValue, overallRating },
            comment,
          });
        } catch (error) {
          console.error(`   ❌ Error: ${error.message}`);
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  return reviews;
}

async function displayStatistics(contract, restaurants) {
  console.log("\n" + "=".repeat(60));
  console.log("System Statistics");
  console.log("=".repeat(60));

  try {
    const counts = await contract.getTotalCounts();
    console.log(`\nTotal Restaurants: ${counts.totalRestaurants}`);
    console.log(`Total Reviews: ${counts.totalReviews}`);

    console.log("\n" + "-".repeat(60));
    console.log("Restaurant Details:");
    console.log("-".repeat(60));

    for (const restaurant of restaurants) {
      const details = await contract.getRestaurant(restaurant.id);
      console.log(`\n${restaurant.name}:`);
      console.log(`  ID: ${restaurant.id}`);
      console.log(`  Location: ${restaurant.location}`);
      console.log(`  Owner: ${restaurant.owner}`);
      console.log(`  Active: ${details.isActive}`);
      console.log(`  Total Reviews: ${details.totalReviews}`);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function saveSimulationResults(restaurants, reviews) {
  const simulationData = {
    timestamp: new Date().toISOString(),
    network: network.name,
    restaurants,
    reviews,
    summary: {
      totalRestaurants: restaurants.length,
      totalReviews: reviews.length,
      averageReviewsPerRestaurant: reviews.length / restaurants.length,
    },
  };

  const simulationDir = path.join(__dirname, "..", "simulations");
  if (!fs.existsSync(simulationDir)) {
    fs.mkdirSync(simulationDir, { recursive: true });
  }

  const filename = path.join(simulationDir, `simulation_${Date.now()}.json`);
  fs.writeFileSync(filename, JSON.stringify(simulationData, null, 2));

  console.log(`\n📄 Simulation results saved to: ${filename}`);
}

async function main() {
  console.log("=".repeat(60));
  console.log("Private Restaurant Rating System - Simulation");
  console.log("=".repeat(60));

  try {
    const { contract, contractAddress } = await loadContract();
    const signers = await ethers.getSigners();

    console.log(`\nContract address: ${contractAddress}`);
    console.log(`Network: ${network.name}`);
    console.log(`Available signers: ${signers.length}`);

    if (signers.length < 3) {
      console.warn("\n⚠️  Warning: At least 3 signers recommended for meaningful simulation");
    }

    // Step 1: Register restaurants
    const restaurants = await simulateRestaurantRegistration(contract, signers.slice(0, 5));

    if (restaurants.length === 0) {
      console.error("\n❌ No restaurants registered. Simulation aborted.");
      return;
    }

    // Step 2: Submit reviews
    const reviews = await simulateReviewSubmission(contract, signers, restaurants);

    // Step 3: Display statistics
    await displayStatistics(contract, restaurants);

    // Step 4: Save simulation results
    await saveSimulationResults(restaurants, reviews);

    console.log("\n" + "=".repeat(60));
    console.log("✅ Simulation completed successfully!");
    console.log("=".repeat(60));
    console.log(`\nSummary:`);
    console.log(`  Restaurants registered: ${restaurants.length}`);
    console.log(`  Reviews submitted: ${reviews.length}`);
    console.log(`  Average reviews per restaurant: ${(reviews.length / restaurants.length).toFixed(2)}`);

  } catch (error) {
    console.error(`\n❌ Simulation failed: ${error.message}`);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
