interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}

function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  type = 'button',
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const baseClasses = `
    rounded-lg px-6 py-3 font-medium
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantClasses = {
    primary: isDisabled
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
      : 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 cursor-pointer',
    secondary: isDisabled
      ? 'bg-gray-100 text-gray-400 border-2 border-gray-300 cursor-not-allowed opacity-60'
      : 'bg-white text-primary-500 border-2 border-primary-500 hover:bg-primary-100 focus:ring-primary-500 cursor-pointer',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {loading ? 'Loading...' : label}
    </button>
  );
}

export default Button;