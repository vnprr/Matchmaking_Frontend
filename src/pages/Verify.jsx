import { useState } from 'react';
import axios from 'axios';

export default function Verify() {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const handleVerification = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/auth/verify?code=${code}`);
            setMessage(res.data);
        } catch (err) {
            setMessage(err.response?.data || err.message);
        }
    };

    return (
        <div>
            <h2>Weryfikacja konta</h2>
            <input type="text" placeholder="Kod weryfikacyjny z maila" value={code} onChange={e => setCode(e.target.value)} />
            <button onClick={handleVerification}>Zweryfikuj konto</button>
            <p>{message}</p>
        </div>
    );
}