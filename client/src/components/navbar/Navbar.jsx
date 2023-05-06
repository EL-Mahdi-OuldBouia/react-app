import React, { useContext, useEffect } from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle, IoMdNotifications } from "react-icons/io";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../App';
import axios from 'axios';
import Notifications from '../notfications/Notifications';


const Navbar = () => {
    const [user, setUser, loggedIn, setLoggedIn, notifications, setNotifications] = useContext(UserContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [signedin, setSignedin] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [toggleNots, setToggleNots] = useState(false);
    const [nots, setNots] = useState(0);
    const location = useLocation();



    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        // TODO: Add search functionality here using searchQuery state
    }
    const logOut = () => {
        setUser({});
        setLoggedIn(false);
        setNots(0);
        setNotifications({});
    }

    useEffect(() => {
        setNots(notifications.length);
        return (setNots(0));
    }, [])

    return (
        <nav>
            <div className="logo">
                <img src="./assets/pic-1.png" alt="" />
                <div className="username">{user?.username}</div>
            </div>
            <div className='chat'><Link to='/chat'>chat</Link>
                {toggle ? <IoIosArrowDropupCircle id='drop-icon' onClick={() => setToggle(!toggle)} /> :
                    <IoIosArrowDropdownCircle id='drop-icon' onClick={() => setToggle(!toggle)} />}
            </div>
            <ul className={toggle ? "drop-menu" : "drop-menu drop-menu-hide"}>
                <li>user 1</li>
                <li>user 2</li>
                <li>user 3</li>
                <li>user 3</li>
                <li>user 4</li>
            </ul>
            <div id='not-container'>
                <span>{nots}</span>
                <IoMdNotifications onClick={() => setToggleNots(!toggleNots)} id='notification' className='icon' />
                {toggleNots && <div className="notification-div">
                    <h1 className='not-h1'>Notifications</h1>
                    {notifications?.length > 0 &&
                        notifications.map((notification, index) =>
                            <Notifications key={index}
                                notification={notification} user={user}
                                setNotifications={setNotifications}
                                notifications={notifications} />
                        )
                    }
                </div>}
            </div>
            <button className='group-chat'>Group Chats</button>
            <div className='search'>
                <input type="text" value={searchQuery} onChange={handleSearchInputChange} placeholder="Search" />
                <button type="submit" onClick={handleSearchSubmit}
                    className='button--secondary'>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>
            {signedin ? (<div className="links">
                <Link to='/profile'>Profile</Link>
                <Link to='/feed' >Feed</Link>
            </div>) : (
                <div className="links">
                    {loggedIn ? <Link to='/login' onClick={logOut}>Log Out</Link> :
                        <>
                            {location.pathname !== '/register' && <Link to='/register'>Register</Link>}
                            {location.pathname !== '/login' && <Link to='/login' >Log In</Link>}
                        </>}
                </div>
            )

            }
        </nav>
    )
}



export default Navbar


