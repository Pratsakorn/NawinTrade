import'./Useraccpage.css'
import Navbar_Login from '../../../components/Navbar/login'
import { useEffect, useState } from "react"
import axios from "axios";
import  { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'

function Useracc_p() {
    const [data] = useState({'cookies': Cookies.get('user-auth')})
    const navigate = useNavigate()
    
    const [userViewData, setData] = useState()
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

    useEffect(()=> {
      const getData = async() => {
        try {
          const res = await axios.post('http://127.0.0.1:5000/api/customerView/profile', data)
          console.log(res.status)
          if(res.status != 200){
            navigate("/login")
          }
          setData(res.data)
          //console.log(res.data)
          
        } catch (error) {
          console.log(error)
          Toast.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาดกรุณา login',
          })
          navigate("/login")
        }
      }
    getData()
    }, [])
    console.log(userViewData)

  return (
    <div className='acc_container'>
        {userViewData == undefined ? 
        <div className="loading-container">
          <span className="loading loading-bars loading-sm text-accent"></span>
        </div>
        :
        <>
        <Navbar_Login />
        <div className='form shadow-lg shadow-gray-500 mx-auto relative bounce'>
            <div className='batch theme2 w-36 h-10 text-white text-center flex text-xl justify-center items-center shadow-md shadow-gray-700'>บัญชีของฉัน</div>
            <div className='w-auto h-64 theme1 px-16 py-8'><p className='font-light text-3xl text-white pt-6'>{userViewData.fName} {userViewData.lName}</p><p className='font-light text-sm'>เลขที่บัญชี {userViewData.AccountNo}</p><p className='font-light text-sm text-opacity-5 pt-8'>Broker : {userViewData.BrokerName}</p><p className='font-bold text-sm text-white pt-8'>เลือกรายการ</p></div>
            <div className='circle-frame rounded-full theme2 flex justify-center items-center circle'><div className='circle-inner rounded-full theme1'><p className='text-lg text-white flex justify-center items-center pt-10'>ยอดเงินทั้งหมด</p><p className='text-3xl text-white font-bold flex justify-center items-center pt-7'>{formatter.format(userViewData.AccountBalance)}</p><p className='text-md flex justify-center items-center pt-1'>USD</p></div></div>
            <div className='w-auto h-8 theme1 bar'></div>
            <div className='relative'>
                <div className='absolute -top-12 left-16 grid grid-cols-4 gap-x-3'>
                    <a onClick={() => navigate("/deposit", {state:{userViewData}})} className='w-9 h-9 green flex justify-center items-center cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-person-fill-up" viewBox="0 0 16 16" style={{ fill: 'white' }}>
                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708L13 11.707V14.5a.5.5 0 0 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                    </svg>
                    </a>
                    <a onClick={() => navigate("/withdraw", {state:{userViewData}})}  className='w-9 h-9 red flex justify-center items-center cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-person-fill-down" viewBox="0 0 16 16" style={{ fill: 'white' }}>
                    <path d="M12.5 9a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7m.354 5.854 1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V10.5a.5.5 0 0 0-1 0v2.793l-.646-.647a.5.5 0 0 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                    </svg>
                    </a>
                    <a onClick={() => navigate("/paymenthistory", {state:{userViewData}})} className='w-9 h-9 bg-blue-500 flex justify-center items-center cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-clock-history" viewBox="0 0 16 16" style={{ fill: 'white' }}>
                    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
                    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                    </a>
                    <a onClick={() => navigate("/tradinghistory", {state:{userViewData}})} className='w-9 h-9 bg-indigo-500 flex justify-center items-center cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cash-coin" style={{ fill: 'white' }} viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"/>
                    <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z"/>
                    <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083q.088-.517.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z"/>
                    <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 6 6 0 0 1 3.13-1.567"/>
                    </svg>
                    </a>
                    <p className='text-black text-xs font-extralight text-center'>ฝากเงิน</p>
                    <p className='text-black text-xs font-extralight text-center'>ถอนเงิน</p>
                    <p className='text-black text-xs font-extralight text-center'>ประวัติ</p>
                    <p className='text-black text-xs font-extralight text-center'>ซื้อขาย</p>
                </div>
            </div>
            <div className='text-black text-2xl font-medium px-16 pt-5 pb-6 flex justify-start items-center'>ข้อมูลส่วนตัว
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
            </svg>
            </div>
            <div className='px-16 grid grid-cols-3 gap-x-8'>
                    <p className='text-xs font-extralight text-left'>ชื่อ</p>
                    <p className='text-xs font-extralight text-left'>นามสกุล</p>
                    <p className='text-xs font-extralight text-left'>ธนาคาร</p>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'>{userViewData.fName}</div>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'>{userViewData.lName}</div>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'>{userViewData.BankAccount}</div>
            </div>
            <div className='px-16 grid grid-cols-12 pt-8 gap-8'>
                <div className='col-span-3'>
                    <p className='text-xs font-extralight text-left'>ปี/เดือน/วันเกิด</p>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'>{userViewData.DOB.replace("T", " ").replace(
                            ".000Z",
                            ""
                          ).split(' ')[0]}</div>
                </div>
                <div className='col-span-4'>
                    <p className='text-xs font-extralight text-left'>เบอร์โทรศัพท์</p>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'>{userViewData.Phone}</div>
                </div>   
                <div className='col-span-5'>
                    <p className='text-xs font-extralight text-left'>E-mail</p>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'>{userViewData.Email}</div>
                </div>
            </div>
            <div className='px-16 pt-8 grid grid-cols-1'>
                    <p className='text-xs font-extralight text-left'>ที่อยู่</p>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'>{userViewData.Address}</div>
            </div>
            <div className='px-16 grid grid-cols-12 pt-8 gap-8'>
              <div className='col-span-3'>
                    <p className='text-xs font-extralight text-left'>ชื่อที่ปรึกษาการลงทุน</p>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'>{userViewData.cfName}</div>
                </div>
                <div className='col-span-3'>
                    <p className='text-xs font-extralight text-left'>นามสกุลที่ปรึกษาการลงทุน</p>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'>{userViewData.clName}</div>
                </div>
                <div className='col-span-2'>
                    <p className='text-xs font-extralight text-left'>เบอร์โทรศัพท์ที่ปรึกษาการลงทุน</p>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'>{userViewData.cPhone}</div>
                </div>   
                <div className='col-span-4'>
                    <p className='text-xs font-extralight text-left'>E-mail ที่ปรึกษาการลงทุน</p>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'>{userViewData.cEmail}</div>
                </div>
            </div>
        </div>
        </>}
    </div>
  )
}

export default Useracc_p