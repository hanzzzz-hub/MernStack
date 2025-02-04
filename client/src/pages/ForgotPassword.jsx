import React, { useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const valideValue = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verification-otp", {
          state: data,
        });
        setData({
          email: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white my-6 w-full max-w-lg mx-auto rounded-lg shadow-lg p-8 sm:p-6">
        <p className="font-semibold text-xl sm:text-2xl text-center">
          Forgot Password
        </p>

        <form className="grid gap-6 py-6" onSubmit={handleSubmit}>
          <div className="flex items-center gap-3">
            <AiOutlineMail className="text-gray-500" size={24} />{" "}
            {/* Icon for Email */}
            <label htmlFor="email" className="text-sm font-medium">
              Email :
            </label>
          </div>

          <input
            type="email"
            id="email"
            className="w-full bg-blue-50 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <button
            disabled={!valideValue}
            className={`${
              valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-3 rounded-lg font-semibold tracking-wide transition-colors duration-300 ease-in-out`}
          >
            Send OTP
          </button>
        </form>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
