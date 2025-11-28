import React, { useState } from "react";
import "./Login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorMessage("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Email ou senha inválidos");
      }

      // Sucesso - salva o token e redireciona
      console.log("Login realizado com sucesso:", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/books";

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErrorMessage("Email ou senha inválidos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <header className="header">
        <h1 className="logo">bookle</h1>

        <button
          type="button"
          className="home-button"
          onClick={() => (window.location.href = "/")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="#3b1424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Página inicial
        </button>
      </header>

      <img
        src="/image/biblioteca.svg"
        alt="Biblioteca"
        className="image-large"
      />

      <img
        src="/image/estudante.svg"
        alt="Estudante"
        className="image-small"
      />

      {errorMessage && (
        <div className="error-box">
          {errorMessage}
        </div>
      )}

      <h2 className="welcome-text">Que bom te ver aqui!</h2>

      <h3 className="login-title">Faça seu login</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          required
          className="email-input"
          disabled={isLoading}
        />

        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
          className="password-input"
          disabled={isLoading}
        />

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}