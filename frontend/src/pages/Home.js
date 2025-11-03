"use client"

import "./Home.css"
import Header from "../components/Header/Header"
import Button from "../components/Button/Button"

export default function Home({ navigate }) {
  return (
    <div className="home-page">
      <Header showAuthButtons={true} showAdmButton={true} navigate={navigate} />

      <main className="home-content">
        <div className="home-illustration">
          <img src="./images/main.svg" alt="Biblioteca ilustração" className="home-image" />
        </div>

        <div className="home-text">
          <h2 className="home-subtitle">Bem-vindo ao</h2>
          <h1 className="home-title">bookle</h1>
          <p className="home-description">seu sistema de reserva de livros</p>
          <Button variant="primary" onClick={() => navigate("books")}>
            Comece agora!
          </Button>
        </div>
      </main>
    </div>
  )
}
