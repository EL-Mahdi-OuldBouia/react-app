import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { faCheck, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../../api/axios';
import validator from 'validator';
import './Register.css';
import { users } from '../../data.js';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const url = 'http://localhost:3001/api';


const Register = () => {
    const userRef = useRef(null);
    const errRef = useRef(null);
    const emailRef = useRef(null);

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [email, setEmail] = useState('');
    const [userFocus, setUserFocus] = useState(false);
    const [emailVisited, setEmailVisited] = useState(false);
    const [validEmail, setValidEmail] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [exists, setExists] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user);
        setValidName(result);
    }, [user]);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');

    }, [user, pwd, matchPwd]);

    const handleEmail = (e) => {
        setEmail(e.target.value);
        if (!validator.isEmail(email) && email) {
            setValidEmail(false);
        } else {
            setValidEmail(true);
        }
    }

    const addManyUsers = async () => {
        console.log('adding users');
        const config = {
            headers: {
                'Content-Type': 'application/json', //this should be application/json
            },
        };
        const res = await axios.post('http://localhost:8000/api/users/register-many', JSON.stringify({
            users: users
        }), config);
        console.log('successfully added the users: ', res.data);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if button was enabled by JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg('Invalid Entry');
            return;
        }
        try {
            const data = {
                username: user,
                password: pwd,
                email: email
            }
            const config = {
                headers: {
                    'Content-Type': 'application/json', //this should be application/json
                },
            };
            console.log('The data sent from client is:', data);
            const response = await axios.post('http://localhost:8000/api/users/register', JSON.stringify(data), config);
            console.log('res in register client', response.data);
            // console.log(response.accessToken);
            console.log(JSON.stringify(response.data));
            setSuccess(true);
            // clear

        } catch (error) {
            if (error.response.data.emailExists) {
                setExists(true);
            }
            console.log('the email already exists');
        }
    }


    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <Link to='/login'>Sign In</Link>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'}
                        aria-live='assertive'>{errMsg}</p>
                    <h1>Register</h1>
                    <button onClick={addManyUsers}>add</button>
                    <form onSubmit={handleSubmit}>

                        <label htmlFor="username">Email:
                            <span className={validEmail && email.length > 2 && emailVisited ? 'valid' : 'hide'}>
                                <FontAwesomeIcon icon={faCheck} id='check' />
                            </span>
                            <span className={validEmail || !email ? 'hide' : 'invalid'}>
                                <FontAwesomeIcon icon={faTimes} id='times' />
                            </span>
                        </label>
                        <input type="text"
                            id='email'
                            ref={emailRef}
                            autoComplete='off'
                            onChange={handleEmail}
                            required
                            aria-invalid={validEmail ? 'false' : 'true'}
                            aria-describedby='uidnote'
                            onBlur={() => setEmailVisited(true)}
                        />
                        <p id='uidnote'
                            className={emailVisited && email && !validEmail ? 'instructions' : 'offscreen'}
                        ><FontAwesomeIcon icon={faInfoCircle} />
                            Please write a valid email<br />
                            If you don't mind.
                        </p>

                        <label htmlFor="username">Username:
                            <span className={validName ? 'valid' : 'hide'}>
                                <FontAwesomeIcon icon={faCheck} id='check' />
                            </span>
                            <span className={validName || !user ? 'hide' : 'invalid'}>
                                <FontAwesomeIcon icon={faTimes} id='times' />
                            </span>
                        </label>
                        <input type="text"
                            id='username'
                            ref={userRef}
                            autoComplete='off'
                            onChange={e => setUser(e.target.value)}
                            required
                            aria-invalid={validName ? 'false' : 'true'}
                            aria-describedby='uidnote'
                            onBlur={() => setUserFocus(true)}

                        />
                        <p id='uidnote'
                            className={userFocus && user && !validName ? 'instructions' : 'offscreen'}
                        ><FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                        <label htmlFor="password">Password:
                            <span className={validPwd ? 'valid' : 'hide'}>
                                <FontAwesomeIcon icon={faCheck} id='check' />
                            </span>
                            <span className={validPwd || !pwd ? 'hide' : 'invalid'}>
                                <FontAwesomeIcon icon={faTimes} id='times' />
                            </span>
                        </label>
                        <input type="text"
                            id='password'
                            onChange={e => setPwd(e.target.value)}
                            required
                            autoComplete='off'
                            aria-invalid={validPwd ? 'false' : 'true'}
                            aria-describedby='pwdnote'
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id='pwdnote' className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle} id='circle' />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character<br />
                            Allowed special characters: <span aria-label='exclamation mark'>!</span>
                            <span aria-label='at symbol'>@</span>
                            <span aria-label='hashtag'>#</span><span aria-label='dollar sign'>$</span><span aria-label='percent'>%</span>
                        </p>

                        <label htmlFor="confirm_pwd">
                            confirm Password:
                            <span className={validMatch && matchPwd ? 'valid' : 'hide'}>
                                <FontAwesomeIcon icon={faCheck} id='check' />
                            </span>
                            <span className={validMatch || !matchPwd ? 'hide' : 'invalid'}>
                                <FontAwesomeIcon icon={faTimes} id='times' />

                            </span>
                        </label>
                        <input type='password'
                            id='confirm_pwd'
                            onChange={(e) => setMatchPwd(e.target.value)}
                            required
                            aria-invalid={validMatch ? 'false' : 'true'}
                            aria-describedby='confirmnote'
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id='confirmnote'
                            className={matchFocus && !validMatch ? 'instructions' : 'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle} id='circle' />
                            The passwords must match.
                        </p>
                        <button disabled={!validName || !validPwd || !validMatch ? true : false}>
                            Sign Up
                        </button>
                    </form>
                    <p className='line'>
                        {/* Put router link here */}
                        <Link to='/login'>Sign In</Link>
                    </p>
                    <p className={exists ? 'instruction' : 'hide'} >
                        The email is already taken,<br />
                        Please choose another one.
                    </p>
                </section>
            )
            }</>

    )
}

export default Register;