import ltoLogo from "./assets/lto_logo.png";
import "./landingPage.css"

function LandingPage(){
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
                    
                    <button className="query-btn">
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
