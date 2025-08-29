const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Deploy ERC20 Token
  const Token = await hre.ethers.getContractFactory("MyToken");
  const token = await Token.deploy(1000000); // 1 million MTK
  await token.waitForDeployment();
  console.log("MyToken deployed at:", token.target);

  // Deploy Crowdsale
  const Crowdsale = await hre.ethers.getContractFactory("Crowdsale");
  const crowdsale = await Crowdsale.deploy(token.target, 1000); // 1 ETH = 1000 MTK
  await crowdsale.waitForDeployment();
  console.log("Crowdsale deployed at:", crowdsale.target);

  // Transfer tokens to Crowdsale for selling
  const tx = await token.transfer(crowdsale.target, hre.ethers.parseUnits("500000", 18));
  await tx.wait();
  console.log("500,000 MTK transferred to Crowdsale");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
