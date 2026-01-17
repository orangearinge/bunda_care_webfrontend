import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { ProtectedRoute } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/sonner"

// Layouts
import AdminLayout from "@/layouts/AdminLayout"

// Pages
import LoginPage from "@/pages/auth/LoginPage"
import DashboardPage from "@/pages/admin/DashboardPage"
import UsersPage from "@/pages/admin/UsersPage"
import MenusPage from "@/pages/admin/MenusPage"
import IngredientsPage from "@/pages/admin/IngredientsPage"
import ArticlesPage from "@/pages/admin/ArticlesPage"
import FeedbacksPage from "@/pages/admin/FeedbacksPage"
import CreateArticlePage from "@/pages/admin/CreateArticlePage"
import EditArticlePage from "@/pages/admin/EditArticlePage"
import ArticlePreviewPage from "@/pages/admin/ArticlePreviewPage"

function App() {
  return (
    <ThemeProvider>
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
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="menus" element={<MenusPage />} />
              <Route path="ingredients" element={<IngredientsPage />} />
              <Route path="feedbacks" element={<FeedbacksPage />} />


              {/* Article Routes */}
              <Route path="articles" element={<ArticlesPage />} />
              <Route path="articles/create" element={<CreateArticlePage />} />
              <Route path="articles/:id/edit" element={<EditArticlePage />} />
              <Route path="articles/:id/preview" element={<ArticlePreviewPage />} />
              <Route path="articles/:id" element={<Navigate to="preview" replace />} />
            </Route>
          </Routes>

          {/* Toast notifications */}
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
