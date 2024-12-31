import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

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
            navigate('/dashboard');
        }catch (error) {
            console.error(error);
        }
        
    
    }
    return (
            <div className="" >
            <form  onSubmit={handleSubmit} className='login-form' >
                <div className="flex-container">
                    <h1>Login</h1>
                    <input type="text" className="login-input"  name="username"  value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)} required/>
                    <input type="password" className="login-input" name="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                    <button type="submit" >Login</button>
                </div>
            </form>
            </div>

    )
}

export default LoginForm;