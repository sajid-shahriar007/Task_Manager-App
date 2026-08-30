import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { FaTasks, FaSignOutAlt, FaUserPlus, FaSignInAlt } from "react-icons/fa";

const NavBar = () => {
  const { user, logOut } = useContext(AuthContext);

  const handleLogOut = () => {
    logOut().catch(error => console.log(error));
  };

  const navLinks = (
    <>
      <li>
        <Link to="/" className="hover:text-indigo-400 transition-colors">
          Home
        </Link>
      </li>
      <li>
        <Link to="/taskmanager" className="hover:text-indigo-400 transition-colors">
          Task Manager
        </Link>
      </li>
      <li>
        <Link to="/about" className="hover:text-indigo-400 transition-colors">
          About
        </Link>
      </li>
    </>
  );

  return (
    <div className="navbar  z-50 w-full p-4 text-white shadow-lg backdrop-blur-md bg-black/30 border-b border-gray-700/50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden text-white hover:bg-gray-700/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul 
            tabIndex={0} 
            className="menu menu-compact dropdown-content mt-3 p-3 shadow-lg bg-gray-800/95 rounded-box w-52 space-y-2"
          >
            {navLinks}
            {user && (
              <li>
                <button 
                  onClick={handleLogOut}
                  className="flex items-center text-red-400 hover:text-red-300"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>

        <Link to="/" className="flex items-center text-2xl font-bold ml-2">
          <FaTasks className="text-indigo-400 mr-2 text-2xl" />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-4 text-lg">
          {navLinks}
        </ul>
      </div>

      <div className="navbar-end flex gap-3">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </span>
              </div>
              <span className="text-sm">{user.displayName || "User"}</span>
            </div>
            <button 
              onClick={handleLogOut}
              className="flex items-center px-4 py-2 text-red-400 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link 
              to="/login" 
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <FaSignInAlt className="mr-2" />
              <span className="hidden sm:inline">Login</span>
            </Link>
            <Link 
              to="/signup" 
              className="flex items-center px-4 py-2 border border-indigo-400 text-indigo-400 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <FaUserPlus className="mr-2" />
              <span className="hidden sm:inline">Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;