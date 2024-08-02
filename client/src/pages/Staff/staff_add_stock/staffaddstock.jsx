import "./staffaddstock.css";
import Navbar from "../../../components/Navbar/login";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import axios from "axios";
import { useState } from "react";

function staffaddstock() {
  const [StockData, setStockData] = useState({
    cookies: Cookies.get("staff-auth"),
    StockSymbol: "",
    CompanyName: "",
    Exchange: "",
    MarketCap: "",
    Sector: "",
    Industry: "",
    Website: "",
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setStockData((values) => ({ ...values, [name]: value }));
    console.log(StockData);
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(StockData);
    Swal.showLoading()
    if(StockData.StockSymbol == "" || StockData.CompanyName == "" || StockData.Exchange == "" || StockData.MarketCap == "" || StockData.Sector == "" || StockData.Industry == "" || StockData.Website == ""){
        Swal.fire({
            title: 'กรุณากรอกข้อมูลให้ครบ',
            icon: 'error',
            confirmButtonText: 'ตกลง'
          })
    }else{
        try {
          const res = await axios.post(
            "http://localhost:5000/api/staffMake/staffinsertStock/",
            StockData
          );
          console.log(res.data);
          if (res.status == 200) {
            console.log("Add Complete");
            //navigate("/staffOrder");
            Swal.fire({
                title: 'ยืนยันคำสั่งสำเร็จ',
                text: "เพิ่ม stock เรียบร้อย",
                icon: 'success',
                confirmButtonText: 'ตกลง'
              })
          }
          Cookies.set("staff-auth", res.data["token"]);
        } catch (error) {
          console.log(error);
          Toast.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาดกรุณาลองใหม่",
          });
        }

    }

  };

  return (
    <div className="add-stock-container">
      <Navbar />
      <div className="add-stock-box">
        <div className="background p-10">
          <div className="text-3xl text-white">เพิ่มหุ้น</div>
          <div>ใส่รายละเอียดของหุ้นที่ต้องการเพิ่ม</div>
        </div>
        <div className="add-stock-form grid grid-cols-2 grid-rows-5 gap-y-4 gap-x-8">
          <div className="col-span-1">
            <div className="mb-2 text-black">Stock symbol</div>
            <input
              type="text"
              value={StockData.StockSymbol || ""}
              onChange={handleChange}
              name="StockSymbol"
              id="Username"
              placeholder="username"
              data-theme="light"
              className="input input-bordered input-success w-full"
            />
          </div>
          <div className="col-span-1">
            <div className="mb-2 text-black">Company name</div>
            <input
              type="text"
              value={StockData.CompanyName || ""}
              onChange={handleChange}
              name="CompanyName"
              id="Username"
              placeholder="username"
              data-theme="light"
              className="input input-bordered input-success w-full"
            />
          </div>
          <div className="col-span-2">
            <div className="mb-2 text-black">Industry</div>
            <input
              type="text"
              value={StockData.Industry || ""}
              onChange={handleChange}
              name="Industry"
              id="Username"
              placeholder="username"
              data-theme="light"
              className="input input-bordered input-success w-full"
            />
          </div>
          <div className="col-span-2">
            <div className="mb-2 text-black">Exchange</div>
            <input
              type="text"
              value={StockData.Exchange || ""}
              onChange={handleChange}
              name="Exchange"
              id="Username"
              placeholder="username"
              data-theme="light"
              className="input input-bordered input-success w-full"
            />
          </div>
          <div className="col-span-1">
            <div className="mb-2 text-black">Sector</div>
            <input
              type="text"
              value={StockData.Sector || ""}
              onChange={handleChange}
              name="Sector"
              id="Username"
              placeholder="username"
              data-theme="light"
              className="input input-bordered input-success w-full"
            />
          </div>
          <div className="col-span-1">
            <div className="mb-2 text-black">Website</div>
            <input
              type="text"
              value={StockData.Website || ""}
              onChange={handleChange}
              name="Website"
              id="Username"
              placeholder="username"
              data-theme="light"
              className="input input-bordered input-success w-full"
            />
          </div>
          <div className="col-span-2">
            <div className="mb-2 text-black">Market cap</div>
            <input
              type="text"
              value={StockData.MarketCap || ""}
              onChange={handleChange}
              name="MarketCap"
              id="Username"
              placeholder="username"
              data-theme="light"
              className="input input-bordered input-success w-full"
            />
          </div>
        </div>
        <div className="text-center">
          <div onClick={handleSubmit} className="btn text-white">
            ยืนยันการเพิ่มหุ้น
          </div>
        </div>
      </div>
    </div>
  );
}

export default staffaddstock;
