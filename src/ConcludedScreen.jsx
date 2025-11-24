import { Typography, Button, Popconfirm, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export default function ConcludedScreen({ uid, onChangeAnswers, onReset }) {
const { t } = useTranslation();

return (
<>
<Title>{t('thankyou.title')}</Title>
<Paragraph>{t('thankyou.text')}</Paragraph>
<Paragraph>{t('thankyou.removal', { uid })}</Paragraph>
<Space direction="vertical" style={{ width: '100%' }}>
<Button block onClick={onChangeAnswers}>
    {t('thankyou.change')}
</Button>
<Popconfirm
    title={t('thankyou.confirmReset', { uid })}
    onConfirm={onReset}
    okText={t('survey.common.sim')}
    cancelText={t('survey.common.nao')}
>
    <Button block danger>
        {t('thankyou.newSurvey')}
    </Button>
</Popconfirm>
</Space>
</>
);
}