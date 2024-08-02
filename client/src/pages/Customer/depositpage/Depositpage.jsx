import'./Depositpage.css'
import Navbar from '../../../components/Navbar/login'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState} from 'react'
import Swal from 'sweetalert2'
import Cookies from "js-cookie";
import axios from 'axios';


function Deposit_p() {
  const param = useLocation()
  const navigate = useNavigate()
  const [Data, setData] = useState({"Amounts" : 0})
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  


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

  const handleChange = (event) => {
    const value = event.target.value;
    if(value >= 0){
      setData(values => ({...values, 'Amounts': value}))
    }else{
      Toast.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาดขี้นกรุณาใส่ใหม่',
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    Swal.showLoading()
    if(Data.Amounts != 0){
      try {
          const res = await axios.post('http://127.0.0.1:5000/api/customerMake/makePayment/', Data)
          console.log(res.status)
          Swal.fire({
            title: 'ฝากเงินสำเร็จ',
            text: 'ฝากเงินจำนวน ' + formatter.format(Data.Amounts) + " แล้ว",
            icon: 'success',
            confirmButtonText: 'ตกลง'
          }, navigate("/account"))
      
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

  useEffect(() => {
    if(param.state == null){
      navigate('/account')
    }else{
      setData({'cookies': Cookies.get('user-auth'), 'Amounts': 0, 'Types': 'Deposit', 'AccountBalance': param.state.userViewData.AccountBalance})
    }
  },[])


  return (
    <div className='deposit_container'>
        {param.state != undefined ? <>
        <Navbar />
        <div className='bounce forms shadow-lg shadow-gray-500 border-b-8 border-zinc-800 mx-auto relative'>
          <div className='batch green w-36 h-10 text-xl text-white text-center flex justify-center items-center shadow-md shadow-gray-700'>ฝากเงิน</div>
          <div className='w-auto h-52 theme1 pl-16'><p className='font-light text-3xl text-white pt-12'>{param.state.userViewData.fName} {param.state.userViewData.lName}</p><p className='font-light text-sm'>เลขที่บัญชี {param.state.userViewData.AccountNo}</p><p className='font-light text-sm text-opacity-5 pt-10'>Broker : InnovestX</p></div>
          <div className="h-80 mt-10 mb-8 px-20 flex flex-col justify-start">
              <div className="text-black text-xl mt-5">จำนวนเงินในบัญชี {param.state.userViewData.BankAccount}</div>
              <div className="flex justify-between px-10 my-6 text-3xl text-green-500 font-bold"><span className='font-bold'>{param.state.userViewData.AccountBalance}</span>USD</div>
              <div className="label mt-10">
                  <span className="login-label">กรอกจำนวนเงินที่ต้องการฝาก</span>
              </div>
              <input value={Data.Amounts || " "} onChange={handleChange} type="number" name="Amounts" id="Username" placeholder="100.00 USD" data-theme="light" className="input mt-5 input-bordered input-success w-full" />
              <div className="mt-2">ระบุราคาที่ต้องการซื้อขั้นต่ำ 1 USD สูงสุดไม่เกิน 100,000 USD</div>
          </div>
          <a onClick={handleSubmit}  className='green w-52 h-12 text-white text-xl text-center ok shadow-md shadow-gray-700 flex justify-center items-center cursor-pointer'>ยืนยันการฝากเงิน</a>
        </div>
        </> : <></>}
    </div>
  )
}

export default Deposit_p