# 💳 cc-tester

> The ultimate, zero-dependency credit card utility library for modern developers. Built for Cloudflare Workers, Edge environments, and the browser.

[![npm version](https://badge.fury.io/js/cc-tester.svg)](https://badge.fury.io/js/cc-tester)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/cc-tester?color=success&label=size)](https://bundlephobia.com/package/cc-tester)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Stop searching for test cards during payment gateway integration. `cc-tester` provides instant access to mock credit cards for various testing scenarios (Success, Decline, Fraud) along with ultra-fast utilities for UI formatting and Luhn validation.

## ✨ Why developers love `cc-tester`?

- ⚡ **Edge-First:** 100% compatible with Cloudflare Workers, Next.js Edge, and Deno. No Node.js built-ins.
- 🪶 **Featherweight:** Zero dependencies. Tree-shakable. Extremely tiny bundle size.
- 🛠️ **All-in-One Utility:** Generate test cards, validate numbers, detect networks, and format inputs for UI.

## 📦 Installation

```bash
npm install cc-tester
# or
pnpm add cc-tester
# or
yarn add cc-tester
