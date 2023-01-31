import React from 'react'
import './css/icon.css'
import Gear from '../components/images/gear.svg';
import Logout from '../components/images/door-open.svg'

export const commonbuttons = [
    {
        title: <p className='sideBarText'>Settings</p>,
        icon: <img className='icon' src={Gear}></img>,
        link: "/calendar"
    },
    {
        title: <p className='sideBarText'>Logout</p>,
        icon: <img className='icon' src={Logout}></img>,
        link: "/"
    }
]