
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import Header from '../components/Navbar';
import Testimonial from '../components/Testimonial';
import Download from '../components/DownloadApp';

const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <AboutSection />
      <Download />
      <Testimonial />
      <Footer />
    </>
  );
};

export default Home;
