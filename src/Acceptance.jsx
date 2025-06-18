import { Typography, Button } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export default function Acceptance({ onAccept, onDecline }) {
  const { t } = useTranslation();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Title>{t('consent.title')}</Title>
      {paragraphs.map((p, idx) => (
        <Paragraph key={idx} dangerouslySetInnerHTML={{ __html: p }} />
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        <Button type="primary" onClick={onAccept}>
          {t('consent.agree')}
        </Button>
        <Button danger onClick={onDecline}>
          {t('consent.decline')}
        </Button>
      </div>
    </div>
  );
}
