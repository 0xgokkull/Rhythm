// SPDX-License-Identifier: MIT
/**
 * @title Deployment Orchestrator (Flow EVM)
 * @dev Deploys the 5-contract system in the mandatory production order.
 */
const { ethers } = require("hardhat");

async function main() {
  console.log("--- Starting Rhythm 10/10 Deployment ---");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 1. RuleEngine (Configuration Layer)
  const RuleEngine = await ethers.getContractFactory("RuleEngine");
  const ruleEngine = await RuleEngine.deploy();
  await ruleEngine.waitForDeployment();
  console.log("RuleEngine deployed to:", await ruleEngine.getAddress());

  // 2. VaultLedger (Note: Temporary address, will wire ExecutionEngine later)
  const VaultLedger = await ethers.getContractFactory("VaultLedger");
  const vaultLedger = await VaultLedger.deploy(deployer.address); 
  await vaultLedger.waitForDeployment();
  console.log("VaultLedger deployed to:", await vaultLedger.getAddress());

  // 3. TreasuryManager (USDC Custodian)
  const TreasuryManager = await ethers.getContractFactory("TreasuryManager");
  const treasuryManager = await TreasuryManager.deploy(deployer.address, deployer.address); 
  await treasuryManager.waitForDeployment();
  console.log("TreasuryManager deployed to:", await treasuryManager.getAddress());

  // 4. AutomationController (System Brain)
  const AutomationController = await ethers.getContractFactory("AutomationController");
  const controller = await AutomationController.deploy(deployer.address); // Relayer address
  await controller.waitForDeployment();
  console.log("AutomationController deployed to:", await controller.getAddress());

  // 5. ExecutionEngine (Pure Logic Engine) - REQUIRES ALL OTHER ADDRESSES
  const ExecutionEngine = await ethers.getContractFactory("ExecutionEngine");
  const executionEngine = await ExecutionEngine.deploy(
    await ruleEngine.getAddress(),
    await vaultLedger.getAddress(),
    await treasuryManager.getAddress(),
    await controller.getAddress()
  );
  await executionEngine.waitForDeployment();
  console.log("ExecutionEngine deployed to:", await executionEngine.getAddress());

  // --- FINAL WIRING (Security Layer) ---
  console.log("--- Wiring System Security ---");
  await controller.setExecutionEngine(await executionEngine.getAddress());
  
  console.log("--- Rhythm 10/10 Backend Initialized ---");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
