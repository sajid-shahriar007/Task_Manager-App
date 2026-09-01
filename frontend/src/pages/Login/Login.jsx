import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { useGoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';

const Login = () => {
  const { signIn, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await googleSignIn(tokenResponse.access_token);
        Swal.fire({
          title: "Google Login successful",
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/taskmanager');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Google Login Failed',
          text: error.response?.data?.error || 'Something went wrong',
        });
      }
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: 'Login was cancelled or failed.',
      });
    }
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await signIn(email, password);
      Swal.fire({
        title: "User Login successful",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      });
      navigate('/taskmanager');
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.error || 'Invalid email or password',
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen overflow-hidden bg-[#8b98f2] p-4">
      {/* Main Card */}
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden max-w-[900px] w-full p-4 gap-4 h-[700px]">

        {/* Left Side - Form */}
        <div className="flex-1 px-8 py-10 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="text-xl font-bold tracking-wide">Tactiq</span>
          </div>

          <h1 className="text-4xl font-bold text-black mb-2">Welcome Back!</h1>
          <p className="text-gray-500 mb-8">Please enter login details below</p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <label className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter the email"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-600">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter the Password"
                required
              />
            </div>

            <div className="flex justify-end">
              <Link to="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#3d38ff] text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
            >
              Sign in
            </button>

            <div className="flex items-center justify-center space-x-2 my-4">
              <span className="h-px w-16 bg-gray-300"></span>
              <span className="text-gray-400 text-sm">Or continue</span>
              <span className="h-px w-16 bg-gray-300"></span>
            </div>

            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Log in with Google
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 font-medium">
            Don't have an account? <Link to='/signup' className="text-blue-600 hover:underline">Sign Up</Link>
          </p>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden md:flex flex-1 bg-[#8c94f5] rounded-3xl flex-col items-center justify-center p-8 relative overflow-hidden">
          <img
            src="/login_illustration.jpg"
            alt="Task management illustration"
            className="w-full h-auto max-w-sm rounded-xl shadow-md z-10"
          />

          <div className="mt-8 text-center z-10">
            <p className="text-white text-lg font-medium italic mb-4">
              Manage your task in a easy and more efficient way with Tasky...
            </p>
            <div className="flex justify-center space-x-2">
              <div className="w-6 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
          </div>

          {/* Decorative elements for the right panel */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-900 opacity-10 rounded-full blur-2xl"></div>
        </div>

      </div>
    </div>
  );
};

export default Login;