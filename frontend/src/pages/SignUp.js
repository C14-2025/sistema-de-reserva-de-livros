"use client"

import { useState } from "react"
import "./SignUp.css"
import Input from "../components/Input/Input"
import Button from "../components/Button/Button"

export default function SignUp({ navigate }) {
  const [formData, setFormData] = useState({
    name: "",
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
    console.log("Cadastro:", formData)
  }

  return (
    <div className="signup-page">
      <div className="signup-header-wrapper">
        <div className="signup-logo">bookle</div>
        <Button variant="secondary" icon="←" onClick={() => navigate("home")}>
          Página inicial
        </Button>
      </div>

      <main className="signup-content">
        <div className="signup-left">
          <img src="./images/estudante.svg" alt="Pessoa estudando" className="signup-image" />
        </div>

        <div className="signup-right">
          <div className="signup-text">
            <p className="signup-subtitle">Dê o primeiro passo da sua jornada</p>
            <h1 className="signup-title">Crie sua conta</h1>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <Input type="text" placeholder="Nome" name="name" value={formData.name} onChange={handleChange} />
            <Input type="email" placeholder="E-mail" name="email" value={formData.email} onChange={handleChange} />
            <Input
              type="password"
              placeholder="Senha"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button variant="primary" type="submit">
              Criar conta
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
