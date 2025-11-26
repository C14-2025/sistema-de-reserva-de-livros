import { useState } from "react"
import "./SignUp.css"


export default function SignUp() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const handleGoHome = () => {
    console.log("Botão clicado - navegando para home")
    window.location.href = "/"
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((s) => ({ ...s, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log("Criar conta:", formData)
    // aqui colocar chamada API / validação / redirecionamento
  }

  return (
    <div className="register-container">
      <header className="header">
        <h1 className="logo">bookle</h1>
        <button type="button" className="home-button" onClick={handleGoHome}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="#3b1424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Página inicial
        </button>
      </header>

      <main className="main-content">
        <img
          src="/image/estudante.svg"
          alt="Pessoa estudando"
          className="illustration"
        />

        <div className="form-section">
          <h2 className="subtitle">Dê o primeiro passo da sua jornada</h2>
          <h3 className="title">Crie sua conta</h3>

          <form onSubmit={handleSubmit}>
            <input name="name" onChange={handleChange} value={formData.name} type="text" placeholder="Nome" className="input-field input-name" />
            <input name="email" onChange={handleChange} value={formData.email} type="email" placeholder="E-mail" className="input-field input-email" />
            <input name="password" onChange={handleChange} value={formData.password} type="password" placeholder="Senha" className="input-field input-password" />
            <button type="submit" className="submit-button">Criar conta</button>
          </form>
        </div>
      </main>
    </div>
  )
}