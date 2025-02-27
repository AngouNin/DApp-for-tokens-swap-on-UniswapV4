import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ArrowDownUp, RefreshCw, AlertCircle } from 'lucide-react';
import { getTokenList, TokenInfo } from '../utils/tokens';
import { getSwapQuote, executeSwap } from '../utils/swap';

const SwapInterface = () => {
  const { address } = useAccount();
  const [tokenList, setTokenList] = useState<TokenInfo[]>([]);
  const [fromToken, setFromToken] = useState<string>('');
  const [toToken, setToToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [expectedOutput, setExpectedOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const tokens = await getTokenList();
        setTokenList(tokens);
        // Set default tokens if available
        if (tokens.length >= 2) {
          setFromToken(tokens[0].address);
          setToToken(tokens[1].address);
        }
      } catch (error) {
        console.error('Failed to load token list:', error);
        setError('Failed to load token list. Please try again later.');
      }
    };

    loadTokens();
  }, []);

  useEffect(() => {
    const getQuote = async () => {
      if (!fromToken || !toToken || !amount || parseFloat(amount) <= 0) {
        setExpectedOutput('');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const quote = await getSwapQuote(fromToken, toToken, amount);
        setExpectedOutput(quote);
      } catch (error) {
        console.error('Failed to get swap quote:', error);
        setError('Failed to get swap quote. Please check token addresses and try again.');
        setExpectedOutput('');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      getQuote();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [fromToken, toToken, amount]);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount('');
    setExpectedOutput('');
  };

  const handleSwap = async () => {
    if (!address || !fromToken || !toToken || !amount || parseFloat(amount) <= 0) {
      return;
    }

    setIsSwapping(true);
    setError(null);
    setTxHash(null);

    try {
      const hash = await executeSwap(fromToken, toToken, amount, address);
      setTxHash(hash);
    } catch (error) {
      console.error('Swap failed:', error);
      setError('Swap failed. Please check your wallet and try again.');
    } finally {
      setIsSwapping(false);
    }
  };

  const getTokenByAddress = (address: string) => {
    return tokenList.find(token => token.address.toLowerCase() === address.toLowerCase());
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      {/* From Token */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">From</label>
        <div className="flex gap-2">
          <select
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
            className="bg-gray-800 text-white rounded-lg p-2 flex-grow"
            disabled={isSwapping}
          >
            <option value="">Select token</option>
            {tokenList.map((token) => (
              <option key={`from-${token.address}`} value={token.address}>
                {token.symbol} - {token.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="bg-gray-800 text-white rounded-lg p-2 w-1/3"
            disabled={isSwapping}
          />
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center my-2">
        <button
          onClick={handleSwapTokens}
          className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full"
          disabled={isSwapping}
        >
          <ArrowDownUp className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* To Token */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
        <div className="flex gap-2">
          <select
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            className="bg-gray-800 text-white rounded-lg p-2 flex-grow"
            disabled={isSwapping}
          >
            <option value="">Select token</option>
            {tokenList.map((token) => (
              <option key={`to-${token.address}`} value={token.address}>
                {token.symbol} - {token.name}
              </option>
            ))}
          </select>
          <div className="bg-gray-800 text-white rounded-lg p-2 w-1/3 flex items-center justify-center">
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
            ) : (
              expectedOutput || '0.0'
            )}
          </div>
        </div>
      </div>

      {/* Custom Token Input */}
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Or enter custom token addresses</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
            placeholder="From token address (0x...)"
            className="bg-gray-700 text-white rounded-lg p-2 w-full"
            disabled={isSwapping}
          />
          <input
            type="text"
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            placeholder="To token address (0x...)"
            className="bg-gray-700 text-white rounded-lg p-2 w-full"
            disabled={isSwapping}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Transaction Hash */}
      {txHash && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg">
          <p className="text-sm text-green-400 mb-1">Transaction submitted!</p>
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:underline break-all"
          >
            {txHash}
          </a>
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={!fromToken || !toToken || !amount || parseFloat(amount) <= 0 || isLoading || isSwapping}
        className={`w-full py-3 px-4 rounded-lg font-medium ${
          !fromToken || !toToken || !amount || parseFloat(amount) <= 0 || isLoading || isSwapping
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } transition-colors flex items-center justify-center gap-2`}
      >
        {isSwapping ? (
          <>
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Swapping...</span>
          </>
        ) : (
          <span>Swap</span>
        )}
      </button>
    </div>
  );
};

export default SwapInterface;