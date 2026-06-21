import SEO from "../../components/SEO";
import AboutUs from './components/AboutUs';
import WhyChoose from './components/Whychoose';
import PricingCards from './components/Pricingcards';
import HowItWorks from '../home/components/HowItWorks';

const About = () => {
  return (
    <div>
      <SEO title="About SideGurus | Flexible Weekend Side Hustles" description="Learn how SideGurus helps you find weekend side jobs, flexible side hustles, and local gigs to make extra money." />
      <AboutUs/>
      <WhyChoose/>
      <PricingCards/>
      <HowItWorks/>
    </div>
  );
};

export default About;