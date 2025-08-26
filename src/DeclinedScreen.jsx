import { Typography, Button } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export default function DeclinedScreen({ onReset }) {
    const { t } = useTranslation();

    return (
        <>
            <Title>{t('thankyou.title')}</Title>
            <Paragraph>{t('thankyou.text')}</Paragraph>
            <Button danger onClick={onReset}>
                {t('thankyou.newSurvey')}
            </Button>
        </>
    );
}