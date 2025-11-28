import React from "react";
import "./Reservations.css";
import Header from "../components/Header/Header";
import { useReservations } from "../contexts/ReservationContext";

export default function Reservations({ navigate }) {
    const { reservations, removeReservation, clearReservations } = useReservations();


    const handleDelete = (id) => {
        if (window.confirm("Deseja excluir esta reserva?")) {
            removeReservation(id);
    }
};

    const handleFinalize = () => {
        if (reservations.length === 0) {
            alert("Não há reservas para finalizar!");
            return;
    }
    
    if (window.confirm(`Finalizar ${reservations.length} reserva(s)?`)) {
        // Aqui pode enviar para o backend
        console.log("Reservas finalizadas:", reservations);
        alert("Reservas finalizadas com sucesso!");
        clearReservations();
        navigate("/books");
    }
};

    return (
    <div className="reservations-page">
        <Header showBooksButton={true} navigate={navigate} />

        <main className="reservations-content">
        <div className="reservations-left">
            <h1 className="reservations-title">Você tem bom gosto!</h1>
            <p className="reservations-subtitle">Algo mais por hoje?</p>
        </div>

        <div className="bookshelf-small">
            <img src="/image/carrinho-de-livros.png" alt="Estante de livros" />
        </div>

        <div className="desk-illustration">
            <img src="/image/mesa-de-livros.png" alt="Pessoa lendo na mesa" />
        </div>

        <div className="reservations-grid">
        {reservations.length === 0 ? (
            <div className="empty-message">
            <p>Você ainda não tem reservas.</p>
            <button onClick={() => navigate("/books")} className="back-to-books-btn">
                Ir para biblioteca
            </button>
            </div>
        ) : (
            <>
            {Array.from({ length: Math.ceil(reservations.length / 2) }).map((_, rowIndex) => (
                <div key={rowIndex} className="reservations-row">
                  {reservations.slice(rowIndex * 2, rowIndex * 2 + 2).map((book) => (
                    <div key={book.id} className="reservation-card">
                    <div className="card-content">
                        <img src={book.cover || "/image/livro-laranja.png"} alt={book.title} className="book-cover" />
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
            ))}
            </>
        )}
        </div>

        {reservations.length > 0 && (
        <button className="finalize-button" onClick={handleFinalize}>
            Finalizar Reserva
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4L10 8L6 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
        )}
    </main>
    </div>
    );
}