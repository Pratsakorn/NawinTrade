import './Trading_history.css'
import Navbar_Login from '../../../components/Navbar/login'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState} from 'react'
import Cookies from "js-cookie";
import axios from 'axios';

function Tradhist (){
    const [cookie, setCookie] = useState({'cookies': Cookies.get('user-auth')})
    const param = useLocation()
    console.log(param)
    const [data, setData] = useState()
    const navigate = useNavigate()
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const getData = async()=>{
        const res = await axios.post('http://127.0.0.1:5000/api/customerView/tradinghistory', cookie)
        setData(res.data)
        }
        console.log(data)

    useEffect(() => {
        if(param.state == null){
          navigate('/account')
        } 
        getData()
    },[])

    
    return(
        <div className="tradeHis-container">
            { data != undefined ? <>
            <Navbar_Login/>
            <div className="bounce PayHis-layout relative">
            <div className="absolute upper-box w-full h-36 theme1 top-0 left-0 p-8">
                <div className="title text-3xl text-white flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-clock-history" viewBox="0 0 16 16">
                    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
                    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                </svg>
                <span>ประวัติการซื้อ-ขาย</span>
                </div>
                <div className="flex justify-between mt-2 px-2">
                    <div>
                        ของ {param.state.userViewData.fName}{" "}
                        {param.state.userViewData.lName}
                    </div>
                    <div>broker : {param.state.userViewData.BrokerName}</div>
                </div>
                <div className="absolute text-box theme2 w-40 shadow-sm h-10 text-white text-md rounded-sm bottom-0 flex justify-center items-center">{data.Count[0].count + data.Count[1].count} รายการย้อนหลัง</div>
            </div>
            <div className="PayHis-box absolute px-4">
                {data.tradingHistory.map((element, index)=>(
                    <div key = {index}>
                    <div className="payment-box">
                        <div className="flex justify-between text-xl items-center">
                            <div className={`${element.OrderType == 'Buy' ? 'theme-success':'theme-danger'} font-black`}>{element.OrderType == 'Sell' ? 'ขาย':'ซื้อ'}<span className='text-black ml-2'>{element.StockSymbol}</span>
                                <div className='text-sm font-medium text-gray-400'>ราคาที่ได้จริง <span className='text-black'>{formatter.format(element.Price)}</span></div>
                                <div className='text-sm font-medium text-gray-400'>จำนวนหุ้น <span className='text-black'>{element.Volume}</span></div>
                                </div>
                            <div className="text-end">
                                <div className={`${element.OrderType == 'Buy' ? 'theme-success':'theme-danger'}`}>{formatter.format(element.amount_money)}</div>
                                <div className="text-sm">{element.OrderDateTime.substring(0, 10)}</div>
                            </div>
                        </div>
                    </div>
                    <hr className="my-5"/>
                </div>
                ))}

            </div>
            <div className="aggregate p-3">
                <div className="flex justify-between">
                    <div>ยอดรวมล่าสุด 7 วันย้อนหลัง</div>
                </div>
                <div className="grid grid-cols-2 text-xl mt-3 text-white">
                    <div className=" col-span-1">ยอดซื้อ : <span className="text-green-400">{formatter.format(data.Net7day[0].net)}</span></div>
                    <div className=" col-span-1 text-end">ยอดขาย : <span className="text-red-400">{formatter.format(data.Net7day[1].net)}</span></div>
                </div>
            </div>
            <div className="absolute w-full h-2 theme1 left-0 bottom-0"></div>
        </div>
            
            </> : <>
            <div className="loading-container">
            <span className="loading loading-bars loading-sm text-accent"></span>
            </div>
            </>}
        </div>
    )
}

export default Tradhist