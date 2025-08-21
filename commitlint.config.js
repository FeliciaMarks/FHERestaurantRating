module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Formatting
        'refactor', // Code restructuring
        'perf',     // Performance improvements
        'test',     // Tests
        'chore',    // Maintenance
        'ci',       // CI/CD changes
        'security', // Security fixes
        'revert'    // Revert changes
      ]
    ],
    'subject-case': [0],
    'subject-max-length': [2, 'always', 100]
  }
};
