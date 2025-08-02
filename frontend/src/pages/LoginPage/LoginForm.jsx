import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

function LoginForm(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useAuth();  
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(username, password);
        try {
            const response = await axios.post('http://localhost:8000/login', {username, password})
            const token = await response.data.access_token;
            login(token);
            localStorage.setItem('user', username);
            navigate('/dashboard');
        }catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                <div className="flex flex-col space-y-4">
                    <h1 className="text-2xl font-bold text-center">Login</h1>
                    <input 
                        type="text" 
                        className="bg-white p-2 border border-gray-300 rounded"  
                        name="username"  
                        value={username} 
                        placeholder="Username" 
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                    />
                    <input 
                        type="password" 
                        className="p-2 border border-gray-300 rounded" 
                        name="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    )
}

export default LoginForm;