import "./BuyStock.css"
import Navbar from '../../../components/Navbar/login'
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios";
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'


function BuyStock() {
  const location = useLocation()
  const navigate = useNavigate()
  const [Data, setData] = useState({})
  const [DataState, setDataState] = useState(false);
  const [StockAmounts, setStockAmounts] = useState(0)

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

  useEffect(() => {
    if(location.state == null){
      navigate("/stockview/AAPL")
    }else{
      setDataState(true)
      setData({ 'StockSymbol':location.state['stockViewData']['StockSymbol'],'Amounts':0.00,'AccountBalance':location.state['stockViewData']['AccountBalance'],'OrderType':'Buy','cookies': Cookies.get('user-auth')})
    }
  }, [location.state, navigate])

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if(value <= location.state['stockViewData']['AccountBalance'] && value >= 0){
      setData(values => ({...values, [name]: value}))
    }else{
      Toast.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาดขี้นกรุณาใส่ใหม่',
      })
    }
    console.log(StockAmounts)
    console.log(Data)
  }

  useEffect(() => {
    if(DataState){
      const realVol = (Data.Amounts*(1-(location.state.stockViewData.ComFee/100)))/location.state.stockViewData.CurrentPrice
      setStockAmounts(realVol)
    }
  }, [Data])
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(Data);
    Swal.showLoading()
    if(Data.Amounts != 0){
      try {
          const res = await axios.post('http://127.0.0.1:5000/api/customerMake/makeOrder/', Data)
          console.log(res.status)
          Swal.fire({
            title: 'ยืนยันคำสั่งซื้อสำเร็จ',
            text: "ซื้อ " + Data.StockSymbol + " จำนวน " + StockAmounts.toFixed(5) + " หุ้น",
            icon: 'success',
            confirmButtonText: 'ตกลง'
          }, navigate("/stockview/" + Data.StockSymbol))
      
      } catch(error) {
          console.log(error);
      }
    }else{
      Swal.fire({
        title: 'กรุณากรอกจำนวนเงิน',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      })
    }
  }

  return (
    <div className="buy-stock-container">
      {DataState ?
      <>
      <Navbar />
      <div className="buy-stock-box bounce">
        <div className="upper-box">
          <div><span className="buy-box">ซื้อ</span><span className="buy-title font-bold pl-20">{location.state['stockViewData']['StockSymbol']}</span></div>
          <div className="buy-price font-semibold mt-2">${location.state['stockViewData']['CurrentPrice']} USD </div>
          <div className="buy-description mt-2"><span>สูงสุด </span><span> 170.61 </span> | <span> ต่ำสุด </span><span> 168.15</span></div>
          <div className="buy-description mt-2">มูลค่าตลาด</div>
          <div className="decoration flex justify-between items-center px-10 text-black">
            <div className="font-medium">ยอดเงินที่ลงทุนได้<span className="ml-5 px-2 py-1 rounded-3xl text-white bg-gray-600"><a href="/deposit">ฝากเงิน +</a></span></div>
            <div className="font-medium">{location.state['stockViewData']['AccountBalance']} USD</div>
          </div>
        </div>
        <div className="middle-box pt-4">
          <div className="text-black text-xl">จำนวนหุ้นที่ได้ประมาณ</div>
          <div className="flex justify-between px-10 my-8 text-2xl"><span>{StockAmounts.toFixed(4)}</span>หุ้น</div>
      
          <div className="text-black my-2 text-xl mt-10">ราคาที่ต้องการซื้อ</div>
          <div className="input-box relative">
            <input type="number" value={Data.Amounts || ""} onChange={handleChange}  name="Amounts" id="Amounts" placeholder="0.01" data-theme="light" className="w-full " />
            <div className="absolute top-4 right-10 text-black">USD</div>
          </div>
          <div className="mt-2">ระบุราคาที่ต้องการซื้อขั้นต่ำ 1 USD สูงสุดไม่เกิน 100,000 USD</div>
        </div>
        <div className="accept-box flex justify-between items-center">
          <div className="flex flex-col justify-between">
            <div>
              ยอดที่ต้องชำระ
            </div>
            <div className="text-3xl font-bold text-white">
              {Data.Amounts} USD
            </div>
          </div>
          <button onClick={handleSubmit}  className="buy-stock-btn">ยืนยันคำสั่งซื้อ</button>
        </div>
      </div> 
      </>
      :
      <></>}
       
    </div>
  )
}

export default BuyStock
