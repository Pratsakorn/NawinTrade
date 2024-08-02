import "./Stockview.css"
import StockGrahp from "../../../components/graph/StockGraph"
import Navbar_Login from "../../../components/Navbar/login"
import { useState, useEffect } from 'react'
import axios from 'axios';
import Cookies from "js-cookie";
import  { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

function Stockview() {
  var date = new Date();
  let currentdate = date.toISOString().split("T")[0]
  let previousdate = new Date(date.setDate(date.getDate() - 150)).toISOString().split("T")[0]
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const param = useParams()
  const navigate = useNavigate();
  
  const [data] = useState({'StockSymbol': param.symbol, 'cookies': Cookies.get('user-auth')})
  const [dateSelected, setDate] = useState({"start":previousdate, "end": "2024-05-23", "skip":1, "render":false})
  const [symbol, setSymbol] = useState(param.symbol)
  console.log(Cookies.get('user-auth'));

  const [stockViewData, setData] = useState()

  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  })


    useEffect(()=> {
      const getData = async() => {
        try {
          const res = await axios.post('http://127.0.0.1:5000/api/customerView/stockView', data)
          console.log(res.status)
          if(res.status != 200){
            navigate("/login")
          }
          setData(res.data)
        } catch (error) {
          console.log(error)
          navigate("/login")
          Toast.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาดกรุณา login',
          })
        }
      }
    getData()
    }, [])
    
  console.log(stockViewData);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDate(values => ({...values, [name]: value, "render" : !dateSelected.render}))

    setTimeout(() => {
      setDate(values => ({...values, "render": false}));
    }, 500);
    console.log(dateSelected)
  }

  const handleSearch = (event) => {
    setSymbol(event.target.value)
  }

  const handleKeydown = (event) => {
    if(event.key == "Enter"){
      navigate("/stockview/"+symbol.toUpperCase())
      navigate(0)
    }

  }

  return (
    <>
      {stockViewData == undefined ? 
      <div className="loading-container">
        <span className="loading loading-bars loading-sm text-accent"></span>
      </div> : <div className="stock-container">
      <Navbar_Login/>
        <div className="stock-layout">
            <div className="stock-search-container flex items-center">
                <div className="search-input relative">
                    <input value={symbol || ""} onKeyDown={handleKeydown} onChange={handleSearch} data-theme="light" className="" type="text" placeholder="Stock symbols Name" />
                    <span>
                      <a href={"/stockview/"+symbol.toUpperCase()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-search absolute top-3 right-3" viewBox="0 0 16 16">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                      </a>
                    </span>
                </div>
            </div>
            <div className="stock-view-container bounce">
              <div className="grid grid-cols-4">
                <div className="col-span-3">
                  <div className="stock-title text-5xl font-bold">{stockViewData.StockSymbol}<span className="font-bold">- {stockViewData.CompanyName}</span></div>
                  <p className="my-2">Stock Price & Overview</p>
                  <div className="my-1"><span  className="stock-price text-4xl font-medium">${stockViewData.CurrentPrice}</span><span className="stock-growth text-2xl font-bold"> +0.87 (0.51%)</span><span className="update-date"> 4:00 PM 04/26/24</span></div>
                  <div className="stock-description my-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo, possimus.</div>
                </div>
                <div className="px-8 flex gap-7 justify-between mr-8">
                  <div className="user-stock text-center flex justify-center items-center flex-col">
                    <div className="mb-3">จำนวนหุ้นที่ถือ</div>
                    <div className="text-2xl text-black font-medium">{(stockViewData.netVol).toFixed(2)}<span>  หุ้น</span></div>
                  </div>
                  <div className="flex justify-center items-center flex-col">
                    <div className="mb-3">ยอดเงินที่ใช้ได้</div>
                    <div className="text-2xl text-black font-medium">{formatter.format(stockViewData.AccountBalance)}<span>  USD</span></div>
                  </div>
                </div>
              </div>
              <hr className="mt-5 mb-5"/>
              <div className="flex gap-10 justify-center">
                <div className="stock-history-graph">
                  <div className="date-select">
                    <p className="text-3xl mb-5">{stockViewData.StockSymbol}<span> - {stockViewData.CompanyName}</span></p>
                    <div className="date-block">
                      <div>10D</div>
                      <div>1M</div>
                      <div>6M</div>
                      <div>1Y</div>
                      <div>5Y</div>
                      <div className="date-input">
                        <p>start date</p>
                        <input type="date" data-theme="light" value={dateSelected.start} name="start" onChange={handleChange} className="" max={currentdate}  min="2023-08-14" />
                      </div>
                      <div className="date-input">
                        <p>end date</p>
                        <input type="date" data-theme="light" className="" max={currentdate} min="2023-08-14"/>
                      </div>
                    </div>
                  </div>
                  <div className="stock-chart-container">
                    {dateSelected.render ? <div className="chart-loading-container flex justify-center"><span className="load loading loading-spinner text-warning"></span></div>   : <StockGrahp stockdata={stockViewData.stock_hist} dateSelect={dateSelected}/> }

                  </div>
                  <div className="brief-stock col-span-3 flex mt-10 gap-10 justify-center">
                    <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-bookmark-check-fill absolute top-3" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
                    </svg>
                      <p>Common</p>
                    </div>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-database absolute top-3 " viewBox="0 0 16 16">
                        <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313M13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A5 5 0 0 0 13 5.698M14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A5 5 0 0 0 13 8.698m0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525"/>
                      </svg>
                      <p>ขนาดใหญ่</p>
                    </div>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-bank2 absolute top-3" viewBox="0 0 16 16">
                        <path d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916zM12.375 6v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zm-2.5 0v7h-1.25V6zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2M.5 15a.5.5 0 0 0 0 1h15a.5.5 0 1 0 0-1z"/>
                      </svg>
                      <p>Technology</p>
                    </div>
                    <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-hand-thumbs-up absolute top-3" viewBox="0 0 16 16">
                      <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                    </svg>
                      <p>จ่ายปันผล</p>  
                    </div>  
                  </div>
                </div>
                <div className="stock-box-description">
                  <div className="box">
                    <div className="line1 mb-1"><span><img src={stockViewData.ImageURL} alt="logo" width="0" height="0"/></span><span className="title text-3xl text-neutral-950">{stockViewData.StockSymbol}</span></div>
                    <div className="line2">ภาพรวมของหุ้นและบริษัท</div>
                    <div className="line3 flex justify-between"><span className="text-green-600">สูงสุด</span><span className="text-rose-500">ต่ำสุด</span></div>
                    <div className="line4 flex justify-between text-2xl"><span className="low-price text-green-600 font-bold">170.61</span><span className="high-price text-rose-500 font-bold">168.15</span></div>
                    <div className="line5 flex justify-between"><span className="box-label">Company</span><span className="box-label">{stockViewData.CompanyName.substring(0,10)}</span></div>
                    <div className="line6 flex justify-between"><span className="box-label">Exchange</span><span className="box-label">{stockViewData.Exchange.substring(0,6)}...</span></div>
                    <div className="line7 flex justify-between"><span className="box-label">Market cap</span><span className="box-label">{stockViewData.MarketCap}</span></div>
                    <div className="line8 flex justify-between"><span className="box-label">Lastest Dividend</span><span className="box-label">{stockViewData.LastestDividend}</span></div>
                    <div className="line9 flex justify-between"><span className="box-label">Sector</span><span className="box-label">{stockViewData.Sector}</span></div>
                    <div className="line10 flex justify-between"><span className="box-label">Industry</span><span className="box-label">{stockViewData.Industry.substring(0,7)}...</span></div>
                    <div className="line11 flex justify-between"><span className="box-label">Website</span><span className="box-label">{stockViewData.Website.substring(0,10)}...</span></div>
                  </div>
                  <div className="buysell-stock flex">
                    <a onClick={() => navigate("/buystock", {state:{stockViewData}})} className="buy">ซื้อ</a>
                    <a onClick={() => navigate("/sellstock", {state:{stockViewData}})} className="sell">ขาย</a>
                  </div>
                </div>
              </div>
            </div>

        </div>
      </div>}
    </>
  )
}

export default Stockview
