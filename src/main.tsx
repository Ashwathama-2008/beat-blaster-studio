import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from '@/components/ui/sonner'

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster />
  </>
);
