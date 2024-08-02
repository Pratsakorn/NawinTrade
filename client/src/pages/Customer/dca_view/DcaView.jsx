import "../dca/dca.css";
import "./DcaViwe.css";
import Navbar_Login from "../../../components/Navbar/login";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

function DcaView() {
  const [data] = useState({ cookies: Cookies.get("user-auth") });
  const [DCAOrders, setDCAOrders] = useState();
  const [loading, setLoading] = useState(true);
  const param = useLocation();
  const navigate = useNavigate()
  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const getData = async () => {
    try {
      console.log("abc");
      const res = await axios.post(
        "http://127.0.0.1:5000/api/customerView/DCAView",
        data
      );
      console.log(res.status);

      setDCAOrders(res.data);
      console.log(res.data);
      //console.log(paymentList.paymentHistory[0]);
    } catch (error) {
      console.log(error);
      navigate("/login");
      Toast.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดกรุณา login",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (param.state == null) {
    //   navigate("/account");
    // }
    getData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <span className="loading loading-bars loading-sm text-accent"></span>
      </div>
    );
  }

  return (
    <div className="dca_container">
      <Navbar_Login />
      <div className="bounce forms shadow-lg shadow-gray-500 border-b-8 border-zinc-800 mx-auto relative">
        <div className="absolute top-5 -left-1 theme2 w-44 h-10 text-white text-center text-xl flex justify-center items-center shadow-md shadow-gray-700 rounded-sm">
          รายการ DCA
        </div>
        <div className="absolute top-5 left-48 w-34 h-10 flex justify-center items-center">
          <a href="/dca">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-box-arrow-up-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
              />
              <path
                fillRule="evenodd"
                d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
              />
            </svg>
          </a>
          <span className='text-2xl'>การตั้งค่า DCA</span>
        </div>
        <div className="w-auto h-36 theme1 pl-16 mb-3 pt-4">
          <p className="font-light text-sm text-opacity-5 pt-16">
            รายการ DCA ของฉัน
          </p>
        </div>
        <div className="dca-view-container">
          {DCAOrders.map((element, index) => (
            <div key={index}>
              <div className="dca-view-box flex justify-between">
                <div>
                  <div className="text-black text-3xl mb-5">
                    หุ้น : <span>{element.StockSymbol}</span>
                  </div>
                  <div className="mb-3">
                    วันที่ DCA : ทุกวันที่ <span>{element.DCADate}</span> ของเดือน
                  </div>
                  <div>
                    จำนวนเงิน{" "}
                    <span className="text-green-400 text-lg">{element.Amounts}</span> USD
                  </div>
                </div>
                <div>
                  <div className=" text-red-600 text-xl">
                    สิ้นสุดวันที่ : <span>{element.EndDate.replace("T", " ").replace(".000Z","").split(' ')[0]}</span>
                  </div>
                </div>
              </div>
              <div className="px-10">
                <hr />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DcaView;
