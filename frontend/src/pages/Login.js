import React, { useState } from "react";
import "./Login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", formData);
    // colocar aqui a chamada da API/validação
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
        />

        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
          className="password-input"
        />

        <button type="submit" className="submit-button">
          Entrar
        </button>
      </form>
    </div>
  );
}
