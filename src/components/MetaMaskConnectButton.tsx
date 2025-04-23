import React, { useState } from 'react';

declare let window: any;

interface MetaMaskConnectButtonProps {
  onConnect: (address: string) => void;
}

export default function MetaMaskConnectButton({ onConnect }: MetaMaskConnectButtonProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
        onConnect(accounts[0]);
      } catch (err) {
        setError('Connection failed! Please check your MetaMask extension.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please install MetaMask browser extension!');
      setLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="wallet-card">
      <div className="flex flex-col items-center p-6">
        <img
          src="https://cdn.worldvectorlogo.com/logos/metamask.svg"
          alt="MetaMask Logo"
          className="w-16 h-16 mb-4"
        />
        <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6 text-center">
          Connect your MetaMask wallet to check how old your wallet is.
        </p>
        
        <button 
          onClick={connectWallet} 
          disabled={loading}
          className="button w-full max-w-xs"
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              <span>Connecting...</span>
            </>
          ) : address ? (
            <>Connected: {formatAddress(address)}</>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              Connect with MetaMask
            </>
          )}
        </button>
        
        {error && <div className="error-message mt-4">{error}</div>}
      </div>
    </div>
  );
}
