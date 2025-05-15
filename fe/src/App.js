import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import DetailRecipe from "./pages/detailRecipe/DetailRecipe";
import Blog from "./pages/blog/Blog";
import BlogDetail from "./pages/blogDetail/BlogDetail";
import FeedbackForm from "./components/feedback/FeedbackForm";
import RecipePage from "./pages/recipe/RecipePage";
import AboutPage from "./pages/about/AboutPage";


import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/detail-recipe" element={<DetailRecipe />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog-detail" element={<BlogDetail />} />
      <Route path="/feedback" element={<FeedbackForm />} />
      <Route path="/recipes" element={<RecipePage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}

export default App;
