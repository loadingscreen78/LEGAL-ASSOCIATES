import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AnimatedLoader } from "./components/AnimatedLoader";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Journals from "./pages/Journals";
import JournalDetails from "./pages/JournalDetails";
import OrissaCriminalReports from "./pages/OrissaCriminalReports";
import Books from "./pages/Books";
import Founder from "./pages/Founder";
import Shop from "./pages/Shop";
import VisitStore from "./pages/VisitStore";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import CheckoutInfo from "./pages/CheckoutInfo";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboardNew from "./pages/AdminDashboardNew";
import FirestoreDebug from "./pages/FirestoreDebug";
import OrderTracking from "./pages/OrderTracking";

const queryClient = new QueryClient();

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AnimatedLoader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/journals" element={<Journals />} />
        <Route path="/journal/:id" element={<JournalDetails />} />
        <Route path="/orissa-criminal-reports" element={<OrissaCriminalReports />} />
        <Route path="/books" element={<Books />} />
        <Route path="/founder" element={<Founder />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/visit-store" element={<VisitStore />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout-info" element={<CheckoutInfo />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard/*" element={<AdminDashboardNew />} />
        <Route path="/track-order/:orderId" element={<OrderTracking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/debug" element={<FirestoreDebug />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <AppContent />
              <Toaster />
              <Sonner />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
