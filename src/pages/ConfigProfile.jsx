import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
 import SideBar from '../components/SideBar'
 import FavoriteTags from '../components/FavoriteTags'
 const ConfigProfile = () => {
   const { user } = useContext(AuthContext)
   return (
     <div>
     <SideBar />
     <FavoriteTags user={user} />
     </div>
   )
 }
 
 export default ConfigProfile