
import { Outlet, useLocation } from "react-router-dom";

import NavBar from "../pages/Shared/Navbar";



const Main = () => {
    const location = useLocation()

    // if it is in login or signup page it will not show navbar and footer
    const noHeaderFooter = location.pathname.includes('/login') || location.pathname.includes('/signup')

    return (
        <div>
             {noHeaderFooter || <NavBar></NavBar>} 

            <div className="min-h-screen">
                <Outlet></Outlet>
            </div>

            
        </div>
    );
};

export default Main;