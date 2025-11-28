import React, { createContext, useState, useContext, useEffect } from 'react';

const ReservationContext = createContext();

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations must be used within ReservationProvider');
  }
  return context;
};

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState(() => {
    // Carrega reservas do localStorage ao iniciar
    const saved = localStorage.getItem('reservations');
    return saved ? JSON.parse(saved) : [];
  });

  // Salva no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

  const addReservation = (book) => {
    // Verifica se o livro já foi reservado
    const alreadyReserved = reservations.some(r => r.id === book.id);
    if (alreadyReserved) {
      alert('Este livro já foi reservado!');
      return false;
    }
    
    setReservations(prev => [...prev, book]);
    return true;
  };

  const removeReservation = (bookId) => {
    setReservations(prev => prev.filter(r => r.id !== bookId));
  };

  const clearReservations = () => {
    setReservations([]);
  };

  return (
    <ReservationContext.Provider value={{ 
      reservations, 
      addReservation, 
      removeReservation,
      clearReservations 
    }}>
      {children}
    </ReservationContext.Provider>
  );
};