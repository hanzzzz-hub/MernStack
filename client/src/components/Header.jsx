import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  // const [totalPrice,setTotalPrice] = useState(0)
  // const [totalQty,setTotalQty] = useState(0)
  const { totalPrice, totalQty } = useGlobalContext();
  const [openCartSection, setOpenCartSection] = useState(false);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }

    navigate("/user");
  };

  //total item and total price
  // useEffect(()=>{
  //     const qty = cartItem.reduce((preve,curr)=>{
  //         return preve + curr.quantity
  //     },0)
  //     setTotalQty(qty)

  //     const tPrice = cartItem.reduce((preve,curr)=>{
  //         return preve + (curr.productId.price * curr.quantity)
  //     },0)
  //     setTotalPrice(tPrice)

  // },[cartItem])

  return (
    <header className="h-24 lg:h-20 shadow-md sticky top-0 z-40 flex flex-col justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-4 justify-between">
          {/** Logo */}
          <div className="h-full flex items-center">
            <Link to={"/"} className="flex items-center">
              <img
                src={logo}
                width={163}
                height={60}
                alt="logo"
                className="hidden lg:block transition-transform duration-300 hover:scale-105"
              />
              <img
                src={logo}
                width={120}
                height={60}
                alt="logo"
                className="lg:hidden transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/** Search */}
          <div className="hidden lg:block w-1/2">
            <Search />
          </div>

          {/** Login and Cart Section */}
          <div className="flex items-center gap-4">
            {/** Mobile User Icon */}
            <button
              className="lg:hidden text-white hover:text-gray-200 transition-colors"
              onClick={handleMobileUser}
            >
              <FaRegCircleUser size={26} />
            </button>

            {/** Desktop Account and Cart */}
            <div className="hidden lg:flex items-center gap-8">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setOpenUserMenu((preve) => !preve)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <p className="font-medium hover:underline">Account</p>
                    {openUserMenu ? (
                      <GoTriangleUp size={20} />
                    ) : (
                      <GoTriangleDown size={20} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-12 bg-white text-gray-800 rounded-lg shadow-lg p-4 min-w-[200px]">
                      <UserMenu close={handleCloseUserMenu} />
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className="text-white bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium shadow-md transition-all"
                >
                  Login
                </button>
              )}
              <button
                onClick={() => setOpenCartSection(true)}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg text-white shadow-md transition-all"
              >
                <div className="animate-bounce">
                  <BsCart4 size={26} />
                </div>
                <div className="font-semibold text-sm">
                  {cartItem[0] ? (
                    <div>
                      <p>{totalQty} Items</p>
                      <p>{DisplayPriceInRupees(totalPrice)}</p>
                    </div>
                  ) : (
                    <p>My Cart</p>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/** Mobile Search */}
      <div className="container mx-auto px-4 lg:hidden">
        <Search />
      </div>

      {/** Cart Section */}
      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </header>
  );
};

export default Header;
