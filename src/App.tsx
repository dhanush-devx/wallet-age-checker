import React, { useState } from 'react';
import MetaMaskConnectButton from './components/MetaMaskConnectButton';
import SocialLogin from './components/SocialLogin';
import { getFirstTransaction } from './utils/getFirstTransaction';

const ETHERSCAN_API_KEY = 'UZHTPZ6HB2VN7APKHX97UKMDGCFUJNRE2X';

const App: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletAge, setWalletAge] = useState<Date | null>(null);
  const [username, setUsername] = useState<string>('');
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [loadingAge, setLoadingAge] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWalletConnect = async (address: string) => {
    setWalletAddress(address);
    setError(null);
    setLoadingAge(true);
    try {
      console.log('Fetching first transaction for address:', address);
      const age = await getFirstTransaction(address, ETHERSCAN_API_KEY);
      if (age) {
        setWalletAge(age);
        console.log('Wallet age fetched:', age.toDateString());
      } else {
        setError('No transactions found for this wallet.');
        setWalletAge(null);
      }
    } catch (err) {
      console.error('Error fetching wallet age:', err);
      setError('Failed to fetch wallet age.');
      setWalletAge(null);
    } finally {
      setLoadingAge(false);
    }
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() !== '') {
      setUsernameSubmitted(true);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checking Wallet Age</h1>
      {!walletAddress ? (
        <MetaMaskConnectButton onConnect={handleWalletConnect} />
      ) : !usernameSubmitted ? (
        <form onSubmit={handleUsernameSubmit} className="mb-4">
          <label htmlFor="username" className="block mb-2 font-semibold">
            Enter your username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-full max-w-xs"
            required
          />
          <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
            Submit
          </button>
        </form>
      ) : (
        <>
          <SocialLogin />
          {loadingAge && <p>Loading wallet age...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {walletAge && (
            <div className="mt-4">
              <strong>Wallet Age:</strong> {walletAge.toDateString()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
