import * as React from 'react'
import {ChakraProvider} from '@chakra-ui/react'
import * as ReactDOM from 'react-dom/client'
import App from './App'


const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <ChakraProvider>
            <App/>
        </ChakraProvider>
    </React.StrictMode>,
)

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
//
//
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
