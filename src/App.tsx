import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/main.css";

import Home from "./pages/Home";
import AboutPage from "./pages/About";
import Product from "./pages/Product";
import Contact from "./pages/Contact";
import ScrollToTop from "./components/ScrollTop";
import ComingSoonPage from "./pages/ComingSoon";
import TermsAndConditions from "./pages/TermsConditions";
import SignIn from "./pages/SignIn";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import { useAuthStore } from "./stores/useAuthStore";
import RefreshPrompt from "./components/RefreshPrompt";

function App() {
  const hydrateTokens = useAuthStore((s) => s.hydrateTokens);
  const setShowPrompt = useAuthStore((s) => s.setShowRefreshPrompt);
  const accessToken = useAuthStore((state) => state.accessToken);
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    hydrateTokens();

    const accessTokenTime = localStorage.getItem("accessTokenTime");
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;

    if (accessTokenTime && now - Number(accessTokenTime) > fifteenMinutes) {
      setShowPrompt(true);
    }
    useAuthStore.getState().hydrateTokens();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/product" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/coming-soon" element={<ComingSoonPage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route
          path="/employee-portals"
          element={accessToken ? <EmployeeDashboard /> : <SignIn />}
        />
      </Routes>
    </Router>
  );
}

export default App;
