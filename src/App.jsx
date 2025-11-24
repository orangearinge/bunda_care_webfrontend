import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, ProtectedRoute } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/sonner"
import LoginPage from "@/pages/auth/LoginPage"
import AdminLayout from "@/layouts/AdminLayout"
import DashboardPage from "@/pages/admin/DashboardPage"
import UsersPage from "@/pages/admin/UsersPage"
import MenusPage from "@/pages/admin/MenusPage"
import IngredientsPage from "@/pages/admin/IngredientsPage"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="menus" element={<MenusPage />} />
            <Route path="ingredients" element={<IngredientsPage />} />
          </Route>
        </Routes>

        {/* Toast notifications */}
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
