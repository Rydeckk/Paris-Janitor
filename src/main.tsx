import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserContext, UserProvider } from './context/UserContext'
import { App } from './App'

export const useUserContext = () => useContext(UserContext)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
  </BrowserRouter>
)


