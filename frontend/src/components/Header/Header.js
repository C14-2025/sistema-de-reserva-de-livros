import "./Header.css"

export default function Header({ showAuthButtons, showAdmButton, showNavButtons, showBooksButton, navigate }) {
  return (
    <header className="landing-header">
      <div className="header-content">
        <h1 className="bookle-logo">bookle</h1>

        {showNavButtons && (
          <nav className="nav-buttons">
            <button className="nav-button" onClick={() => navigate("/reservations")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="#3b1424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Minhas reservas
            </button>
            <button className="nav-button" onClick={() => navigate("/")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="#3b1424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Página inicial
            </button>
          </nav>
        )}

        {showBooksButton && (
          <nav className="nav-buttons">
            <button className="nav-button" onClick={() => navigate("/books")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="#3b1424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Biblioteca
            </button>
            <button className="nav-button" onClick={() => navigate("/")}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="#3b1424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Página inicial
            </button>
          </nav>
        )}

        {showAuthButtons && (
          <>
            <button onClick={() => navigate("/login")} className="header-btn login-btn">
              👤 Fazer login
            </button>

            <button onClick={() => navigate("/signup")} className="header-btn create-btn">
              ➕ Criar conta
            </button>
          </>
        )}

        {showAdmButton && (
          <button onClick={() => navigate("/admin")} className="header-btn admin-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Adm
          </button>
        )}
      </div>
    </header>
  )
}