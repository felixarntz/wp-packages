# Contributing to my WordPress NPM packages

Thank you for your interest in contributing to my WordPress NPM packages! I welcome bug reports, enhancement and feature suggestions, and code contributions.

## Reporting Bugs

If you find a bug, please [open a bug report issue](https://github.com/felixarntz/wp-packages/issues/new?template=1-bug.yml), and complete and submit the form.

## Suggesting Enhancements

If you have a suggestion for improving an existing feature, please [open an enhancement request issue](https://github.com/felixarntz/wp-packages/issues/new?template=2-enhancement.yml), and complete and submit the form.

## Suggesting Features

Do you have an idea for an entirely new feature that might fit into the scope of my WordPress NPM packages? Feature suggestions are welcome!

If your idea is mostly related to an existing feature, consider suggesting an enhancement instead (see above). But if your idea is something entirely new, please go ahead and [open a feature request issue](https://github.com/felixarntz/wp-packages/issues/new?template=3-feature.yml), and complete and submit the form.

## Code Contributions

### Prerequisites

- **Node.js**: Version 20.0.0 or higher
- **npm**: Package manager
- **Git**: For version control

### Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/wp-packages.git
   cd wp-packages
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Verify everything works:
   ```bash
   npm run test
   ```

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-change-name
   ```
2. Make your changes
3. Write or update tests for your changes
4. Ensure everything passes:
   ```bash
   npm run test
   npm run lint
   ```
5. Commit with a clear message and push to your fork
6. Open a pull request

### Helpful Scripts

- `npm run build` - Build all packages (including package types)
- `npm run test` - Run all tests
- `npm run lint` - Check code style
- `npm run lint:fix` - Auto-fix linting issues

### Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Include tests for new functionality
- Update documentation if needed
- Ensure all checks pass before requesting review
- Respond to feedback by the maintainer(s)

## License

By contributing, you agree that your contributions will be licensed under the GPL v2 (or later) License.
