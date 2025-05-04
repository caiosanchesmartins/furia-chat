export function Button({ children, onClick, className = "", ...props }: any) {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }