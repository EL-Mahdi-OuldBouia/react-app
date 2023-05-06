import React from 'react';
import './Footer.css';
import { FaGithubSquare, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';


const Footer = () => {
  return (

    <footer>
      <div className="social-media-links">
        <div className="email so-link">
          <SiGmail />
          <span className='contact-email'>ouldbouia.elmahdi@gmail.com</span>
        </div>

        <div className="github so-link">
          <FaGithubSquare />
          <span className="githyb-id">@Ould-Bouia-El-Mahdi</span>
        </div>

        <div className="twitter so-link">
          <FaTwitter />
          <span className="twitter-id">@Ouldbouia-el-Mahdi</span>
        </div>
        <div className="linkedin so-link">
          <FaLinkedin />
          <span className="linkedin-id">@Ouldbouia-EL-Mahdi</span>
        </div>
      </div>
      <div className="copyright">Copyright 2023</div>
      <img src="./assets/pic-5.png" alt="" />
    </footer>

  )
}

export default Footer