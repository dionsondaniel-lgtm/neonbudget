# 🌌 NeonBudget

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-purple)

**NeonBudget** is a privacy-focused, offline-first Personal Finance Progressive Web App (PWA). 

Built with a "Cyberpunk/Futuristic" aesthetic, it utilizes **Glassmorphism** and **Neon** visual cues to make financial tracking engaging. The application runs entirely on the client side, using the browser's LocalStorage to ensure your financial data never leaves your device.

## ✨ Key Features

- **🎨 Futuristic UI:** Deep space backgrounds, neon accents, and glassmorphism cards using Tailwind CSS.
- **📱 PWA & Offline-First:** Installable on mobile/desktop and works 100% without an internet connection.
- **📊 Interactive Analytics:** Visual breakdowns of expenses vs. income using `Recharts`.
- **🔒 Privacy Centric:** No database or server. Data is stored locally on your device.
- **💾 Data Management:**
  - Create and restore local snapshots.
  - Export/Import data via JSON.
  - "Storage Inspector" to monitor local storage usage.
- **⚡ Quick Actions:**
  - Recurring transaction templates.
  - Smart "Quick Fill" based on previous entries.
  - Loan Calculator & Planner.
- **🌗 Theming:** Includes multiple preset themes (Cosmic Neon, Dark Forest, Midnight Ocean, Polar Light).

## 🛠 Tech Stack

- **Framework:** [React](https://react.dev/) (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API + LocalStorage
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Charting:** Recharts
- **PWA:** vite-plugin-pwa

## 🚀 Getting Started

### Prerequisites
Ensure you have Node.js installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dionsondaniel-lgtm/neon-budget.git