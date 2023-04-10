import React from 'react'
import '../components/css/icon.css' 
import Home from '../components/images/house-door.svg';
import Building from '../components/images/building.svg';
import Calendar from '../components/images/calendar3-week.svg';
import Profile from '../components/images/person-circle.svg'
import Logout from '../components/images/door-open.svg'



// Check logic if img null then use icon
// function to return image

export const datasidebar = [
    {
        title: <p className='sideBarText'>Account</p>,
        icon: <img className='iconHeader' src={Profile}></img>,
        link: "/account"
    },
    {
        title: <p className='sideBarText'>Home</p>,
        icon: <img className='icon' src={Home}></img>,
        link: "/coordinator"
    },
    {
        title: <p className='sideBarText'>Semester</p>,
        icon: <img className='icon' src={Building}></img>,
        link: "/semester"
    },
    {
        title: <p className='sideBarText'>Calendar</p>,
        icon: <img className='icon' src={Calendar}></img>,
        link: "/calendar"
    },
    {
        title: <p className='sideBarText'>Logout</p>,
        icon: <img className='icon' src={Logout}></img>,
        link: "/"
    }
]