import { useEffect, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

import Acceptance from './Acceptance.jsx';
import SurveyForm from './SurveyForm.jsx';
import DeclinedScreen from './DeclinedScreen.jsx';
import ConcludedScreen from './ConcludedScreen.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

const STORAGE_KEY = 'survey_data';

const initialState = {
    status: null,
    uid: null,
    data: { shareSurvey: true, shareBrowser: true },
};

function surveyReducer(state, action) {
    switch (action.type) {
        case 'ACCEPT':
            if(!state.uid){
                state.uid = uuidv4()
            }
            return { ...state, status: 'accepted' };
        case 'DECLINE':
            return { ...state, status: 'declined' };
        case 'CONCLUDE':
            return { ...state, status: 'concluded' };
        case 'CHANGE_ANSWERS':
            return { ...state, status: 'accepted' };
        case 'SET_DATA':
            return { ...state, data: action.payload };
        case 'RESET':
            return { ...state,status:null };
        case 'LOAD_FROM_STORAGE':
            if (action.payload.status =='accepted' || action.payload.status =='declined')
                action.payload.status = null
            return { ...action.payload };
        default:
            throw new Error(`Ação desconhecida: ${action.type}`);
    }
}

export default function App() {
    const [state, dispatch] = useReducer(surveyReducer, initialState);
    const { i18n } = useTranslation();

    // Carrega uid + data do storage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            dispatch({ type: 'LOAD_FROM_STORAGE', payload: JSON.parse(saved) });
        }
    }, []);

    // Salva sempre que uid ou data mudarem
    useEffect(() => {
        // Não salva o estado inicial (vazio) se o usuário resetar
        if (state.status !== null) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
    }, [state]);

    const renderContent = () => {
        switch (state.status) {
            case 'accepted':
                return (
                    <SurveyForm
                        data={state.data}
                        uid={state.uid}
                        setData={(newData) => dispatch({ type: 'SET_DATA', payload: newData })}
                        onAnswer={() => dispatch({ type: 'CONCLUDE' })}
                    />
                );

            case 'declined':
                return <DeclinedScreen onReset={() => dispatch({ type: 'RESET' })} />;

            case 'concluded':
                return (
                    <ConcludedScreen
                        uid={state.uid}
                        onChangeAnswers={() => dispatch({ type: 'CHANGE_ANSWERS' })}
                    />
                );

            default:
                return (
                    <Acceptance
                        onAccept={() => dispatch({ type: 'ACCEPT' })}
                        onDecline={() => dispatch({ type: 'DECLINE' })}
                    />
                );
        }
    };

    const fixedTopBar = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'white',
        padding: '12px 16px',
        zIndex: 999,
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    };

    const mainContainer = {
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        padding: '24px',
        paddingTop: '80px',
        minHeight: '95vh',
    };

    return (
        <>
            <div style={fixedTopBar}>
                <LanguageSwitcher
                    i18n={i18n}
                    data={state.data}
                    setData={(newData) => dispatch({ type: 'SET_DATA', payload: newData })}
                />
            </div>

            <div style={mainContainer}>
                {renderContent()}
            </div>
        </>
    );
}
