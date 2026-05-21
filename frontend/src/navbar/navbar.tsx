import { NavLink } from "react-router-dom";
import "./navbar.css";

const navLinks = [
    {name: "HOME", path: "/"},
    {name: "SELECT", path: "/select"},
    {name: "INSERT", path: "/insert"},
    {name: "UPDATE", path: "/update"},
    {name: "REPORTS", path: "/reports"},
];

function NavBar(){
    return(
        <nav className="lto-navbar">
            <div className="navbar-links">
                {navLinks.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }: { isActive: boolean }) => 
                        `nav-btn ${isActive ? 'active' : ''}`
                    }
                >{item.name} </NavLink>
                ))}
            </div>
        </nav>
    );
}

export default NavBar;
