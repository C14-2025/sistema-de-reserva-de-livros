"use client"

import { useState } from "react"
import Home from "./pages/Home"
import Books from "./pages/Books"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import "./App.css"

export default function App() {
  const [currentPage, setCurrentPage] = useState("home")

  const navigate = (page) => {
    setCurrentPage(page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home navigate={navigate} />
      case "books":
        return <Books navigate={navigate} />
      case "signup":
        return <SignUp navigate={navigate} />
      case "login":
        return <Login navigate={navigate} />
      default:
        return <Home navigate={navigate} />
    }
  }

  return <div className="App">{renderPage()}</div>
}