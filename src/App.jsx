import { useState, useEffect } from 'react';
import Acceptance from './Acceptance.jsx';
import SurveyForm from './SurveyForm.jsx';
import { Typography,Button, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

const { Title, Paragraph } = Typography;

export default function App() {
  const { t } = useTranslation();
  const [status, setStatus] = useState(null); // null | 'accepted' | 'declined'
  const [uid,setUid] = useState(null);
  const [data, setData] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("survey_data");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUid(parsed.uid);
      setData(parsed.data || {});
      setStatus(parsed.status);
    }
  }, []);

  useEffect(() => {
    if (uid) {
      const toSave = {
        uid,
        data,
        status
      };
      localStorage.setItem("survey_data", JSON.stringify(toSave));
    }
  }, [uid, data]);


    if (status === null) {
      return <Acceptance onAccept={() => {setStatus('accepted');setUid(uuidv4());}} onDecline={() => setStatus('declined')} />;
    }

    if (status === 'declined') {
      return (
        <div style={{ padding: 24 }}>
          <Title>{t('thankyou.title')}</Title>
          <Paragraph>{t('thankyou.text')}</Paragraph>
           <Button danger onClick={()=>{setData({});setUid(null);setStatus(null)}}>
              {t('thankyou.newSurvey')}
            </Button>
        </div>
      );
    }
    if (status === 'accepted') {
        return <div style={{ padding: 24 }}><SurveyForm
            onReset={()=>{setData({});setStatus(null); console.log("reset");}}
            onAnswer={()=>setStatus('concluded')}
            setData={setData} uiid={uid} data={data}/></div>;
    }
    if(status === 'concluded') {
        return (
            <div style={{padding: 24}}>
                <Title>{t('thankyou.title')}</Title>
                <Paragraph>{t('thankyou.text')}</Paragraph>
                <Paragraph>{t('thankyou.removal', {uid})}</Paragraph>
                <Button block onClick={()=>setStatus('accepted')} info>
                    {t('thankyou.change')}
                </Button>
                <Popconfirm
                    title={t('thankyou.confirmReset', {uid})}
                    onConfirm={() => {
                        setData(null);
                        setUid(null);
                        setStatus(null)
                    }}
                    okText="Sim"
                    cancelText="Cancelar"
                >
                    <Button block danger>
                        {t('thankyou.newSurvey')}
                    </Button>
                </Popconfirm>
            </div>
        )
    }
}
