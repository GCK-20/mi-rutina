import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import RoutineForm from './components/RoutineForm';
import RoutineList from './components/RoutineList';
import ComboForm from './components/ComboForm';
import ComboList from './components/ComboList';
import DashboardLayout from './components/DashboardLayout';
import RegisterForm from './components/RegisterForm';
import './App.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginForm />} />

        {/* Ruta de registro */}
        <Route path="/register" element={<RegisterForm />} />

        {/* Rutas protegidas dentro del dashboard */}
        <Route
          path="/dashboard"
          element={token ? <DashboardLayout /> : <Navigate to="/login" replace />}
        >
          <Route
            path="products"
            element={
              <div className="section">
                <ProductForm />
                <ProductList />
              </div>
            }
          />
          <Route
            path="routines"
            element={
              <div className="section">
                <RoutineForm />
                <RoutineList />
              </div>
            }
          />
          <Route
            path="combos"
            element={
              <div className="section">
                <ComboForm />
                <ComboList />
              </div>
            }
          />
          {/* Redirección por defecto */}
          <Route index element={<Navigate to="/dashboard/products" replace />} />
        </Route>
        

        {/* Redirección global */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;