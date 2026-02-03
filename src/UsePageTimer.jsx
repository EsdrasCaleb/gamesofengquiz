import { useEffect, useRef } from "react";

export default function UsePageTimer({ data, setData, status }) {
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    const accumulatedRef = useRef(0);

    // Refs para manter acesso aos dados mais recentes sem reiniciar o useEffect
    const dataRef = useRef(data);
    const statusRef = useRef(status);

    // Mantém as refs sempre sincronizadas com o estado do App
    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    useEffect(() => {
        // Inicializa o acumulador com o valor que veio do banco/storage (apenas na montagem)
        // Assume que o valor salvo já está em milissegundos (conforme seu último código)
        accumulatedRef.current = dataRef.current?.time || 0;

        function startTimer() {
            if (timerRef.current) return;

            startTimeRef.current = Date.now();

            timerRef.current = setInterval(() => {
                // Checa o status atual através da Ref
                const currentStatus = statusRef.current;

                // Se o formulário já acabou, para de atualizar
                if (currentStatus === 'concluded' || currentStatus === 'declined') {
                    // Opcional: chamar stopTimer() aqui se quiser parar o intervalo
                    return;
                }

                const now = Date.now();
                const elapsed = accumulatedRef.current + (now - startTimeRef.current);

                // AQUI ESTÁ A CORREÇÃO PRINCIPAL:
                // Criamos o objeto completo usando o valor atual da Ref + o novo tempo
                const newData = { ...dataRef.current, time: elapsed };

                // Passamos o OBJETO direto, pois seu reducer não aceita função (prev => ...)
                setData(newData);
            }, 1000);
        }

        function stopTimer() {
            if (!timerRef.current) return;
            clearInterval(timerRef.current);
            timerRef.current = null;

            // Salva o progresso final na ref de acumulado para não perder precisão ao pausar
            if (startTimeRef.current) {
                accumulatedRef.current += (Date.now() - startTimeRef.current);
            }
        }

        const onFocus = () => startTimer();
        const onBlur = () => stopTimer();

        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);

        // Inicia o timer
        startTimer();

        return () => {
            stopTimer();
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("blur", onBlur);
        };
    }, []); // Array vazio: O timer NUNCA reinicia, ele roda direto.

    return null;
}