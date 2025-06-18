import { useState } from 'react';
import Acceptance from './Acceptance.jsx';
import SurveyForm from './SurveyForm.jsx';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export default function App() {
  const { t } = useTranslation();
  const [consent, setConsent] = useState(null); // null | 'accepted' | 'declined'

  if (consent === null) {
    return <Acceptance onAccept={() => setConsent('accepted')} onDecline={() => setConsent('declined')} />;
  }

  if (consent === 'declined') {
    return (
      <div style={{ padding: 24 }}>
        <Title>{t('thankyou.title')}</Title>
        <Paragraph>{t('thankyou.text')}</Paragraph>
      </div>
    );
  }

  return <SurveyForm />;
}
