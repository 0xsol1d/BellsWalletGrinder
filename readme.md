# Wallet Address Grinder

This script generates Bellcoin wallet addresses and searches for specific patterns within them. It can generate individual wallet addresses or "grind" for wallet addresses that match certain patterns. You can specify different wallet types and search for patterns within the address using multiple filters.

## Features

- **Wallet Address Types**: Supports `p2pkh`, `p2wpkh`, and `p2tr` wallet address types.
- **Pattern Matching**: Allows searching for wallet addresses that match a specific pattern, considering prefixes and user-defined patterns.
- **Grind Mode**: Allows generating multiple wallet addresses and searching for a specific pattern within them.
- **Customizable Search**: Search for wallet addresses that start or end with a certain string.

## Installation

### Prerequisites

### Prerequisites

It is **recommended** to use **Bun** to run this script, as it has native support for TypeScript, which makes the setup and execution easier and faster. You can install Bun from [Bun's official website](https://bun.sh).

To install Bun, simply run:

```bash
curl https://bun.sh/install | bash
```

Alternatively, you can run this script with **Node.js**. However, to use TypeScript with Node, you'll need to install the necessary dependencies and configure it to handle TypeScript files.

#### Using Node.js (Requires additional setup):

1. **Install Node.js**: If you don't have Node.js installed, download it from the official website: [Node.js](https://nodejs.org).

2. **Install Dependencies**: You need to install the dependencies using `npm` or `yarn`:

```bash
npm install
```

3. **Install TypeScript and ts-node**:
   To run the TypeScript script directly with Node.js, install `typescript` and `ts-node` globally or as dev dependencies:

```bash
npm install --save-dev typescript ts-node
```

4. **Run the Script**:
   After installing TypeScript and ts-node, you can run the script like so:

```bash
npx ts-node src/createWallet.ts [your-parameters]
```

**Note**: Using **Bun** is highly recommended for better performance and native TypeScript support.

### Installing Dependencies

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies by running:

```bash
bun install
```

or, if you're using npm:

```bash
npm install
```

## Usage

### Generate Individual Wallet Address

If no `--grind` parameter is provided, the script will generate a single wallet address based on the `--type` parameter.

Example to generate a single wallet of type `p2wpkh`:

```bash
bun src/createWallet.ts --type=p2wpkh
```

This will create a wallet address with the `p2wpkh` address type and save the private key and address to a `.json` file.

### Grind for Wallets Matching a Pattern

To search for wallet addresses that match a specific pattern, use the `--grind` parameter followed by the number of wallet addresses you want to search. Additionally, you can specify the pattern filters using `--starts-with` and `--ends-with`.

Example to grind for 10 wallet addresses that **start** with `e` and **end** with `r`:

```bash
bun src/createWallet.ts --grind=10 --starts-with=e --ends-with=r
```

This will generate 10 wallets and check if their address starts with `e` and ends with `r`. Once a match is found, it will save the wallet to a `.json` file.

## Available Parameters

- `--type=<wallet_type>`: Specifies the type of wallet to create. Available types: `p2pkh`, `p2wpkh`, `p2tr`. If not provided, defaults to `p2wpkh`.
- `--grind=<number_of_wallets>`: Specifies the number of wallets to generate and search. (e.g., `--grind=10`).
- `--starts-with=<pattern>`: Filters the wallets to those whose addresses start with a given string (e.g., `--starts-with=test`).
- `--ends-with=<pattern>`: Filters the wallets to those whose addresses end with a given string (e.g., `--ends-with=end`).

## Example Commands

1. **Generate a single wallet of type `p2pkh`**:

```bash
bun src/createWallet.ts --type=p2pkh
```

2. **Grind for 10 wallets with address starting with `test` and ending with `end`**:

```bash
bun src/createWallet.ts --grind=10 --starts-with=test --ends-with=end
```

3. **Grind for 5 wallets with address starting with `bel1q` and ending with `xyz`**:

```bash
bun src/createWallet.ts --grind=5 --starts-with=bel1q --ends-with=xyz
```

## Output

For each wallet generated or found during the grind process, the private key and address are saved to a `.json` file named after the wallet address.

Example output file: `bel1q...xyz.json`

## Notes

- The `--starts-with` and `--ends-with` parameters are case-insensitive
