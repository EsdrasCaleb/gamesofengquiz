import { Typography, Tooltip, Button } from 'antd';
import { QuestionCircleOutlined } from "@ant-design/icons";

import { useTranslation } from 'react-i18next';

export default function Acceptance({ onAccept, onDecline }) {
  const { t } = useTranslation();
  
  const paragraphs = t('consent.paragraphs', { returnObjects: true });

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Typography.Title>
          {t('consent.title')}
          <Tooltip title={t('consent.helper')}>
              <QuestionCircleOutlined
                  style={{
                      color: 'red',
                      fontSize: '24px',
                      verticalAlign: 'text-top',
                      marginLeft: 8
                  }}
              />
          </Tooltip>
      </Typography.Title>
      {paragraphs.map((p, idx) => (
        <Typography.Paragraph key={idx} style={{ marginBottom: 16 }} >
            <span dangerouslySetInnerHTML={{ __html: p }} />
        </Typography.Paragraph>
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
