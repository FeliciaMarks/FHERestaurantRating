# Deployment Guide

This document provides comprehensive instructions for deploying and managing the Private Restaurant Rating System smart contract.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Sepolia Testnet Deployment](#sepolia-testnet-deployment)
- [Contract Verification](#contract-verification)
- [Deployment Information](#deployment-information)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying the contract, ensure you have the following:

### Required Software

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: For version control

### Required Accounts and Keys

1. **Ethereum Wallet**:
   - MetaMask or any compatible wallet
   - Export your private key (keep it secure!)

2. **RPC Provider**:
   - Alchemy account ([https://www.alchemy.com](https://www.alchemy.com))
   - Infura account ([https://www.infura.io](https://www.infura.io))
   - Or any other Ethereum RPC provider

3. **Etherscan API Key**:
   - Create account at [https://etherscan.io](https://etherscan.io)
   - Generate API key for contract verification

4. **Testnet ETH**:
   - For Sepolia testnet deployment
   - Get free testnet ETH from:
     - [Sepolia Faucet](https://sepoliafaucet.com)
     - [Alchemy Sepolia Faucet](https://sepoliafaucet.com)

## Environment Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Private key from your wallet (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Sepolia RPC URL
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key

# Zama fhEVM RPC URL (if using FHE features)
ZAMA_RPC_URL=https://devnet.zama.ai

# Etherscan API key for verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional: Gas reporting
REPORT_GAS=false
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
```

**⚠️ Security Warning**: Never commit your `.env` file to version control!

## Local Development

### Compile Contracts

```bash
npm run compile
```

This will:
- Compile all Solidity contracts
- Generate TypeScript typings
- Create artifacts in the `artifacts/` directory

### Run Tests

```bash
# Run all tests
npm test

# Run tests with gas reporting
REPORT_GAS=true npm test

# Run tests with coverage
npm run test:coverage
```

### Start Local Hardhat Node

```bash
npm run node
```

This starts a local Ethereum node at `http://127.0.0.1:8545/` with 20 test accounts.

### Deploy to Local Network

In a separate terminal:

```bash
npm run deploy
```

## Sepolia Testnet Deployment

### 1. Verify Prerequisites

Before deploying to Sepolia, ensure:

- ✅ Your wallet has Sepolia ETH (at least 0.1 ETH recommended)
- ✅ Environment variables are configured
- ✅ Contracts compile successfully

Check your balance:

```bash
# Using Hardhat console
npx hardhat console --network sepolia
```

Then in the console:

```javascript
const [deployer] = await ethers.getSigners();
const balance = await ethers.provider.getBalance(deployer.address);
console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
```

### 2. Deploy Contract

```bash
npm run deploy:sepolia
```

Expected output:

```
============================================================
Private Restaurant Rating System - Deployment
============================================================

Deploying to network: sepolia (Chain ID: 11155111)
Deployer address: 0x...
Deployer balance: 0.5 ETH

------------------------------------------------------------
Deploying PrivateRestaurantRating contract...
------------------------------------------------------------

✅ PrivateRestaurantRating deployed to: 0x...
Transaction hash: 0x...
Block number: 12345678
Gas used: 2500000

------------------------------------------------------------
Verifying deployment...
------------------------------------------------------------
Contract owner: 0x...
Initial restaurant counter: 0
Initial review counter: 0

📄 Deployment info saved to: deployments/sepolia_1234567890.json
📄 Latest deployment info saved to: deployments/sepolia_latest.json

============================================================
📊 Etherscan Links:
============================================================
Contract: https://sepolia.etherscan.io/address/0x...
Transaction: https://sepolia.etherscan.io/tx/0x...

⚠️  Remember to verify the contract source code:
   npm run verify:sepolia

============================================================
✅ Deployment completed successfully!
============================================================
```

### 3. Save Deployment Information

The deployment script automatically saves information to:

- `deployments/sepolia_<timestamp>.json` - Historical record
- `deployments/sepolia_latest.json` - Latest deployment (used by other scripts)

Example deployment file:

```json
{
  "network": "sepolia",
  "chainId": 11155111,
  "contractAddress": "0x...",
  "deployer": "0x...",
  "deploymentTime": "2024-01-15T10:30:00.000Z",
  "transactionHash": "0x...",
  "blockNumber": 12345678,
  "owner": "0x...",
  "initialRestaurantCounter": 0,
  "initialReviewCounter": 0
}
```

## Contract Verification

Verify your contract on Etherscan to make the source code publicly available:

```bash
npm run verify:sepolia
```

Expected output:

```
============================================================
Contract Verification Script
============================================================

Network: sepolia
Contract address: 0x...

------------------------------------------------------------
Starting verification process...
------------------------------------------------------------

Successfully submitted source code for contract verification:
...

✅ Contract verified successfully!

📊 View verified contract at:
   https://sepolia.etherscan.io/address/0x...#code

📄 Deployment info updated with verification status
```

### Manual Verification

If automatic verification fails, verify manually on Etherscan:

1. Go to: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
2. Click "Contract" tab → "Verify and Publish"
3. Select:
   - Compiler Type: Solidity (Single file)
   - Compiler Version: v0.8.24
   - License: MIT
4. Paste the flattened contract source
5. Enable optimization: Yes, 200 runs
6. Submit

## Deployment Information

### Current Deployment

**Network**: Sepolia Testnet
**Chain ID**: 11155111
**Contract Address**: `0x0f3e553484dF29aF3423AD6E301b571a255b1142`

**Etherscan Links**:
- Contract: https://sepolia.etherscan.io/address/0x0f3e553484dF29aF3423AD6E301b571a255b1142
- Verified Source Code: https://sepolia.etherscan.io/address/0x0f3e553484dF29aF3423AD6E301b571a255b1142#code

### Interacting with Deployed Contract

#### Using Scripts

**Interactive Menu**:
```bash
npm run interact:sepolia
```

**Simulation (for testing)**:
```bash
npm run simulate:sepolia
```

#### Using Hardhat Console

```bash
npx hardhat console --network sepolia
```

Then interact with the contract:

```javascript
const contractAddress = "0x0f3e553484dF29aF3423AD6E301b571a255b1142";
const PrivateRestaurantRating = await ethers.getContractFactory("PrivateRestaurantRating");
const contract = PrivateRestaurantRating.attach(contractAddress);

// Get total counts
const counts = await contract.getTotalCounts();
console.log(`Restaurants: ${counts.totalRestaurants}, Reviews: ${counts.totalReviews}`);

// Register a restaurant
const tx = await contract.registerRestaurant("My Restaurant", "123 Main St");
await tx.wait();
console.log("Restaurant registered!");

// View restaurant
const restaurant = await contract.getRestaurant(1);
console.log(restaurant);
```

## Post-Deployment Checklist

After successful deployment:

- [ ] Contract deployed and verified on Etherscan
- [ ] Deployment information saved to `deployments/` directory
- [ ] Contract address documented
- [ ] Etherscan links confirmed working
- [ ] Test basic contract functions (register restaurant, submit review)
- [ ] Update frontend configuration with new contract address
- [ ] Announce deployment (if applicable)

## Troubleshooting

### Common Issues

#### 1. Insufficient Funds

**Error**: `sender doesn't have enough funds to send tx`

**Solution**:
- Get more Sepolia ETH from faucets
- Check balance: `npx hardhat console --network sepolia`

#### 2. Nonce Too Low

**Error**: `nonce has already been used`

**Solution**:
- Wait for pending transactions to complete
- Reset account nonce in MetaMask (Settings → Advanced → Reset Account)

#### 3. Contract Verification Failed

**Error**: `Etherscan verification failed`

**Solution**:
- Ensure ETHERSCAN_API_KEY is set correctly
- Try manual verification on Etherscan
- Wait a few minutes and retry

#### 4. RPC Connection Issues

**Error**: `could not detect network`

**Solution**:
- Verify RPC URL is correct
- Check Alchemy/Infura dashboard for API limits
- Try alternative RPC provider

#### 5. Compilation Errors

**Error**: `Solidity compilation failed`

**Solution**:
```bash
# Clean and recompile
npm run clean
npm run compile
```

### Gas Estimation Issues

If deployment fails due to gas:

1. Check current gas prices: https://etherscan.io/gastracker
2. Increase gas limit in `hardhat.config.js`:

```javascript
sepolia: {
  gas: 6000000,
  gasPrice: 'auto',
}
```

### Getting Help

- **Hardhat Documentation**: https://hardhat.org/docs
- **Ethers.js Documentation**: https://docs.ethers.org
- **GitHub Issues**: Create an issue in the project repository
- **Community Support**: Join Hardhat Discord or Ethereum Stack Exchange

## Security Best Practices

1. **Never share your private key**
2. **Use hardware wallets for mainnet deployments**
3. **Test thoroughly on testnet before mainnet**
4. **Audit smart contracts before production deployment**
5. **Use multi-signature wallets for contract ownership**
6. **Monitor contract for unusual activity**
7. **Keep dependencies updated**

## Next Steps

After deployment:

1. ✅ Test all contract functions
2. ✅ Run simulation script
3. ✅ Update frontend with contract address
4. ✅ Configure IPFS for decentralized frontend
5. ✅ Set up monitoring and alerts
6. ✅ Plan for mainnet deployment

---

**Questions or Issues?** Please open an issue in the GitHub repository.
