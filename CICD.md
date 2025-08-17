# CI/CD Pipeline Documentation

Comprehensive guide for the Continuous Integration and Continuous Deployment pipeline.

## Overview

The project uses GitHub Actions for automated testing, code quality checks, and coverage reporting.

## GitHub Actions Workflows

### Test Suite
- Runs on Node.js 18.x and 20.x
- Triggers on push to main/develop
- Triggers on pull requests

### Code Quality
- Solhint linting
- Prettier formatting checks
- ESLint for JavaScript

### Coverage
- Generates coverage reports
- Uploads to Codecov
- Comments on pull requests

## Quick Start

```bash
# Run all checks locally
npm run lint
npm test
npm run test:coverage
```

## Configuration Files

- `.github/workflows/test.yml` - Test suite workflow
- `.github/workflows/code-quality.yml` - Linting workflow
- `.github/workflows/coverage.yml` - Coverage workflow
- `.solhint.json` - Solhint configuration
- `.prettierrc.yml` - Prettier configuration
- `.eslintrc.js` - ESLint configuration
- `codecov.yml` - Codecov configuration

## Codecov Integration

Coverage targets:
- Project: 90% minimum
- Patch: 85% minimum
- Threshold: 2% drop tolerance

## Secrets Required

Add these secrets in GitHub repository settings:
- `CODECOV_TOKEN`: Codecov upload token

## Troubleshooting

See full documentation for detailed troubleshooting steps.
