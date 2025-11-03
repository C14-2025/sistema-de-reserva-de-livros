"use client"

import { useState } from "react"
import "./Login.css"
import Input from "../components/Input/Input"
import Button from "../components/Button/Button"

export default function Login({ navigate }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login:", formData)
  }

  return (
    <div className="login-page">
      <div className="login-header-wrapper">
        <div className="login-logo">bookle</div>
        <Button variant="secondary" icon="←" onClick={() => navigate("home")}>
          Página inicial
        </Button>
      </div>

      <main className="login-content">
        <div className="login-left">
          <img src="./images/biblioteca.svg" alt="Biblioteca" className="login-image" />
        </div>

        <div className="login-right">
          <div className="login-text">
            <p className="login-subtitle">Que bom te ter aqui!</p>
            <h1 className="login-title">Faça seu login</h1>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <Input type="email" placeholder="E-mail" name="email" value={formData.email} onChange={handleChange} />
            <Input
              type="password"
              placeholder="Senha"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button variant="primary" type="submit">
              Entrar
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
