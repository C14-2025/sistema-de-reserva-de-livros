import "./BookCard.css"

export default function BookCard({ title, author, genre }) {
  return (
    <div className="book-card">
      <div className="book-card-row">
        <span className="book-card-icon">▶</span>
        <span className="book-card-label">Nome do livro</span>
      </div>
      <div className="book-card-row">
        <span className="book-card-icon">👤</span>
        <span className="book-card-label">Nome do autor</span>
      </div>
      <div className="book-card-row">
        <span className="book-card-icon">🌙</span>
        <span className="book-card-label">Gênero</span>
      </div>
    </div>
  )
}