# Private Restaurant Rating System

[![codecov](https://codecov.io/gh/YOUR_USERNAME/private-restaurant-rating-system/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/private-restaurant-rating-system)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow.svg)](https://hardhat.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A confidential dining experience review platform built with Fully Homomorphic Encryption (FHE) technology, ensuring complete privacy for restaurant ratings and reviews.

## 🌟 Overview

The Private Restaurant Rating System revolutionizes how diners share their dining experiences by leveraging cutting-edge homomorphic encryption. Users can submit honest, detailed restaurant reviews while maintaining complete confidentiality of their ratings. Restaurant owners can benefit from aggregate feedback without compromising individual reviewer privacy.

### Smart Contract
Built on fhEVM (Fully Homomorphic Encryption Virtual Machine) using Zama's encryption library.

**Contract Address**: `0x0f3e553484dF29aF3423AD6E301b571a255b1142`

### Core Functions
- `registerRestaurant()`: Register a new restaurant with name and location
- `submitReview()`: Submit encrypted ratings and comments
- `getRestaurant()`: Retrieve restaurant details and review count
- `hasReviewed()`: Check if a user has already reviewed a specific restaurant

## 🎬 Demo

**Live Application**: [https://fhe-restaurant-rating.vercel.app/](https://fhe-restaurant-rating.vercel.app/)

**demo.mp4**: See the platform in action with a complete walkthrough of restaurant registration, review submission, and privacy features.

## 🔐 Core Concept

### Fully Homomorphic Encryption (FHE)

This platform utilizes FHE smart contracts to enable computations on encrypted data without ever decrypting it. When users submit ratings for food quality, service, atmosphere, and value, these ratings are encrypted on-chain and remain confidential throughout their lifecycle.

**Key Benefits:**
- **Complete Privacy**: Individual ratings remain encrypted and private
- **Honest Feedback**: Reviewers can provide authentic opinions without fear of retaliation
- **Aggregate Insights**: Restaurant owners can derive meaningful analytics from encrypted data
- **Tamper-Proof**: Blockchain ensures ratings cannot be altered or deleted

### How It Works

1. **Restaurant Registration**: Restaurant owners register their establishments on-chain
2. **Encrypted Reviews**: Diners submit multi-dimensional ratings (food quality, service, atmosphere, price/value) that are automatically encrypted
3. **Privacy-Preserving Analytics**: Aggregate statistics are computed directly on encrypted data
4. **Verifiable Trust**: All interactions are recorded on the blockchain while maintaining confidentiality

## 🎯 Features

### For Reviewers
- Submit comprehensive ratings across multiple dimensions
- Add written comments about dining experiences
- Complete anonymity of individual ratings
- One review per restaurant per user to prevent spam

### For Restaurant Owners
- Register and manage restaurant profiles
- Receive authentic feedback without bias
- Track total review counts
- Build reputation through transparent aggregate metrics

### Multi-Dimensional Rating System
- **Food Quality**: Taste, presentation, freshness
- **Service**: Attentiveness, professionalism, timing
- **Atmosphere**: Ambiance, cleanliness, comfort
- **Price/Value**: Worth for money, portion sizes

### 🆕 Next.js Frontend Application
- **Modern Stack**: Built with Next.js 14, React 18, and TypeScript
- **Full Type Safety**: Complete TypeScript coverage with custom type definitions
- **Custom Hooks**: Reusable React hooks for wallet connection and restaurant operations
- **Responsive Design**: Beautiful UI with Tailwind CSS
- **FHEVM SDK Integration**: Seamless encryption/decryption using @fhevm/sdk
- **Production Ready**: Optimized build with code splitting and lazy loading

## 🏗️ Technical Architecture

### Development Framework
- **Hardhat**: Primary development environment for smart contracts
- **Ethers.js v6**: Ethereum library for contract interactions
- **Chai & Mocha**: Testing framework with comprehensive test coverage
- **Hardhat Toolbox**: Complete suite of development tools

### Smart Contract
Built on fhEVM (Fully Homomorphic Encryption Virtual Machine) using Zama's encryption library.

**Network**: Sepolia Testnet
**Chain ID**: 11155111
**Contract Address**: `0x0f3e553484dF29aF3423AD6E301b571a255b1142`
**Etherscan**: [View Contract](https://sepolia.etherscan.io/address/0x0f3e553484dF29aF3423AD6E301b571a255b1142)

### Core Functions
- `registerRestaurant()`: Register a new restaurant with name and location
- `submitReview()`: Submit encrypted ratings and comments
- `getRestaurant()`: Retrieve restaurant details and review count
- `hasReviewed()`: Check if a user has already reviewed a specific restaurant

## 🎬 Demo

**Live Application**: [https://fhe-restaurant-rating.vercel.app/](https://fhe-restaurant-rating.vercel.app/)

**demo.mp4**: See the platform in action with a complete walkthrough of restaurant registration, review submission, and privacy features.

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MetaMask** or compatible Web3 wallet
- **Sepolia testnet ETH** for deployment and transactions

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd private-restaurant-rating-system
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment**:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Development Workflow

#### Compile Contracts
```bash
npm run compile
```

#### Run Tests
```bash
# Run all tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test

# Run with coverage
npm run test:coverage
```

#### Local Development
```bash
# Start local Hardhat node
npm run node

# Deploy to local network (in another terminal)
npm run deploy
```

#### Sepolia Testnet Deployment
```bash
# Deploy to Sepolia
npm run deploy:sepolia

# Verify contract on Etherscan
npm run verify:sepolia

# Interact with deployed contract
npm run interact:sepolia

# Run simulation
npm run simulate:sepolia
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile smart contracts |
| `npm test` | Run test suite |
| `npm run test:coverage` | Generate test coverage report |
| `npm run deploy` | Deploy to local network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run verify:sepolia` | Verify contract on Etherscan |
| `npm run interact:sepolia` | Interactive contract menu |
| `npm run simulate:sepolia` | Run simulation script |
| `npm run node` | Start local Hardhat node |
| `npm run clean` | Clean artifacts and cache |
| `npm run help` | Display Hardhat help |
| `npm run lint` | Run Solidity linter (Solhint) |
| `npm run lint:sol` | Lint Solidity files |
| `npm run lint:fix` | Auto-fix Solidity linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## 📋 Deployment Information

### Sepolia Testnet
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **Contract Address**: `0x0f3e553484dF29aF3423AD6E301b571a255b1142`
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x0f3e553484dF29aF3423AD6E301b571a255b1142)
- **Verified**: Yes

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🧪 Testing

The project includes comprehensive tests covering:
- Contract deployment and initialization
- Restaurant registration
- Review submission and validation
- Access control and permissions
- Edge cases and error handling

Run tests with:
```bash
npm test
```

### Code Coverage

Generate coverage reports:
```bash
npm run test:coverage
```

Coverage reports are automatically uploaded to Codecov on every push to main/develop branches.

## 🔄 CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

### Automated Testing
Tests automatically run on:
- Every push to `main` and `develop` branches
- All pull requests to `main` and `develop`
- Multiple Node.js versions (18.x, 20.x)

### Workflow Jobs

**Test Job:**
- Runs on Node.js 18.x and 20.x
- Executes Solidity linting (Solhint)
- Compiles smart contracts
- Runs complete test suite
- Generates and uploads coverage to Codecov

**Code Quality Job:**
- Runs Solhint for Solidity code quality
- Checks contract compilation
- Verifies no compilation warnings

### Configuration Files
- `.github/workflows/test.yml` - Main CI/CD workflow
- `.solhint.json` - Solidity linting rules
- `codecov.yml` - Code coverage configuration
- `.prettierrc.json` - Code formatting rules

### Running Locally

```bash
# Run linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Check code formatting
npm run format:check

# Format code
npm run format
```

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Complete deployment guide
- **Contract ABI**: Available in `artifacts/contracts/PrivateRestaurantRating.sol/PrivateRestaurantRating.json`
- **Hardhat Config**: See `hardhat.config.js` for network configurations

## 🔧 Project Structure

```
private-restaurant-rating-system/
├── contracts/              # Smart contracts
│   └── PrivateRestaurantRating.sol
├── scripts/               # Deployment and interaction scripts
│   ├── deploy.js         # Deployment script
│   ├── verify.js         # Verification script
│   ├── interact.js       # Interactive menu
│   └── simulate.js       # Simulation script
├── test/                 # Test suite
│   └── PrivateRestaurantRating.test.js
├── deployments/          # Deployment records
├── artifacts/            # Compiled contracts
├── cache/               # Hardhat cache
├── hardhat.config.js    # Hardhat configuration
├── package.json         # Dependencies and scripts
├── .env.example         # Environment template
├── DEPLOYMENT.md        # Deployment guide
└── README.md           # This file
```

### Frontend Application

The frontend is a modern Next.js 14 application with full TypeScript support:

**Two Deployment Options:**

1. **Next.js Application** (Recommended - Located in `restaurant-rating/`):
   - Full Next.js 14 with App Router
   - TypeScript throughout
   - React 18.2 with custom hooks
   - Tailwind CSS styling
   - @fhevm/sdk integration
   - Custom wallet and restaurant hooks

   **Run Locally:**
   ```bash
   cd restaurant-rating
   npm install
   npm run dev
   ```
   Visit: [http://localhost:3001](http://localhost:3001)

2. **Static HTML Version** (Legacy - `index.html` in project root):
   - Simple HTML5 interface
   - Vanilla JavaScript
   - CDN-based libraries
   - Open `index.html` in browser

**Live Demo**: [https://fhe-restaurant-rating.vercel.app/](https://fhe-restaurant-rating.vercel.app/)

## 📖 Using the Platform

### For Users

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Browse Restaurants**: View all registered restaurants and their review counts
3. **Submit Reviews**: Rate restaurants on multiple dimensions (1-10 scale)
4. **View Your Reviews**: Track all reviews you've submitted

### For Restaurant Owners

1. **Register Restaurant**: Provide name and location
2. **Manage Profile**: Toggle restaurant active status
3. **Track Reviews**: Monitor total review count
4. **Verify Reviews**: Verify authentic customer reviews


## 🔒 Privacy Guarantees

- **End-to-End Encryption**: Ratings are encrypted client-side before submission
- **Zero-Knowledge Computation**: Aggregate statistics computed without decrypting individual data
- **Immutable Records**: Blockchain ensures review integrity
- **No Personal Data Storage**: Only wallet addresses and encrypted ratings are stored

## 🌐 Use Cases

### Restaurant Industry
- Fine dining establishments seeking authentic feedback
- Chain restaurants monitoring service quality across locations
- New restaurants building initial reputation

### Food Tourism
- Travel platforms integrating confidential local recommendations
- Food critics providing unbiased reviews
- Culinary tour operators curating experiences

### Quality Assurance
- Anonymous employee feedback on workplace dining
- Corporate cafeteria improvement programs
- Catering service evaluation

## 🛠️ Technology Stack

### Smart Contract Development
- **Framework**: Hardhat v2.19.0
- **Language**: Solidity ^0.8.24
- **Blockchain**: Ethereum-compatible fhEVM
- **Encryption**: Zama fhevmjs library (v0.5.0)
- **Testing**: Chai, Hardhat Network Helpers
- **Libraries**: Ethers.js v6.9.0

### Frontend Application (restaurant-rating/)
- **Framework**: Next.js 14.0.0 with App Router
- **Language**: TypeScript 5.0
- **UI Library**: React 18.2.0 + React DOM 18.2.0
- **Styling**: Tailwind CSS 3.3.6
- **Web3**: Ethers.js v6.9.0
- **FHE Integration**: @fhevm/sdk (custom package)
- **State Management**: React Hooks (useWallet, useRestaurant)
- **Deployment**: Vercel
- **Build Tool**: PostCSS + Autoprefixer
- **Code Quality**: ESLint with Next.js config

### Development Tools
- **Compilation**: Hardhat with optimizer enabled
- **Testing**: Hardhat test suite with coverage reporting
- **Deployment Scripts**: Automated deployment and verification
- **Network**: Sepolia testnet (Chain ID: 11155111)
- **TypeScript**: Full type safety with custom type definitions
- **Linting**: ESLint + Solhint for Solidity

## 📊 Smart Contract Events

- `RestaurantRegistered`: Emitted when a new restaurant is added
- `ReviewSubmitted`: Emitted when an encrypted review is successfully submitted
- `ReviewVerified`: Emitted when a review is verified by restaurant or contract owner
- `RatingSummaryUpdated`: Emitted when aggregate rating statistics are updated

## 📂 Project Structure

```
private-restaurant-rating-system/
├── contracts/               # Smart contracts
│   └── PrivateRestaurantRating.sol
├── scripts/                # Deployment and utility scripts
│   ├── deploy.js          # Main deployment script
│   ├── verify.js          # Contract verification script
│   ├── interact.js        # Interactive contract interface
│   └── simulate.js        # Simulation script for testing
├── test/                   # Test files
│   └── PrivateRestaurantRating.test.js
├── restaurant-rating/      # 🆕 Next.js Frontend Application
│   ├── src/
│   │   ├── app/           # Next.js 14 App Router
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── lib/           # Smart contract & FHEVM utilities
│   │   │   ├── contract.ts
│   │   │   └── fhevm.ts
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── useWallet.ts
│   │   │   └── useRestaurant.ts
│   │   └── types/         # TypeScript type definitions
│   │       ├── index.ts
│   │       └── window.d.ts
│   ├── contracts/         # Contract reference
│   ├── next.config.js     # Next.js configuration
│   ├── tailwind.config.ts # Tailwind CSS configuration
│   ├── tsconfig.json      # TypeScript configuration
│   └── package.json       # Frontend dependencies
├── deployments/            # Deployment artifacts (auto-generated)
├── artifacts/              # Compiled contracts (auto-generated)
├── cache/                  # Hardhat cache (auto-generated)
├── index.html             # Legacy static HTML version
├── hardhat.config.js       # Hardhat configuration
├── package.json            # Project dependencies and scripts
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore rules
├── DEPLOYMENT.md          # Detailed deployment guide
└── README.md              # This file
```

## 📜 Available Scripts

### Smart Contract Scripts (Root Directory)

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile smart contracts |
| `npm test` | Run test suite |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run deploy` | Deploy to local network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run verify:sepolia` | Verify contract on Etherscan |
| `npm run interact:sepolia` | Interactive contract interface |
| `npm run simulate:sepolia` | Run simulation script |
| `npm run node` | Start local Hardhat node |
| `npm run clean` | Clean artifacts and cache |
| `npm run lint` | Run Solidity linter (Solhint) |
| `npm run format` | Format code with Prettier |

### Frontend Scripts (restaurant-rating/)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server (port 3001) |
| `npm run build` | Build Next.js production bundle |
| `npm start` | Start Next.js production server |
| `npm run lint` | Run ESLint on frontend code |

## 🔗 Links

- **Live Demo**: [https://fhe-restaurant-rating.vercel.app/](https://fhe-restaurant-rating.vercel.app/)
- **Sepolia Contract**: [https://sepolia.etherscan.io/address/0x0f3e553484dF29aF3423AD6E301b571a255b1142](https://sepolia.etherscan.io/address/0x0f3e553484dF29aF3423AD6E301b571a255b1142)
- **Zama Documentation**: [https://docs.zama.ai](https://docs.zama.ai)
- **Hardhat Documentation**: [https://hardhat.org/docs](https://hardhat.org/docs)

## 🤝 Contributing

We welcome contributions to enhance the Private Restaurant Rating System! Whether it's adding new features, improving the UI/UX, or optimizing smart contracts, your input is valuable.

## 🙏 Acknowledgments

Built with [Zama's fhEVM](https://docs.zama.ai/fhevm) technology, enabling fully homomorphic encryption on the Ethereum Virtual Machine.

---

**Empowering honest feedback through privacy-preserving technology** 🍽️🔐
