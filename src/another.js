const [message, setMessage] = useState("")
const [messages, setMessages] = useState([])

useEffect(() => {
    socket.on('error', (error) => {
        console.error('Error general en el cliente:', error);
    });

    socket.on('loadMessages', (loadedMessages) => {
        setMessages(loadedMessages);
    });

    socket.on('message', receiveMessage);

    return () => {
        socket.off('message', receiveMessage);
        socket.off('loadMessages');
    };
}, [socket]);

const receiveMessage = (message) =>
    setMessages((prevMessages) => [...prevMessages, message]);

const handleSubmit = (e) => {
    e.preventDefault()
    setMessages((prevMessages) => [...prevMessages, message])
    socket.emit("message", message)
}