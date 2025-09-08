# Security Policy

## Overview

The Private Restaurant Rating System takes security seriously. This document outlines our security measures, vulnerability reporting process, and best practices for developers and users.

## Table of Contents

- [Security Features](#security-features)
- [Threat Model](#threat-model)
- [Security Audit](#security-audit)
- [Vulnerability Reporting](#vulnerability-reporting)
- [Security Best Practices](#security-best-practices)
- [Performance & DoS Protection](#performance--dos-protection)
- [Incident Response](#incident-response)

## Security Features

### Smart Contract Security

#### 1. Access Control
- **Owner-based Permissions**: Critical functions restricted to contract owner
- **Restaurant Owner Verification**: Only restaurant owners can manage their establishments
- **Review Uniqueness**: One review per user per restaurant

#### 2. Fully Homomorphic Encryption (FHE)
- **Data Privacy**: Ratings encrypted on-chain
- **Zero-Knowledge Computation**: Aggregate statistics without decryption
- **Access Control Lists (ACL)**: Granular permission management for encrypted data

#### 3. Input Validation
- **Range Checks**: All ratings validated (1-10 scale)
- **Restaurant Existence**: Verify restaurant is active before operations
- **Duplicate Prevention**: Prevent multiple reviews from same user

#### 4. Integer Overflow Protection
- **Solidity 0.8+**: Built-in overflow/underflow protection
- **Safe Math**: Automatic checks on all arithmetic operations

#### 5. Event Emission
- **Transparency**: All state changes emit events
- **Audit Trail**: Complete on-chain activity log
- **Off-chain Monitoring**: Enable real-time security monitoring

### Application Security

#### 1. Environment Security
- **.env Protection**: Sensitive data never committed to version control
- **API Key Rotation**: Regular rotation of all API keys
- **Secure Storage**: Private keys stored securely offline

#### 2. Code Quality
- **ESLint**: JavaScript/TypeScript linting
- **Solhint**: Solidity linting with security rules
- **Prettier**: Consistent code formatting
- **Pre-commit Hooks**: Automated quality checks

#### 3. Dependency Security
- **npm audit**: Regular dependency vulnerability scans
- **Automated Updates**: Dependabot for security patches
- **Minimal Dependencies**: Reduce attack surface

## Threat Model

### Threats Considered

#### 1. Reentrancy Attacks
**Status**: ✅ Protected

**Protection**:
- No external calls with value transfers
- Checks-effects-interactions pattern
- State updates before external calls

#### 2. Integer Overflow/Underflow
**Status**: ✅ Protected

**Protection**:
- Solidity 0.8+ automatic checks
- No use of unchecked blocks
- Bounded counters

#### 3. DoS (Denial of Service)
**Status**: ✅ Protected

**Protection**:
- No unbounded loops over user-controlled data
- Gas-efficient storage patterns
- Rate limiting recommendations

#### 4. Access Control Bypass
**Status**: ✅ Protected

**Protection**:
- Modifier-based access control
- Owner verification
- Restaurant owner verification

#### 5. Front-Running
**Status**: ⚠️ Partial Protection

**Mitigation**:
- Private mempool recommendations
- Commit-reveal scheme consideration
- MEV-aware transaction submission

#### 6. Privacy Leakage
**Status**: ✅ Protected

**Protection**:
- FHE for sensitive data
- ACL-based access control
- No plaintext rating storage

### Threats NOT Considered

1. **Network-level attacks**: DDoS on RPC endpoints
2. **Social engineering**: Phishing attacks on users
3. **Hardware attacks**: Compromised signing devices
4. **Centralized infrastructure**: Dependency on specific RPC providers

## Security Audit

### Automated Audits

The project includes automated security audit tools:

```bash
# Run security audit
npm run security:audit

# Full security check (includes npm audit)
npm run security:check
```

### Audit Checklist

- [x] Contract compilation
- [x] Storage layout analysis
- [x] Access control verification
- [x] Reentrancy protection
- [x] Overflow protection
- [x] DoS vulnerability check
- [x] Event emission verification
- [x] Input validation check
- [x] External call safety
- [x] Randomness security

### Manual Review Recommendations

1. **Pre-deployment**: Full manual code review
2. **Third-party Audit**: Professional security audit for production
3. **Bug Bounty**: Consider bug bounty program
4. **Continuous Monitoring**: Real-time transaction monitoring

## Vulnerability Reporting

### Responsible Disclosure

We appreciate security researchers and welcome responsible disclosure of vulnerabilities.

### Reporting Process

1. **DO NOT** disclose publicly until patch is available
2. **Email**: security@example.com
3. **Include**:
   - Detailed description
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **24 hours**: Initial response
- **72 hours**: Vulnerability assessment
- **7 days**: Patch development
- **14 days**: Patch deployment
- **30 days**: Public disclosure (coordinated)

### Reward Program

Critical vulnerabilities may be eligible for rewards:
- **Critical**: $500 - $5,000
- **High**: $250 - $1,000
- **Medium**: $100 - $500
- **Low**: Recognition in CONTRIBUTORS.md

## Security Best Practices

### For Developers

#### 1. Pre-commit Security
```bash
# Automated checks
npm run lint          # Code quality
npm run format:check  # Code formatting
npm run security:check # Security audit
npm test             # All tests
```

#### 2. Code Review
- **Peer Review**: All changes reviewed by another developer
- **Security Focus**: Special attention to:
  - Access control changes
  - External interactions
  - State variable modifications
  - Loop iterations

#### 3. Testing
```bash
# Comprehensive testing
npm test                  # Unit tests
npm run test:coverage    # Coverage report
npm run performance:test # Performance tests
```

#### 4. Gas Optimization vs Security
- **Principle**: Security over gas savings
- **Review**: All optimizations reviewed for security impact
- **Documentation**: Document security trade-offs

### For Users

#### 1. Wallet Security
- Use hardware wallets for significant funds
- Verify transaction details before signing
- Never share private keys
- Use separate wallets for testing

#### 2. Transaction Verification
- Check contract address
- Verify function being called
- Review gas costs
- Confirm transaction data

#### 3. Privacy Protection
- Understand FHE limitations
- Review ACL permissions
- Monitor on-chain activity
- Use private RPCs when possible

## Performance & DoS Protection

### Gas Optimization

#### Compiler Settings
```javascript
optimizer: {
  enabled: true,
  runs: 200,
  details: {
    yul: true,
    yulDetails: {
      stackAllocation: true
    }
  }
}
```

#### Gas Reporting
```bash
# Generate gas report
npm run gas:report
```

### DoS Mitigation

#### 1. Loop Limits
- **No unbounded loops** over user-controlled arrays
- **Pull pattern** for payments
- **Pagination** for large datasets

#### 2. Storage Efficiency
- **Packed storage**: Optimize storage slots
- **Minimal state**: Store only essential data
- **Events for history**: Use events instead of on-chain storage

#### 3. Rate Limiting
- **One review per user per restaurant**
- **Owner-only** administrative functions
- **Gas limits** prevent excessive computation

## Incident Response

### Severity Levels

#### Critical (P0)
- **Definition**: Active exploit, funds at risk
- **Response Time**: Immediate (< 1 hour)
- **Actions**: Emergency pause, notify users, deploy fix

#### High (P1)
- **Definition**: Potential exploit, no active attack
- **Response Time**: 4 hours
- **Actions**: Deploy fix, security advisory, user notification

#### Medium (P2)
- **Definition**: Security weakness, low exploitability
- **Response Time**: 24 hours
- **Actions**: Scheduled fix, documentation update

#### Low (P3)
- **Definition**: Minor issue, theoretical risk
- **Response Time**: 1 week
- **Actions**: Include in next release

### Emergency Procedures

#### 1. Detection
- Automated monitoring alerts
- User reports
- Security audit findings

#### 2. Assessment
- Verify vulnerability
- Assess impact
- Determine severity

#### 3. Response
- Coordinate with team
- Develop patch
- Test thoroughly
- Deploy fix

#### 4. Communication
- Notify affected users
- Public disclosure (coordinated)
- Post-mortem report

### Contact Information

- **Security Email**: security@example.com
- **Emergency Contact**: EMERGENCY_CONTACT from .env
- **Bug Bounty**: security@example.com

## Security Checklist

### Pre-deployment

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Gas costs reviewed
- [ ] Documentation complete
- [ ] Third-party audit (for production)
- [ ] Bug bounty program ready
- [ ] Monitoring infrastructure ready
- [ ] Emergency procedures documented

### Post-deployment

- [ ] Contract verified on Etherscan
- [ ] Monitoring active
- [ ] Documentation published
- [ ] Security advisory channel ready
- [ ] Bug bounty program live

## Tools & Resources

### Security Tools

- **Solhint**: Solidity linting
- **ESLint**: JavaScript linting
- **Hardhat**: Development environment
- **Gas Reporter**: Gas cost analysis
- **Coverage**: Test coverage analysis

### External Resources

- [Consensys Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [OpenZeppelin Security](https://docs.openzeppelin.com/contracts/security)
- [SWC Registry](https://swcregistry.io/)
- [Ethereum Security](https://ethereum.org/en/developers/docs/security/)

## Updates

This security policy is updated regularly. Last update: 2025-10-30

For the latest version, see: [SECURITY.md](./SECURITY.md)

---

**Security is a shared responsibility. Report vulnerabilities responsibly.**
