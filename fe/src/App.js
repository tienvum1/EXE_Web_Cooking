import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import DetailRecipe from "./pages/detailRecipe/DetailRecipe";
import Blog from "./pages/blog/Blog";
import BlogDetail from "./pages/blogDetail/BlogDetail";
import FeedbackForm from "./pages/feedback/FeedbackPage";
import RecipePage from "./pages/recipe/RecipePage";
import AboutPage from "./pages/about/AboutPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import CreateRecipe from "./pages/recipe/CreateRecipe";
import MenuSuggestion from "./pages/menuSuggestion/MenuSuggestion";
import MenuSuggestionResult from "./pages/menuSuggestion/MenuSuggestionResult";
import ProfilePage from "./pages/profilePage/ProfilePage";
import SettingPage from "./pages/settingPage/SettingPage";
import BMIPage from './pages/tools/BMIPage';
import WeightPage from './pages/tools/WeightPage';
import BmrTdeePage from './pages/tools/BmrTdeePage';
import TopupModal from "./pages/wallet/StripeTopupModal.jsx";
import TransactionHistory from './pages/transasctionPage/TransactionHistory.jsx';
import NotificationPage from './pages/notification/NotificationPage';
import SavedRecipesPage from './pages/recipePages/SavedRecipesPage.jsx';
import AllRecipesPage from './pages/recipePages/AllRecipesPage.jsx';
import DraftRecipesPage from './pages/recipePages/DraftRecipesPage.jsx';
import PublishedRecipesPage from './pages/recipePages/PublishedRecipesPage.jsx';
import AdminPage from './pages/admin/AdminPage';
import CreateBlogPage from './pages/admin/CreateBlogPage';
import AdminRecipeApprovalPage from './pages/admin/AdminRecipeApprovalPage';
import AdminRecipeDetailApprovalPage from './pages/admin/AdminRecipeDetailApprovalPage';
import AdminWithdrawalsPage from './pages/admin/AdminWithdrawalsPage';
import AdminLayout from './layouts/AdminLayout';
import ChatBot from './components/sidebar/ChatBot';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import SetPasswordPage from './pages/auth/SetPasswordPage';
import ChangePasswordPage from './pages/settingPage/ChangePasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import WithdrawalPage from './pages/withdrawal/WithdrawalPage';
import PendingUserRecipesPage from './pages/recipePages/PendingUserRecipesPage.jsx';
import AdminBlogManagementPage from './pages/admin/AdminBlogManagementPage.jsx';
import AdminEditBlogPage from './pages/admin/AdminEditBlogPage.jsx';
import AdminProtectedRoute from './components/AdminProtectedRoute/AdminProtectedRoute.jsx';

  

import "./App.css";

// Log environment variables on startup
console.log('Frontend environment variables:', process.env); // Log all process.env
console.log('REACT_APP_BACKEND_URL:', process.env.REACT_APP_BACKEND_URL); // Log the specific variable

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/detail-recipe/:id" element={<DetailRecipe />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog-detail/:id" element={<BlogDetail />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu-suggestion" element={<MenuSuggestion />} />
        <Route path="/menu-suggestion/result" element={<MenuSuggestionResult />} />
        <Route path="/recipes/create" element={<CreateRecipe />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/tools/bmi" element={<BMIPage />} />
        <Route path="/tools/weight" element={<WeightPage />} />
        <Route path="/tools/bmr-tdee" element={<BmrTdeePage />} />
        <Route path="/wallet/topup" element={<TopupModal />} />
        <Route path="/wallet/history" element={<TransactionHistory />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/recipes-saved" element={<SavedRecipesPage />} />
        <Route path="/all-recipes" element={<AllRecipesPage />} />
        <Route path="/draft-recipes" element={<DraftRecipesPage />} />
        <Route path="/published-recipes" element={<PublishedRecipesPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/settings/change-password" element={<ChangePasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/withdrawal" element={<WithdrawalPage />} />
        <Route path="/pending-recipes"  element ={<PendingUserRecipesPage/>} />
        
        <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route
            index
            element={<AdminLayout><AdminPage /></AdminLayout>}
          />
          <Route
            path="create-blog"
            element={<AdminLayout><CreateBlogPage /></AdminLayout>}
          />
          <Route
            path="blogs"
            element={<AdminLayout><AdminBlogManagementPage /></AdminLayout>}
          />
          <Route
            path="blogs/edit/:id"
            element={<AdminLayout><AdminEditBlogPage /></AdminLayout>}
          />
          <Route
            path="recipes/pendings"
            element={<AdminLayout><AdminRecipeApprovalPage /></AdminLayout>}
          />
          <Route
            path="recipes/:id"
            element={<AdminLayout><AdminRecipeDetailApprovalPage /></AdminLayout>}
          />
          <Route
            path="withdrawals"
            element={<AdminLayout><AdminWithdrawalsPage /></AdminLayout>}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ChatBot />
    </>
  );
}

export default App;
