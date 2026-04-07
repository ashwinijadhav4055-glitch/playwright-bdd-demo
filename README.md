# 🎭 Playwright BDD Demo — UI & API Automation

A production-ready test automation framework using **Playwright**, **Cucumber BDD**, and **TypeScript** with **Page Object Model (POM)** design pattern.

---

## 🚀 Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev/) | Browser automation + API testing |
| [Cucumber.js](https://cucumber.io/) | BDD framework with Gherkin syntax |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe test code |
| [Allure Report](https://allurereport.org/) | Beautiful test reporting |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline |

---

## 🌐 Test Sites

| Type | Site | Coverage |
|------|------|---------|
| **UI** | [saucedemo.com](https://www.saucedemo.com) | Login, Inventory, Cart, Checkout |
| **API** | [dummyjson.com](https://dummyjson.com) | Auth, Products, Users CRUD |

---

## 📁 Project Structure

```
playwright-bdd-demo/
├── src/
│   ├── pages/                  ← POM Page Objects
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   └── CheckoutPage.ts
│   ├── api/                    ← API Client Classes
│   │   ├── AuthApiClient.ts
│   │   ├── ProductApiClient.ts
│   │   └── UserApiClient.ts
│   └── support/
│       ├── world.ts            ← Custom Cucumber World
│       └── hooks.ts            ← Before/After hooks
├── features/
│   ├── ui/                     ← UI Feature files
│   │   ├── login.feature
│   │   ├── inventory.feature
│   │   └── checkout.feature
│   └── api/                    ← API Feature files
│       ├── auth.feature
│       ├── products.feature
│       └── users.feature
├── step-definitions/
│   ├── ui/                     ← UI Step definitions
│   └── api/                    ← API Step definitions
├── fixtures/                   ← Test data (JSON)
├── .env                        ← Environment config
├── cucumber.config.ts
├── playwright.config.ts
└── .github/workflows/ci.yml
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js >= 18
- npm >= 9

### Install Dependencies
```bash
npm install
```

### Install Playwright Browsers
```bash
npx playwright install chromium
```

### Configure Environment
```bash
cp .env.example .env
# Edit .env with your values
```

---

## ▶️ Running Tests

```bash
# Run all tests
npm test

# Run UI tests only
npm run test:ui

# Run API tests only
npm run test:api

# Run smoke tests
npm run test:smoke
```

### Run with specific tags
```bash
npx cucumber-js --tags "@smoke and @ui"
npx cucumber-js --tags "@api and @positive"
```

---

## 📊 Allure Reports

```bash
# Generate and open report
npm run report

# Generate only
npm run allure:generate

# Serve live
npm run allure:serve
```

---

## 🏷️ Tags

| Tag | Description |
|-----|-------------|
| `@ui` | UI automation tests |
| `@api` | API automation tests |
| `@smoke` | Smoke / sanity tests |
| `@positive` | Positive test cases |
| `@negative` | Negative / error test cases |

---

## 🔑 SauceDemo Users

| Username | Type |
|----------|------|
| `standard_user` | Normal user |
| `problem_user` | UI bug user |
| `performance_glitch_user` | Slow user |
| `locked_out_user` | Blocked user |
| `visual_user` | Visual bug user |

Password for all: `secret_sauce`

---

## 🤖 CI/CD

GitHub Actions pipeline runs automatically on:
- Push to `main` / `develop`
- Pull Requests
- Daily schedule (6AM UTC)
- Manual trigger with tag filter

Artifacts uploaded:
- Allure Results & Report
- Playwright Screenshots (on failure)

---

## 📞 Support

Raise an issue or PR in the repository. Happy testing! 🎉
