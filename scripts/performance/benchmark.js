const { ethers } = require("hardhat");

async function main() {
  console.log("Performance Benchmark");
  
  const PrivateRestaurantRating = await ethers.getContractFactory("PrivateRestaurantRating");
  const contract = await PrivateRestaurantRating.deploy();
  await contract.waitForDeployment();
  
  console.log("Contract deployed successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
