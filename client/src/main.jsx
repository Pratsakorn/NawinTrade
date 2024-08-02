import './index.css';
import ReactDOM from 'react-dom/client'
import 'sweetalert2/src/sweetalert2.scss'
import { Navigate, Routes, Route, BrowserRouter } from "react-router-dom";

import Deposit_p from './pages/Customer/depositpage/Depositpage.jsx';
import Withdraw_p from './pages/Customer/withdrawpage/Withdrawpage.jsx';
import Useracc_p from './pages/Customer/useraccpage/Useraccpage.jsx';

import Loginpage from './pages/loginpage/Loginpage.jsx';
import Stockview from './pages/Customer/Stockview/Stockview.jsx';
import BuyStock from './pages/Customer/Buy_Stock/BuyStock.jsx';
import SellStock from './pages/Customer/Sell_Stock/SellStock.jsx';
import Userportfolio from './pages/Customer/User_portfolio/Userportfolio.jsx';
import Payment_history from './pages/Customer/payment_history/Payment_history.jsx';
import Consultaccount from './pages/Consultance/Consult_account/Consultaccount.jsx';
import Consultportfolio from './pages/Consultance/Consult_customer_portfolio/Consultportfolio.jsx';
import Staffaccount from './pages/Staff/Staff_account/Staffaccount.jsx';
import Staffaddstock from './pages/Staff/staff_add_stock/staffaddstock.jsx';
import Stafforder from './pages/Staff/staff_order/stafforder.jsx';
import StaffDashboard from './pages/Staff/staff_dashboard/StaffDashboard.jsx';
import Dca from './pages/Customer/dca/dca.jsx';
import DcaView from './pages/Customer/dca_view/DcaView.jsx';
import Tradhist from './pages/Customer/trading_history/Trading_history.jsx';
import LoginStaff from './pages/Staff/LoginStaff/LoginStaff.jsx';
import StaffOrder from './pages/Staff/staff_order/stafforder.jsx'
import LoginConsultant from './pages/Consultance/LoginConsultant/LoginConsultant.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace={true} />}/>
      <Route path='/login' element={<Loginpage   />}/> 
      <Route path='/deposit' element={<Deposit_p   />}/> 
      <Route path='/withdraw' element={<Withdraw_p   />}/> 
      <Route path='/account' element={<Useracc_p   />}/> 
      <Route path='/stockview/:symbol' element={<Stockview   />}/> 
      <Route path='/buystock' element={<BuyStock />} />
      <Route path='/sellstock' element={<SellStock />} />
      <Route path='/portfolio' element={<Userportfolio />} />
      <Route path='/dca' element={<Dca />} />
      <Route path='/dcaview' element={<DcaView />} />
      <Route path='/paymenthistory' element={<Payment_history />} />
      <Route path='/tradinghistory' element={<Tradhist />} />
      <Route path='/consultaccount' element={<Consultaccount />}/>
      <Route path='/consultportfolio' element={<Consultportfolio />}/>
      <Route path='/loginConsultant' element = {<LoginConsultant/>} />
      <Route path='/staffaccount' element={<Staffaccount />}/>
      <Route path='/staffaddstock' element={<Staffaddstock />}/>
      <Route path='/stafforder' element={<Stafforder />}/>
      <Route path='/staffdashboard' element={<StaffDashboard />}/>
      <Route path='/tradehistory' element={<Tradhist />}/>
      <Route path='/loginStaff' element={<LoginStaff/ >}/>
      <Route path='/staffOrder' elemnent={<StaffOrder/>}/>
      <Route path='*' element={<Navigate to="/Stockview/AAPL" replace={true} />}/>
    </Routes>
  </BrowserRouter>,
)
