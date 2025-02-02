export enum ItemError {
  ALREADY_EXISTS = "Already exists",
  INVALID_NAME = "Invalid name",
}

interface ConvertedError {
  [key: string]: string;
}

export const PROGRAM_ERROR: ConvertedError = {
  "0": "Either an account has already been initialized or an account balance is below rent-exempt threshold.",
  "1": "Insufficient funds.",
  "2": "Invalid Mint(token address).",
  "3": "Account not associated with this Mint(token address).",
  "4": "Owner does not match.",
  "5": "This token's supply is fixed and new tokens cannot be minted.",
  "6": "The account cannot be initialized because it is already being used.",
  "7": "Invalid number of provided signers.",
  "8": "Invalid number of required signers.",
  "9": "State is unititialized.",
  a: "Instruction does not support native tokens.",
  b: "Non-native account can only be closed if its balance is zero.",
  c: "Invalid instruction.",
  d: "State is invalid for requested operation.",
  e: "Operation overflowed.",
  f: "Account does not support specified authority type.",
  "10": "This token mint cannot freeze accounts.",
  "11": "Account is frozen, all account operations will fail.",
  "12": "The provided decimals value different from the Mint decimals.",
  "13": "Instruction does not support non-native tokens.",
};

export const RPC_ERROR: ConvertedError = {
  "503 Service Unavailable":
    "RPC unavailable. Please try a different endpoint from the settings or try again.",
  "429 Too Many Requests":
    "Too many requests for this endpoint. You can change the endpoint from the settings.",
  "Network request failed":
    "RPC endpoint is not responsive. Please change the endpoint from the settings.",
};
