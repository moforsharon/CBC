// src/components/DeviceDetection.js

import React from 'react';
import { isMobile } from 'react-device-detect';

const DeviceDetection = ({ children }) => {
  if (!isMobile) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Mobile Only</h1>
        <p>Please reopen the link on a phone browser.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default DeviceDetection;
