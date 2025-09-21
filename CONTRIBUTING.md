# Contributing to Cadenza

First off, thank you for considering contributing to Cadenza! It's people like you that make this project better for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Process](#development-process)
- [Style Guidelines](#style-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- Git
- A GitHub account

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/cadenza.git
   cd cadenza
   ```
3. **Set up the development environment** following the [Quick Start guide](README.md#-quick-start)
4. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected
- **Include screenshots** if applicable
- **Specify your environment** (OS, Node.js version, browser, etc.)

### ✨ Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List some other applications where this enhancement exists** if applicable

### 💻 Code Contributions

#### Areas where contributions are welcome:

- **Bug fixes**
- **Feature implementations**
- **Performance improvements**
- **Documentation improvements**
- **Test coverage improvements**
- **UI/UX enhancements**

## Development Process

### 1. Setting Up Your Development Environment

```bash
# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev

# Frontend setup (in new terminal)
cd frontend
npm install
cp .env.example .env.development
npm run dev
```

### 2. Making Changes

- **Write tests** for new functionality
- **Update documentation** as needed
- **Follow the existing code style**
- **Test your changes** thoroughly

### 3. Testing

```bash
# Backend tests (when available)
cd backend
npm test

# Frontend tests (when available)
cd frontend
npm test

# Manual testing
# Test both frontend and backend functionality
```

## Style Guidelines

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow **ESLint** configuration
- Use **meaningful variable and function names**
- Add **JSDoc comments** for public APIs
- Prefer **async/await** over Promises
- Use **arrow functions** for short functions

### React Components

- Use **functional components** with hooks
- Follow the **single responsibility principle**
- Use **TypeScript interfaces** for props
- Implement **proper error boundaries**
- Use **meaningful component names**

### CSS/SCSS

- Follow **BEM methodology** for class naming
- Use **SCSS variables** for colors and spacing
- Write **responsive styles**
- Avoid **inline styles** unless necessary

### Database

- Use **descriptive table and column names**
- Follow **Sequelize best practices**
- Write **proper migrations**
- Add **appropriate indexes**

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Examples

```bash
feat(auth): add LinkedIn OAuth integration
fix(search): resolve pagination issue on company search
docs(readme): update installation instructions
style(components): fix ESLint warnings in SearchPage
refactor(api): restructure company controller methods
```

## Pull Request Process

### Before Submitting

1. **Ensure your code follows** the style guidelines
2. **Update documentation** as necessary
3. **Add tests** for new functionality
4. **Test your changes** thoroughly
5. **Update the README.md** if needed

### Submitting the Pull Request

1. **Push your changes** to your fork
2. **Create a pull request** from your feature branch
3. **Fill out the PR template** completely
4. **Link any related issues**
5. **Request review** from maintainers

### PR Title Format

Use the same format as commit messages:
```
feat(auth): add LinkedIn OAuth integration
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have tested these changes locally
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

## Development Tips

### Useful Commands

```bash
# Backend development
npm run dev          # Start development server
npm run build        # Build for production
npm run db:init      # Initialize database

# Frontend development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Debugging

- Use **browser developer tools** for frontend debugging
- Use **console.log** strategically (remove before committing)
- Use **debugger** statements when needed
- Check **network tab** for API issues

### Common Issues

- **CORS errors**: Check backend CORS configuration
- **Database connection**: Verify PostgreSQL is running
- **Environment variables**: Ensure .env files are properly configured
- **Port conflicts**: Make sure ports 3000 and 5000 are available

## Questions?

If you have questions about contributing, feel free to:

- **Open an issue** with the `question` label
- **Contact the maintainers** directly
- **Check existing documentation** and issues first

Thank you for contributing to Cadenza! 🎼
