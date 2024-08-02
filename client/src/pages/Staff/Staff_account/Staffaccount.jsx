import "./Staffaccount.css"
import '../../Customer/useraccpage/Useraccpage.css'
import Navbar from "../../../components/Navbar/login"

function Staffaccount() {
  return (
    <div className="staff-account-container">
      <Navbar />
      <div className='form shadow-lg shadow-gray-500 mx-auto relative bounce'>
            <div className='batch theme2 w-52 h-10 text-white text-center flex text-xl justify-center items-center shadow-md shadow-gray-700'>บัญชี Staff<consultance></consultance></div>
            <div className='w-auto h-64 theme1 px-16 py-8'><p className='font-light text-3xl text-white pt-6'>ชัชนันท์ บุญพา</p><p className='font-light text-sm'>เลขที่บัญชี 123456789</p><p className='font-light text-sm text-opacity-5 pt-8'>Broker : InnovestX</p></div>
            <div className='w-auto h-8 theme1 bar'></div>
            <div className='text-black text-2xl font-medium px-16 pt-5 pb-6 flex justify-start items-center'>ข้อมูลส่วนตัว
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
            </svg>
            </div>
            <div className='px-16 grid grid-cols-3 gap-x-8'>
                    <p className='text-xs font-extralight text-left'>ชื่อ</p>
                    <p className='text-xs font-extralight text-left'>นามสกุล</p>
                    <p className='text-xs font-extralight text-left'>ธนาคาร</p>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'></div>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'></div>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'></div>
            </div>
            <div className='px-16 grid grid-cols-12 pt-8 gap-8'>
                <div className='col-span-3'>
                    <p className='text-xs font-extralight text-left'>วัน/เดือน/ปีเกิด</p>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'></div>
                </div>
                <div className='col-span-4'>
                    <p className='text-xs font-extralight text-left'>เบอร์โทรศัพท์</p>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'></div>
                </div>   
                <div className='col-span-5'>
                    <p className='text-xs font-extralight text-left'>E-mail</p>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'></div>
                </div>
            </div>
            <div className='px-16 pt-8 grid grid-cols-1'>
                    <p className='text-xs font-extralight text-left'>ที่อยู่</p>
                    <div className='textbox bg-white text-black flex justify-start items-center pl-2 pr-2 shadow-md shadow-gray-400'></div>
            </div>
      </div>
    </div>
  )
}

export default Staffaccount
