import { useState } from 'react'
import './App.css'
import Signin from './components/Signin'
import Signup from './components/Signup'
import ResponsiveAppBar from './components/Appbar'
import { Home, About, Page2 } from './components/Info'
import Cars from './components/Cars'
import Profile from './components/Profile'
import Locations from './components/Locations'
import Admin from './components/Admin'
import AddCar from './components/AddCar'
import Cartpage from './components/Cartpage'
import Billing from './components/Billing'
import ForgotPassword from './components/ForgotPassword'

function App({ store }) {
  function Display() {
    switch (store.getState()) {
      case "Signin": return (<Signin store={store} />);
      case "Signup": return (<Signup store={store} />);
      case "ForgotPassword": return (<ForgotPassword store={store} />);
      case "Cars":
        if (localStorage.getItem("role") === "1" || localStorage.getItem("role") === "2")
          return (<Cars store={store} />)
        else return (<Signin store={store} />)
      case "Profile":
      case "Bookings":
        if (localStorage.getItem("role") === "1" || localStorage.getItem("role") === "2")
          return (<Profile store={store} />)
        else return (<Signin store={store} />)
      case "Locations":
        if (localStorage.getItem("role") === "1" || localStorage.getItem("role") === "2")
          return (<Locations store={store} />)
        else return (<Signin store={store} />)
      case "About": return (<About />);
      case "Admin":
        if (localStorage.getItem("role") === "1")
          return (<Admin />)
        else return (<Signin store={store} />)
      case "AddCar":
        if (localStorage.getItem("role") === "1" || localStorage.getItem("role") === "2")
          return (<AddCar store={store} />)
        else return (<Signin store={store} />)
      case "Cartpage":
        if (localStorage.getItem("role") === "1" || localStorage.getItem("role") === "2")
          return (<Cartpage store={store} />)
        else return (<Signin store={store} />)
      case "Billing":
        if (localStorage.getItem("role") === "1" || localStorage.getItem("role") === "2")
          return (<Billing store={store} />)
        else return (<Signin store={store} />)
      case "Home": return (<Home store={store} />);
      default: return (<Home store={store} />);
    }
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ResponsiveAppBar store={store} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', paddingBottom: '60px' }} className="fade-in">
        <Display />
      </main>
    </div>
  )
}

export default App
