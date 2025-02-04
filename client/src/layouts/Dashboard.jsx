import React, { useState } from "react";
import UserMenu from "../components/UserMenu";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RxDashboard } from "react-icons/rx";
import { IoClose, IoMenu } from "react-icons/io5";

const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  console.log("user dashboard", user);

  return (
    <section className="h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden bg-blue-800 text-white p-4 flex justify-between items-center">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-white text-2xl"
        >
          <IoMenu />
        </button>
        <span className="font-bold">Dashboard</span>
      </div>

      {/* Sidebar (User Menu) */}
      <div
        className={`lg:w-[250px] w-full bg-blue-800 text-white p-4 flex flex-col justify-between h-full border-r fixed lg:relative transition-transform duration-300 ease-in-out 
          ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        <div>
          <div className="flex justify-between items-center">
            <Link className="font-bold text-lg mb-4 gap-1 flex items-center text-white hover:text-green-500">
              <RxDashboard size={24} /> Dashboard
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden text-white text-2xl"
            >
              <IoClose />
            </button>
          </div>
          <div className="mt-4">
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 bg-white p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default Dashboard;
