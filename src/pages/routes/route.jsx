import { AboutUs } from "../component/aboutUs/aboutUs";
import { BlogsCard } from "../component/blogs/blogsCard";
import { BlogsDetails } from "../component/blogs/blogsDetail/blogsDetails";
import { BlogsMultiCards } from "../component/blogs/blogsmultiCard/blogsMultiCards";
import { ChooseUs } from "../component/chooseUs/chooseUs";
import { Success } from "../component/confirmationPage/Success";
import { ContactUs } from "../component/contactUs/contactUs";
import { DrawerBar } from "../component/drawer/drawer";
import { FaqMainPage } from "../component/faqs/FaqMian/faqMainPage";
import FrontPage from "../component/frontPage";
// import ResponsiveDrawer from "../backEnd/appBar/mainComponent";
// import { BuyForm } from "../backEnd/buyForm/buyForm";
// import CrudOperation from "../backEnd/CrudSystem/crudOperation";
// import { Monthly } from "../backEnd/extraChargesForm/monthly/monthly";
// import { OneTime } from "../backEnd/extraChargesForm/oneTime/oneTime";
import { Home } from "../backEnd/home";
// import ProfilePage from "../backEnd/profile/profile";
// import { SellForm } from "../backEnd/sellForm/sellForm";


//---------------------------------------------------------
import { AdminProfilePage } from "../Admin/profile/AdminProfile";
import { Adminlogin } from "../Admin/loginPage/adminlogin";
import { Admin } from "../Admin/admin";
import { AdminMain } from "../Admin/appBar/adminMain";
// import BrokerForm from "../backEnd/brokerForm/brokerForm";
// import BrokerList from "../backEnd/brokerForm/brokerList/brokerList";
// import { DashboardView } from "../backEnd/dashboardView/dashboardView";
// import { Dividen } from "../backEnd/Dividen/dividen";
// import DividenList from "../backEnd/dividenList/dividenList";
// import { EditeProfile } from "../backEnd/editeProfile/editeProfile";
// import ExtraChargesList from "../backEnd/extraChargesForm/extraChargesList/extraChargesList";
// import Holdings from "../backEnd/holdings/holdings";
// import Summary from "../backEnd/marketData/marketSummary/summary";
// import SummaryIndex from "../backEnd/marketData/marketSummaryIndex/summaryIndex";
// import SummaryDetailsPage from "../backEnd/marketData/marketSummaryIndex/summaryDetails/summaryDetailsPage";
// import { OverView } from "../backEnd/marketData/marketOverview/overview";
// import OverviewIndex from "../backEnd/marketData/marketOverviewList/overviewIndex";
// import { RuleForm } from "../backEnd/profile/Rules/rules";
// import { RulesView } from "../backEnd/RulesView/rulesView";
// import { ClosedTrades } from "../backEnd/closedTradesList/closedTradeslist";
// import { Developers } from "../backEnd/developersPage/developer";
// import DrawerLayout from "../backEnd/HomeComponents/drawerLayout";

// =================================================================

import { Broker } from "../backEnd/pages/broker";
import { Buy } from "../backEnd/pages/buy";
import { BuyAndSellList } from "../backEnd/pages/buyAndSellList";
import { ClosedTradesPage } from "../backEnd/pages/closedTradesPage";
import { DashBoard } from "../backEnd/pages/dashBoard";
import { DevelopersPage } from "../backEnd/pages/DevelopersPage";
import { DividendList } from "../backEnd/pages/dividendList";
import { Editprofile } from "../backEnd/pages/editprofile";
import { ExtraCharges } from "../backEnd/pages/extraCharges";
import { HoldingsPage } from "../backEnd/pages/holdingsPage";
import { MarketOverView } from "../backEnd/pages/marketOverView";
import { MarketOverviewList } from "../backEnd/pages/marketOverviewList";
import { MarketSummary } from "../backEnd/pages/marketSummary";
import { MarketSummaryList } from "../backEnd/pages/marketSummaryList";
import { MonthlyCharges } from "../backEnd/pages/monthlyCharges";
import { OneTimeCharges } from "../backEnd/pages/oneTimeCharges";
import { Profile } from "../backEnd/pages/profile";
import { Sell } from '../backEnd/pages/sell'
import { BrokerListPage } from "../backEnd/pages/brokerList";
import { DividendPage } from "../backEnd/pages/dividendPage";
import { Rules } from "../backEnd/pages/rules";
import { RulesViewPage } from "../backEnd/pages/rulesViewPage";
import { TradingJournalPage } from "../backEnd/pages/tradingJournal";
import { TradingJournal_Form } from "../backEnd/pages/tradingJournal_form";
import { TradingJournal_Edit } from "../backEnd/pages/tradingJournal_Edit";
import { TradingJournal_View } from "../backEnd/pages/tradingJournal_View";
import { SummaryDetailsPg } from "../backEnd/pages/summaryDetails";


export const routes = [
  { path: '/', element: <Home /> },
  { path: '/profile', element: <Profile /> },
  { path: '/buyForm', element: <Buy /> },
  { path: '/sellForm', element: <Sell /> },
  { path: '/crudOperation', element: <BuyAndSellList /> },
  { path: '/onetime', element: <OneTimeCharges /> },
  { path: '/monthly', element: <MonthlyCharges /> },
  { path: '/BrokerForm', element: <Broker /> },
  { path: '/BrokerList', element: <BrokerListPage /> },
  { path: '/Dashboard', element: <DashBoard /> },
  { path: '/Dividend', element: <DividendPage /> },
  { path: '/DividenList', element: <DividendList /> },
  { path: '/Editprofile', element: <Editprofile /> },
  { path: '/ExtraChargesList', element: <ExtraCharges /> },
  { path: '/Holdings', element: <HoldingsPage /> },
  { path: '/Summary', element: <MarketSummary /> },
  { path: '/SummaryIndex', element: <MarketSummaryList /> },
  { path: '/Summary/Details-Page', element: <SummaryDetailsPg /> },
  { path: '/OverView', element: <MarketOverView /> },
  { path: '/OverviewIndex', element: <MarketOverviewList /> },
  { path: '/RuleForm', element: <Rules /> },
  { path: '/RulesView', element: <RulesViewPage /> },
  { path: '/ClosedTrades', element: <ClosedTradesPage /> },
  { path: '/Developers', element: <DevelopersPage /> },
  { path: '/Trding-journal/list', element: <TradingJournalPage /> },
  { path: '/Trding-journal/form', element: <TradingJournal_Form /> },
  { path: '/Trding-journal/edit', element: <TradingJournal_Edit /> },
  { path: '/Trding-journal/view', element: <TradingJournal_View /> },




  // { path: '/DrawerLayout', element: <DrawerLayout /> },

  // ==========================================

  { path: '/frontPage', element: <FrontPage /> },
  // { path: '/responsiveDrawer', element: <ResponsiveDrawer /> },
  { path: '/blogsMultiCards', element: <BlogsMultiCards /> },
  { path: '/blogsDetails', element: <BlogsDetails /> },
  { path: '/faqMainPage', element: <FaqMainPage /> },
  { path: '/drawerBar', element: <DrawerBar /> },
  { path: '/blogsCard', element: <BlogsCard /> },
  { path: '/chooseUs', element: <ChooseUs /> },
  { path: '/contactUs', element: <ContactUs /> },

  // ===========================================

  { path: '/aboutUs', element: <AboutUs /> },
  { path: '/success', element: <Success /> },

  // ============================================

  { path: '/admin', element: <Admin /> },
  { path: '/adminProfile', element: < AdminProfilePage /> },
  { path: '/adminMain', element: < AdminMain /> },
  { path: '/login', element: < Adminlogin /> },








];
