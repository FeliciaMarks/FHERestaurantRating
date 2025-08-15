# CI/CD Pipeline Documentation

## Overview

This project implements a comprehensive Continuous Integration and Continuous Deployment (CI/CD) pipeline using GitHub Actions. The pipeline ensures code quality, runs automated tests, and provides coverage reporting for every code change.

## Table of Contents

- [Workflow Overview](#workflow-overview)
- [GitHub Actions Configuration](#github-actions-configuration)
- [Automated Testing](#automated-testing)
- [Code Quality Checks](#code-quality-checks)
- [Coverage Reporting](#coverage-reporting)
- [Local Development](#local-development)
- [Troubleshooting](#troubleshooting)

## Workflow Overview

### Triggers

The CI/CD pipeline runs automatically on:
- **Push events** to `main` and `develop` branches
- **Pull requests** targeting `main` and `develop` branches

### Jobs

The pipeline consists of two main jobs:

1. **Test Job**: Runs tests across multiple Node.js versions
2. **Code Quality Job**: Performs code quality checks

## GitHub Actions Configuration

### File Location
`.github/workflows/test.yml`

### Workflow Structure

```yaml
name: Test and Coverage

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    # Multi-version testing
  code-quality:
    # Quality checks
```

### Test Job Details

**Runs on**: Ubuntu Latest
**Node.js versions**: 18.x, 20.x

**Steps**:
1. Checkout code
2. Setup Node.js environment
3. Install dependencies with `npm ci`
4. Run Solidity linting
5. Compile smart contracts
6. Execute test suite
7. Generate coverage report
8. Upload coverage to Codecov (Node.js 20.x only)

### Code Quality Job Details

**Runs on**: Ubuntu Latest
**Node.js version**: 20.x

**Steps**:
1. Checkout code
2. Setup Node.js environment
3. Install dependencies
4. Run Solhint linting
5. Compile contracts
6. Verify no compilation warnings

## Automated Testing

### Test Execution

Tests run automatically using Hardhat's testing framework:

```bash
npm test
```

### Test Coverage

Coverage reports are generated and uploaded to Codecov:

```bash
npm run test:coverage
```

### Supported Node.js Versions

The pipeline tests against multiple Node.js versions to ensure compatibility:
- Node.js 18.x (LTS)
- Node.js 20.x (Latest LTS)

## Code Quality Checks

### Solidity Linting (Solhint)

**Configuration**: `.solhint.json`

**Rules**:
- Code complexity: Maximum 8
- Compiler version: >=0.8.20
- Function visibility: Required
- Max line length: 120 characters
- Named parameters mapping
- No console logs in production
- Proper error handling

**Run locally**:
```bash
npm run lint:sol
```

**Auto-fix issues**:
```bash
npm run lint:fix
```

### Code Formatting (Prettier)

**Configuration**: `.prettierrc.json`

**Settings**:
- Print width: 120 characters
- Tab width: 2 spaces (JavaScript), 4 spaces (Solidity)
- Single quotes: No
- Trailing commas: ES5
- Semicolons: Required

**Check formatting**:
```bash
npm run format:check
```

**Auto-format**:
```bash
npm run format
```

## Coverage Reporting

### Codecov Integration

Coverage reports are automatically uploaded to Codecov on every push to main/develop branches.

**Configuration**: `codecov.yml`

**Settings**:
- Target coverage: Auto
- Threshold: 1%
- Informational mode: Enabled
- Ignored files: Tests, scripts, config files

### Setting Up Codecov

1. **Create Codecov Account**:
   - Visit [codecov.io](https://codecov.io)
   - Sign in with GitHub
   - Add your repository

2. **Get Codecov Token**:
   - Navigate to repository settings in Codecov
   - Copy the upload token

3. **Add GitHub Secret**:
   - Go to GitHub repository settings
   - Navigate to Secrets and Variables → Actions
   - Create new secret: `CODECOV_TOKEN`
   - Paste the Codecov token

4. **Verify Integration**:
   - Push code to main/develop branch
   - Check GitHub Actions for successful upload
   - View coverage report on Codecov dashboard

### Coverage Badge

Add to README.md:
```markdown
[![codecov](https://codecov.io/gh/USERNAME/REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/USERNAME/REPO)
```

## Local Development

### Prerequisites

Install development dependencies:
```bash
npm install
```

### Pre-commit Checks

Run these commands before committing:

```bash
# 1. Run linting
npm run lint

# 2. Fix linting issues
npm run lint:fix

# 3. Check formatting
npm run format:check

# 4. Format code
npm run format

# 5. Compile contracts
npm run compile

# 6. Run tests
npm test

# 7. Check coverage
npm run test:coverage
```

### Git Hooks (Optional)

Create `.git/hooks/pre-commit`:

```bash
#!/bin/sh
npm run lint && npm run format:check && npm test
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

## Configuration Files

### .solhint.json

Solidity linting configuration:

```json
{
  "extends": "solhint:recommended",
  "rules": {
    "code-complexity": ["error", 8],
    "compiler-version": ["error", ">=0.8.20"],
    "func-visibility": ["error", { "ignoreConstructors": true }],
    "max-line-length": ["error", 120]
  }
}
```

### .solhintignore

Files to ignore during linting:

```
node_modules/
artifacts/
cache/
coverage/
```

### codecov.yml

Coverage configuration:

```yaml
coverage:
  status:
    project:
      default:
        target: auto
        threshold: 1%

ignore:
  - "test/**/*"
  - "scripts/**/*"
```

### .prettierrc.json

Code formatting configuration:

```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": false
}
```

## Troubleshooting

### Common Issues

#### 1. GitHub Actions Failing

**Symptom**: Tests pass locally but fail in CI

**Solutions**:
```bash
# Use npm ci instead of npm install locally
npm ci

# Check Node.js version matches CI
node --version

# Clear npm cache
npm cache clean --force
```

#### 2. Codecov Upload Failing

**Symptom**: Coverage report not appearing on Codecov

**Solutions**:
- Verify `CODECOV_TOKEN` secret is set correctly
- Check GitHub Actions logs for upload errors
- Ensure coverage file exists: `coverage/lcov.info`
- Verify Codecov repository is properly configured

#### 3. Solhint Errors

**Symptom**: Linting fails in CI

**Solutions**:
```bash
# Run locally to see errors
npm run lint:sol

# Auto-fix what's possible
npm run lint:fix

# Manually fix remaining issues
```

#### 4. Compilation Warnings

**Symptom**: Code quality job fails due to warnings

**Solutions**:
- Review compilation output: `npm run compile`
- Update contract code to resolve warnings
- Ensure Solidity version is compatible

### Debugging Tips

**View detailed logs**:
```bash
# Enable verbose npm logging
npm test --verbose

# Show Hardhat stack traces
npx hardhat test --show-stack-traces
```

**Test specific files**:
```bash
npx hardhat test test/PrivateRestaurantRating.test.js
```

**Check coverage locally**:
```bash
npm run test:coverage
# Open coverage/index.html in browser
```

## Best Practices

### 1. Branch Protection

Enable branch protection rules:
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Require review from code owners

### 2. Pull Request Workflow

1. Create feature branch from `develop`
2. Make changes and commit
3. Run local checks before pushing
4. Create pull request to `develop`
5. Wait for CI/CD checks to pass
6. Address any failures
7. Request code review
8. Merge after approval and passing checks

### 3. Commit Messages

Use conventional commits:
```
feat: add new restaurant verification feature
fix: resolve review submission bug
docs: update CI/CD documentation
test: add edge case tests for ratings
chore: update dependencies
```

### 4. Code Review Checklist

- [ ] All CI/CD checks pass
- [ ] Code coverage maintained or improved
- [ ] No linting errors
- [ ] Properly formatted code
- [ ] Tests added for new features
- [ ] Documentation updated

## Maintenance

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Test after updates
npm test
```

### Monitoring

**GitHub Actions**:
- Monitor workflow runs in Actions tab
- Set up notifications for failures
- Review failed builds promptly

**Codecov**:
- Monitor coverage trends
- Set coverage targets
- Review coverage reports for new PRs

## Resources

- **GitHub Actions**: https://docs.github.com/en/actions
- **Codecov**: https://docs.codecov.com
- **Solhint**: https://github.com/protofire/solhint
- **Prettier**: https://prettier.io/docs
- **Hardhat Testing**: https://hardhat.org/tutorial/testing-contracts

## Support

For issues with the CI/CD pipeline:
1. Check GitHub Actions logs
2. Review this documentation
3. Verify configuration files
4. Open an issue in the repository

---

**Last Updated**: 2025-10-30
**CI/CD Version**: 1.0
