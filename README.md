# 🎹 Rhythm | Salary Automation on Flow EVM

Rhythm is a production-hardened salary splitting platform built on **Flow EVM Testnet**. It enables users to automate their income distribution into different "Vaults" (Savings, Bills, Spend) the moment a deposit lands in their account.

---

## 🏗 System Architecture

The platform uses a "Treasury-to-Vault" model synchronized via an automated execution engine.

1. **Treasury**: Holds incoming funds (unprocessed salary).
2. **Execution Controller**: Triggers the intelligent split based on user-defined rules.
3. **Vault Ledger**: Manages the final allocated wealth balances on-chain.

---

## 💎 Deployed Contracts (Flow EVM Testnet)

All contracts are deployed on **Chain ID 545**.

| Component | Contract Address | Role |
| :--- | :--- | :--- |
| **TreasuryManager** | `0x04F80c1DA4D8FCf676E7174e3BBA47BF367a73F9` | Holds unprocessed user deposits |
| **VaultLedger** | `0xb96BFf5fE3ce64D29cAAcC253E2c90392be88085` | tracks allocated wealth (Savings/Bills) |
| **RuleEngine** | `0x02a0Fc6088A441A6CE86Cf7d09c2a31245e67619` | Manages split % logic (e.g. 50/30/20) |
| **ExecutionEngine** | `0x6B015Df62da64A12dF2e13d2fFAb9BFd99a838a2` | **Authorized Engine** (Relayer-Role) |
| **AutomationController** | `0xD93b31cc5B6E995744D0D3c7d09f5c2E340E3b10` | Dispatches splitting commands |

---

## 🚀 Key Features

### 1. **Salary Treasury & Top-Up**
Users can "Top Up" their Rhythm account from any wallet. Fresh funds are visible in the **Salary Treasury** before being split, ensuring 100% transparency.

### 2. **Native On-Chain Decoding**
To bypass unreliable blockchain explorer indexing, Rhythm features a **Native Transaction Decoder**. It pulls direct logs from the Flow RPC to show real-time fund breakdowns (e.g., *Savings: +200 FLOW*).

### 3. **Dual-Path Persistence**
The event indexer uses a dual-path strategy (Render Persistent Disk + Local Fallback) to ensure that your activity history is never lost, even during server restarts.

### 4. **Gasless Logic (Relayer Integration)**
The backend relayer handles the execution gas costs, providing a seamless "click-to-automate" experience for the end user.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Ethers.js v6
- **Backend**: Node.js (Express), Supabase (PostgreSQL), Flow EVM RPC
- **Styling**: Premium Obsidian Dark Aesthetic (Flow Green accents)

---

## 📦 Setting Up Locally

1. **Clone & Install**:
   ```bash
   npm install
   cd backend && npm install