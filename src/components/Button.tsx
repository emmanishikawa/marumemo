type Props = {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: "primary" | "symbol" | "word" | "border";
};

export default function Button({ onClick, children, disabled, variant = "primary" }: Props) {
  const base = "m-1 touch-manipulation active:scale-95 cursor-pointer disabled:opacity-40";

  const variants = {
    primary: "bg-(--primary) px-3 py-2 rounded text-white",
    symbol: "w-[40px] h-[40px] bg-(--primary) text-white rounded-lg",
    word: "w-[60px] h-[40px] bg-(--primary)text-white rounded-lg",
    border: "border px-3 py-2 rounded text-(--primary)",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}