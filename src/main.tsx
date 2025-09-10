import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppWithRouter from './AppWithRouter.tsx';
import './i18n';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithRouter />
  </StrictMode>
);
