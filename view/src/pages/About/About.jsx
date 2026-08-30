import React from 'react';
import { FaGraduationCap, FaUniversity, FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">About Me</h1>
                    <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Passionate Computer Science student at BRAC University with a drive for innovation and technology.
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="md:flex">
                        {/* Profile Image Section */}
                        <div className="md:w-1/3 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex flex-col items-center justify-center">
                            <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl">
                                <div className="w-44 h-44 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                                    <span className="text-6xl text-white font-bold">SS</span>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white text-center">Shahriar Sajid</h2>
                            <p className="text-blue-100 text-center mt-2">Computer Science Student</p>
                        </div>

                        {/* Details Section */}
                        <div className="md:w-2/3 p-8">
                            {/* Education */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <FaUniversity className="text-blue-500 text-xl mr-3" />
                                    <h3 className="text-2xl font-semibold text-gray-800">Education</h3>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex items-center mb-3">
                                        <FaGraduationCap className="text-blue-400 mr-3" />
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800">BRAC University</h4>
                                            <p className="text-gray-600">Bachelor of Science in Computer Science</p>
                                            <p className="text-sm text-gray-500">2022 - Present</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mt-3">
                                        Currently pursuing my degree in Computer Science with a focus on software development, 
                                        artificial intelligence, and web technologies. Passionate about creating innovative 
                                        solutions that make a difference.
                                    </p>
                                </div>
                            </div>

                            {/* Skills & Interests */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Skills & Interests</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-blue-600 mb-2">Technical Skills</h4>
                                        <ul className="text-gray-700 space-y-1">
                                            <li>• Web Development (React, Node.js)</li>
                                            <li>• Programming (Python, JavaScript, Java)</li>
                                            <li>• Database Management (MongoDB, SQL)</li>
                                            <li>• UI/UX Design</li>
                                            <li>• Problem Solving</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-blue-600 mb-2">Interests</h4>
                                        <ul className="text-gray-700 space-y-1">
                                            <li>• Artificial Intelligence</li>
                                            <li>• Machine Learning</li>
                                            <li>• Mobile App Development</li>
                                            <li>• Open Source Projects</li>
                                            <li>• Technology Innovation</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Get In Touch</h3>
                                <div className="flex flex-wrap gap-4">
                                    <a
                                        href="mailto:shahriar@example.com"
                                        className="flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <FaEnvelope className="mr-2" />
                                        Email
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/shahriar-sajid"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <FaLinkedin className="mr-2" />
                                        LinkedIn
                                    </a>
                                    <a
                                        href="https://github.com/shahriar-sajid"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <FaGithub className="mr-2" />
                                        GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quote Section */}
                <div className="text-center mt-12">
                    <blockquote className="text-xl italic text-gray-700 max-w-2xl mx-auto">
                        "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle."
                        <footer className="text-sm text-gray-600 mt-2">- Steve Jobs</footer>
                    </blockquote>
                </div>

                {/* University Pride */}
                <div className="text-center mt-12 bg-white rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">BU</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">BRAC University</h3>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Proud student of one of Bangladesh's leading private universities, known for its excellence in 
                        computer science education and innovative research environment.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;