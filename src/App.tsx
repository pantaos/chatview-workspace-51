import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminSettings from "./pages/AdminSettings";
import ChatInterface from "./components/ChatInterface";
import TrendcastUploadLinks from "./pages/trendcast/TrendcastUploadLinks";
import TrendcastEditScript from "./pages/trendcast/TrendcastEditScript";
import TrendcastAudio from "./pages/trendcast/TrendcastAudio";
import TrendcastVideo from "./pages/trendcast/TrendcastVideo";
import TrendcastPreview from "./pages/trendcast/TrendcastPreview";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { applyThemeColors } from "./lib/theme-utils";
import VersionNumber from "./components/VersionNumber";
import ImageCropper from "./pages/ImageCropper";
import ReportCardInput from "./pages/reportcard/ReportCardInput";
import ReportCardEdit from "./pages/reportcard/ReportCardEdit";
import ReportCardDownload from "./pages/reportcard/ReportCardDownload";
import ConversationalWorkflow from "./components/ConversationalWorkflow";

// Theme wrapper to apply colors on mount and theme changes
const ThemeApplier = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  
  useEffect(() => {
    console.log("Applying theme colors:", theme);
    applyThemeColors(theme);
  }, [theme]);
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => {
  console.log("App component rendering...");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <ThemeProvider>
          <LanguageProvider>
            <ThemeApplier>
              <Toaster />
              <Sonner />
              <VersionNumber />
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<Index />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/admin-settings" element={<AdminSettings />} />
                  <Route path="/chat" element={<ChatInterface />} />
                  
                  {/* Trendcast Workflow Routes */}
                  <Route path="/trendcast" element={<TrendcastUploadLinks />} />
                  <Route path="/trendcast/script" element={<TrendcastEditScript />} />
                  <Route path="/trendcast/audio" element={<TrendcastAudio />} />
                  <Route path="/trendcast/video" element={<TrendcastVideo />} />
                  <Route path="/trendcast/preview" element={<TrendcastPreview />} />
                  
                  {/* Report Card Workflow Routes */}
                  <Route path="/reportcard" element={<ReportCardInput />} />
                  <Route path="/reportcard/edit" element={<ReportCardEdit />} />
                  <Route path="/reportcard/download" element={<ReportCardDownload />} />
                  
                  {/* Conversational Workflow Route */}
                  <Route path="/greenstone-report" element={
                    <ConversationalWorkflow 
                      workflow={{
                        id: "4",
                        title: "Green Stone Report",
                        description: "Step-by-step student progress report creation for Green Stone School",
                        icon: "GraduationCap",
                        tags: [{ id: "4", name: "Education", color: "green" }],
                        type: "conversational",
                        steps: [
                          {
                            id: "student-info",
                            title: "Student Information",
                            description: "Fill in the student details for the report.",
                            fields: [
                              { id: "studentName", type: "text", label: "Student Name", placeholder: "Enter the student's name", required: true },
                              { id: "term", type: "text", label: "Term", placeholder: "e.g. Fall 2024", required: true },
                              { id: "className", type: "text", label: "Class Name", placeholder: "e.g. ML101", required: true },
                              { id: "tutor", type: "text", label: "Tutor/Teacher", placeholder: "e.g. Mr. Kim", required: true },
                              { id: "daysAbsent", type: "text", label: "Days Absent", placeholder: "e.g. 1", required: true }
                            ]
                          },
                          {
                            id: "report-template",
                            title: "Report Template",
                            description: "Provide the report template URL.",
                            fields: [
                              { id: "templateUrl", type: "url", label: "Report Template URL", placeholder: "Enter the template URL", required: true }
                            ]
                          }
                        ],
                        initialMessage: "Welcome to the Student Progress Report Workflow 👋\n\nLet's get started! Please fill out the student information form below."
                      }}
                    />
                  } />
                  
                  {/* Image Cropper Tool */}
                  <Route path="/image-cropper" element={<ImageCropper />} />
                  
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ThemeApplier>
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
