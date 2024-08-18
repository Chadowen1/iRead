import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LandingPage from './Routes/LandingPage/LandingPage';
import Login from './Routes/Authentication/Login';
import SignUp from './Routes/Authentication/Signup';
import Book from './Routes/Book/Book';
import MyLibrary from './Routes/MyLibrary/MyLibrary';

const PrivateRoutes = () => {
  const isAuthenticated = localStorage.getItem('token') ? true : false;
  console.log('Authenticated:', isAuthenticated);
  return (
    isAuthenticated ? <Outlet /> : <Navigate to='/' />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/book/:id" element={<Book />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/mylibrary" element={<MyLibrary />} />
        </Route>
        {/* Fallback Route for Undefined Paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
