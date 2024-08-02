import axios from 'axios';
import'./login.css'
import { useState } from 'react'
import  { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'


function Navbar_Login(){
        const[click, setClick] = useState(false)
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
        
        const handleClick = () => {
                setClick(!click);
                console.log(click)
              };
        const handleSignOut = async() => {
                const  res = await axios.post('http://localhost:5000/api/auth/signout/', {}, {withCredentials: true})
                console.log(res)
                if (res.status==200) {
                        Toast.fire({
                                icon: 'warning',
                                title: 'logout ออกจากระบบสำเร็จ',
                              })
                        navigate("/login")
                }
        }
  return(
  <div className='navbar border-b-2 border-black'>
        <div className='flex justify-between w-full px-10'>
            <div>
                <button><b><a className='nt_logo font-bold'>Nawin Trade</a></b></button>
                <button><a href='/stockview/AAPL' className='menu'>ซื้อขายหุ้น</a></button>
                <button><a href='/dca' className='menu'>DCA หุ้น</a></button>
                <button><a className='menu'>ข่าวสาร</a></button>
                <button><a className='menu'>เกี่ยวกับเรา</a></button>
        </div>
        <div className='flex text-center'>
                <div className='w-6 h-6 profile_border rounded-full text-black flex justify-center items-center mr-3'>N</div>
                <div className='w-auto h-6 user_border rounded-3xl text-white flex justify-center items-center mr-3 px-3'>Nawin Tosilanon</div>
                <div className='w-10 h-6 state rounded-3xl text-white flex justify-center items-center hover:bg-zinc-800'><button onClick={handleClick}>•••</button></div>
        </div>
        </div>
        {click ? 
        <div className='drops bg-zinc-800 flex-col'>
                <div className="drops-hand bg-zinc-800"></div>
                <div className='p-3 text-white text-center border-white hover:border-b'><a href='/account'>บัญชีของฉัน</a></div>
                <div className='p-3 text-white text-center border-white hover:border-b'><a href='/portfolio'>Portfolio ของฉัน</a></div>
                <div className='p-3 text-white text-center border-white hover:border-b'><a onClick={handleSignOut}>ออกจากระบบ</a></div>
        </div>:<></>
        }
  </div>
  )}
  export default Navbar_Login