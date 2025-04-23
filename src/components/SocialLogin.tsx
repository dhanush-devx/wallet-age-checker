import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export default function SocialLogin() {
  return <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />;
}
