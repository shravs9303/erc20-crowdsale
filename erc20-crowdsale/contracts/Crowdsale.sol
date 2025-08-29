// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Crowdsale contract for selling MyToken in exchange for ETH
contract Crowdsale is Ownable {
    IERC20 public token;        // Token being sold
    uint256 public rate;        // How many tokens per ETH
    uint256 public raised;      // Total ETH raised

    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    event Withdrawn(address indexed owner, uint256 amount);

    constructor(address _token, uint256 _rate) Ownable(msg.sender) {
        require(_token != address(0), "Token address cannot be zero");
        require(_rate > 0, "Rate must be greater than zero");

        token = IERC20(_token);
        rate = _rate;
    }

    /// @notice Buy tokens by sending ETH
    function buyTokens() external payable {
        require(msg.value > 0, "Send ETH to buy tokens");

        uint256 tokens = msg.value * rate;
        raised += msg.value;

        require(token.transfer(msg.sender, tokens), "Token transfer failed");

        emit TokensPurchased(msg.sender, msg.value, tokens);
    }

    /// @notice Withdraw collected ETH (only owner)
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");

        payable(owner()).transfer(balance);

        emit Withdrawn(owner(), balance);
    }
}
