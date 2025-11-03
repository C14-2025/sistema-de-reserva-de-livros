"use client"

import "./Header.css"
import Button from "../Button/Button"

export default function Header({ showAuthButtons = false, showNavButtons = false, showAdmButton = false, navigate }) {
  return (
    <header className="header">
      <div className="header-logo">bookle</div>
      <div className="header-buttons">
        {showNavButtons && (
          <>
            <Button variant="secondary" icon="←" onClick={() => navigate("home")}>
              Página inicial
            </Button>
            <Button variant="secondary" icon="←" onClick={() => navigate("books")}>
              Minhas reservas
            </Button>
          </>
        )}
        {showAuthButtons && (
          <>
            <Button variant="secondary" icon="👤" onClick={() => navigate("login")}>
              Fazer login
            </Button>
            <Button variant="secondary" icon="+" onClick={() => navigate("signup")}>
              Criar conta
            </Button>
          </>
        )}
        {showAdmButton && (
          <Button variant="secondary" icon="›">
            Adm
          </Button>
        )}
      </div>
    </header>
  )
}