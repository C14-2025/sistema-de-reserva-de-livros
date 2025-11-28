import { useState } from "react"
import "./SignUp.css"

export default function SignUp() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleGoHome = () => {
    window.location.href = "/"
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((s) => ({ ...s, [name]: value }))
    if (errorMessage) {
      setErrorMessage("")
    }
  }

  function validateForm() { 
    if (!formData.name.trim()) {
      return "Nome é obrigatório"
    }
    
    if (!formData.email.trim()) {
      return "E-mail é obrigatório"
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      return "E-mail inválido"
    }
    
    if (!formData.password.trim()) {
      return "Senha é obrigatória"
    } else if (formData.password.length < 6) {
      return "Senha deve ter no mínimo 6 caracteres"
    }
    
    return ""
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const error = validateForm()

    if (error) {
      setErrorMessage(error)
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar conta")
      }

      // Sucesso - redireciona para login
      console.log("Conta criada com sucesso:", data)
      window.location.href = "/login"
      
    } catch (error) {
      console.error("Erro ao criar conta:", error)
      setErrorMessage(error.message || "Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
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
          {errorMessage && (
            <div className="error-box">
              {errorMessage}
            </div>
          )}
          <h2 className="subtitle">Dê o primeiro passo da sua jornada</h2>
          <h3 className="title">Crie sua conta</h3>

          <form onSubmit={handleSubmit}>
            <div>
              <input 
                name="name" 
                onChange={handleChange} 
                value={formData.name} 
                type="text" 
                placeholder="Nome" 
                className="input-field input-name"
                disabled={isLoading}
              />
            </div>

            <div>
              <input 
                name="email" 
                onChange={handleChange} 
                value={formData.email} 
                type="email" 
                placeholder="E-mail" 
                className="input-field input-email"
                disabled={isLoading}
              />
            </div>

            <div>
              <input 
                name="password" 
                onChange={handleChange} 
                value={formData.password} 
                type="password" 
                placeholder="Senha" 
                className="input-field input-password"
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}