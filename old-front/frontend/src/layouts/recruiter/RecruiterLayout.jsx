import {Navbar} from "../../components/recruiter/NavBar"
import Footer from '../../components/recruiter/Footer'
import { Outlet } from 'react-router-dom'


const RecruiterLayout = () => {
  return (
    <>
    <Navbar />
    <Outlet/>
    <Footer />
    </>
  )
}

export default RecruiterLayout
