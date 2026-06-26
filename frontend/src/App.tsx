import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from "chart.js";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Crop from "./pages/Crop";
import Yield from "./pages/Yield";
import Soil from "./pages/Soil";
import Pca from "./pages/Pca";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/crop" element={<Crop />} />
          <Route path="/yield" element={<Yield />} />
          <Route path="/soil" element={<Soil />} />
          <Route path="/pca" element={<Pca />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
