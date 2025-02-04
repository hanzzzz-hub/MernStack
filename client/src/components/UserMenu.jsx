import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import {
  HiOutlineExternalLink,
  HiOutlineUser,
  HiOutlineTag,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineMap,
  HiOutlineLogout,
  HiOutlineHome,
} from "react-icons/hi";
import { FaRegUserCircle } from "react-icons/fa";
import isAdmin from "../utils/isAdmin";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const pageMapping = {
    "/": "Dashboard",
    "/product": "Dashboard",
  };

  const goToText = pageMapping[location.pathname] || "Go To Home";

  const goToPath =
    location.pathname === "/" || location.pathname === "/product"
      ? "/dashboard"
      : "/";

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout });
      console.log("logout", response);
      if (response.data.success) {
        if (close) close();
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) close();
  };

  return (
    <div>
      {" "}
      <Link
        to={goToPath}
        className={`font-bold text-lg mb-4 gap-1 flex items-center ${
          goToText === "Go To Home" ? "text-white" : "text-black"
        } hover:text-green-500`}
      >
        <HiOutlineHome size={24} />
        {goToText}
      </Link>
      <div className="font-bold text-lg mb-4">My Account</div>
      <div className="w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
        {user.avatar ? (
          <img alt={user.name} src={user.avatar} className="w-full h-full" />
        ) : (
          <FaRegUserCircle size={65} />
        )}
      </div>
      <div className="text-sm flex items-center gap-2 mb-4">
        <span className="max-w-52 text-ellipsis line-clamp-1">
          {user.name || user.mobile}{" "}
          <span className="text-medium text-red-600">
            {user.role === "ADMIN" ? "(Admin)" : ""}
          </span>
        </span>
        <Link
          onClick={handleClose}
          to={"/dashboard/profile"}
          className="text-blue-500 hover:text-blue-600"
        >
          <HiOutlineExternalLink size={16} />
        </Link>
      </div>
      <Divider />
      <nav className="text-sm grid gap-2 mt-4">
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/category"}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-green-500 transition"
          >
            <HiOutlineTag size={20} />
            Category
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/subcategory"}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-green-500 transition"
          >
            <HiOutlineTag size={20} />
            Sub Category
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/upload-product"}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-green-500 transition"
          >
            <HiOutlineCube size={20} />
            Upload Product
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/product"}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-green-500 transition"
          >
            <HiOutlineCube size={20} />
            Product
          </Link>
        )}

        <Link
          onClick={handleClose}
          to={"/dashboard/myorders"}
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-green-500 transition"
        >
          <HiOutlineShoppingCart size={20} />
          My Orders
        </Link>

        <Link
          onClick={handleClose}
          to={"/dashboard/address"}
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-green-500 transition"
        >
          <HiOutlineMap size={20} />
          Save Address
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-100 transition text-red-600 w-full text-left"
        >
          <HiOutlineLogout size={20} />
          Log Out
        </button>
      </nav>
    </div>
  );
};

export default UserMenu;
