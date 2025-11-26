import "./Books.css";
import Header from "../components/Header/Header";
import BookCard from "../components/BookCard/BookCard";

export default function Books({ navigate }) {
  return (
    <div className="books-page">
      <Header showNavButtons={true} navigate={navigate} />

      <main className="books-content">
        <div className="books-left">
          <h1 className="books-title">O que vamos ler hoje?</h1>
          <p className="books-subtitle">Encontre o livro perfeito</p>

          <div className="books-list">
            <BookCard />
            <BookCard />
            <BookCard />
          </div>
        </div>

        <div className="books-right">
          <img src="/image/estante.svg" alt="Estante de livros" className="books-image" />
        </div>
      </main>
    </div>
  );
}