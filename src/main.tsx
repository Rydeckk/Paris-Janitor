import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserContext, UserProvider } from './context/UserContext'
import { App } from './App'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

export const useUserContext = () => useContext(UserContext)

const stripePromise = loadStripe("pk_test_51Pf4LK2MpWi7PhrTjs2VlhmriorvvemDqpstNYJYCDVc29WsHN5BBPZZAzzAjlaCPTjnQDHTZZw32ckRRRQ8ncxr0048DPfiHY");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <UserProvider>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </UserProvider>
  </BrowserRouter>
)


