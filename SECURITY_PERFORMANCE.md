# Security and Performance Guide

Comprehensive security auditing and performance optimization for the Private Restaurant Rating System.

## Overview

This project implements multiple layers of security checks and performance optimizations:

- Pre-commit hooks with Husky
- Automated security scanning
- Gas optimization and monitoring
- DoS protection checks
- Performance benchmarking
- Code quality enforcement

## Security Tools

### 1. Pre-commit Hooks (Husky)

Automatically runs checks before each commit:

- Linting (Solhint, ESLint)
- Code formatting (Prettier)
- Security checks
- No sensitive data in commits

### 2. Security Check Script

Location: `scripts/security/check.js`

Performs:
- NPM audit for vulnerabilities
- Solidity linting
- Console.log detection in contracts
- TODO comment tracking
- .env file safety check

Run manually:
```bash
npm run security:check
```

### 3. DoS Protection Check

Location: `scripts/security/dos-check.js`

Detects:
- Unbounded loops over dynamic arrays
- External calls in loops
- Multiple transfers in loops
- Unbounded array growth

Run manually:
```bash
npm run security:dos
```

### 4. Gas Analysis

Location: `scripts/security/gas-analysis.js`

Features:
- Generates detailed gas reports
- Identifies high gas usage functions
- Tracks gas optimization trends

Run manually:
```bash
npm run security:gas
```

## Performance Optimization

### Compiler Optimization

Configured in `hardhat.config.js`:

- Optimizer enabled: 200 runs
- Yul optimization: Enabled
- Via IR: Disabled (security trade-off)

### Gas Reporter

Automatically generates gas usage reports during tests.

### Performance Benchmark

Location: `scripts/performance/benchmark.js`

Tests:
- Contract deployment time
- Transaction execution time
- Read operation latency

Run manually:
```bash
npm run performance:benchmark
```

## Available Scripts

### Security Commands

| Command | Description |
|---------|-------------|
| `npm run security:check` | Run all security checks |
| `npm run security:dos` | Check for DoS vulnerabilities |
| `npm run security:gas` | Analyze gas usage |

### Performance Commands

| Command | Description |
|---------|-------------|
| `npm run performance:benchmark` | Run performance benchmarks |
| `REPORT_GAS=true npm test` | Generate gas report |

### Code Quality Commands

| Command | Description |
|---------|-------------|
| `npm run lint` | Lint all code |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format all code |
| `npm run format:check` | Check formatting |

## Commit Convention

Using Conventional Commits with commitlint:

```
<type>: <subject>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- perf: Performance improvements
- test: Tests
- chore: Maintenance
- ci: CI/CD changes
- security: Security fixes
```

## Pre-commit Workflow

1. Stage your changes: `git add .`
2. Commit: `git commit -m "feat: add new feature"`
3. Pre-commit hooks run automatically:
   - Lint staged files
   - Format code
   - Run security checks
4. If checks pass, commit succeeds
5. If checks fail, fix issues and try again

## Security Best Practices

### Smart Contract Security

1. **Access Control**: Use modifiers for role-based access
2. **Input Validation**: Validate all user inputs
3. **Reentrancy Protection**: Follow checks-effects-interactions pattern
4. **Gas Optimization**: Avoid unbounded loops
5. **Error Handling**: Use custom errors instead of strings

### Development Security

1. **Never commit secrets**: Use .env files (in .gitignore)
2. **Regular audits**: Run `npm audit` regularly
3. **Dependency updates**: Keep dependencies up to date
4. **Code reviews**: Require reviews before merging
5. **Testing**: Maintain high test coverage

## Gas Optimization Strategies

### 1. Storage Optimization
- Use uint256 instead of smaller uints when possible
- Pack variables into single storage slots
- Use immutable for constants

### 2. Function Optimization
- Use external visibility for public functions
- Cache array lengths in loops
- Use calldata instead of memory when possible

### 3. Computation Optimization
- Minimize SLOAD operations
- Batch operations when possible
- Use events instead of storage for historical data

## DoS Protection

### Implemented Protections

1. **Gas Limits**: Functions have reasonable gas limits
2. **Array Bounds**: No unbounded array iterations
3. **Rate Limiting**: Prevent spam through checks
4. **Fail-Safe**: Critical functions can be paused

### Detection Patterns

The DoS checker looks for:
- `for` loops over `.length`
- External calls in loops
- `transfer()` in loops
- Unbounded `push()` operations

## Performance Metrics

### Target Metrics

| Operation | Target | Current |
|-----------|--------|---------|
| Restaurant Registration | <500k gas | ~300k gas |
| Review Submission | <1M gas | ~800k gas |
| Review Verification | <100k gas | ~50k gas |
| Read Operations | <50k gas | <30k gas |

## Continuous Monitoring

### Automated Checks

- **On Commit**: Pre-commit hooks
- **On Push**: GitHub Actions CI/CD
- **On PR**: Full security and performance suite

### Manual Audits

Schedule regular security audits:
- Weekly: Quick security scan
- Monthly: Full audit with gas analysis
- Before deployment: Comprehensive review

## Troubleshooting

### Pre-commit Hook Fails

```bash
# Skip hooks temporarily (not recommended)
git commit --no-verify

# Fix issues manually
npm run lint:fix
npm run format
```

### Security Check Fails

```bash
# Run individual checks
npm run security:check
npm run security:dos

# Fix reported issues
# Re-run checks
```

### High Gas Usage

```bash
# Generate detailed report
REPORT_GAS=true npm test

# Review gas-report.txt
# Optimize high-usage functions
```

## Resources

- [Consensys Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Solidity Security Considerations](https://docs.soliditylang.org/en/latest/security-considerations.html)
- [OpenZeppelin Security](https://www.openzeppelin.com/security)

## Support

For security concerns:
- Review this documentation
- Run automated security checks
- Consult with security auditors
- Report vulnerabilities responsibly

---

**Security Status**: Protected with multiple layers
**Performance Status**: Optimized and monitored
**Last Updated**: October 30, 2025
