import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { AuthProvider } from './contexts/AuthContext.jsx'

import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';      
import 'lrm-graphhopper';   

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ChakraProvider value={defaultSystem}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>
  </BrowserRouter>
)