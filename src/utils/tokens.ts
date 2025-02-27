export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

// Common ERC20 tokens on Ethereum mainnet
const COMMON_TOKENS: TokenInfo[] = [
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png'
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    decimals: 8,
    logoURI: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png'
  },
  {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    name: 'Uniswap',
    symbol: 'UNI',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png'
  }
];

// Function to fetch token list from Uniswap token list API
export const getTokenList = async (): Promise<TokenInfo[]> => {
  try {
    // In a real app, you would fetch from a token list API
    // const response = await fetch('https://tokens.uniswap.org');
    // const data = await response.json();
    // return data.tokens.filter(token => token.chainId === 1);
    
    // For this demo, we'll return a static list of common tokens
    return COMMON_TOKENS;
  } catch (error) {
    console.error('Failed to fetch token list:', error);
    return COMMON_TOKENS; // Fallback to common tokens
  }
};

// Function to validate if an address is a valid ERC20 token
export const isValidTokenAddress = (address: string): boolean => {
  // Basic validation - check if it's a valid Ethereum address format
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Function to get token info by address
export const getTokenInfo = async (address: string): Promise<TokenInfo | null> => {
  // First check if it's in our common tokens list
  const commonToken = COMMON_TOKENS.find(
    token => token.address.toLowerCase() === address.toLowerCase()
  );
  
  if (commonToken) {
    return commonToken;
  }
  
  // In a real app, you would fetch token info from a blockchain API or contract
  // For this demo, we'll return null for unknown tokens
  return null;
};