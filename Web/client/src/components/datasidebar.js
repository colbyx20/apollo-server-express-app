import React from 'react'
import '../components/css/icon.css' 
import Home from '../components/images/house-door.svg';
import Building from '../components/images/building.svg';
import Calendar from '../components/images/calendar3-week.svg';
import Profile from '../components/images/person-circle.svg'
import {useNavigate} from 'react-router-dom';

const firstInitial = localStorage.getItem("firstname");
const lastname = localStorage.getItem("lastname");

function Formatter(string) {
    if(string === null)
        return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const datasidebar = [
    {
        title: <p className='sideBarText'>{Formatter(firstInitial).charAt(0)}. {Formatter(lastname)}</p>,
        icon: <img className='iconHeader' src={Profile}></img>,
        link: "/user"
    },
    {
        title: <p className='sideBarText'>Home</p>,
        icon: <img className='icon' src={Home}></img>,
        link: "/home"
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
]