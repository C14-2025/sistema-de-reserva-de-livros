import React from "react";
import "./BookCard.css";

export default function BookCard({ title = "Nome do livro", author = "Nome do autor", genre = "Gênero" }) {
  const handleReserve = () => {
    console.log("Reservar:", { title, author, genre });
  };

  return (
    <div className="book-card">
      <div className="book-info">
        <div className="info-item">
          <span className="info-icon">▶</span>
          <span>{title}</span>
        </div>
        <div className="info-item">
          <span className="info-icon">◎</span>
          <span>{author}</span>
        </div>
        <div className="info-item">
          <span className="info-icon">◐</span>
          <span>{genre}</span>
        </div>
      </div>
      
      <button className="reserve-button" onClick={handleReserve}>
        Reservar
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 4L10 8L6 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}