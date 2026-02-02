import { useEffect, useRef } from "react";

export default function UsePageTimer({ data, setData }) {
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    const accumulatedRef = useRef(0);

    useEffect(() => {
        // ao montar, pegar o tempo já salvo (em segundos) e converter para ms
        accumulatedRef.current = (data?.time || 0);

        function startTimer() {
            if (timerRef.current) return;
            startTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
                if(data.status === 'concluded'||data.status === 'declined') return;
                const elapsed =
                    accumulatedRef.current + (Date.now() - startTimeRef.current);

                // converte pra segundos antes de gravar
                const seconds = elapsed;
                setData({ ...data, time: seconds });
            }, 1000);
        }

        function stopTimer() {
            if (!timerRef.current) return;
            clearInterval(timerRef.current);
            timerRef.current = null;
            accumulatedRef.current += Date.now() - startTimeRef.current;
        }

        const onFocus = () => startTimer();
        const onBlur = () => stopTimer();

        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);

        startTimer();

        return () => {
            stopTimer();
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("blur", onBlur);
        };
    }, [data]);

    return null;
}
