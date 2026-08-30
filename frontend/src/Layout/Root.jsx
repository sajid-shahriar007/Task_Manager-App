import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../pages/Shared/NavBar"; // fixed casing: file is NavBar.jsx

const Main = () => {
    const location = useLocation()

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
