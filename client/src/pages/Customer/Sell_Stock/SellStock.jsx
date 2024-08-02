import './SellStock.css'
import Navbar from '../../../components/Navbar/login'
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios";
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'

function SellStock() {
  const location = useLocation()
  const [Data, setData] = useState({})
  const [DataState, setDataState] = useState(false);
  const [stockPrice, setStockPrice] = useState(0);
  const navigate = useNavigate()

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
      setData({ 'StockSymbol':location.state['stockViewData']['StockSymbol'],'Amounts':0.00,'AccountBalance':location.state['stockViewData']['AccountBalance'],'OrderType':'Sell','cookies': Cookies.get('user-auth')})
    }
  }, [location.state, navigate])

  useEffect(() => {
    if(DataState){
      const realMoneyValue = Data.Amounts * location.state.stockViewData.CurrentPrice*(1-(location.state.stockViewData.ComFee/100))
      setStockPrice(realMoneyValue)
    }
  }, [Data])

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if(value <= location.state['stockViewData']['netVol'] && value >= 0){
      setData(values => ({...values, [name]: value}))

    }else{
      Toast.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาดขี้นกรุณาใส่ใหม่',
      })
    }
    console.log(Data)
}

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(Data);
    Swal.showLoading()
    if(Data.Amounts != 0){
      try {
          const res = await axios.post('http://127.0.0.1:5000/api/customerMake/makeOrder/', Data)
          console.log(res.status)
          Swal.fire({
            title: 'ยืนยันคำสั่งขายสำเร็จ',
            text: "ขายหุ้น " + Data.StockSymbol + " จำนวน " + stockPrice.toFixed(5) + " USD",
            icon: 'success',
            confirmButtonText: 'ตกลง'
          }, navigate("/stockview/" + Data.StockSymbol))
      
      } catch(error) {
          console.log(error);
      }
    }else{
      Swal.fire({
        title: 'กรุณากรอกจำนวนหุ้น',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      })
    }
  }


  useEffect(() => {
    console.log(location.state)
  }, [location])


  return (
    <div className="sell-stock-container">
      {DataState ? 
      <>
      <Navbar />
      <div className="sell-stock-box bounce">
        <div className="upper-box">
          <div><span className="sell-box">ขาย</span><span className="sell-title font-bold pl-20">{location.state['stockViewData']['StockSymbol']}</span></div>
          <div className="sell-price font-semibold mt-2">${location.state['stockViewData']['CurrentPrice']} USD </div>
          <div className="sell-description mt-2"><span>สูงสุด </span><span> 170.61 </span> | <span> ต่ำสุด </span><span> 168.15</span></div>
          <div className="sell-description mt-2">มูลค่าตลาด</div>
          <div className="decoration flex justify-between items-center px-10 text-black">
            <div className="font-medium">จำนวนหุ้นที่ถือ<span className="ml-5 px-2 py-1 rounded-3xl text-white bg-gray-600"><a href="/deposit">ซื้อหุ้น +</a></span></div>
            <div className="font-medium">{location.state['stockViewData']['netVol'].toFixed(3)} หุ้น</div>
          </div>
        </div>
        <div className="middle-box pt-4">
          <div className="text-black text-xl">จำนวนหุ้นที่ต้องการขาย</div>
          <div className="input-box">
            <input type="number" value={Data.Amounts || ""} onChange={handleChange} name="Amounts" id="Amounts" placeholder="0.01" data-theme="light" className="w-full" />
            <div className='absolute top-20 right-10 text-black'>หุ้น</div>
          </div>
          <div className="mt-2">ระบุราคาที่ต้องการซื้อขั้นต่ำ 1 USD สูงสุดไม่เกิน 100,000 USD</div>
      
          <div className="text-black my-2 text-xl mt-6">ราคาที่ได้</div>
          <div className="flex justify-between px-10 my-8 text-2xl"><span>{stockPrice.toFixed(4)}</span>USD</div>
        </div>
        <div className="accept-box flex justify-between items-center">
          <div className="flex flex-col justify-between">
            <div>
              ยอดเงินที่ได้
            </div>
            <div className="text-3xl font-bold text-white">
              {stockPrice.toFixed(2)} USD
            </div>
          </div>
          <button onClick={handleSubmit}  className="sell-stock-btn">ยืนยันคำสั่งขาย</button>
        </div>
      </div>  
      </> : 
      <>
      
      </>}
      
    </div>
  )
}

export default SellStock
