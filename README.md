# 🎹 Rhythm | Automated DeFi Treasury on Flow EVM

Rhythm is a decentralized asset management and automated execution platform built on **Flow EVM**. It allows users to automate their income distribution into distinct buckets—**Savings**, **Bills**, and **Spending**—the moment funds land in their account.

🚀 **Live App**: [https://rhythm-autopilot.vercel.app/](https://rhythm-autopilot.vercel.app/)
📁 **GitHub**: [https://github.com/0xgokkull/Rhythm](https://github.com/0xgokkull/Rhythm)

---

## 🏗 How it Works

Rhythm uses a "Set & Forget" model for wealth management:

1.  **Define Rules**: Set your desired percentages for Savings and Bills (e.g., 50% Savings, 30% Bills, 20% Spend).
2.  **Deposit (Top-Up)**: Add FLOW tokens to your Treasury.
3.  **Automated Split**: Our execution engine automatically splits and allocates your funds to the correct on-chain vaults.
4.  **Track Wealth**: Monitor your growing balances and transaction history in real-time.

---

## 💎 Deployed Contracts (Flow EVM Testnet)

All contracts are deployed on **Chain ID 545**.

| Component | Contract Address | Role |
| :--- | :--- | :--- |
| **TreasuryManager** | `0xB3100373c3b7A5005AE2Fe0F359a9B1D52B785Ce` | Receives and holds user deposits |
| **VaultLedger** | `0x814863A0Ce15A079C575EC3929DC130E7CB58837` | Tracks allocated balances (Savings/Bills/Spend) |
| **RuleEngine** | `0xaFbBc6efc31bA85f6A686FC9925Bf6d136547364` | Stores user-defined split percentages |
| **ExecutionEngine** | `0xF49579b232659E61daAA2982C5a4BB2bDB09951F` | Core splitting logic executed by relayers |
| **AutomationController** | `0xbF4E69C78f9CF44f3f49de23E39006a767755912` | Manages relayer interactions and retries |

---

## 🚀 Key Features

*   **Zero-Click Management**: Once your rules are set, asset distribution is handled automatically by our backend relayer.
*   **On-Chain Transparency**: Every split is logged as a blockchain event.
*   **Real-Time Indexing**: Our custom indexer ensures your dashboard stays perfectly synced with the blockchain.
*   **Gasless Experience**: Backend relayers handle the transaction gas for splitting, so users don't have to sign multiple complex transactions.

---

## 🛠 Tech Stack

*   **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Ethers.js
*   **Backend**: Node.js (Express), Supabase (Activity History)
*   **Smart Contracts**: Solidity
*   **Blockchain**: Flow EVM Testnet

---

## 📦 Local Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    cd backend && npm install
    ```
2.  **Environment Setup**: Create `.env` files in both root and `backend` directories with your RPC URLs and Private Keys.
3.  **Run Development Server**:
    ```bash
    npm run dev
    # In another terminal
    cd backend && node server.js
    ```