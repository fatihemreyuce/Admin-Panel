import { LoginProvider } from "@/providers/login-state-provider";
import QueryProvider from "@/providers/query-client-provider";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "@/providers/protected-route";
import LoginPage from "@/pages/login/login-page";
import DashboardPage from "@/pages/dashboard/dashboard-page";
import AdminLayout from "@/components/admin-layout";
import UsersListPage from "@/pages/users/users-list-page";
import UserCreatePage from "@/pages/users/user-create-page";
import UserDetailPage from "@/pages/users/user-detail-page";
import CategoryListPage from "@/pages/categories/category-list-page";
import CategoryCreatePage from "@/pages/categories/category-create-page";
import CategoryDetailPage from "@/pages/categories/category-detail-page";
import CategoryEditPage from "@/pages/categories/category-edit-page";
import TagListPage from "@/pages/tags/tag-list-page";
import TagCreatePage from "@/pages/tags/tag-create-page";
import TagDetailPage from "@/pages/tags/tag-detail-page";
import TagEditPage from "@/pages/tags/tag-edit-page";
import BlogListPage from "@/pages/blogs/blog-list-page";
import BlogCreatePage from "@/pages/blogs/blog-create-page";
import BlogDetailPage from "@/pages/blogs/blog-detail-page";
import BlogEditPage from "@/pages/blogs/blog-edit-page";





function App() {
  return(
    <QueryProvider>
      <LoginProvider>
        <BrowserRouter>
          <Toaster />
          <Routes> 
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="/users" element={<UsersListPage />} />
                <Route path="/users/create" element={<UserCreatePage />} />
                <Route path="/users/:id" element={<UserDetailPage />} />
                <Route path="/users/:id/edit" element={<UserDetailPage />} />
                <Route path="/categories" element={<CategoryListPage />} />
                <Route path="/categories/create" element={<CategoryCreatePage />} />
                <Route path="/categories/:id" element={<CategoryDetailPage />} />
                <Route path="/categories/:id/edit" element={<CategoryEditPage />} />
                <Route path="/tags" element={<TagListPage />} />
                <Route path="/tags/create" element={<TagCreatePage />} />
                <Route path="/tags/:id" element={<TagDetailPage />} />
                <Route path="/tags/:id/edit" element={<TagEditPage />} />
                <Route path="/blog" element={<Navigate to="/blogs" replace />} />
                <Route path="/blogs" element={<BlogListPage />} />
                <Route path="/blogs/create" element={<BlogCreatePage />} />
                <Route path="/blogs/:id" element={<BlogDetailPage />} />
                <Route path="/blogs/:id/edit" element={<BlogEditPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </LoginProvider>
    </QueryProvider>
  )
}
export default App;