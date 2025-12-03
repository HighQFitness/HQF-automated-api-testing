# 🧪 Playwright API Testing (TypeScript)

This repository contains automated **API tests** written in **TypeScript** using [Playwright Test](https://playwright.dev/docs/test-api-testing).  
It validates HighQ Fitness service endpoints — ensuring that API responses meet schema and data expectations.

---

## 🧰 Tech Stack

| Tool | Purpose |
|------|----------|
| **Node.js** | Runtime environment |
| **TypeScript** | Strong typing and cleaner code for test logic |
| **Playwright** | Test runner with built-in API request context |
| **Dotenv** | Loads environment variables from `.env` |
| **ESLint + Prettier** | Code quality and formatting |
| **Custom Schema Validation** | Ensures responses match expected JSON structure |

---

## 📂 Project Structure

The project follows a **modular, domain-driven architecture** similar to NestJS patterns:

```
automated-api-testing/
│
├── src/
│   ├── services/
│   │   └── account-service/          # Account service API tests
│   │       ├── account/              # Account domain
│   │       │   ├── config/          # Domain configuration
│   │       │   ├── types/           # TypeScript interfaces
│   │       │   ├── validators/      # Response validators
│   │       │   ├── index.ts         # Domain exports
│   │       │   └── account.spec.ts  # Test suite
│   │       ├── account-info/        # Account info domain
│   │       ├── health-info/         # Health info domain
│   │       ├── sports-info/         # Sports info domain
│   │       ├── workout-units/       # Workout units domain
│   │       ├── pills/               # Pills/IoT devices domain
│   │       ├── notification-preferences/  # Notification preferences
│   │       ├── feedback/            # Feedback upload domain
│   │       └── status/              # API status check
│   │
│   └── shared/                      # Shared utilities
│       ├── client/                  # API client
│       ├── constants/               # Shared constants
│       ├── fixtures/                # Playwright fixtures
│       ├── reporters/               # Custom reporters
│       └── utils/                   # Utility functions
│
├── config/
│   └── appConfig.ts                 # Centralized configuration
│
├── constants/
│   └── testData.ts                  # Test data constants
│
├── global-setup.ts                  # Global test setup
├── global-teardown.ts               # Global test teardown
├── playwright.config.ts             # Playwright configuration
├── tsconfig.json                    # TypeScript configuration
└── .env.example                     # Environment variable template
```

### Key Features

- **Path Aliases**: Use `@shared/*`, `@config/*`, `@constants/*`, `@services/*` for clean imports
- **Domain-Driven**: Each API domain has its own folder with types, configs, factories, and validators
- **Type-Safe**: Full TypeScript coverage with interfaces for all API responses
- **Modular**: Easy to add new domains or modify existing ones

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/HighQFitness/automated-api-testing.git
cd automated-api-testing
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Create a local `.env` file by copying the provided example:

```bash
cp .env.example .env
```

Then fill in your values:

```bash
# Required
API_BASE_URL=https://mobile.highqfit.com

# Authentication (recommended)
API_USER_PHONE=+1234567890

# Optional: Use direct access token instead of phone signin
# API_ACCESS_TOKEN=your-access-token-here

# Test Data (optional)
API_USER_EMAIL=jimena@highqfitness.com
```

> ⚠️ The `.env` file is ignored by Git — never commit real credentials.

---

## 🚀 Running the Tests

### Run all tests

```bash
npm test
# or
npx playwright test
```

### Run specific test suite

```bash
npx playwright test src/services/account-service/account/account.spec.ts
```

### Run tests by tag

```bash
# Run only critical tests
npx playwright test --grep @critical

# Run smoke tests
npx playwright test --project=smoke
```

### Run in interactive UI mode

```bash
npx playwright test --ui
```

### View test report

```bash
npx playwright show-report
```

---

## 🧩 Useful Commands

| Command | Description |
|----------|-------------|
| `npm install` | Install dependencies |
| `npm test` | Run all tests |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npx playwright show-report` | Open the last test report |

---

## 🧬 Environment Variables

### Required

| Variable | Description |
|----------|-------------|
| `API_BASE_URL` | Base API URL (e.g., `https://mobile.highqfit.com`) |

### Recommended

| Variable | Description |
|----------|-------------|
| `API_USER_PHONE` | Phone number for authentication (phone-based signin returns token without code) |

### Optional

| Variable | Description |
|----------|-------------|
| `API_ACCESS_TOKEN` | Direct access token (bypasses phone signin if provided) |
| `API_USER_EMAIL` | Test email for account attributes (not used for authentication) |

> **Note**: All endpoints use hardcoded defaults. Only `API_BASE_URL` is required. Other environment variables are optional and use sensible defaults if not provided.

---

## 📝 Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
// Instead of relative paths:
import { HttpStatus } from '../../../../shared/constants/http-status-codes';

// Use aliases:
import { HttpStatus } from '@shared/constants/http-status-codes';
import { config } from '@config/appConfig';
import { TestUserData } from '@constants/testData';
```

### Available Aliases

- `@shared/*` → `src/shared/*`
- `@config/*` → `config/*`
- `@constants/*` → `constants/*`
- `@services/*` → `src/services/*`

---

## 🧠 Best Practices

- **Environment Variables**: Keep all credentials in `.env` (never commit it)
- **Type Safety**: Use TypeScript interfaces to enforce API response structure
- **Path Aliases**: Always use path aliases instead of relative imports
- **Test Isolation**: Each test should be independent and clean up after itself
- **Error Testing**: Validate both happy paths and error scenarios (401, 400, 404, etc.)
- **Schema Validation**: Use validators to ensure API responses match expected structure

---

## 🏗️ Adding a New Domain

To add a new API domain (e.g., `notifications`):

1. Create folder structure:
   ```
   src/services/account-service/notifications/
   ├── config/
   │   └── notifications.config.ts
   ├── types/
   │   └── notifications.types.ts
   ├── factories/
   │   └── notifications.factory.ts
   ├── validators/
   │   └── notifications.validator.ts
   ├── notifications.spec.ts
   └── index.ts
   ```

2. Add endpoints to `config/appConfig.ts`
3. Export from domain's `index.ts`
4. Write tests in `notifications.spec.ts`

---

## 👩‍💻 Author

**QA Automation – HighQ Fitness**  
📧 `jimena@highqfitness.com`
**Engineering Lead – HighQ Fitness**  
📧 `joao@highqfitness.com`
