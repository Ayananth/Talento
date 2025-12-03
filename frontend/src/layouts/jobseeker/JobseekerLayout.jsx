import {Navbar} from "../../components/seeker/NavBar"
import Footer from '../../components/seeker/Footer'
import { Outlet } from 'react-router-dom'


const JobseekerLayout = () => {
  return (
    <>
    <Navbar />
    <Outlet/>
    <Footer />
    </>
  )
}

export default JobseekerLayout
