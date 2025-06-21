import { useState, useEffect } from 'react';
import Acceptance from './Acceptance.jsx';
import SurveyForm from './SurveyForm.jsx';
import { Typography } from 'antd';
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
    }
  }, []);

  useEffect(() => {
    if (uid) {
      const toSave = {
        uid,
        data,
      };
      localStorage.setItem("survey_data", JSON.stringify(toSave));
    }
  }, [uid, data]);

  if(!uid){
    if (status === null) {
      return <Acceptance onAccept={() => {setStatus('accepted');setUid(uuidv4())}} onDecline={() => setStatus('declined')} />;
    }

    if (status === 'declined') {
      return (
        <div style={{ padding: 24 }}>
          <Title>{t('thankyou.title')}</Title>
          <Paragraph>{t('thankyou.text')}</Paragraph>
        </div>
      );
    }
  }
  if (status === 'accepted') {
    return <SurveyForm onFinish={()=>setStatus('concluded')}/>;
  }
}
