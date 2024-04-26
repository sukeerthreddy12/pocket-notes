import React from 'react';
import styled from 'styled-components';
import DesktopView from './desktopview';
import MobileView from './mobileview';

const DesktopContainer = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileContainer = styled.div`
  @media (min-width: 769px) {
    display: none;
  }
`;

function App() {
  return (
    <div>
      <DesktopContainer>
        <DesktopView />
      </DesktopContainer>
      <MobileContainer>
        <MobileView />
      </MobileContainer>
    </div>
  );
}

export default App;
