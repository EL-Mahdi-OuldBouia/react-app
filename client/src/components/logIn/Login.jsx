import React, { useState, useRef, useEffect, useContext } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import validator from 'validator';
import axios from 'axios';
import { UserContext } from '../../App';

const LogIn = () => {
    const [, setUser, , setLoggedIn, , setNotifications] = useContext(UserContext);
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [emailVisited, setEmailVisited] = useState(false);
    const [message, setMessage] = useState('');
    const [clicked, setClicked] = useState(false);
    const [acc, setAcc] = useState(true);
    const navigate = useNavigate();
    const emailRef = useRef();

    const config = {
        headers: {
            'Content-Type': 'application/json', //this should be application/json
        },
    };

    const checkEmail = (e) => {
        setEmail(e.target.value);
        console.log(e.target.value);
        if (!validator.isEmail(email) && email) {
            setValidEmail(false);
        } else {
            setValidEmail(true);
        }

    }

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validator.isEmail(email) && password) {
            await axios.post('http://localhost:8000/api/users/login', JSON.stringify({
                email,
                password
            }), config)
                .then((response) => {
                    console.log('Response:', response.data._doc);
                    // Do something with the response data

                    if (response.data) {
                        setUser({ ...response.data._doc })
                        setLoggedIn(true);
                        setMessage('You are Logged in');
                        setAcc(false);
                        if (response.data._doc.friendshipRequests) {
                            axios.post('http://localhost:8000/api/users/get-certain-users',
                                JSON.stringify({
                                    users: response.data._doc.friendshipRequests
                                }), config).then((res) => {
                                    setNotifications([...res.data.users]);
                                }).catch((error) => {
                                    console.log('An Error has occurred', error);
                                })
                        }

                        return navigate('/');

                    } else {
                        setMessage('You are not authorized');
                        setAcc(false);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    // Do something with the error
                    setMessage('You are not authorized');
                    setAcc(false);
                });
            setClicked(true);
        }





    }

    const loginKey = async (e) => {

        if (e.key === 'Enter') {
            if (validator.isEmail(email) && password) {
                await axios.post('http://localhost:8000/api/users/login', JSON.stringify({
                    email,
                    password
                }), config)
                    .then((response) => {
                        console.log('Response:', response.data);
                        // Do something with the response data
                        return navigate('/');

                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        // Do something with the error
                    });
            }
        }
    }

    return (
        <div className='login'>
            <h1 className='h1-login'>Login</h1>
            <form action="submit" onSubmit={handleSubmit} method="post">
                <div className="email">
                    <label htmlFor="email" >
                        Email:
                    </label>
                    <input type="text" name='email' onChange={checkEmail}
                        ref={emailRef} id='email' placeholder='yours@gmail.com'
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailVisited(true)}
                    />
                    {(!validEmail && email !== '' && emailVisited) && <p>Please write a valid email to log into your account.</p>}
                </div>
                <div className="password">
                    <label htmlFor="password">
                        Password:
                    </label>
                    <span>
                        <input type={visible ? "text" : "password"}
                            onChange={e => setPassword(e.target.value)}
                            name='password' id='password'
                            onKeyDown={loginKey} />
                        {visible ? <AiFillEye className='visible'
                            onClick={() => setVisible(!visible)} /> :
                            <AiFillEyeInvisible className='visible' onClick={() => setVisible(!visible)} />}
                    </span>

                </div>
                <p className={acc ? (clicked ? 'logged-out' : 'hide') : (clicked ? 'logged-in' : 'hide')}>{message}</p>
                <button>Log In</button>
            </form>
        </div>
    )
}

export default LogIn;