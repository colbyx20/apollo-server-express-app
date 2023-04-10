import { Routes, Route } from "react-router-dom";
import { createContext, useContext, useState, useEffect } from "react";
import { ThemeContext } from './context/themeContext'
import './index.css';
import Homepage from './pages/homepage';
import Register from './pages/register';
import Login from './pages/login';
import Student from './pages/student';
import Loginpath from './pages/login';
import Professors from "./pages/professors";
import Coordinator from "./pages/coordinator"
import Calendar from "./pages/calendar";
import Calendar2 from "./pages/calendar2";
import Calendar3 from "./pages/calendar3";
import Semester from "./pages/semester";
import Account from "./pages/account";
import Forgot from "./pages/forgot";
import RegisterCoord from "./pages/registerCoord";
// update master 

function App() {
  const [theme, setTheme] = useState(window.localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    window.localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="app" data-theme={theme}>

      <ThemeContext.Provider value={{ theme, setTheme }} >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Loginpath />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerCoord" element={<RegisterCoord />} />
          <Route path="/student" element={<Student />} />
          <Route path="/professor" element={<Professors />} />
          <Route path="/calendar" element={<Calendar lightMode={theme === 'dark' ? false : true} />} />
          <Route path="/calendar2" element={<Calendar2 />} />
          <Route path="/calendar3" element={<Calendar3 />} />
          <Route path="/coordinator" element={<Coordinator />} />
          <Route path="/account" element={<Account />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/semester" element={<Semester />} />
        </Routes>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
