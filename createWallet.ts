import { networks, payments } from "belcoinjs-lib";
import * as ecc from "bells-secp256k1";
import ECPairFactory, { ECPairInterface } from "belpair";
import * as fs from "fs";

const ECPair = ECPairFactory(ecc);

const network = networks.bellcoin;
let addressType = "p2wpkh";
let grindingEnabled = false;
let grindCount = 1;
let startsWith = "";
let endsWith = "";

const args = process.argv.slice(2);
for (const arg of args) {
  const [key, value] = arg.split("=");
  switch (key) {
    case "--type":
      addressType = value;
      break;
    case "--grind":
      grindingEnabled = true;
      grindCount = parseInt(value, 10);
      if (isNaN(grindCount) || grindCount < 1) {
        console.error("Invalid grind count specified. It should be a positive integer.");
        process.exit(1);
      }
      break;
    case "--starts-with":
      startsWith = value;
      break;
    case "--ends-with":
      endsWith = value;
      break;
    default:
      console.log(`Unknown parameter: ${key}`);
      process.exit(1);
  }
}

function createWallet(type: string) {
  const keypair = ECPair.makeRandom({ network });
  const privateKey = keypair.privateKey?.toString("hex");
  const publicKey = keypair.publicKey.toString("hex");

  if (!privateKey) {
    throw new Error("Private key not generated");
  }

  let address;
  switch (type) {
    case "p2pkh":
      address = payments.p2pkh({ pubkey: keypair.publicKey, network }).address;
      break;
    case "p2wpkh":
      address = payments.p2wpkh({ pubkey: keypair.publicKey, network }).address;
      break;
    case "p2tr":
      address = payments.p2tr({ internalPubkey: keypair.publicKey.slice(1, 33), network }).address;
      break;
    default:
      throw new Error("Unsupported address type");
  }

  if (!address) {
    throw new Error("Address not generated");
  }

  return { privateKey, address };
}

function matchesPattern(address: string): boolean {
  const prefix = addressType === "p2pkh" ? "B" : addressType === "p2wpkh" ? "bel1q" : "bel1p";
  const addressAfterPrefix = address.slice(prefix.length);

  // Check if address matches both starts-with and ends-with conditions
  if (startsWith && !addressAfterPrefix.startsWith(startsWith)) {
    return false;
  }

  if (endsWith && !addressAfterPrefix.endsWith(endsWith)) {
    return false;
  }

  return true;
}

function saveWalletToFile(wallet: { privateKey: string; address: string }) {
  const fileName = `${wallet.address}.json`;
  const result = {
    privateKey: wallet.privateKey,
    address: wallet.address,
  };

  fs.writeFileSync(fileName, JSON.stringify(result, null, 2));

  console.log(`Private Key: ${wallet.privateKey}`);
  console.log(`Address: ${wallet.address}`);
  console.log(`Saved to file: ${fileName}`);
}

if (grindingEnabled) {
  let walletCount = 0;
  let matchesFound = 0;
  const startTime = Date.now(); // Startzeit speichern

  console.log(`Start grinding for ${grindCount} wallets...`);
  
  while (grindCount > 0) {
    const wallet = createWallet(addressType);
    walletCount++;

    if (matchesPattern(wallet.address)) {
      saveWalletToFile(wallet);
      grindCount--;
      matchesFound++; // Anzahl der gefundenen Übereinstimmungen erhöhen
    }

    // Ausgabe der Statistik nach jedem 1000. Wallet
    if (walletCount % 10000 === 0) {
      const elapsedTime = (Date.now() - startTime) / 1000; // Zeit in Sekunden
      console.log(`Searched ${walletCount} keypairs in ${elapsedTime.toFixed(0)}s. ${matchesFound} matches found.`);
    }
  }

  const totalTime = (Date.now() - startTime) / 1000; // Gesamtzeit in Sekunden
  console.log(`Total wallets generated: ${walletCount}`);
  console.log(`Searched ${walletCount} keypairs in ${totalTime.toFixed(0)}s. ${matchesFound} matches found.`);
} else {
  const wallet = createWallet(addressType);
  saveWalletToFile(wallet);
}
