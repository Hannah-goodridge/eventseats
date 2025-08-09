# Contributing to EventSeats

Thank you for your interest in contributing to EventSeats! This document provides guidelines and information for contributors.

## 🤝 Ways to Contribute

- 🐛 **Report bugs** and issues
- 💡 **Suggest new features** or improvements
- 🔧 **Submit code** fixes and enhancements
- 📚 **Improve documentation**
- 🌍 **Add translations** for different languages
- 🎨 **Create themes** and customizations
- 🧪 **Write tests** to improve coverage
- 💬 **Help others** in discussions and issues

## 🚀 Getting Started

### Development Environment Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/show-bookings-system.git
   cd show-bookings-system
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/Hannah-goodridge/eventseats.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your database and API keys
   ```

6. **Run the development server**:
   ```bash
   npm run dev
   ```

### Development Workflow

1. **Create a new branch** for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards
3. **Test thoroughly** - run existing tests and add new ones
4. **Commit your changes** with a clear message
5. **Push to your fork** and create a Pull Request

## 📝 Coding Standards

### TypeScript & JavaScript

- Use **TypeScript** for all new code
- Follow **ESLint** configuration (run `npm run lint`)
- Use **meaningful variable names** and add comments for complex logic
- Prefer **functional components** with hooks over class components

### Code Style

```typescript
// ✅ Good - Clear, typed, documented
interface BookingFormProps {
  onSubmit: (data: BookingData) => void
  isLoading: boolean
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit, isLoading }) => {
  // Component logic here
}

// ❌ Avoid - Unclear, no types
const BookingForm = (props) => {
  // ...
}
```

### Database & API

- Use **Supabase client** for database operations
- Add **proper error handling** for all API calls
- Include **TypeScript types** for all API responses
- Follow **RESTful conventions** for new endpoints

### CSS & Styling

- Use **Tailwind CSS** for styling
- Create **reusable components** in `/src/components/ui/`
- Ensure **mobile responsiveness** for all new features
- Test on different screen sizes

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Add tests for **new components** and **API endpoints**
- Use **React Testing Library** for component tests
- Mock **external dependencies** (APIs, database calls)
- Test **both success and error cases**

Example test structure:
```typescript
describe('BookingForm', () => {
  it('should submit booking data when form is valid', () => {
    // Test implementation
  })

  it('should show validation errors for invalid data', () => {
    // Test implementation
  })
})
```

## 📋 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Documentation updated if needed
- [ ] Manual testing completed

### PR Template

When creating a Pull Request, please include:

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (specify)

## Testing
- [ ] Added/updated tests
- [ ] Manual testing completed
- [ ] All tests pass

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

### Review Process

1. **Automated checks** must pass (tests, linting, type checking)
2. **Code review** by maintainers
3. **Manual testing** if needed
4. **Approval** and merge by maintainers

## 🐛 Bug Reports

### Before Reporting

- Search existing issues to avoid duplicates
- Try to reproduce the bug with latest code
- Check if it's a known limitation

### Bug Report Template

```markdown
**Bug Description**
Clear description of what the bug is

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Screenshots**
Add screenshots if applicable

**Environment**
- OS: [e.g. iOS, Windows]
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 1.0.0]

**Additional Context**
Any other context about the problem
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature you'd like

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How do you envision this working?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Any other context, mockups, or examples
```

## 🌍 Internationalization

We welcome translations! EventSeats uses **react-i18next** for internationalization.

### Adding a New Language

1. **Create translation file**: `src/locales/[language-code].json`
2. **Copy from English**: Use `src/locales/en.json` as template
3. **Translate all strings**
4. **Add language to config**: Update `src/lib/i18n.ts`
5. **Test thoroughly** with your language

### Translation Guidelines

- Keep **UI text concise** but descriptive
- Maintain **consistent terminology** throughout
- Consider **cultural differences** in date/time formats
- Test with **longer text** to ensure UI doesn't break

## 🎨 Themes & Customization

### Creating Themes

EventSeats supports custom themes through CSS variables and Tailwind configuration.

1. **Create theme file**: `src/styles/themes/your-theme.css`
2. **Define CSS variables** for colors, fonts, spacing
3. **Test across all components**
4. **Add documentation** for theme usage

### Theme Guidelines

- Ensure **accessibility** (contrast ratios, focus states)
- Test with **different content lengths**
- Support both **light and dark modes** if possible
- Follow **brand guidelines** for venue-specific themes

## 📚 Documentation

### Types of Documentation

- **User guides** - How to use features
- **Admin guides** - Managing the system
- **Developer docs** - API references, setup guides
- **Deployment guides** - Production deployment

### Documentation Standards

- Use **clear, simple language**
- Include **code examples** where relevant
- Add **screenshots** for UI instructions
- Keep docs **up to date** with code changes

## 🏆 Recognition

Contributors are recognized in several ways:

- **GitHub contributors graph**
- **CHANGELOG.md** mentions for significant contributions
- **Special thanks** in README for major contributors
- **Contributor badge** in Discord (when available)

## 📞 Getting Help

### Community Support

- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bug reports and feature requests

### Maintainer Response Times

- **Critical bugs**: Within 24 hours
- **Regular issues**: Within 1 week
- **Feature requests**: Within 2 weeks
- **Pull reviews**: Within 1 week

## 📜 Code of Conduct

### Our Standards

- **Be respectful** and inclusive
- **Welcome newcomers** and help them contribute
- **Focus on what's best** for the community
- **Show empathy** towards other community members

### Unacceptable Behavior

- Harassment, trolling, or discriminatory language
- Personal attacks or political arguments
- Publishing private information
- Any conduct inappropriate in a professional setting


## 🎯 Contribution Ideas

### For Beginners

- Fix typos in documentation
- Improve error messages
- Add input validation
- Write tests for existing components

### For Experienced Developers

- Payment gateway integrations
- Advanced seat layout editor
- Mobile app development
- Performance optimizations

### For Designers

- UI/UX improvements
- Custom themes
- Logo and branding assets
- User experience audits

### For DevOps

- Docker configurations
- CI/CD improvements
- Deployment guides
- Performance monitoring

## 🎉 Thank You!

Every contribution, no matter how small, makes EventSeats better for everyone. We appreciate your time and effort in helping build this open-source project!

---

**Questions?** Feel free to ask in [GitHub Discussions](https://github.com/Hannah-goodridge/eventseats/discussions)
