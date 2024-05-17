import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { jwtDecode } from "jwt-decode";
import { Token } from "../Interfaces";

export const PrivateRoute = () => {
    const { isAuth } = useAuthStore();
    return (
        isAuth ? <Outlet /> : <Navigate to="/login" />
    );
}

export const AdminPrivateRoute = () => {
    const token: string= useAuthStore.getState().access
    const tokenDecoded: Token = jwtDecode(token)
    const isAdmin = (tokenDecoded.is_staff);
    return (
        isAdmin ? <Outlet /> : <Navigate to="/" />
    );
}