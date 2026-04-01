const { ethers } = require("hardhat");

async function main() {
  console.log("--- Starting Rhythm Full Redeploy ---");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1. RuleEngine (no deps)
  const RuleEngine = await ethers.getContractFactory("RuleEngine");
  const ruleEngine = await RuleEngine.deploy();
  await ruleEngine.waitForDeployment();
  const ruleEngineAddr = await ruleEngine.getAddress();
  console.log("RuleEngine:            ", ruleEngineAddr);

  // 2. AutomationController (needs relayer = deployer)
  const AutomationController = await ethers.getContractFactory("AutomationController");
  const controller = await AutomationController.deploy(deployer.address);
  await controller.waitForDeployment();
  const controllerAddr = await controller.getAddress();
  console.log("AutomationController:  ", controllerAddr);

  // 3. ExecutionEngine (needs rule, vault placeholder — we pass address(0) then wire)
  //    Actually we need vault+treasury first. Deploy them with address(0) then we need an upgrade path.
  //    Since there's no setter, deploy EE with placeholder, then redeploy vault/treasury with EE addr.
  //    Correct order: deploy EE with dummy, then vault+treasury with EE addr, then wire AC.

  // We use a two-pass approach: pre-compute EE address from nonce
  const nonce = await deployer.provider.getTransactionCount(deployer.address);
  // EE will be deployed at nonce+2 (vault=nonce, treasury=nonce+1, EE=nonce+2)
  const futureEEAddr = ethers.getCreateAddress({ from: deployer.address, nonce: nonce + 2 });
  console.log("Pre-computed ExecutionEngine address:", futureEEAddr);

  // 4. VaultLedger — pass the future EE address directly
  const VaultLedger = await ethers.getContractFactory("VaultLedger");
  const vaultLedger = await VaultLedger.deploy(futureEEAddr);
  await vaultLedger.waitForDeployment();
  const vaultLedgerAddr = await vaultLedger.getAddress();
  console.log("VaultLedger:           ", vaultLedgerAddr);

  // 5. TreasuryManager — pass the future EE address directly
  const TreasuryManager = await ethers.getContractFactory("TreasuryManager");
  const treasuryManager = await TreasuryManager.deploy(futureEEAddr);
  await treasuryManager.waitForDeployment();
  const treasuryManagerAddr = await treasuryManager.getAddress();
  console.log("TreasuryManager:       ", treasuryManagerAddr);

  // 6. ExecutionEngine — this MUST land at futureEEAddr
  const ExecutionEngine = await ethers.getContractFactory("ExecutionEngine");
  const executionEngine = await ExecutionEngine.deploy(
    ruleEngineAddr,
    vaultLedgerAddr,
    treasuryManagerAddr,
    controllerAddr
  );
  await executionEngine.waitForDeployment();
  const executionEngineAddr = await executionEngine.getAddress();
  console.log("ExecutionEngine:       ", executionEngineAddr);

  if (executionEngineAddr.toLowerCase() !== futureEEAddr.toLowerCase()) {
    console.error("❌ ExecutionEngine landed at wrong address! Pre-computation was off.");
    process.exit(1);
  }

  // 7. Wire AutomationController → ExecutionEngine
  console.log("--- Wiring AutomationController → ExecutionEngine ---");
  await controller.setExecutionEngine(executionEngineAddr);
  console.log("✅ AutomationController wired.");

  // 8. Verify wiring
  console.log("--- Verifying ---");
  console.log("VaultLedger.executionEngine:", await vaultLedger.executionEngine());
  console.log("TreasuryManager.executionEngine:", await treasuryManager.executionEngine());
  console.log("AutomationController.executionEngine:", await controller.executionEngine());

  console.log("\n=== COPY THESE INTO server.js ADDRESSES ===");
  console.log(JSON.stringify({
    RuleEngine: ruleEngineAddr,
    VaultLedger: vaultLedgerAddr,
    TreasuryManager: treasuryManagerAddr,
    ExecutionEngine: executionEngineAddr,
    AutomationController: controllerAddr
  }, null, 2));
  console.log("===========================================");
  console.log("✅ Rhythm deployment complete & verified.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

