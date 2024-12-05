import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Context from './Context/Context.jsx'
import "react-toastify/dist/ReactToastify.css"
import 'react-quill-new/dist/quill.bubble.css'
import 'react-tagsinput/react-tagsinput.css'
import moment from "moment";
import "moment/locale/az";
import "moment/dist/locale/az";
import { HelmetProvider } from 'react-helmet-async'

moment.locale("az");
createRoot(document.getElementById('root')).render(
  <HelmetProvider>  {/* Wrap your app with HelmetProvider */}
  <StrictMode>
    <BrowserRouter>
    <Context>
      <App/>
    </Context>
    </BrowserRouter>
  </StrictMode>
  </HelmetProvider>,
)
