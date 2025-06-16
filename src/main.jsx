import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import 'antd/dist/reset.css';
import App from './App.jsx'
import SurveyForm from "./SurveyForm.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SurveyForm />
  </StrictMode>,
)
