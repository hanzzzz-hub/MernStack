import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye, FaSpinner } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const valideValue = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      toast.error("Password and confirm password must be the same");
      return;
    }

    setLoading(true);
    try {
      const response = await Axios({ ...SummaryApi.register, data });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        setData({ name: "", email: "", password: "", confirmPassword: "" });
        navigate("/login");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white w-full max-w-lg mx-auto rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome to MernStack
        </h2>
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="name" className="text-gray-700 font-medium">
              Name :
            </label>
            <input
              type="text"
              id="name"
              autoFocus
              className="w-full bg-blue-50 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-gray-700 font-medium">
              Email :
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-blue-50 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-gray-700 font-medium">
              Password :
            </label>
            <div className="bg-blue-50 p-3 border border-gray-300 rounded-lg flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full outline-none bg-transparent"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer ml-2"
              >
                {showPassword ? (
                  <FaRegEyeSlash size={20} />
                ) : (
                  <FaRegEye size={20} />
                )}
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-gray-700 font-medium"
            >
              Confirm Password :
            </label>
            <div className="bg-blue-50 p-3 border border-gray-300 rounded-lg flex items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="w-full outline-none bg-transparent"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your confirm password"
                required
              />
              <div
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="cursor-pointer ml-2"
              >
                {showConfirmPassword ? (
                  <FaRegEyeSlash size={20} />
                ) : (
                  <FaRegEye size={20} />
                )}
              </div>
            </div>
          </div>
          <button
            disabled={!valideValue || loading}
            className={`${
              valideValue ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
            } text-white py-3 rounded-lg font-semibold tracking-wide transition duration-300 flex items-center justify-center`}
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : null}{" "}
            Register
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 hover:text-green-800 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
