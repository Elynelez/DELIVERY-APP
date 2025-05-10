import { useEffect, useRef, useState } from "react";
import { MessageOutlined } from '@ant-design/icons';
import { useTheme } from "@mui/material";
import { Modal, Button } from 'antd';
import { tokens } from "../../theme";

export default function ChatBot() {
    const [input, setInput] = useState("");
    const [visible, setVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const endRef = useRef(null);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages([...messages, userMessage]);

        // Simulación de respuesta (puedes cambiar por fetch a tu API después)
        setTimeout(() => {
            const botMessage = { role: "bot", content: `Entiendo: "${input}"` };
            setMessages((prev) => [...prev, botMessage]);
        }, 500);

        setInput("");
    };

    return (
        <div>
            <Button
                icon={<MessageOutlined />}
                type='primary'
                style={{
                    backgroundColor: colors.greenAccent[600],
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    zIndex: 1000
                }}
                onClick={showModal}
            >
                Chat
            </Button>
            <Modal
                open={visible}
                title="🤖 Chat IA"
                onCancel={handleCancel}
                footer={null}
                width={360}
                bodyStyle={{ padding: 0, backgroundColor: colors.primary[600] }}
            >
                <div className="flex flex-col h-[400px] p-3">
                    <div 
                    className="flex-1 overflow-y-auto p-2 rounded space-y-2"
                    style={{ backgroundColor: colors.primary[400] }}
                    >
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`max-w-[70%] p-2 rounded ${msg.role === "user"
                                    ? "bg-blue-600 self-end text-right"
                                    : "bg-green-600 self-start text-left"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        ))}
                        <div ref={endRef} />
                    </div>

                    <div className="flex mt-2 gap-2">
                        <input
                            className="flex-1 px-3 py-1 rounded outline-none text-sm"
                            style={{ backgroundColor: colors.primary[400] }}
                            type="text"
                            placeholder="Escribe algo..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded text-sm"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
