import { useEffect, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

// Importando os componentes de tela
import Acceptance from './Acceptance.jsx';
import SurveyForm from './SurveyForm.jsx';
import DeclinedScreen from './DeclinedScreen.jsx';
import ConcludedScreen from './ConcludedScreen.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

// Constante para a chave do localStorage
const STORAGE_KEY = 'survey_data';

// Estado inicial para o reducer
const initialState = {
    status: null, // null | 'accepted' | 'declined' | 'concluded'
    uid: null,
    data: {shareSurvey:true,shareBrowser:true},
};

// Reducer para gerenciar todas as transições de estado
function surveyReducer(state, action) {
    switch (action.type) {
        case 'ACCEPT':
            return { ...state, status: 'accepted', uid: uuidv4() };
        case 'DECLINE':
            return { ...state, status: 'declined' };
        case 'CONCLUDE':
            return { ...state, status: 'concluded' };
        case 'CHANGE_ANSWERS':
            return { ...state, status: 'accepted' };
        case 'SET_DATA':
            return { ...state, data: action.payload };
        case 'RESET':
            return initialState;
        case 'LOAD_FROM_STORAGE':
            return { ...action.payload };
        default:
            throw new Error(`Ação desconhecida: ${action.type}`);
    }
}

export default function App() {
    const [state, dispatch] = useReducer(surveyReducer, initialState);
    const { t, i18n } = useTranslation();

    // Efeito para carregar dados do localStorage na montagem
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            dispatch({ type: 'LOAD_FROM_STORAGE', payload: JSON.parse(savedData) });
        }
    }, []);

    // Efeito para salvar dados no localStorage sempre que o estado mudar
    useEffect(() => {
        // Não salva o estado inicial (vazio) se o usuário resetar
        if (state.status !== null) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [state]);

    // Função para renderizar o conteúdo principal com base no status
    const renderContent = () => {
        switch (state.status) {
            case 'accepted':
                return (
                    <SurveyForm
                        data={state.data}
                        uid={state.uid}
                        setData={(newData) => dispatch({ type: 'SET_DATA', payload: newData })}
                        onAnswer={() => dispatch({ type: 'CONCLUDE' })}
                        onReset={() => dispatch({ type: 'RESET' })}
                    />
                );
            case 'declined':
                return <DeclinedScreen onReset={() => dispatch({ type: 'RESET' })} />;
            case 'concluded':
                return (
                    <ConcludedScreen
                        uid={state.uid}
                        onChangeAnswers={() => dispatch({ type: 'CHANGE_ANSWERS' })}
                        onReset={() => dispatch({ type: 'RESET' })}
                    />
                );
            default: // status === null
                return (
                    <Acceptance
                        onAccept={() => dispatch({ type: 'ACCEPT' })}
                        onDecline={() => dispatch({ type: 'DECLINE' })}
                    />
                );
        }
    };

    const languageSwitcherStyle = {
        position: 'fixed', // Fixa o elemento na tela
        top: '24px',       // 24px de distância do topo
        left: '24px',      // 24px de distância da esquerda
        zIndex: 10,        // Garante que fique acima de outros elementos
    };

    const mainContainerStyle = {
        padding: '24px',
        paddingTop: '80px', // ALTERADO: Adiciona espaço no topo para não ficar atrás do switcher
        maxWidth: 800,
        margin: 'auto',
    };

    return (
        // Usa o novo estilo para o container principal
        <div style={mainContainerStyle}>
            <div style={languageSwitcherStyle}>
                <LanguageSwitcher
                    i18n={i18n}
                    data={state.data}
                    setData={(newData) => dispatch({ type: 'SET_DATA', payload: newData })}
                />
            </div>

            {/* O conteúdo do formulário é renderizado aqui, já com o espaçamento correto */}
            {renderContent()}
        </div>
    );
}