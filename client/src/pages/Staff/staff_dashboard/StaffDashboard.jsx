import './StaffDashboard.css'
import Navbar_Login from '../../../components/Navbar/login'
import DashBoardGraph from '../../../components/graph/DashBoardGraph'
import Pieshard from '../../../components/graph/Pieshard.jsx'
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

function StaffDashboard() {

  const [data] = useState({ cookies: Cookies.get("staff-auth") });
  const [staffDashboardData, setStaffDashboardData] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const getData = async () => {
    try {
      console.log("abc");
      const res = await axios.post(
        "http://127.0.0.1:5000/api/staffView/staffPortfolio",
        data
      );
      console.log(res.status);

      setStaffDashboardData(res.data);
      console.log(res.data);
      //console.log(paymentList.paymentHistory[0]);
    } catch (error) {
      console.log(error);
      navigate("/login");
      Toast.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดกรุณา login",
      });
    } finally {
      setLoading(false);
    }
  };

  console.log(staffDashboardData)

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <span className="loading loading-bars loading-sm text-accent"></span>
      </div>
    );
  }

  var sumPrice = 0;
  
  for(let i = 0; i < staffDashboardData.resultByStock.length ; i++){
    sumPrice = sumPrice + staffDashboardData.resultByStock[i].currentPrice * staffDashboardData.resultByStock[i].netVolume
  }


  return (
    <div className='staff-dash-container'>
      <Navbar_Login />
      <div className="dash-box-1 relative p-10">
        <div className='absolute text-xl left-3 -top-5 w-36 h-10 rounded-sm box-shadow flex justify-center items-center theme2 text-white z-50'>Dashboard</div>
        <div className='z-0 absolute h-72 top-0 left-0 right-0 theme1'></div>
        <div className='absolute top-12 right-10 left-10 bottom-8 grid grid-cols-12 grid-rows-12 gap-5'>
          <div className=' col-span-8 row-span-10 pt-5 bg-white shadow-md'>
            <DashBoardGraph data={staffDashboardData} />
          </div>
          <div className=' col-span-2 row-span-5 color2 p-5 flex flex-col items-center'>
            <div className='text-white text-4xl pb-3'>ออเดอร์</div>
            <div className='text-white text-7xl font-bold'>104</div>
            {/* <div className='text-white pb-4 text-lg'>+0.0%</div> */}
            {/* <div className='text-white'>ณ วันที่ {staffDashboardData.resultByDate[0].orderDate.substring(0,10)}</div> */}
          </div>
          <div className=' col-span-2 row-span-10 color1 p-5 grid grid-rows-11'>
            <div className=' row-span-5 flex flex-col items-center'>
              <div className='text-white text-4xl pb-3'>จำนวนหุ้น</div>
              <div className='text-white text-7xl font-bold'>{staffDashboardData.resultByStock.length}</div>
              <div className='text-white pb-4 text-lg'>หุ้น</div>
              <div className='text-white'>จำนวนหุ้นทั้งหมดที่มี</div>
            </div>
            <div className='row-span-1 pt-5'><hr  className='text-xl'/></div>
            <div className=' row-span-5 flex flex-col items-center pt-2'>
              <div className='text-white text-4xl pb-3'>มูลค่า</div>
              <div className='text-white text-3xl font-bold mt-5 mb-4'>{formatter.format(sumPrice)}</div>
              <div className='text-white pb-4 text-lg'>USD</div>
              {/* <div className='text-white'>ณ วันที่ {staffDashboardData.resultByDate[0].orderDate.substring(0,10)}</div> */}
            </div>
          </div>
          <div className=' col-span-2 row-span-5 color3  p-5 flex flex-col items-center'>
            <div className='text-white text-4xl pb-3'>บัญชี</div>
            <div className='text-white text-7xl font-bold'>{staffDashboardData.resultByUser.length}</div>
            {/* <div className='text-white pb-4 text-lg'>+0 บัญชี</div>
            <div className='text-white'>ณ วันที่ 24 พ.ค 2567</div> */}
          </div>
          <div className=' col-span-12 row-span-2 flex gap-6'>
            <div className='text-black text-xl'>ค่าเฉลี่ยใน 1 สัปดาห์ : <span className=' text-amber-500'>$14,582.34 USD</span> </div>
            <div className='text-black'>สูงสุด : <span className=' text-green-600'>$17,843.97 USD</span></div>
            <div className='text-black'>ต่ำสุด : <span className=' text-red-600'>$1,431.65 USD</span></div>
          </div>
        </div>
      </div>
      <div className='dash-box-2 grid grid-cols-12 gap-x-10'>
        <div className='col-span-7 box-shadow p-8'>
          <div className='flex justify-between items-end'>
            <div className='text-3xl text-black'>รายชื่อหุ้นทั้งหมด</div>
            <div className='text-white'>ณ วันที่ {staffDashboardData.resultByDate[0].orderDate.substring(0,10)}</div>
          </div>
          <div className='flex justify-between mt-4'>
            <div>{staffDashboardData.resultByStock.length} รายการ</div>
            <div>all net volume</div>
          </div>
          <div className='min-w-max mt-6'>
            {/*box stock */}
            {staffDashboardData.resultByStock.map((element, index) => (
              <div key={index} className="stock-box p-4 hover:bg-gray-200">
                <a href="/stock/AAPL">
                  <div className='flex justify-between mb-3 text-2xl font-normal text-black'>
                    <div className=''><span>{element.StockSymbol}</span> <span className='text-green-600'>{formatter.format(element.currentPrice)}</span></div>
                    <div>{element.netVolume.toFixed(2)}</div>
                  </div>
                  <div className='flex  justify-between'>
                    <div className='font-light'></div>
                    <div>มูลค่าทั้งหมด <span className=''>{formatter.format(element.currentPrice * element.netVolume)}</span></div>
                  </div>
                </a>
              </div>
            ))}
            {/*box stock */}
            
          </div>
        </div>
        <div className=' col-span-5 grid grid-rows-12 gap-y-10'>
          <div className=' row-span-5 box-shadow p-8'>
            {/* <div className='text-3xl text-black'>สัดส่วนหุ้นทั้งหมด</div> */}
            <div>
              <Pieshard  data={staffDashboardData.resultByStock} />
            </div>
          </div>
          <div className=' row-span-7 box-shadow p-8'>
            <div className='text-3xl text-black'>บัญชีลูกค้า</div>
            <div className='flex justify-between mt-4'>
              
            </div>
            <div className='min-w-max mt-6'>
            {/*box account */}
            {staffDashboardData.resultByUser.map((element, index) => (
              <div key={index} className="stock-box p-4">
                  <div className='flex justify-between mb-3 font-normal text-black'>
                    <div className=''>{element.fName} {element.lName}</div>
                    <div>เลขที่บัญชี {element.AccountNo}</div>
                  </div>
                  <div className='font-light'>ธนาคาร   <span>{element.BankAccount}</span></div>
              </div>

            ))}
            {/*box account */}
            
          </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default StaffDashboard
