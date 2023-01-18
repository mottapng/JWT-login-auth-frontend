import { Link } from "react-router-dom"
import './missing.scss'

const Missing = () => {
  return (
    <div className="missing-container">
      <h1>404</h1>
      <h2>OPPS! PAGE NOT FOUND</h2>
      <p>Sorry, the page you're looking for doesn't exist. If you think something is broken, report the problem</p>
      <div>
        <Link to="/">RETURN HOME</Link>
        <a>REPORT PROBLEM</a>
      </div>
    </div>
  )
}

export default Missing