import React, { createContext, useState } from 'react';
import './App.css';
import Chat from './components/chat/Chat.jsx';
import Register from './components/register/Register.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/logIn/Login.jsx';
import Home from './pages/home/Home.jsx';
import Profile from './pages/profile/Profile.jsx';
import Feed from './pages/feed/Feed.jsx';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import FeedNavbar from './components/feedNavbar/FeedNavbar';
import GroupChat from './pages/groupChat/GroupChat';

export const UserContext = createContext(null);
const App = () => {
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  return (
    <UserContext.Provider value={[user, setUser, loggedIn, setLoggedIn, notifications, setNotifications]}>
      <BrowserRouter>

        <Routes>

          <Route path='/' element={<><Navbar /><Home /> </>} />
          <Route path='/profile' element={<><Navbar /><Profile /> <Footer /></>} />
          <Route path='/feed' element={<><FeedNavbar /><Feed /></>} />
          <Route path="/chat" element={<><Navbar /><Chat /> <Footer /></>} />
          <Route path='/register' element={<><Navbar /><Register /> <Footer /></>} />
          <Route path='/login' element={<><Navbar /><Login /> <Footer /></>} />
          <Route path='/group-chat' element={<><FeedNavbar/><GroupChat /></>} />


        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App;