import { Link } from "react-router-dom"
import UsersList from "../UsersList"

const Admin = () => {
  return (
    <div>
      <Link to="/">Home</Link>
      <UsersList />
    </div>
  )
}

export default Admin