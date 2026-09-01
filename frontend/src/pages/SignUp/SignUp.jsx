import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthContext";
import Swal from "sweetalert2";

const SignUp = () => {
    const { register, handleSubmit, reset, formState: { errors }, } = useForm();
    const { createUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    const onSubmit = async (data) => {
        try {
            await createUser(data.name, data.email, data.password);
            reset();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'User created successfully.',
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/login');
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.response?.data?.error || 'Something went wrong',
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

                    <h1 className="text-4xl font-bold text-black mb-2">Create Account</h1>
                    <p className="text-gray-500 mb-8">Please enter your details below to sign up</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Name Input */}
                        <div className="relative">
                            <label className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-600">
                                Name
                            </label>
                            <input
                                type="text"
                                {...register("name", { required: true })}
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="Enter your name"
                            />
                            {errors.name && <span className="text-red-600 text-sm mt-1 block">Name is required</span>}
                        </div>

                        {/* Email Input */}
                        <div className="relative">
                            <label className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-600">
                                Email
                            </label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="Enter your email"
                            />
                            {errors.email && <span className="text-red-600 text-sm mt-1 block">Email is required</span>}
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <label className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-600">
                                Password
                            </label>
                            <input
                                type="password"
                                {...register("password", { required: true, minLength: 6, maxLength: 20 })}
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="Enter your password"
                            />
                            {errors.password?.type === 'required' && <span className="text-red-600 text-sm mt-1 block">Password is required.</span>}
                            {errors.password?.type === 'minLength' && <span className="text-red-600 text-sm mt-1 block">Password must be at least 6 characters.</span>}
                            {errors.password?.type === 'maxLength' && <span className="text-red-600 text-sm mt-1 block">Password must be less than 20 characters.</span>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#3d38ff] text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 mt-4"
                        >
                            Sign Up
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600 font-medium">
                        Already have an account? <Link to='/login' className="text-blue-600 hover:underline">Log in</Link>
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
export default SignUp;