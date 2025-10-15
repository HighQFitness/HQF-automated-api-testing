# 🧪 Playwright API Testing (TypeScript)

This repository contains automated **API tests** written in **TypeScript** using [Playwright Test](https://playwright.dev/docs/test-api-testing).  
It validates HighQ Fitness service endpoints — such as authentication and workout units — ensuring that API responses meet schema and data expectations.

---

## 🧰 Tech Stack

| Tool | Purpose |
|------|----------|
| **Node.js** | Runtime environment |
| **TypeScript** | Strong typing and cleaner code for test logic |
| **Playwright** | Test runner with built-in API request context |
| **Dotenv** | Loads environment variables from `.env` |
| **Custom Schema Validation** | Ensures responses match expected JSON structure |

---

## 📂 Project Structure

```
automated-api-testing/
│
├── e2e/
│   └── account-service/
│       └── workoutunit/
│           └── workoutUnits.spec.ts      # API test suite
│
├── utils/
│   ├── apiClient.ts                      # Handles authentication and requests
│   ├── schemaValidator.ts                # Validates API responses
│   └── types.ts                          # TypeScript interfaces
│
├── .env.example                          # Environment variable template
├── .gitignore                            # Excludes secrets and build artifacts
├── package.json                          # Dependencies and npm scripts
└── README.md                             # Project documentation
```

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

Then fill in your real credentials:
```bash
API_BASE_URL=https://mobile.highqfit.com
API_SIGNIN_URL=/account_service_v2/api/v1/auth/signin
API_WORKOUTUNITS_URL=/account_service_v2/api/v1/workout-units
API_EMAIL=XXXx@XXXXcom
API_PASSWORD=XXXXXXX

> ⚠️ The `.env` file is ignored by Git — never commit real credentials.

---

## 🚀 Running the Tests

Run all Playwright API tests:

```bash
npx playwright test
```

Run only a specific suite:

```bash
npx playwright test e2e/account-service/workoutunit/workoutUnits.spec.ts
```

Run in interactive UI mode:

```bash
npx playwright test --ui
```

View the HTML report after tests:

```bash
npx playwright show-report
```

---

## 🧩 Useful Commands

| Command | Description |
|----------|-------------|
| `npm install` | Install dependencies |
| `npx playwright test` | Run all tests |
| `npx playwright show-report` | Open the last test report |
| `npx playwright codegen <url>` | Record API or UI actions interactively |

---

## 🧬 Environment Variables

| Variable | Description |
|-----------|-------------|
| `API_BASE_URL` | Base API URL |
| `API_SIGNIN_URL` | Login endpoint |
| `API_WORKOUTUNITS_URL` | Workout units endpoint |
| `API_EMAIL` | User email for auth |
| `API_PASSWORD` | User password for auth |
| `API_KEY` | Optional API key (if required) |

---

## 🧠 Best Practices

- Keep all credentials in `.env`  
- Use **TypeScript interfaces** to enforce API response structure  
- Validate both happy and unhappy paths (invalid token, missing fields, etc.)  
- Commit only `.env.example`, not `.env`  

---

## 👩‍💻 Author

**QA Automation – HighQ Fitness**  
📧 `jimena@highqfitness.com`
