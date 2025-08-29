const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowdsale", function () {
  let Token, Crowdsale, token, crowdsale, owner, investor;

  beforeEach(async function () {
    [owner, investor] = await ethers.getSigners();

    Token = await ethers.getContractFactory("MyToken");
    token = await Token.deploy(ethers.parseUnits("1000000", 18));

    Crowdsale = await ethers.getContractFactory("Crowdsale");
    crowdsale = await Crowdsale.deploy(await token.getAddress(), 1000);

    // Transfer tokens to Crowdsale
    await token.transfer(await crowdsale.getAddress(), ethers.parseUnits("500000", 18));
  });

  it("should allow investors to buy tokens", async function () {
    await crowdsale.connect(investor).buyTokens({ value: ethers.parseEther("1") });
    const balance = await token.balanceOf(investor.address);
    expect(balance).to.equal(ethers.parseUnits("1000", 18));
  });

  it("should track ETH raised", async function () {
    await crowdsale.connect(investor).buyTokens({ value: ethers.parseEther("1") });
    expect(await crowdsale.raised()).to.equal(ethers.parseEther("1"));
  });

  it("should only allow owner to withdraw ETH", async function () {
    await crowdsale.connect(investor).buyTokens({ value: ethers.parseEther("1") });
    await expect(crowdsale.connect(investor).withdrawETH()).to.be.revertedWith("Ownable: caller is not the owner");

    await expect(() => crowdsale.connect(owner).withdrawETH())
      .to.changeEtherBalance(owner, ethers.parseEther("1"));
  });
});
