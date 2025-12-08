import {Navbar} from "../../components/admin/NavBar"
import Footer from '../../components/admin/Footer'
import { Outlet } from 'react-router-dom'
import TopNavbar from "../../components/admin/TopNavbar"
import Sidebar from "../../components/seeker/Sidebar"


const AdminLayout = () => {
  return (
    <>
    <TopNavbar />
    <Sidebar/>
    <Outlet/>
    {/* <Footer /> */}
    </>
  )
}

export default AdminLayout
