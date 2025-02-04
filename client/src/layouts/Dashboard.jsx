import React from "react";
import UserMenu from "../components/UserMenu";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RxDashboard } from "react-icons/rx";

const Dashboard = () => {
  const user = useSelector((state) => state.user);

  console.log("user dashboard", user);

  return (
    <section className="h-screen bg-gray-100 flex">
      {/* Left: Sidebar (User Menu) */}
      <div className="lg:w-[250px] w-full bg-blue-800 text-white p-4 flex flex-col justify-between h-full sticky top-0 border-r">
        <div>
          <Link className="font-bold text-lg mb-4 gap-1 flex items-center text-white hover:text-green-500">
            <RxDashboard size={24} />
            Dashboard
          </Link>
          {/* Memberikan margin-top pada UserMenu untuk menambah jarak */}
          <div className="mt-4">
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Right: Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Optional: Mobile Hamburger for Menu Toggle */}
        <div className="lg:hidden bg-blue-800 text-white p-4 flex justify-between items-center">
          <button className="text-white">
            <i className="fas fa-bars"></i> {/* Replace with an actual icon */}
          </button>
          <span className="font-bold">Dashboard</span>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-white p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default Dashboard;
