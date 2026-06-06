import Banner from './components/Banner'
import HeroBanner from './components/HeroBanner'
import HowItWorks from './components/HowItWorks'
import ReachMoreCustomers from './components/ReachMoreCustomers'
import ServicesPage from './components/ServicesPage'

const Home = () => {
  return (
    <div>
      <Banner />
      <ServicesPage/>
      <ReachMoreCustomers/>
      <HowItWorks/>
      <HeroBanner/> 
    </div>
  )
}

export default Home
