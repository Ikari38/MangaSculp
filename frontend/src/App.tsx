import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import { PrivateRoute, AdminPrivateRoute } from "./components/PrivateRoute"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import AdminPage from "./pages/AdminPage"
import AddProductPage from "./pages/AddProductPage"
import EditProductPage from "./pages/EditProductPage" 
import SoloProduct from "./pages/SoloProduct"
import CategoryPage from "./pages/CategoryPage"
import SearchByCategory from "./pages/SearchByCategory"
import CartPage from "./pages/CartPage"
import UserProfile from "./pages/UserProfile"
import SoloOrder from "./pages/SoloOrder"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="products/get/:slug" element={<SoloProduct/>} />
          <Route path="category" element={<CategoryPage/>} />
          <Route path="category/:category" element={<SearchByCategory />}/>

          <Route element={<PrivateRoute />} >
            <Route path="cart" element={<CartPage />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="order/solo/:id" element={<SoloOrder />} />
          </Route>

          <Route path="admin" element={<AdminPrivateRoute />} >
            <Route index element={<AdminPage/>} />
            <Route path="add" element={<AddProductPage/>} />
            <Route path="edit/:id" element={<EditProductPage/>} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
