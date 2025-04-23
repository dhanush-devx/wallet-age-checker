import React, { useState, useEffect } from 'react';
import MetaMaskConnectButton from './components/MetaMaskConnectButton';
import SocialLogin from './components/SocialLogin';
import { getFirstTransaction } from './utils/getFirstTransaction';
import { ETHERSCAN_API_KEY } from './config';
import { useUser } from '@clerk/clerk-react';

const App: React.FC = () => {
  const { user: clerkUser, isSignedIn } = useUser();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletAge, setWalletAge] = useState<Date | null>(null);
  const [username, setUsername] = useState<string>('');
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [loadingAge, setLoadingAge] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'connect' | 'username' | 'verify' | 'result'>('connect');

  const handleWalletConnect = async (address: string) => {
    setWalletAddress(address);
    setError(null);
    setStep('username');
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() !== '') {
      setUsernameSubmitted(true);
      setStep('verify');
    }
  };

  const fetchWalletAge = async () => {
    if (!walletAddress) return;
    
    setLoadingAge(true);
    try {
      console.log('Fetching first transaction for address:', walletAddress);
      const age = await getFirstTransaction(walletAddress, ETHERSCAN_API_KEY);
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

  // Monitor social verification status
  useEffect(() => {
    // When user has completed social verification, move to results and fetch wallet age
    if (isSignedIn && step === 'verify') {
      setStep('result');
      fetchWalletAge();
    }
  }, [isSignedIn, step]);

  const calculateWalletAgeInDays = (date: Date): number => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatWalletAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="page-title">Wallet Age Checker</h1>
        
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className={`step-indicator ${step === 'connect' ? 'active' : (step === 'username' || step === 'verify' || step === 'result' ? 'completed' : '')}`}>
              <div className="step-number">1</div>
              <div className="step-label">Connect Wallet</div>
            </div>
            <div className="step-line"></div>
            <div className={`step-indicator ${step === 'username' ? 'active' : (step === 'verify' || step === 'result' ? 'completed' : '')}`}>
              <div className="step-number">2</div>
              <div className="step-label">Set Username</div>
            </div>
            <div className="step-line"></div>
            <div className={`step-indicator ${step === 'verify' ? 'active' : (step === 'result' ? 'completed' : '')}`}>
              <div className="step-number">3</div>
              <div className="step-label">Verify Identity</div>
            </div>
            <div className="step-line"></div>
            <div className={`step-indicator ${step === 'result' ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Results</div>
            </div>
          </div>
        </div>
        
        {/* Step 1: Connect Wallet */}
        {step === 'connect' && (
          <MetaMaskConnectButton onConnect={handleWalletConnect} />
        )}
        
        {/* Step 2: Enter Username */}
        {step === 'username' && walletAddress && (
          <div className="wallet-card">
            <div className="mb-4 text-center">
              <div className="text-sm font-medium text-gray-500 mb-1">Connected Wallet</div>
              <div className="text-lg font-semibold">{formatWalletAddress(walletAddress)}</div>
            </div>
            
            <form onSubmit={handleUsernameSubmit} className="mt-6">
              <label htmlFor="username" className="block mb-2 font-semibold text-gray-700">
                Enter your username to continue:
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input mb-4"
                placeholder="Your username"
                required
              />
              <button type="submit" className="button w-full">
                Continue
              </button>
            </form>
          </div>
        )}
        
        {/* Step 3: Social Verification */}
        {step === 'verify' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm font-medium text-gray-500">Connected as</div>
                <div className="text-lg font-semibold">{username}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-500">Wallet</div>
                <div className="text-lg font-semibold">{formatWalletAddress(walletAddress!)}</div>
              </div>
            </div>
            
            <SocialLogin />
          </div>
        )}
        
        {/* Step 4: Results */}
        {step === 'result' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm font-medium text-gray-500">Connected as</div>
                <div className="text-lg font-semibold">{username}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-500">Wallet</div>
                <div className="text-lg font-semibold">{formatWalletAddress(walletAddress!)}</div>
              </div>
            </div>
            
            {clerkUser && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm leading-5 font-medium text-green-800">
                      Social verification successful
                    </p>
                    <div className="mt-2 text-sm text-green-700">
                      {clerkUser.primaryEmailAddress?.emailAddress && (
                        <div>Email: {clerkUser.primaryEmailAddress.emailAddress}</div>
                      )}
                      {clerkUser.externalAccounts.length > 0 && (
                        <div className="mt-1">
                          Verified accounts: {clerkUser.externalAccounts.map(acc => acc.provider.replace('oauth_', '')).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {loadingAge && (
              <div className="text-center p-6">
                <div className="inline-flex items-center">
                  <span className="loading-spinner"></span>
                  <span className="ml-2 text-gray-700">Fetching wallet age...</span>
                </div>
              </div>
            )}
            
            {error && <div className="error-message">{error}</div>}
            
            {walletAge && (
              <div className="wallet-age-result">
                <h3 className="text-lg font-bold mb-2">Wallet Age Results</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">First Transaction</div>
                    <div className="font-medium">{walletAge.toDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Age in Days</div>
                    <div className="font-medium">{calculateWalletAgeInDays(walletAge)} days</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          Wallet Age Checker • Verify Ethereum account age
        </div>
      </div>
    </div>
  );
};

export default App;
