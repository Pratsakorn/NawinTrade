import "./Consultportfolio.css";
import "../../Customer/useraccpage/Useraccpage.css";
import "../../Customer/User_portfolio/Userportfolio.css";
import Navbar from "../../../components/Navbar/login";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

function Consultportfolio() {
  const [data] = useState({ cookies: Cookies.get("consultant-auth") });
  const navigate = useNavigate();

  const [consultViewData, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

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

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.post(
          "http://127.0.0.1:5000/api/consultantView/consultCustomerPortView",
          data
        );
        console.log(res.status);
        if (res.status != 200) {
          navigate("/login");
        }
        setData(res.data);
        //console.log(res.data)
      } catch (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดกรุณา login",
        });
        navigate("/login");
      } finally {
        setLoading(false)
      }
    };
    getData();
  }, []);
  console.log(consultViewData);

  if (loading) {
    return ( <div className="loading-container">
    <span className="loading loading-bars loading-sm text-accent"></span>
  </div>)
  }

  return (
    <div className="consult-portfolio-container">
      <Navbar />
      <div className="px-72 text-3xl text-black">Portfolio ของลูกค้า</div>

      {consultViewData.map((element, index) => {
        const ex = "1000000";
        let sumVol = 0;
        let investBalance = 0;
        let netGrowth_USD = 0;
        let previousBalance = 0;
        let sumGrowth = 0;
        let stockList = [];

        console.log("portData");
        console.log(element.portfolioData);

        element.portfolioData.forEach((stock) => {
          sumVol += stock.netVol;
          investBalance += stock.netVol * stock.currentPrice;
        });

        element.portfolioData.forEach((stock) => {
          stockList.push({
            StockSymbol: stock.StockSymbol,
            StockRatio: (stock.netVol / sumVol) * 100,
            StockGrowth:
              ((stock.currentPrice - stock.SecondLatestEOD_Price) /
                stock.SecondLatestEOD_Price) *
              100,
            StockGrowth_USD:
              (stock.currentPrice - stock.SecondLatestEOD_Price) * stock.netVol,
          });
        });

        stockList.forEach((element) => {
          netGrowth_USD += element.StockGrowth_USD;
        });

        element.portfolioData.forEach((element) => {
          previousBalance += element.netVol * element.SecondLatestEOD_Price;
        });

        sumGrowth = (netGrowth_USD / previousBalance) * 100;

        return (
          <div className="customer-port relative" key={index}>
            <div className="port-box">
              <div className="title-container">
                {element.fName} {element.lName}
              </div>
              <div>
                <div className={"overall-money"}>
                  {investBalance.toFixed(2)}
                  <span className="ml-6 text-xl"> USD</span>
                </div>
                <div className="stock-ratio-bar">
                  <div className="label">สัดส่วนการลงทุน</div>
                  <div className="stock-label flex">
                    {stockList.map((element, index) => (
                      <div
                        key={index}
                        className="stock"
                        style={{ width: element.StockRatio * 5.5 + "px" }}
                      >
                        {element.StockRatio < 10 ? null : (
                          <div className="percent">
                            {element.StockRatio.toFixed(2)}%
                          </div>
                        )}
                        {element.StockRatio < 20 ? null : (
                          <>{element.StockSymbol}</>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="port-growth">
                <div className="label">การเติบโตของพอร์ต</div>
                <div
                  className={`${
                    sumGrowth < 0 ? "growth-red" : "growth-green"
                  }`}
                >
                  {sumGrowth.toFixed(2)} %(
                  {formatter.format(netGrowth_USD)})
                </div>
                <div className="description mt-1">ภาพรวมการเติบโตของพอร์ต</div>
                <div className="growth-graph">
                  {stockList.map((element, index) => (
                    <div
                      key={index}
                      className={`stock ${
                        element.StockGrowth < 0 ? "red" : "green"
                      }`}
                      style={{
                        height:
                          element.StockGrowth *
                            (element.StockGrowth < 0 ? -1 : 1) *
                            10 +
                          "px",
                      }}
                    >
                      <p>{element.StockSymbol}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="port-footer px-10">
                <div>พอร์ตฟอลิโอของ</div>
                <div className="text-sm">
                  {element.fName} {element.lName}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Consultportfolio;
