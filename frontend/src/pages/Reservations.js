import React from "react";
import "./Reservations.css";
import Header from "../components/Header/Header";

export default function Reservations({ navigate }) {
    const reservations = [
        { id: 1, title: "Nome do livro", author: "Nome do autor", genre: "Gênero", cover: "/image/livro-amarelo.png" },
        { id: 2, title: "Nome do livro", author: "Nome do autor", genre: "Gênero", cover: "/image/livro-azul.png" },
        { id: 3, title: "Nome do livro", author: "Nome do autor", genre: "Gênero", cover: "/image/livro-vermelho.png" },
        { id: 4, title: "Nome do livro", author: "Nome do autor", genre: "Gênero", cover: "/image/livro-laranja.png" },
];

    const handleDelete = (id) => {
        console.log("Excluir reserva:", id);
};

    const handleFinalize = () => {
        console.log("Finalizar reserva");
};

    return (
    <div className="reservations-page">
        <Header showBooksButton={true} navigate={navigate} />

        <main className="reservations-content">
        {/* Left Section */}
        <div className="reservations-left">
            <h1 className="reservations-title">Você tem bom gosto!</h1>
            <p className="reservations-subtitle">Algo mais por hoje?</p>
        </div>

        {/* Bookshelf Image - Small */}
        <div className="bookshelf-small">
            <img src="/image/carrinho-de-livros.png" alt="Estante de livros" />
        </div>

        {/* Main Illustration - Desk */}
        <div className="desk-illustration">
            <img src="/image/mesa-de-livros.png" alt="Pessoa lendo na mesa" />
        </div>

        {/* Book Cards Grid */}
        <div className="reservations-grid">
          {/* Top Row */}
            <div className="reservations-row">
            {reservations.slice(0, 2).map((book) => (
                <div key={book.id} className="reservation-card">
                <div className="card-content">
                    <img src={book.cover} alt={book.title} className="book-cover" />
                    <div className="card-info">
                    <h3 className="card-title">{book.title}</h3>
                    <p className="card-author">{book.author}</p>
                    <p className="card-genre">{book.genre}</p>
                    </div>
                </div>
                <button className="delete-button" onClick={() => handleDelete(book.id)}>
                    Excluir Reserva ⊗
                </button>
                </div>
            ))}
            </div>

            <div className="reservations-row">
            {reservations.slice(2, 4).map((book) => (
                <div key={book.id} className="reservation-card">
                <div className="card-content">
                    <img src={book.cover} alt={book.title} className="book-cover" />
                    <div className="card-info">
                    <h3 className="card-title">{book.title}</h3>
                    <p className="card-author">{book.author}</p>
                    <p className="card-genre">{book.genre}</p>
                    </div>
                </div>
                <button className="delete-button" onClick={() => handleDelete(book.id)}>
                    Excluir Reserva ⊗
                </button>
                </div>
            ))}
            </div>
        </div>

        <button className="finalize-button" onClick={handleFinalize}>
            Finalizar Reserva
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4L10 8L6 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
        </main>
    </div>
    );
}