import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import ItemDetail from './pages/ItemDetail';
import ReportItem from './pages/ReportItem';
import EditItem from './pages/EditItem';
import MyItems from './pages/MyItems';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              <Route
                path="/report"
                element={
                  <ProtectedRoute>
                    <ReportItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-items"
                element={
                  <ProtectedRoute>
                    <MyItems />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
