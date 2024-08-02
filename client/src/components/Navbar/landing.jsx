import'./landing.css'
function Navbar(){
  return(
  <div className='navbar border-b-2 border-black'>
        <div className='flex justify-between w-full px-10'>
            <div>
                <button><b><a className='nt_logo font-bold'>Nawin Trade</a></b></button>
                <button><a href='/stockview/AAPL' className='menu'>ซื้อขายหุ้น</a></button>
                <button><a className='menu'>เปิดพอร์ต</a></button>
                <button><a className='menu'>ข่าวสาร</a></button>
                <button><a className='menu'>เกี่ยวกับเรา</a></button>
        </div>
        <div>
                <button><a className='menu'>เข้าสู่ระบบ</a></button>
                <button><a className='nav_btn'>สมัครสมาชิก</a></button>
        </div>
        </div>
        
  </div>
  )}
  export default Navbar