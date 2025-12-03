import {Navbar} from "../../components/admin/NavBar"
import Footer from '../../components/admin/Footer'
import { Outlet } from 'react-router-dom'


const AdminLayout = () => {
  return (
    <>
    <Navbar />
    <Outlet/>
    <Footer />
    </>
  )
}

export default AdminLayout
