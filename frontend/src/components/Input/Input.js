"use client"
import "./Input.css"

export default function Input({ type = "text", placeholder, value, onChange, name }) {
  return (
    <input
      className="input-field"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
    />
  )
}