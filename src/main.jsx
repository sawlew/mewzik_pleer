import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import LottieAnimation from './Lottie.jsx'
import { LottieProvider } from './LottieContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LottieProvider>
      <App />
    {/* <LottieAnimation /> */}
    </LottieProvider>
  </React.StrictMode>,
)
