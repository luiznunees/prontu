import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white border-2 border-ink shadow-[4px_4px_0px_0px_#0D0D0D] p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
