import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState } from 'react'
import './App.css'
import LandingPage from './landingPage.tsx';
import InsertPage from './insert/insertPage.tsx';
import NavBar from "./navbar/navbar.tsx";
import UpdatePage from "./update/updatePage.tsx";
import SelectPage from "./select/selectPage.tsx";
import ReportsPage from "./reports/reportsPage.tsx";

function App() {
  return(
    <Router>
      <NavBar/>
      <div className="content">
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/select" element={<SelectPage/>}/>
          <Route path="/insert" element={<InsertPage/>}/>
          <Route path="/update" element={<UpdatePage/>}/>
          <Route path="/reports" element={<ReportsPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App
