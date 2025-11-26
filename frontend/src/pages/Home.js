"use client"

import "./Home.css"
import Header from "../components/Header/Header"
import Button from "../components/Button/Button"

export default function Home({ navigate }) {
  return (
    <div className="landing-container">
      <main className="landing-main">
        <Header showAuthButtons={true} showAdmButton={true} navigate={navigate} />

        <div className="image-container">
          <img src="/image/main.svg" alt="Biblioteca ilustração" className="illustration" />
        </div>

        <p className="welcome-text">Bem-vindo ao</p>

        <h2 className="bookle-title">bookle</h2>

        <p className="description-text">
          seu sistema de
          <br />
          reserva de livros
        </p>

        <Button variant="primary" onClick={() => navigate("books")} className="cta-button">
          Comece agora!
        </Button>
      </main>
    </div>
  )
}
