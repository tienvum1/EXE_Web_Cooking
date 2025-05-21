import { Routes, Route } from "react-router-dom";
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

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/detail-recipe/:id" element={<DetailRecipe />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog-detail/:id" element={<BlogDetail />} />
      <Route path="/feedback" element={<FeedbackForm />} />
      <Route path="/recipes" element={<RecipePage />} />
      <Route path="/recipes/create" element={<CreateRecipe />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/menu-suggestion" element={<MenuSuggestion />} />
      <Route path="/menu-suggestion/result" element={<MenuSuggestionResult />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingPage />} />
      <Route path="/tools/bmi" element={<BMIPage />} />
<Route path="/tools/weight" element={<WeightPage />} />
<Route path="/tools/bmr-tdee" element={<BmrTdeePage />} />
    </Routes>
  );
}

export default App;
