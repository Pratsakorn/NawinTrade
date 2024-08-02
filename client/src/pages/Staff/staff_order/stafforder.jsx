import './stafforder.css'
import Navbar from '../../../components/Navbar/login'
import { useState, useEffect } from 'react'
import axios from 'axios';
import Cookies from "js-cookie";
import  { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'


function StaffOrder() {
    const [data] = useState({'cookies': Cookies.get('staff-auth')})
    const [orderList, setOrderList] = useState([])
    const [selectedOrder, setSelected] = useState()
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const getData = async() => {
      try {
        console.log("abc")
        const res = await axios.post('http://127.0.0.1:5000/api/staffView/staffOrderView', data)
        console.log(res.status)
        // if(res.status != 200){
        //   navigate("/login")
        // }
        setOrderList(res.data)
        console.log(res.data)
      } catch (error) {
        console.log(error)
        navigate("/login")
        // Toast.fire({
        //   icon: 'error',
        //   title: 'เกิดข้อผิดพลาดกรุณา login',
        // })
      } finally {
        setLoading(false)
      }
    }



    useEffect(()=> {
      getData()
      }, [])

      
      const handleSubmit = async (event) => {
        event.preventDefault();
        Swal.showLoading()   
          try {
            const orderObj = orderList[event.target.value]
            //console.log(obj.UserID)
            const res = await axios.post('http://127.0.0.1:5000/api/staffMake/staffOrderApprove/', 
            {'orderID': orderObj.OrderID, 'orderType' : orderObj.OrderType,'vol': orderObj.Volume, 'price': orderObj.Price, 'userID': orderObj.UserID})
            console.log(res.status)
            Swal.fire({
              title: 'ยินยันคำสั่งสำเร็จ',
              text: 'ยืนยันคำสั่งหมายเลข ' + orderObj.OrderID,
              icon: 'success',
              confirmButtonText: 'ตกลง'
            })
            getData()
          
          } catch(error) {
              console.log(error);
          } finally {
            setLoading(false); 
          }
        
      }

    if (loading) {
        return ( <div className="loading-container">
        <span className="loading loading-bars loading-sm text-accent"></span>
      </div>)
    }

  return (
    <div className='staff-order-container'>
      <Navbar />
      <div className='staff-order-box'>
        <div className='background p-8'>
            <div className="text-3xl text-white">ออเดอร์คำสั่ง ซื้อ-ขาย</div>
        </div>
        <div className='order-contain'>
          {orderList.map( (element, index)=>(
            <div className='box' key = {index}>
                <div>
                    <div className='text-2xl font-normal'>
                      <span className={element.OrderType === 'Buy' ? 'green text-white px-2 pt-1 mr-2 rounded-2xl' : 'red text-white px-2 pt-1 mr-2 rounded-2xl'}>
                        {element.OrderType === 'Buy' ? 'ซื้อ' : 'ขาย'}</span><span className='text-black'>{element.StockSymbol}
                      </span></div>
                    <div className='mt-4 text-black'>สถานะ : <span className='pending'>รอการยืนยัน</span></div>
                    <div className='mt-2'>ชื่อบัญชี : <span>{element.fName} {element.lName}</span></div>
                    <div className='mt-5'>เลขออเดอร์ : <span>{element.OrderID}</span></div>
                </div>
                <div>
                    <div className='text-end mt-1 text-2xl text-black font-normal'>จำนวน : <span> {element.Volume} หุ้น</span></div>
                    <div className='mt-4 text-end'>ณ ว้นที่ <span> {element.OrderDateTime.replace('T', ' ').replace('.000Z', '')}</span></div>
                    <div className='text-end mt-12'>
                        คำสั่งยืนยัน<button className='button green' onClick={handleSubmit} value = {index}>ตกลง</button>
                    </div>
                </div>


            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StaffOrder
