import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './redux/store';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <SnackbarProvider maxSnack={3}>
     <Provider store={store}>
      <App />
    </Provider>
     </SnackbarProvider>
 
  </React.StrictMode>
)