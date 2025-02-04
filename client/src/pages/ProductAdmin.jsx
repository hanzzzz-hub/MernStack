import React, { useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import Loading from "../components/Loading";
import ProductCardAdmin from "../components/ProductCardAdmin";
import { IoSearchOutline } from "react-icons/io5";
import EditProductAdmin from "../components/EditProductAdmin";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search: search,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage);
        setProductData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [page]);

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage((preve) => preve + 1);
    }
  };
  const handlePrevious = () => {
    if (page > 1) {
      setPage((preve) => preve - 1);
    }
  };

  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    let flag = true;

    const interval = setTimeout(() => {
      if (flag) {
        fetchProductData();
        flag = false;
      }
    }, 300);

    return () => {
      clearTimeout(interval);
    };
  }, [search]);

  return (
    <section className="p-4">
      <div className="bg-white shadow-md flex flex-wrap items-center justify-between gap-4 p-4 rounded">
        <h2 className="font-semibold text-lg">Product</h2>
        <div className="h-10 min-w-24 max-w-lg w-full sm:w-1/2 bg-blue-50 px-4 flex items-center gap-3 py-2 rounded border focus-within:border-primary-200">
          <IoSearchOutline size={20} />
          <input
            type="text"
            placeholder="Search product..."
            className="h-full w-full outline-none bg-transparent text-sm"
            value={search}
            onChange={handleOnChange}
          />
        </div>
      </div>

      {loading && <Loading />}

      <div className="p-4 bg-blue-50">
        <div className="min-h-[55vh]">
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            }}
          >
            {productData.map((p) => (
              <ProductCardAdmin
                key={p._id}
                data={p}
                fetchProductData={fetchProductData}
              />
            ))}
          </div>
        </div>

        {/* Navigasi Pagination */}
        <div className="flex justify-between items-center my-4">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className="border border-gray-300 px-4 py-2 rounded bg-gray-200 text-black 
              hover:bg-red-500 hover:text-black transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-300"
          >
            Previous
          </button>

          <span className="px-4 py-2 bg-slate-100 rounded">
            {page} / {totalPageCount}
          </span>

          <button
            onClick={handleNext}
            disabled={page === totalPageCount}
            className="border border-gray-300 px-4 py-2 rounded bg-gray-200 text-black 
              hover:bg-red-500 hover:text-black transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-300"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductAdmin;
