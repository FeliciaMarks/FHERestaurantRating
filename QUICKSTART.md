# Quick Start Guide

Get started with the Private Restaurant Rating System in 5 minutes!

## Prerequisites

- Node.js v18+ installed
- MetaMask wallet with Sepolia ETH
- Alchemy or Infura account (for RPC)
- Etherscan API key

## Step 1: Installation (1 minute)

```bash
# Navigate to project directory
cd private-restaurant-rating-system

# Install dependencies
npm install
```

## Step 2: Configuration (2 minutes)

```bash
# Create environment file
cp .env.example .env
```

Edit `.env` file:
```env
PRIVATE_KEY=your_wallet_private_key_without_0x
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

**Where to get these:**
- **Private Key**: MetaMask → Account Details → Export Private Key
- **Sepolia RPC**: [Alchemy.com](https://www.alchemy.com) → Create App → Copy HTTP URL
- **Etherscan Key**: [Etherscan.io](https://etherscan.io/myapikey) → Add → Copy API Key

## Step 3: Test Everything Works (1 minute)

```bash
# Compile contracts
npm run compile

# Run tests
npm test
```

Expected output: All tests passing ✅

## Step 4: Deploy to Sepolia (1 minute)

```bash
# Deploy contract
npm run deploy:sepolia

# Verify on Etherscan
npm run verify:sepolia
```

Save the contract address from the output!

## Step 5: Interact with Contract (30 seconds)

```bash
# Start interactive interface
npm run interact:sepolia
```

## Common Commands

```bash
# Development
npm run compile              # Compile contracts
npm test                     # Run tests
npm run test:coverage        # Test coverage

# Local Testing
npm run node                 # Start local node (Terminal 1)
npm run deploy               # Deploy locally (Terminal 2)

# Sepolia Testnet
npm run deploy:sepolia       # Deploy to Sepolia
npm run verify:sepolia       # Verify on Etherscan
npm run interact:sepolia     # Interactive CLI
npm run simulate:sepolia     # Run simulation

# Utilities
npm run clean                # Clean build artifacts
```

## Troubleshooting

### "Insufficient funds"
- Get Sepolia ETH from [Sepolia Faucet](https://sepoliafaucet.com)

### "Invalid API key"
- Check your API keys in `.env` file
- Verify Alchemy/Infura dashboard shows the project

### "Contract not found"
- Run `npm run deploy:sepolia` first
- Check `deployments/sepolia_latest.json` exists

### Compilation errors
```bash
npm run clean
npm run compile
```

## What's Next?

1. ✅ View your contract on Etherscan
2. ✅ Try the interactive interface (`npm run interact:sepolia`)
3. ✅ Run a simulation (`npm run simulate:sepolia`)
4. ✅ Update the frontend with your contract address
5. ✅ Read `DEPLOYMENT.md` for advanced features

## Quick Reference

| Action | Command |
|--------|---------|
| Compile | `npm run compile` |
| Test | `npm test` |
| Deploy | `npm run deploy:sepolia` |
| Verify | `npm run verify:sepolia` |
| Interact | `npm run interact:sepolia` |

## Need Help?

- 📖 Read `DEPLOYMENT.md` for detailed guide
- 📖 Read `README.md` for project overview
- 📖 Read `MIGRATION_SUMMARY.md` for framework details
- 🐛 Check GitHub issues
- 💬 Contact support

---

**Ready to build!** 🚀
