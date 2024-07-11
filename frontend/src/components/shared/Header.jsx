import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container"></div>
      <ConnectButton />
    </nav>
  );
};

export default Header;
