# Playwright SkillSprig Automation Framework

Enterprise-grade Playwright automation framework for testing the SkillSprig application - a skill mentoring marketplace platform.

## 🚀 Features

- **Comprehensive Page Object Model** - Well-structured page objects with fluent interfaces
- **Factory Pattern** - Test data factories for users, courses, and bookings
- **Custom Fixtures** - Pre-authenticated contexts for different user roles
- **MCP Server Integration** - AI-assisted test generation and selector discovery
- **Multi-Environment Support** - Dev, staging, and production configurations
- **Parallel Execution** - Optimized for CI/CD with parallel test execution
- **Rich Reporting** - HTML reports, JUnit XML, and screenshots/videos on failure
- **TypeScript Strict Mode** - Type-safe test automation
- **Self-Healing Selectors** - Multiple locator strategies for resilient tests

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [CI/CD](#cicd)
- [MCP Server](#mcp-server)
- [Contributing](#contributing)

## 📦 Prerequisites

- Node.js 18+ (recommended: Node.js 20)
- npm 9+
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lakssh/playwright-skillopedia.git
   cd playwright-skillopedia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install --with-deps
   ```

4. **Configure environment**
   ```bash
   cp config/dev.env config/.env
   # Edit config/.env with your settings
   ```

## 📁 Project Structure

```
playwright-skillopedia/
├── src/
│   ├── core/
│   │   ├── base/              # Base classes (BasePage, BaseComponent, BaseApi)
│   │   ├── factories/         # Test data factories
│   │   ├── fixtures/          # Custom Playwright fixtures
│   │   ├── helpers/           # Utility helpers
│   │   └── config/            # Configuration files
│   ├── pages/                 # Page Object Models
│   │   ├── auth/              # Authentication pages
│   │   ├── admin/             # Admin pages
│   │   ├── mentor/            # Mentor pages
│   │   ├── student/           # Student pages
│   │   └── common/            # Shared components
│   ├── api/                   # API clients and models
│   └── mcp/                   # MCP server implementation
├── tests/
│   ├── e2e/                   # End-to-end tests
│   ├── api/                   # API tests
│   ├── visual/                # Visual regression tests
│   ├── accessibility/         # Accessibility tests
│   └── performance/           # Performance tests
├── test-data/                 # Test data files
├── config/                    # Environment configurations
└── .github/workflows/         # CI/CD pipelines
```

## ⚙️ Configuration

### Environment Variables

The framework supports multiple environments through `.env` files:

- `config/dev.env` - Development environment
- `config/staging.env` - Staging environment
- `config/prod.env` - Production environment

Key variables:
```env
BASE_URL=https://skill-sprig.vercel.app
API_BASE_URL=https://skill-sprig.vercel.app/api
TEST_ENV=dev
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=Admin@123
```

### Playwright Configuration

Edit `playwright.config.ts` to customize:
- Test timeout settings
- Browser configurations
- Retry strategies
- Reporter options
- Parallel execution settings

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run specific test suites
```bash
npm run test:auth        # Authentication tests
npm run test:admin       # Admin tests
npm run test:mentor      # Mentor tests
npm run test:student     # Student tests
npm run test:api         # API tests
npm run test:visual      # Visual tests
```

### Run tests by tag
```bash
npm test -- --grep @smoke       # Smoke tests
npm test -- --grep @critical    # Critical tests
```

### Run in headed mode
```bash
npm run test:headed
```

### Run in UI mode
```bash
npm run test:ui
```

### Debug tests
```bash
npm run test:debug
```

### View test report
```bash
npm run report
```

## ✍️ Writing Tests

### Basic Test Example

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/auth/LoginPage';

test.describe('Login Tests', () => {
  test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('user@example.com', 'Password123!');
    await loginPage.waitForLoginSuccess();
    
    expect(page.url()).not.toContain('/login');
  });
});
```

### Using Factories

```typescript
import { UserFactory } from '../src/core/factories/UserFactory';

test('should register new user', async ({ page }) => {
  const user = UserFactory.createStudent();
  const registerPage = new RegisterPage(page);
  
  await registerPage.goto();
  await registerPage.register(user);
});
```

### Using Custom Fixtures

```typescript
import { authTest } from '../src/core/fixtures/auth-fixtures';

authTest('should access admin dashboard', async ({ authenticatedAdminPage }) => {
  await authenticatedAdminPage.goto('/admin/dashboard');
  // Test with pre-authenticated admin context
});
```

## 🔄 CI/CD

The framework includes three GitHub Actions workflows:

### 1. Main Tests (`playwright-tests.yml`)
- Runs on push to main/develop
- Runs on pull requests
- Tests across Chrome, Firefox, and Safari

### 2. Smoke Tests (`smoke-tests.yml`)
- Runs on pull requests
- Quick validation with critical tests
- Chrome only for speed

### 3. Nightly Tests (`nightly-tests.yml`)
- Runs at 2 AM UTC daily
- Full regression suite
- Sharded execution for parallel testing

## 🤖 MCP Server

The framework includes an MCP (Model Context Protocol) server with AI-assisted tools:

### Available Tools

1. **test-generator** - Generate tests from natural language
2. **selector-finder** - Find optimal element selectors
3. **test-analyzer** - Analyze test results and suggest improvements
4. **data-suggester** - Suggest test data based on context

### Usage Example

```typescript
import { McpServer } from './src/mcp/server/McpServer';
import { TestGeneratorTool } from './src/mcp/server/tools/test-generator';

const mcpServer = new McpServer();
mcpServer.registerTool(new TestGeneratorTool());

const result = await mcpServer.executeTool('test-generator', {
  description: 'Login with valid credentials',
  testType: 'e2e'
});
```

## 📊 Reporting

### HTML Report
Automatically generated after test run:
```bash
npm run report
```

### Test Results Location
- HTML Report: `playwright-report/`
- Screenshots: `test-results/`
- Videos: `test-results/`
- Traces: `test-results/`

## 🛠️ Development

### Linting
```bash
npm run lint
npm run lint:fix
```

### Formatting
```bash
npm run format
npm run format:check
```

### Type Checking
```bash
npm run type-check
```

## 🧩 Key Components

### BasePage
Abstract base class providing common page operations:
- Navigation
- Element interactions (click, fill, type)
- Waiting strategies
- Assertions

### Factories
Generate test data:
- `UserFactory` - Create users by role
- `CourseFactory` - Generate course data
- `BookingFactory` - Create booking scenarios

### Helpers
Utility functions:
- `WaitHelper` - Custom wait strategies
- `DataHelper` - Test data generation
- `AssertionHelper` - Custom assertions
- `ApiHelper` - API utilities

## 📝 Best Practices

1. **Use Page Object Model** - Encapsulate page logic in page objects
2. **Use Factories** - Generate test data with factories
3. **Use Custom Fixtures** - Leverage fixtures for setup
4. **Tag Tests** - Use tags for test organization (@smoke, @critical, etc.)
5. **Self-Healing Selectors** - Use multiple locator strategies
6. **Parallel Execution** - Run tests in parallel for speed
7. **Clean Test Data** - Clean up test data after tests

## 🐛 Troubleshooting

### Tests are flaky
- Use proper wait strategies from `WaitHelper`
- Avoid hardcoded `waitForTimeout`
- Use `waitForLoadState` appropriately

### Selectors not working
- Use the selector-finder MCP tool
- Implement multiple locator strategies
- Use data-testid attributes

### CI failures
- Check environment variables
- Verify browser installation
- Review test artifacts and screenshots

## 📖 Documentation

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [SkillSprig Application](https://skill-sprig.vercel.app)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Run linting and formatting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Authors

SkillSprig QA Team

## 🔗 Links

- [Repository](https://github.com/Lakssh/playwright-skillopedia)
- [Issues](https://github.com/Lakssh/playwright-skillopedia/issues)
- [SkillSprig Application](https://skill-sprig.vercel.app)
