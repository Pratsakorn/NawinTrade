import './dca.css'
import Navbar_Login from '../../../components/Navbar/login'
import { useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import Swal from "sweetalert2";

    
function Dca(){
    const [Data, setData] = useState({"StockSymbol" : "", "Amounts" : 0, "providedDayOfMonth" : 0, "EndDate" : "" , "cookies" : Cookies.get('user-auth')})
    
    const handleChange = (event) => {
        const name = event.target.name; 
        const value = event.target.value;
        if(name == "Amounts" || name == "providedDayOfMonth"){
            setData(values => ({...values, [name]: Number(value)}))
        }else{
            setData(values => ({...values, [name]: value}))

        }
    }

    console.log(Data)

    const handleSubmit = async (event) => {
        event.preventDefault();
        Swal.showLoading()
        if(Data.Amounts > 0 && Data.StockSymbol != null && Data.providedDayOfMonth > 0 && Data.EndDate != null){
          try {
              const res = await axios.post('http://127.0.0.1:5000/api/customerMake/makeDCA/', Data)
              console.log(res)
              Swal.fire({
                title: 'ยืนยันคำสั่งสำเร็จ',
                text: "เพิ่ม stock เรียบร้อย",
                icon: 'success',
                confirmButtonText: 'ตกลง'
              })
          } catch(error) {
              console.log(error);
            }
        }else{
            console.log('error')
            Swal.fire({
              title: 'กรุณากรอกข้อมูลให้ครบ',
              icon: 'error',
              confirmButtonText: 'ตกลง'
            })
        }
      }
      
    return (
        <div className='dca_container'>
            <Navbar_Login />
            <div className='bounce forms shadow-lg shadow-gray-500 border-b-8 border-zinc-800 mx-auto relative'>
                <div className='absolute top-5 -left-1 theme2 w-44 h-10 text-white text-center text-xl flex justify-center items-center shadow-md shadow-gray-700 rounded-sm'>การตั้งค่า DCA</div>
                <div className='absolute top-5 left-48 w-34 h-10 flex justify-center items-center'>
                    <a href="/dcaview">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
                            <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
                        </svg>
                    </a>
                <span className='text-2xl'>การ DCA ของฉัน</span>
                </div>
                <div className='w-auto h-36 theme1 pl-16 mb-3 pt-4'><p className='font-light text-sm text-opacity-5 pt-16'>ตั้งค่า Dollar - Cost Averaging (รายเดือน) แบบกำหนดเอง</p></div>
                    <div className='px-20 pt-10 grid grid-rows-2 gap-y-14'>
                        <div>
                            <p className='text-black font-normal'>เลือกหุ้นที่ต้องการ DCA</p>
                            <input value={Data.StockSymbol || ""} onChange={handleChange} name='StockSymbol' type="text" placeholder="Type here" className="input text-black input-bordered input-success w-full h-12 bg-white" />
                        </div>
                        <div>
                            <p className='text-black font-normal'>ระบุจำนวนเงิน</p>
                            <div className='relative'><input value={Data.Amounts || ""} onChange={handleChange} name='Amounts' type="number" placeholder="0.00" className="input input-bordered input-success w-full h-12 bg-white" /><p className='text-black absolute top-3 right-3'>USD</p></div>
                        </div>
                    </div>
                    <div className='pt-16 px-20 grid grid-cols-2 gap-x-8'>
                        <div>
                            <p className='text-black font-normal'>วันที่</p>
                            <input value={Data.providedDayOfMonth || ""} onChange={handleChange} name='providedDayOfMonth' type="number" placeholder="Ex. 1" className="input input-bordered input-success w-full h-12 bg-white" style={{width : "100%"}}/>
                        </div>
                        <div>
                            <p className='text-black font-normal'>วันสิ้นสุด</p>
                            <input value={Data.EndDate || "2024-05-23"} onChange={handleChange} name='EndDate' type="date" placeholder="Type here" className="input input-bordered input-success w-full h-12 bg-white" style={{width : "100%"}}/>
                        </div>
                    </div>
                <a onClick={handleSubmit}  className='theme1 cursor-pointer w-52 h-12 text-xl text-white text-center ok shadow-md shadow-gray-700 flex justify-center items-center'>ยืนยันการตั้งค่า</a>
            </div>
        </div>

    )
}

export default Dca