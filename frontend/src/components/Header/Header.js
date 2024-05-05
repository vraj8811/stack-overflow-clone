import React, { useEffect, useState } from 'react'
import './Header.css';
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/Inbox';
import { Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { selectUser } from '../../features/userSlice';
import { useSelector } from 'react-redux';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Header = () => {
  const user = useSelector(selectUser);
  const navi = useNavigate();
  const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        try {
            const docSnap = await getDoc(doc(db, 'users', user.uid));
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting document: ", error);
            return error.message;
        }
    }

    fetchUserData();

  return (
    <header>
      <div className="header-container">
        <div className="header-left">
          <Link to='/' className='link'>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Stack_Overflow_logo.svg/330px-Stack_Overflow_logo.svg.png"
              alt='logo' />
          </Link>
          <h3>Products</h3>
        </div>

        <div className="header-middle">
          <div className="header-search-container">
            <SearchIcon />
            <input type='text' placeholder='Search...' />
          </div>
        </div>

        <div className="header-right">
          <div className="header-right-container">

            <Avatar src={userData?.isGoogle === true ? user?.photo : userData?.photo } style={{cursor:"pointer"}} onClick={()=>{navi("/profile")}} />

            <InboxIcon style={{fontSize:'50px'}}/>
            <svg
              aria-hidden="true"
              className="svg-icon iconStackExchange"
              width="24"
              height="24"
              viewBox="0 0 18 18"
              fill="rgba(0,0,0,0.5)"
              style={{
                cursor: "pointer",
              }}
            >
              <path d="M15 1H3a2 2 0 00-2 2v2h16V3a2 2 0 00-2-2ZM1 13c0 1.1.9 2 2 2h8v3l3-3h1a2 2 0 002-2v-2H1v2Zm16-7H1v4h16V6Z"></path>
            </svg>
            {user ? (<LogoutIcon style={{fontSize:'50px'}} onClick={() => {
              auth.signOut();
              navi("/auth");
            }} /> ) :(<></>) }
              
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;
