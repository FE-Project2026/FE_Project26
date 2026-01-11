import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// PHẢI IMPORT CÁC PROVIDER NÀY (Kiểm tra đúng đường dẫn file của bạn)
import { LanguageProvider } from './context/LanguageContext' 
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* BỌC APV TRONG CÁC PROVIDER ĐỂ NAVBAR KHÔNG BỊ LỖI */}
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
)