import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./components/About";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
