import React from 'react';
import useAppStore from './store/useAppStore';

// Views
import LandingPage from './components/views/LandingPage';
import UploadPage from './components/views/UploadPage';
import ProcessingView from './components/views/ProcessingView';
import ResultsGallery from './components/views/ResultsGallery';
import ErrorView from './components/views/ErrorView';

// Styles
import './index.css';

function App() {
  const { appState } = useAppStore();

  switch (appState) {
    case 'LANDING':
      return <LandingPage />;
    case 'UPLOAD':
      return <UploadPage />;
    case 'PROCESSING':
      return <ProcessingView />;
    case 'RESULTS':
      return <ResultsGallery />;
    case 'ERROR':
      return <ErrorView />;
    default:
      return <LandingPage />;
  }
}

export default App;
