import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import CourseTopic from "./pages/CoursesTopic";
import LessonRouter from "./pages/LessonRouter"; // Import LessonRouter thay vì LessonDetail
import SectionList from "./pages/SectionList";
import NotFound from "./pages/NotFound";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import MainLayout from "./components/layout/MainLayout";
import Translate from "./pages/TranslateLesson";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/courses/:courseType" element={<CourseTopic />} />
            <Route path="/courses/:courseType/:slug" element={<SectionList />} />
            {/* Sử dụng LessonRouter thay vì LessonDetail */}
            <Route path="/courses/:courseType/:slug/:lessonSlugAndId" element={<LessonRouter />} />
          </Route>
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/translate" element={<Translate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;