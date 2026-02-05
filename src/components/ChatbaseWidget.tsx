'use client';

import { useEffect } from 'react';

interface ChatbaseWidgetProps {
    botId: string;
}

export default function ChatbaseWidget({ botId }: ChatbaseWidgetProps) {
    useEffect(() => {
        if (!botId) return;

        // Standard Chatbase embed script injection
        const script = document.createElement('script');
        script.src = 'https://www.chatbase.co/embed.min.js';
        script.setAttribute('chatbotId', botId);
        script.setAttribute('domain', 'www.chatbase.co');
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            const existingScript = document.querySelector(`script[chatbotId="${botId}"]`);
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, [botId]);

    return null; // The script handles the floating widget
}
