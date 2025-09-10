import React from 'react';
import { useTranslation } from 'react-i18next';

const SkipToContent: React.FC = () => {
  const { t } = useTranslation();

  const handleSkip = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleSkip}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      {t('a11y.skipToContent')}
    </button>
  );
};

export default SkipToContent;