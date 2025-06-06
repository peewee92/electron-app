import React from 'react';
import './BrandLogo.less';
import ahoy from '@renderer/assets/images/ahoy.jpg';

const BrandLogo: React.FC = () => {
  return (
    <div className="brand-logo-container">
      <img 
        src={ahoy}
        className="brand-logo"
        alt="Brand Logo"
      />
    </div>
  );
};

export default BrandLogo;