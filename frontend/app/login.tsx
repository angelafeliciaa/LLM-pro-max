import React from 'react';
import Link from 'next/link';

const Login: React.FC = () => {
  return (
    <Link href="/api/auth/login" passHref>
      <a className="login-link">Login</a>
    </Link>
  );
};

export default Login;