import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PrimeReactProvider } from 'primereact/api';
import { store } from './store/store';
import 'primereact/resources/primereact.min.css';

import { ThemeProvider } from './components/providers/theme-provider';
import App from './components/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Provider store={store}>
      <PrimeReactProvider>
        <ThemeProvider defaultTheme="system" storageKey="fnr-ui-theme">
          <App />
        </ThemeProvider>
      </PrimeReactProvider>
    </Provider>
  </StrictMode>
);
