import React from 'react';
import { IoLogoInstagram } from "react-icons/io";

function Footer() {
    return (
        <footer className="bg-indigo-800 text-indigo-200 p-8 sm:p-12 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-8 border-b border-indigo-700">
                    
                    <div className="flex flex-col space-y-3 text-center md:text-left">
                        <h3 className="text-3xl font-extrabold text-white">
                            Coding <span className="text-yellow-400">Sena</span>
                        </h3>
                        <p className="text-indigo-300 text-sm max-w-xs mx-auto md:mx-0">
                            Empowering the next generation of digital leaders.
                        </p>
                        <p className="text-xs text-indigo-400 pt-4">
                            &copy; {new Date().getFullYear()} Coding Sena.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end space-y-4">
                        <h4 className="text-base font-semibold text-white uppercase tracking-wider">Get in Touch</h4>
                        <a 
                        href="mailto:" 
                        className="text-white font-bold hover:text-yellow-400 transition duration-300 text-lg border-b border-yellow-400"
                        >
                        codingsena@gmail.com
                        </a>
                        <div className="pt-2">
                            <a href="https://www.instagram.com/codingsena" target="_blank">
                                <IoLogoInstagram className="w-8 h-8 text-indigo-300 hover:text-yellow-400 transition cursor-pointer duration-300 transform hover:scale-110" />
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;