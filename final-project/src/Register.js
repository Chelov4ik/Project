import React, { useState } from 'react';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import users from './Users';  

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
         
        const userExists = users.some(user => user.login === email);
        
        if(password !== passwordConfirm){setError("Password mismatch");return; }


        if (userExists) {
            setError("username is being used by someone else");
            return;
        }
 
        users.push({ login: email, password });
        console.log('New User Registered:', { email, password });
        
        navigate('/login'); 
    };

    return (
        <div style={{paddingTop: 100, paddingBottom: 100}} className="auth-container">
            <h2>Register</h2>
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
                    <label htmlFor="password">Confirm Password</label>
                    <input
                        type="password"
                        id="passwordConfirm"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                    />
                </div> 
                <button  className="center" type="submit" style={{borderColor:'black',borderRadius:10,backgroundColor: 'lightblue'}}>Register</button>
                <p className="center" style={{width: "100%"}}>
                    u are our old friend? so just {"->"} <Link to="/login">Log in</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
