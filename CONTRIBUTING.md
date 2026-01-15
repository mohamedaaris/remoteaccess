# Contributing to FlowLink

Thank you for your interest in contributing to FlowLink!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/flowlink.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit: `git commit -m "Add your feature"`
7. Push: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

See [docs/SETUP.md](docs/SETUP.md) for detailed setup instructions.

## Code Style

- Use TypeScript for type safety
- Follow existing code formatting
- Add comments for complex logic
- Write meaningful commit messages

### TypeScript

- Use strict mode
- Define interfaces for data structures
- Avoid `any` type when possible
- Use async/await over callbacks

### Naming Conventions

- Classes: PascalCase
- Functions/Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: PascalCase for classes, camelCase for utilities

## Testing

Before submitting:

1. Test all affected components
2. Verify cross-platform compatibility
3. Check for console errors
4. Test network edge cases

## Pull Request Guidelines

### PR Title

Use conventional commits format:
- `feat: Add new feature`
- `fix: Fix bug in component`
- `docs: Update documentation`
- `refactor: Refactor code`
- `test: Add tests`
- `chore: Update dependencies`

### PR Description

Include:
- What changes were made
- Why the changes were necessary
- How to test the changes
- Screenshots/videos if UI changes
- Related issues

### Checklist

- [ ] Code follows project style
- [ ] Changes are tested
- [ ] Documentation updated
- [ ] No console errors
- [ ] Commits are meaningful
- [ ] PR description is complete

## Areas for Contribution

### High Priority

- [ ] Add unit tests
- [ ] Improve error handling
- [ ] Add rate limiting
- [ ] Implement user authentication
- [ ] Add session recording
- [ ] iOS agent app

### Medium Priority

- [ ] File transfer feature
- [ ] Audio streaming
- [ ] Multi-monitor support
- [ ] Clipboard sync
- [ ] Connection quality metrics
- [ ] Internationalization

### Low Priority

- [ ] UI themes
- [ ] Keyboard shortcuts
- [ ] Session history
- [ ] Device groups
- [ ] Custom TURN server UI

## Bug Reports

When reporting bugs, include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**:
   - OS and version
   - Browser/Electron version
   - FlowLink version
6. **Logs**: Console logs and errors
7. **Screenshots**: If applicable

## Feature Requests

When requesting features:

1. **Use Case**: Why is this needed?
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other approaches considered
4. **Additional Context**: Any other information

## Code Review Process

1. Maintainers review PRs
2. Feedback provided via comments
3. Address feedback and update PR
4. Approved PRs are merged
5. Changes deployed in next release

## Community Guidelines

- Be respectful and inclusive
- Help others learn
- Provide constructive feedback
- Follow code of conduct
- Ask questions if unclear

## Questions?

- Open a GitHub Discussion
- Check existing issues
- Review documentation
- Ask in pull request comments

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
