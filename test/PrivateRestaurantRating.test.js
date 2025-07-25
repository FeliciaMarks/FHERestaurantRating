const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("PrivateRestaurantRating", function () {
  // Fixture to deploy the contract
  async function deployContractFixture() {
    const [owner, restaurantOwner1, restaurantOwner2, reviewer1, reviewer2, reviewer3] =
      await ethers.getSigners();

    const PrivateRestaurantRating = await ethers.getContractFactory("PrivateRestaurantRating");
    const contract = await PrivateRestaurantRating.deploy();
    await contract.waitForDeployment();

    return {
      contract,
      owner,
      restaurantOwner1,
      restaurantOwner2,
      reviewer1,
      reviewer2,
      reviewer3
    };
  }

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const { contract, owner } = await loadFixture(deployContractFixture);
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should initialize counters to zero", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      expect(await contract.restaurantCounter()).to.equal(0);
      expect(await contract.reviewCounter()).to.equal(0);
    });

    it("Should return correct total counts", async function () {
      const { contract } = await loadFixture(deployContractFixture);
      const counts = await contract.getTotalCounts();
      expect(counts.totalRestaurants).to.equal(0);
      expect(counts.totalReviews).to.equal(0);
    });
  });

  describe("Restaurant Registration", function () {
    it("Should register a restaurant successfully", async function () {
      const { contract, restaurantOwner1 } = await loadFixture(deployContractFixture);

      const tx = await contract.connect(restaurantOwner1).registerRestaurant(
        "The Golden Fork",
        "123 Main St, New York, NY"
      );

      await expect(tx)
        .to.emit(contract, "RestaurantRegistered")
        .withArgs(1, "The Golden Fork", restaurantOwner1.address);

      expect(await contract.restaurantCounter()).to.equal(1);
    });

    it("Should store restaurant details correctly", async function () {
      const { contract, restaurantOwner1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "The Golden Fork",
        "123 Main St, New York, NY"
      );

      const restaurant = await contract.getRestaurant(1);
      expect(restaurant.name).to.equal("The Golden Fork");
      expect(restaurant.location).to.equal("123 Main St, New York, NY");
      expect(restaurant.restaurantOwner).to.equal(restaurantOwner1.address);
      expect(restaurant.isActive).to.equal(true);
      expect(restaurant.totalReviews).to.equal(0);
    });

    it("Should allow multiple restaurants to be registered", async function () {
      const { contract, restaurantOwner1, restaurantOwner2 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Restaurant One",
        "Location One"
      );

      await contract.connect(restaurantOwner2).registerRestaurant(
        "Restaurant Two",
        "Location Two"
      );

      expect(await contract.restaurantCounter()).to.equal(2);

      const restaurant1 = await contract.getRestaurant(1);
      const restaurant2 = await contract.getRestaurant(2);

      expect(restaurant1.name).to.equal("Restaurant One");
      expect(restaurant2.name).to.equal("Restaurant Two");
    });
  });

  describe("Review Submission", function () {
    it("Should submit a review successfully", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      // Register restaurant first
      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      const tx = await contract.connect(reviewer1).submitReview(
        1, // restaurantId
        8, // foodQuality
        9, // service
        7, // atmosphere
        8, // priceValue
        8, // overallRating
        "Great dining experience!"
      );

      await expect(tx)
        .to.emit(contract, "ReviewSubmitted")
        .withArgs(1, 1, reviewer1.address);

      expect(await contract.reviewCounter()).to.equal(1);
    });

    it("Should update restaurant review count", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Great!");

      const restaurant = await contract.getRestaurant(1);
      expect(restaurant.totalReviews).to.equal(1);
    });

    it("Should prevent duplicate reviews from same user", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "First review");

      await expect(
        contract.connect(reviewer1).submitReview(1, 7, 8, 6, 7, 7, "Second review")
      ).to.be.revertedWith("User already reviewed this restaurant");
    });

    it("Should prevent restaurant owner from reviewing own restaurant", async function () {
      const { contract, restaurantOwner1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      await expect(
        contract.connect(restaurantOwner1).submitReview(1, 10, 10, 10, 10, 10, "Self review")
      ).to.be.revertedWith("Restaurant owner cannot review own restaurant");
    });

    it("Should reject invalid ratings (below 1)", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      await expect(
        contract.connect(reviewer1).submitReview(1, 0, 9, 7, 8, 8, "Invalid rating")
      ).to.be.revertedWith("Rating must be between 1-10");
    });

    it("Should reject invalid ratings (above 10)", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      await expect(
        contract.connect(reviewer1).submitReview(1, 11, 9, 7, 8, 8, "Invalid rating")
      ).to.be.revertedWith("Rating must be between 1-10");
    });

    it("Should track which users have reviewed a restaurant", async function () {
      const { contract, restaurantOwner1, reviewer1, reviewer2 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      expect(await contract.hasReviewed(1, reviewer1.address)).to.equal(false);

      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Review");

      expect(await contract.hasReviewed(1, reviewer1.address)).to.equal(true);
      expect(await contract.hasReviewed(1, reviewer2.address)).to.equal(false);
    });
  });

  describe("Review Retrieval", function () {
    it("Should retrieve review information correctly", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      await contract.connect(reviewer1).submitReview(
        1, 8, 9, 7, 8, 8, "Excellent service!"
      );

      const review = await contract.getReviewInfo(1);
      expect(review.restaurantId).to.equal(1);
      expect(review.reviewer).to.equal(reviewer1.address);
      expect(review.comment).to.equal("Excellent service!");
      expect(review.isVerified).to.equal(false);
    });

    it("Should retrieve user's review IDs", async function () {
      const { contract, restaurantOwner1, restaurantOwner2, reviewer1 } =
        await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant("Restaurant 1", "Location 1");
      await contract.connect(restaurantOwner2).registerRestaurant("Restaurant 2", "Location 2");

      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Review 1");
      await contract.connect(reviewer1).submitReview(2, 7, 8, 6, 7, 7, "Review 2");

      const reviewIds = await contract.getUserReviews(reviewer1.address);
      expect(reviewIds.length).to.equal(2);
      expect(reviewIds[0]).to.equal(1);
      expect(reviewIds[1]).to.equal(2);
    });

    it("Should retrieve restaurant's review IDs", async function () {
      const { contract, restaurantOwner1, reviewer1, reviewer2 } =
        await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Review 1");
      await contract.connect(reviewer2).submitReview(1, 7, 8, 6, 7, 7, "Review 2");

      const reviewIds = await contract.getRestaurantReviews(1);
      expect(reviewIds.length).to.equal(2);
      expect(reviewIds[0]).to.equal(1);
      expect(reviewIds[1]).to.equal(2);
    });
  });

  describe("Review Verification", function () {
    it("Should allow restaurant owner to verify review", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Great food!");

      const tx = await contract.connect(restaurantOwner1).verifyReview(1);
      await expect(tx).to.emit(contract, "ReviewVerified").withArgs(1, 1);

      const review = await contract.getReviewInfo(1);
      expect(review.isVerified).to.equal(true);
    });

    it("Should allow contract owner to verify review", async function () {
      const { contract, owner, restaurantOwner1, reviewer1 } =
        await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Great food!");

      await contract.connect(owner).verifyReview(1);

      const review = await contract.getReviewInfo(1);
      expect(review.isVerified).to.equal(true);
    });

    it("Should prevent non-authorized users from verifying reviews", async function () {
      const { contract, restaurantOwner1, reviewer1, reviewer2 } =
        await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Great food!");

      await expect(
        contract.connect(reviewer2).verifyReview(1)
      ).to.be.revertedWith("Not authorized to verify");
    });

    it("Should prevent double verification", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Great food!");

      await contract.connect(restaurantOwner1).verifyReview(1);

      await expect(
        contract.connect(restaurantOwner1).verifyReview(1)
      ).to.be.revertedWith("Review already verified");
    });
  });

  describe("Restaurant Management", function () {
    it("Should allow restaurant owner to toggle status", async function () {
      const { contract, restaurantOwner1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      let restaurant = await contract.getRestaurant(1);
      expect(restaurant.isActive).to.equal(true);

      await contract.connect(restaurantOwner1).toggleRestaurantStatus(1);

      restaurant = await contract.getRestaurant(1);
      expect(restaurant.isActive).to.equal(false);

      await contract.connect(restaurantOwner1).toggleRestaurantStatus(1);

      restaurant = await contract.getRestaurant(1);
      expect(restaurant.isActive).to.equal(true);
    });

    it("Should prevent non-owner from toggling restaurant status", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      await expect(
        contract.connect(reviewer1).toggleRestaurantStatus(1)
      ).to.be.revertedWith("Not restaurant owner");
    });

    it("Should prevent reviews on inactive restaurants", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      await contract.connect(restaurantOwner1).toggleRestaurantStatus(1);

      await expect(
        contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Review")
      ).to.be.revertedWith("Restaurant not active");
    });
  });

  describe("Edge Cases", function () {
    it("Should revert when querying non-existent restaurant", async function () {
      const { contract } = await loadFixture(deployContractFixture);

      await expect(contract.getRestaurant(999)).to.be.revertedWith("Restaurant not found");
    });

    it("Should revert when querying non-existent review", async function () {
      const { contract } = await loadFixture(deployContractFixture);

      await expect(contract.getReviewInfo(999)).to.be.revertedWith("Review not found");
    });

    it("Should handle multiple reviews for same restaurant", async function () {
      const { contract, restaurantOwner1, reviewer1, reviewer2, reviewer3 } =
        await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Popular Restaurant",
        "Prime Location"
      );

      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Review 1");
      await contract.connect(reviewer2).submitReview(1, 7, 8, 6, 7, 7, "Review 2");
      await contract.connect(reviewer3).submitReview(1, 9, 10, 8, 9, 9, "Review 3");

      const restaurant = await contract.getRestaurant(1);
      expect(restaurant.totalReviews).to.equal(3);

      const reviewIds = await contract.getRestaurantReviews(1);
      expect(reviewIds.length).to.equal(3);
    });

    it("Should handle empty comment in review", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "");

      const review = await contract.getReviewInfo(1);
      expect(review.comment).to.equal("");
    });

    it("Should handle very long restaurant name", async function () {
      const { contract, restaurantOwner1 } = await loadFixture(deployContractFixture);

      const longName = "A".repeat(200);
      await contract.connect(restaurantOwner1).registerRestaurant(longName, "Location");

      const restaurant = await contract.getRestaurant(1);
      expect(restaurant.name).to.equal(longName);
    });

    it("Should handle very long comment", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant("Restaurant", "Location");

      const longComment = "Great! ".repeat(100);
      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, longComment);

      const review = await contract.getReviewInfo(1);
      expect(review.comment).to.equal(longComment);
    });
  });

  describe("Gas Optimization", function () {
    it("Should register restaurant efficiently", async function () {
      const { contract, restaurantOwner1 } = await loadFixture(deployContractFixture);

      const tx = await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lt(500000);
    });

    it("Should submit review efficiently", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      const tx = await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Great!");
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lt(1000000);
    });

    it("Should verify review efficiently", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant(
        "Test Restaurant",
        "Test Location"
      );

      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Great!");

      const tx = await contract.connect(restaurantOwner1).verifyReview(1);
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lt(100000);
    });
  });

  describe("Data Integrity", function () {
    it("Should maintain review count consistency", async function () {
      const { contract, restaurantOwner1, reviewer1, reviewer2 } =
        await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant("Restaurant", "Location");

      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Review 1");
      await contract.connect(reviewer2).submitReview(1, 7, 8, 6, 7, 7, "Review 2");

      const counts = await contract.getTotalCounts();
      const restaurant = await contract.getRestaurant(1);
      const reviewIds = await contract.getRestaurantReviews(1);

      expect(counts.totalReviews).to.equal(2);
      expect(restaurant.totalReviews).to.equal(2);
      expect(reviewIds.length).to.equal(2);
    });

    it("Should preserve review data accuracy", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant("Restaurant", "Location");

      const ratings = { food: 8, service: 9, atmosphere: 7, price: 8, overall: 8 };
      const comment = "Excellent dining experience!";

      await contract.connect(reviewer1).submitReview(
        1,
        ratings.food,
        ratings.service,
        ratings.atmosphere,
        ratings.price,
        ratings.overall,
        comment
      );

      const review = await contract.getReviewInfo(1);
      expect(review.restaurantId).to.equal(1);
      expect(review.reviewer).to.equal(reviewer1.address);
      expect(review.comment).to.equal(comment);
    });

    it("Should maintain restaurant ownership", async function () {
      const { contract, restaurantOwner1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant("Restaurant", "Location");

      const restaurant = await contract.getRestaurant(1);
      expect(restaurant.restaurantOwner).to.equal(restaurantOwner1.address);
    });
  });

  describe("Rating Boundaries", function () {
    it("Should accept all ratings at minimum boundary (1)", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant("Restaurant", "Location");

      await expect(
        contract.connect(reviewer1).submitReview(1, 1, 1, 1, 1, 1, "Minimum ratings")
      ).to.not.be.reverted;
    });

    it("Should accept all ratings at maximum boundary (10)", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant("Restaurant", "Location");

      await expect(
        contract.connect(reviewer1).submitReview(1, 10, 10, 10, 10, 10, "Maximum ratings")
      ).to.not.be.reverted;
    });

    it("Should reject food quality rating of 0", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant("Restaurant", "Location");

      await expect(
        contract.connect(reviewer1).submitReview(1, 0, 5, 5, 5, 5, "Invalid")
      ).to.be.revertedWith("Rating must be between 1-10");
    });

    it("Should reject service rating above 10", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant("Restaurant", "Location");

      await expect(
        contract.connect(reviewer1).submitReview(1, 5, 11, 5, 5, 5, "Invalid")
      ).to.be.revertedWith("Rating must be between 1-10");
    });
  });

  describe("Multiple Restaurants", function () {
    it("Should handle multiple restaurant registrations", async function () {
      const { contract, restaurantOwner1, restaurantOwner2 } =
        await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant("Restaurant 1", "Location 1");
      await contract.connect(restaurantOwner2).registerRestaurant("Restaurant 2", "Location 2");
      await contract.connect(restaurantOwner1).registerRestaurant("Restaurant 3", "Location 3");

      const counts = await contract.getTotalCounts();
      expect(counts.totalRestaurants).to.equal(3);
    });

    it("Should allow user to review multiple restaurants", async function () {
      const { contract, restaurantOwner1, restaurantOwner2, reviewer1 } =
        await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant("Restaurant 1", "Location 1");
      await contract.connect(restaurantOwner2).registerRestaurant("Restaurant 2", "Location 2");

      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Review 1");
      await contract.connect(reviewer1).submitReview(2, 7, 8, 6, 7, 7, "Review 2");

      const userReviews = await contract.getUserReviews(reviewer1.address);
      expect(userReviews.length).to.equal(2);
    });

    it("Should track reviews separately for each restaurant", async function () {
      const { contract, restaurantOwner1, restaurantOwner2, reviewer1, reviewer2 } =
        await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant("Restaurant 1", "Location 1");
      await contract.connect(restaurantOwner2).registerRestaurant("Restaurant 2", "Location 2");

      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Review 1-1");
      await contract.connect(reviewer2).submitReview(1, 7, 8, 6, 7, 7, "Review 1-2");
      await contract.connect(reviewer1).submitReview(2, 9, 10, 8, 9, 9, "Review 2-1");

      const restaurant1Reviews = await contract.getRestaurantReviews(1);
      const restaurant2Reviews = await contract.getRestaurantReviews(2);

      expect(restaurant1Reviews.length).to.equal(2);
      expect(restaurant2Reviews.length).to.equal(1);
    });
  });

  describe("Event Emissions", function () {
    it("Should emit RestaurantRegistered with correct parameters", async function () {
      const { contract, restaurantOwner1 } = await loadFixture(deployContractFixture);

      await expect(
        contract.connect(restaurantOwner1).registerRestaurant("Test Restaurant", "Test Location")
      )
        .to.emit(contract, "RestaurantRegistered")
        .withArgs(1, "Test Restaurant", restaurantOwner1.address);
    });

    it("Should emit ReviewSubmitted with correct parameters", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant("Restaurant", "Location");

      await expect(
        contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Great!")
      )
        .to.emit(contract, "ReviewSubmitted")
        .withArgs(1, 1, reviewer1.address);
    });

    it("Should emit ReviewVerified when review is verified", async function () {
      const { contract, restaurantOwner1, reviewer1 } = await loadFixture(deployContractFixture);

      await contract.connect(restaurantOwner1).registerRestaurant("Restaurant", "Location");
      await contract.connect(reviewer1).submitReview(1, 8, 9, 7, 8, 8, "Great!");

      await expect(contract.connect(restaurantOwner1).verifyReview(1))
        .to.emit(contract, "ReviewVerified")
        .withArgs(1, 1);
    });
  });
});
