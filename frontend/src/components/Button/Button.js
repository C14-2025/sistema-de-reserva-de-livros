"use client"
import "./Button.css"

export default function Button({ children, variant = "primary", icon, onClick, type = "button" }) {
  return (
    <button className={`button button-${variant}`} onClick={onClick} type={type}>
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  )
}