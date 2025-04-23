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
        setError('Connection failed!');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please install MetaMask!');
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={connectWallet} disabled={loading}>
        {loading ? 'Connecting...' : address ? `Connected: ${address}` : 'Connect MetaMask'}
      </button>
      {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
    </div>
  );
}
