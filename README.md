# SauceDemo Playwright Test Automation Framework

A comprehensive test automation framework built with Playwright and TypeScript for testing the [SauceDemo](https://www.saucedemo.com/) e-commerce application. This framework implements the Page Object Model (POM) pattern and includes end-to-end tests covering core functionality.

## 🚀 Features

- **Page Object Model (POM)**: Clean separation of page elements and test logic
- **TypeScript**: Type-safe code with full IntelliSense support
- **Comprehensive Test Coverage**: 5 test suites covering authentication, product browsing, cart operations, checkout process, and end-to-end scenarios
- **Reusable Base Page**: Abstract `BasePage` class with common methods for all page objects
- **Centralized Test Data**: Static test data stored in separate files
- **Environment Variables**: Secure credential storage using `.env` files
- **CI/CD Integration**: GitHub Actions workflow for automated test execution
- **Cross-Browser Support**: Tests configured for Chromium, Firefox, and WebKit
- **Parallel Execution**: Tests run concurrently for faster feedback
- **Rich Reporting**: HTML, JSON, and JUnit test reports

## 📋 Prerequisites

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd sauceDemo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   The `.env` file is already pre-configured with default SauceDemo credentials. No changes needed unless you want to customize settings.

## 📁 Project Structure

```
sauceDemo/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI/CD workflow
├── src/
│   ├── pages/
│   │   ├── common/
│   │   │   └── BasePage.ts         # Abstract base page with reusable methods
│   │   ├── LoginPage.ts            # Login page object
│   │   ├── InventoryPage.ts        # Product listing page object
│   │   ├── CartPage.ts             # Shopping cart page object
│   │   ├── CheckoutStepOnePage.ts  # Checkout info page object
│   │   ├── CheckoutStepTwoPage.ts  # Checkout overview page object
│   │   ├── CheckoutCompletePage.ts # Order confirmation page object
│   │   └── ProductDetailPage.ts    # Product detail page object
│   ├── data/
│   │   ├── users.ts                # User credentials and test data
│   │   ├── products.ts             # Product information
│   │   └── checkout.ts             # Checkout form data
│   ├── utils/
│   │   ├── env.ts                  # Environment variable configuration
│   │   ├── constants.ts            # Application constants
│   │   └── helpers.ts              # Utility helper functions
│   └── types/
│       └── index.ts                # TypeScript type definitions
├── tests/
│   ├── auth/
│   │   └── login.spec.ts           # Login functionality tests
│   ├── inventory/
│   │   └── products.spec.ts        # Product browsing tests
│   ├── cart/
│   │   └── cart.spec.ts            # Shopping cart tests
│   ├── checkout/
│   │   └── checkout.spec.ts        # Checkout process tests
│   └── e2e/
│       └── end-to-end.spec.ts      # End-to-end user journey tests
├── playwright.config.ts             # Playwright configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Project dependencies and scripts
├── .env                             # Environment variables (gitignored)
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
└── README.md                        # Project documentation
```

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in specific browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run specific test suite
```bash
npm run test:auth          # Login tests
npm run test:inventory     # Product browsing tests
npm run test:cart          # Cart operations tests
npm run test:checkout      # Checkout process tests
npm run test:e2e           # End-to-end tests
```

### Debug mode
```bash
npm run test:debug
```

### UI mode (interactive test runner)
```bash
npm run test:ui
```

### View test report
```bash
npm run report
```

## 📊 Test Coverage

### 1. Authentication Tests (`tests/auth/login.spec.ts`)
- ✅ Login with valid credentials
- ✅ Login with invalid credentials
- ✅ Login with locked user
- ✅ Empty username validation
- ✅ Empty password validation
- ✅ Error message handling

### 2. Product Browsing Tests (`tests/inventory/products.spec.ts`)
- ✅ Display all products
- ✅ Sort products by name (A-Z, Z-A)
- ✅ Sort products by price (low-high, high-low)
- ✅ Navigate to product details
- ✅ Add/remove products from inventory

### 3. Shopping Cart Tests (`tests/cart/cart.spec.ts`)
- ✅ Add multiple products to cart
- ✅ Remove products from cart
- ✅ Continue shopping functionality
- ✅ Empty cart state
- ✅ Cart persistence across pages

### 4. Checkout Process Tests (`tests/checkout/checkout.spec.ts`)
- ✅ Complete checkout with valid information
- ✅ Validation for missing first name
- ✅ Validation for missing last name
- ✅ Validation for missing postal code
- ✅ Cancel checkout functionality
- ✅ Order total calculation verification

### 5. End-to-End Tests (`tests/e2e/end-to-end.spec.ts`)
- ✅ Logout functionality
- ✅ Complete user journey (login → browse → cart → checkout → logout)
- ✅ Reset app state
- ✅ Browser navigation (back/forward)
- ✅ Unauthorized access prevention
- ✅ Session persistence

## 🔧 Configuration

### Environment Variables

The framework uses environment variables for configuration. Key variables in `.env`:

```env
# Application URL
BASE_URL=https://www.saucedemo.com

# Test User Credentials
STANDARD_USER=standard_user
DEFAULT_PASSWORD=secret_sauce

# Test Configuration
HEADLESS=false
BROWSER=chromium
WORKERS=4
RETRIES=1

# Timeouts (milliseconds)
DEFAULT_TIMEOUT=30000
NAVIGATION_TIMEOUT=30000
ACTION_TIMEOUT=10000
```

### Playwright Configuration

Test execution settings are defined in `playwright.config.ts`:
- **Parallel execution**: Tests run concurrently
- **Retries**: Automatic retry on failure (1 retry locally, 2 in CI)
- **Browsers**: Chromium, Firefox, WebKit support
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Reports**: HTML, JSON, and JUnit formats

## 🔄 CI/CD Integration

### GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) that:
- Triggers on push to `main` or `develop` branches
- Triggers on pull requests
- Can be manually triggered
- Installs dependencies and Playwright browsers
- Runs all tests in headless mode
- Uploads test results and reports as artifacts

### Setting Up GitHub Actions

1. Push your code to GitHub
2. The workflow will automatically run on push/PR
3. View test results in the "Actions" tab

### Test Reports

After each run, test reports are available as downloadable artifacts in GitHub Actions.

## 🎯 Page Object Model Architecture

### BasePage Class

The `BasePage` class provides reusable methods for all page objects:

**Navigation Methods:**
- `goto()`, `getCurrentUrl()`, `getPageTitle()`

**Element Interactions:**
- `clickElement()`, `fillInput()`, `getText()`, `selectDropdown()`

**Wait Methods:**
- `waitForElement()`, `waitForElementToBeVisible()`, `waitForNavigation()`

**Assertions:**
- `expectElementToBeVisible()`, `expectElementToContainText()`, `expectUrlToContain()`

**State Checks:**
- `isElementVisible()`, `isElementEnabled()`, `isElementChecked()`

**Utilities:**
- `takeScreenshot()`, `scrollToElement()`, `pressKey()`

### Page Object Example

```typescript
import { BasePage } from './common/BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput = '#user-name';
  private readonly passwordInput = '#password';

  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement('#login-button');
  }
}
```

## 📚 Test Data Management

Test data is centralized in separate files under `src/data/`:

```typescript
// src/data/users.ts
export const validUsers = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
    type: 'standard',
    description: 'Standard user with full access'
  }
};

// Usage in tests
import { validUsers } from '../../src/data/users';
await loginPage.login(validUsers.standard.username, validUsers.standard.password);
```

## 🐛 Troubleshooting

### Tests failing locally but passing in CI
- Ensure your local environment matches CI (same Node version)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Reinstall browsers: `npx playwright install`

### Browser not launching
- Install system dependencies: `npx playwright install-deps`
- Try running in headed mode to see errors: `npm run test:headed`

### Timeout errors
- Increase timeout in `playwright.config.ts`
- Check internet connection for SauceDemo availability
- Ensure no network proxy interfering with requests

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/new-tests`
2. Make your changes
3. Run tests to ensure they pass: `npm test`
4. Commit your changes: `git commit -m "Add new test cases"`
5. Push to the branch: `git push origin feature/new-tests`
6. Open a Pull Request

## 📝 Best Practices

1. **Keep tests independent**: Each test should be able to run in isolation
2. **Use Page Objects**: Never use selectors directly in tests
3. **Centralize test data**: Store test data in `src/data/` files
4. **Use meaningful assertions**: Verify expected outcomes clearly
5. **Add comments**: Document complex test logic
6. **Follow naming conventions**: Use descriptive test names
7. **Keep tests focused**: One test should verify one specific behavior

## 📄 License

MIT License - Feel free to use this framework for your own projects!

## 👤 Author

Created as a comprehensive Playwright testing framework example.

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/) - Modern web testing framework
- [SauceDemo](https://www.saucedemo.com/) - Test application
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

---

**Happy Testing! 🚀**
