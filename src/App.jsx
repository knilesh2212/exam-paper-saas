import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ExamProvider } from '@/context/ExamContext';
import Dashboard from '@/pages/Dashboard';
import ExamCreator from '@/pages/ExamCreator';
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <BrowserRouter>
      <ExamProvider>
        <div className="min-h-screen bg-background font-sans antialiased text-foreground">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<ExamCreator />} />
          </Routes>
          <Toaster />
        </div>
      </ExamProvider>
    </BrowserRouter>
  );
}

export default App;
