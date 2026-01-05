import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Home from "./pages/home/Home";
import ManageBooks from "./pages/books/ManageBooks";
import AddEditBook from "./pages/books/AddEditBook";
import BorrowedBooks from "./pages/books/BorrowedBooks";
import Layout from "./components/layout/Layout";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  return isAuthenticated ? <Navigate to="/home" /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />

        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-books"
          element={
            <ProtectedRoute>
              <Layout>
                <ManageBooks />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-book"
          element={
            <ProtectedRoute>
              <Layout>
                <AddEditBook />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-book/:bookId"
          element={
            <ProtectedRoute>
              <Layout>
                <AddEditBook />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/borrowed-books"
          element={
            <ProtectedRoute>
              <Layout>
                <BorrowedBooks />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;