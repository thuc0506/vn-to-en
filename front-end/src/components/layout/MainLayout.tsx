import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { setUser } from "@/lib/slices/authSlice";
import { fetchMe } from "@/lib/slices/authSlice";


const MainLayout = () => {
   const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchMe());  // ✅ Fetch /auth/me lấy user mới từ cookie HttpOnly
    }, [dispatch]);

    return (
        <div className="min-h-screen">
            <Navigation />
            <Outlet />
            <Footer />
        </div>
    );
};

export default MainLayout;
