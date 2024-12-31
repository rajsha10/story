const hre = require("hardhat");

async function main() {
  console.log("Starting deployment script...");

  // Replace "ImageStorage" with "Stewry" to deploy the correct contract
  const Stewry = await hre.ethers.getContractFactory("Stewry");

  console.log("Deploying Stewry contract...");
  console.log("Waiting for the contract to be deployed...");

  // Deploy the contract and wait for deployment to complete
  const stewry = await Stewry.deploy();
  await stewry.waitForDeployment();  // Wait for the deployment to complete

  const address = await stewry.getAddress();  // Get the contract address

  console.log("Stewry contract deployed successfully!");
  console.log("Contract Address:", address);
}

// Execute the main function and handle any errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
