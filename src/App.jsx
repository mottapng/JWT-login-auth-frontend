import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout'
import Login from './components/Login';
import Home from './components/Home';
import Admin from './components/Admin';
import Missing from './components/Missing';

import RequireAuth from './components/RequireAuth';

const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />

        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>

        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  )
}

export default App
