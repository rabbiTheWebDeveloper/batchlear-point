import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white p-4 text-center">
        <p>© {new Date().getFullYear()} My App. All Rights Reserved.</p>
      </footer>
  );
};

export default Footer;