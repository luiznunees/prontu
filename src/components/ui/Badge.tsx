import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "yellow" | "accent" | "ink";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = "yellow", 
  className = "" 
}) => {
  const variants = {
    yellow: "bg-prontu-yellow text-ink",
    accent: "bg-accent text-white",
    ink: "bg-ink text-white",
  };

  return (
    <span className={`inline-block px-2 py-0.5 font-display font-bold text-xs uppercase tracking-wider border border-ink ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
