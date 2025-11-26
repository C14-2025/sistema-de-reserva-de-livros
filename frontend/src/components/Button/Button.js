import "./Button.css"

export default function Button({ variant = "primary", onClick, children, className = "" }) {
  return (
    <button onClick={onClick} className={`btn btn-${variant} ${className}`}>
      {children}
    </button>
  )
}