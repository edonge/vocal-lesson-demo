import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { OnboardingProvider } from './context/OnboardingContext';
import { ConsultProvider } from './context/ConsultContext';
import { StudentActivityProvider } from './context/StudentActivityContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <OnboardingProvider>
        <ConsultProvider>
          <StudentActivityProvider>
            <App />
          </StudentActivityProvider>
        </ConsultProvider>
      </OnboardingProvider>
    </BrowserRouter>
  </React.StrictMode>
);
