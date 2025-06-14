interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`border rounded-lg p-4 hover:bg-gray-50 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
