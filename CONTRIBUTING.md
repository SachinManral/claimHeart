# Contributing to ClaimHeart

Thank you for your interest in contributing to ClaimHeart! 🎉

This document provides guidelines for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [License](#license)

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## 🚀 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- Clear and descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, versions)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Include:

- Clear description of the enhancement
- Use case and benefits
- Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💻 Development Setup

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 📝 Pull Request Process

1. Update documentation for any new features
2. Follow the existing code style
3. Add tests for new functionality
4. Ensure all tests pass
5. Update the README.md if needed
6. Request review from maintainers

## 🎨 Coding Standards

### Frontend (TypeScript/React)

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused

### Backend (Python)

- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions
- Keep functions focused and testable

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions make ClaimHeart better for everyone!
