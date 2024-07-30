import React, { useState } from 'react';
import './Auth.css'; 
import { Link, useNavigate } from 'react-router-dom';
import users from './Users';  

const Login =  ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
         
        const user = users.find(user => user.login === email && user.password === password);
        
        if (!user) {
            setError('wrong login or password');
            return;
        }

        console.log('Login:', { email, password });
        onLogin(email); 
        navigate('/home'); 
    };

    return (
        <div style={{paddingTop: 100, paddingBottom: 100}} className="auth-container">
            <h2>LOGIN</h2>
            <h5 style={{height:"auto", backgroundColor: "rgba(255, 0, 0, 0.1)"}}>{error}</h5>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email / Username</label>
                    <input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="center" type="submit" style={{borderColor:'black',borderRadius:10,backgroundColor: 'lightblue'}} >Log in</button>
                <p className="center" style={{width: "100%"}}>
                    ur first time? just {"->"}  <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
