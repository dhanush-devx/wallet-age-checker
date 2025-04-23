import React from 'react';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';

export default function SocialLogin() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const clerk = useClerk();

  // Function to authenticate with Google
  const authenticateWithGoogle = () => {
    clerk.openSignIn({
      redirectUrl: window.location.href,
      appearance: {
        elements: {
          rootBox: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }
        }
      },
      signUpUrl: '/sign-up',
      signInUrl: '/sign-in',
      afterSignInUrl: window.location.href,
      afterSignUpUrl: window.location.href
    });
  };

  // Function to authenticate with Twitter
  const authenticateWithTwitter = () => {
    clerk.openSignIn({
      redirectUrl: window.location.href,
      appearance: {
        elements: {
          rootBox: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }
        }
      },
      signUpUrl: '/sign-up',
      signInUrl: '/sign-in',
      afterSignInUrl: window.location.href,
      afterSignUpUrl: window.location.href
    });
  };

  if (isSignedIn && user) {
    // Extract connected accounts
    const connectedAccounts = [];
    
    if (user.emailAddresses.length > 0) {
      // Check if any email is from Google
      const googleEmail = user.emailAddresses.find(email => {
        const verificationStrategy = email.verification?.strategy;
        const redirectURL = email.verification?.externalVerificationRedirectURL;
        return verificationStrategy === "oauth_google" || 
               (redirectURL && redirectURL.toString().includes('google'));
      });
      
      if (googleEmail) {
        connectedAccounts.push('Google');
      }
    }

    // Check for Twitter in OAuth accounts
    const twitterAccount = user.externalAccounts.find(account => 
      account.provider.includes('twitter')
    );
    
    if (twitterAccount) {
      connectedAccounts.push('Twitter');
    }

    return (
      <div className="social-login-container">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Verification Complete</h3>
            <p className="text-gray-600 mt-2">Your social accounts have been successfully verified!</p>
            
            <div className="mt-4 text-left">
              <h4 className="font-semibold text-gray-700 mb-2">Connected Accounts:</h4>
              <ul className="list-disc pl-5">
                {connectedAccounts.map((account, index) => (
                  <li key={index} className="text-gray-600">{account}</li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={() => signOut()} 
              className="mt-6 px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="social-login-container">
      <h2 className="text-xl font-bold mb-4 text-center">Social Account Verification</h2>
      <p className="text-gray-600 mb-6 text-center">
        Please verify your identity by connecting your social accounts. This helps us prevent fraud and ensures wallet ownership.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col space-y-4">
          <button 
            onClick={authenticateWithGoogle} 
            className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            Connect with Google
          </button>
          
          <button 
            onClick={authenticateWithTwitter} 
            className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-3 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Connect with X (Twitter)
          </button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Your information is securely handled according to our privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
