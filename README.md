# Mini Digital Bank Dashboard

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Test Coverage](https://img.shields.io/badge/coverage-87%25-red)

A high-performance, accessible mini banking dashboard built with React + TypeScript.

## Features
- [ ] Mock authentication
- [ ] Account overview
- [ ] Transaction management with filtering/sorting
- [ ] Spending analytics
- [ ] Money transfer functionality
- [ ] Dark/light theme
- [ ] Fully responsive

## Performance Metrics
- Lighthouse Score: TBD
- Bundle Size: TBD
- Test Coverage: TBD

## Tech Stack
- React 19 + TypeScript
- Vite
- React Router
- Vitest + React Testing Library
- Playwright
- Recharts
- react-window

## Getting Started
[To be completed]

## Testing

This project maintains high test coverage with a focus on business-critical logic:

- **87% overall coverage** (statements)
- **96% hook coverage** - All custom React hooks fully tested
- **82% service layer coverage** - Core business logic validated
- **100% validation logic coverage** - Transfer rules, IBAN validation

### Run Tests
```bash
npm run test                 # Run all tests
npm run test:coverage        # View coverage report
npm run test:ui              # Interactive test UI
```

### Testing Strategy

We follow the testing pyramid:
- **Unit tests**: Utils, validation, services (Vitest)
- **Integration tests**: Custom hooks (React Testing Library)
- **E2E tests**: Critical user flows (Playwright) - TBD

## Architecture
[To be completed]