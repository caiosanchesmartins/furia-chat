export function Input({ className = "", ...props }: any) {
    return (
      <input
        className={`border rounded px-2 py-1 text-black ${className}`}
        {...props}
      />
    );
  }