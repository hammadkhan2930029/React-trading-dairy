import { Home } from "../backEnd/home";
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
import { LoginPage } from "../component/login/loginPage/loginPage";
import { HowWorksPage } from "../component/how/howWorksPage/howWorksPage";
import { PrivacyPolicy } from "../component/privacyPolicy/privacypolicy";
import { TermsAndConditions } from "../component/termsAndConditions/termAndConditions";

//=================================================================

import { AdminProfilePage } from "../Admin/profile/AdminProfile";
import { Adminlogin } from "../Admin/loginPage/adminlogin";
import { Admin } from "../Admin/admin";
import { AdminMain } from "../Admin/appBar/adminMain";

// =================================================================

import { Broker } from "../backEnd/pages/broker";
import { Buy } from "../backEnd/pages/buy";
import { BuyAndSellList } from "../backEnd/pages/buyAndSellList";
import { ClosedTradesPage } from "../backEnd/pages/closedTradesPage";
import { ClosedTradeDashboardView } from "../backEnd/pages/closedTradeDashboardView";
import { DashBoard } from "../backEnd/pages/dashBoard";
import { DevelopersPage } from "../backEnd/pages/DevelopersPage";
import { Dividendindex} from "../backEnd/pages/dividendList";
import { Editprofile } from "../backEnd/pages/editprofile";
import { ExtraCharges } from "../backEnd/pages/extraCharges";
import { ExtraChargesAdd } from "../backEnd/pages/extraChargesAdd";
import { HoldingsPage } from "../backEnd/pages/holdingsPage";
import { MarketOverView } from "../backEnd/pages/marketOverView";
import { MarketOverviewList } from "../backEnd/pages/marketOverviewList";
import { MarketSummary } from "../backEnd/pages/marketSummary";
import { MarketSummaryList } from "../backEnd/pages/marketSummaryList";
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
import { BonusIndex } from "../backEnd/pages/bonusList";
import { BonusForm } from "../backEnd/pages/bonusAddForm";
import { DepositPage } from "../backEnd/pages/depositPage";
import { WithdrawalPage } from "../backEnd/pages/withdrawalPage";
import { InvestmentPage } from "../backEnd/pages/investmentPage";
import { ImportPage } from "../backEnd/pages/importPage";
import { SplitList } from "../backEnd/pages/splitList";
import { SplitForm } from "../backEnd/pages/splitForm";
import { RightSharesList } from "../backEnd/pages/rightSharesList";
import { RightSharesForm } from "../backEnd/pages/rightSharesForm";
import { PerformancePage } from "../backEnd/pages/performancePage";
import { ClosedTradesSummaryPage } from "../backEnd/pages/closedTradesSummaryPage";

export const routes = [

    // ==========ADMIN ROUTES START==========
  
    { path: '/admin', element: <Admin /> },
    { path: '/adminProfile', element: < AdminProfilePage /> },
    { path: '/adminMain', element: < AdminMain /> },
    // { path: '/login', element: < Adminlogin /> },

    // ==========ADMIN ROUTES END===========
    // ==========USER ROUTES START==========

    { path: '/dashboard', element: <DashBoard /> },
    { path: '/performance', element: <PerformancePage /> },
    { path: '/profile', element: <Profile /> },
    { path: '/Editprofile', element: <Editprofile /> },
    { path: '/holdings', element: <HoldingsPage /> },
    { path: '/buy-sell/list', element: <BuyAndSellList /> },
    { path: '/buy', element: <Buy /> },
    { path: '/sell', element: <Sell /> },
    { path: '/closed-trades', element: <ClosedTradesPage /> },
    { path: '/closed-trades/dashboard', element: <ClosedTradeDashboardView /> },
    { path: '/extra-charges/add', element: <ExtraChargesAdd /> },
    { path: '/extra-charges/list', element: <ExtraCharges /> },
    { path: '/broker/add', element: <Broker /> },
    { path: '/broker/list', element: <BrokerListPage /> },
    { path: '/dividend/add', element: <DividendPage /> },
    { path: '/dividend/list', element: <Dividendindex /> },
    { path: '/SummaryIndex', element: <MarketSummaryList /> },
    { path: '/market-summary/details', element: <SummaryDetailsPg /> },  
    { path: '/market-summary', element: <MarketSummary /> },
    { path: '/market-overview', element: <MarketOverView /> }, 
    { path: '/OverviewIndex', element: <MarketOverviewList /> },
    { path: '/RuleForm', element: <Rules /> },
    { path: '/my-rules-book', element: <RulesViewPage /> },
    { path: '/developers', element: <DevelopersPage /> },
    { path: '/trading-journal/list', element: <TradingJournalPage /> },
    { path: '/trading-journal/add', element: <TradingJournal_Form /> },
    { path: '/trading-journal/edit', element: <TradingJournal_Edit /> },
    { path: '/trading-journal/details', element: <TradingJournal_View /> },
    { path: '/bonus/list', element: <BonusIndex /> },
    { path: '/bonus/add', element: <BonusForm /> },
    { path: '/deposit', element: <DepositPage /> },
    { path: '/withdrawal', element: <WithdrawalPage /> },
    { path: '/account-balance', element: <InvestmentPage /> },
    { path: '/imports', element: <ImportPage /> },
    { path: '/split/list', element: <SplitList /> },
    { path: '/split/add', element: <SplitForm /> },
    { path: '/right-shares/list', element: <RightSharesList /> },
    { path: '/right-shares/add', element: <RightSharesForm /> },
    { path: '/summary', element: <ClosedTradesSummaryPage /> },

    // ==============USER ROUTE END==============
    // ==========FRONT PAGE ROUTE START==========

    { path: '/', element: <Home /> },
    { path: '/about-us', element: <AboutUs /> },
    { path: '/blogsCard', element: <BlogsCard /> },
    { path: '/blogs', element: <BlogsMultiCards /> },
    { path: '/blogs-details', element: <BlogsDetails /> },
    { path: '/choose-us', element: <ChooseUs /> },
    { path: '/contact-us', element: <ContactUs /> },
    { path: '/drawerBar', element: <DrawerBar /> },
    { path: '/faqs', element: <FaqMainPage /> },
    { path: '/how-works', element: < HowWorksPage/> },
    { path: '/login', element: < LoginPage/> },
    { path: '/privacy-policy', element: < PrivacyPolicy/> },
    { path: '/success', element: <Success /> },  
    { path: '/terms-&-conditions', element: <TermsAndConditions/> },

    // ==========FRONT PAGE ROUTE END==========


];
