import SEO from "../../components/SEO";
import Banner from './components/Banner'
import HeroBanner from './components/HeroBanner'
import HowItWorks from './components/HowItWorks'
import ReachMoreCustomers from './components/ReachMoreCustomers'
import ServicesPage from './components/ServicesPage'

const Home = () => {
  return (
    <div>
      <SEO title="Local & Weekend Side Jobs | Flexible Side Hustles Near You" description="Find local side jobs, weekend side hustles, and flexible gigs near you. Make money locally or from home with easy weekend side jobs on SideGurus." />
      <Banner />
      <ServicesPage/>
      <ReachMoreCustomers/>
      <HowItWorks/>
      <HeroBanner/> 
    </div>
  )
}

export default Home
