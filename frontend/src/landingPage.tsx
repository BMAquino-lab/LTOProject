import ltoLogo from "./assets/lto_logo.png";
import "./landingPage.css"
import { useNavigate } from 'react-router-dom';

function LandingPage(){
    const navigate = useNavigate();
    return(
        <>
        <div className="page-container">
            <main className="header-section">
                {/* left column */}
                <div className="header-content">
                    <h1 className="header-title"> 
                        LTO INFORMATION <br/>
                        MANAGEMENT <br/>
                        SYSTEM
                    </h1>
                    
                    <button className="query-btn" onClick={()=> navigate('/select')}>
                        START QUERY
                        <span className="arrow">→</span>
                    </button>
                </div>

                {/* right column */}
                <div className="header-logo">
                    <img src={ltoLogo} className="header-logo-img"/>
                </div>
            </main>
        </div>
        </>
    )
}


export default LandingPage
