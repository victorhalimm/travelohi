import React from 'react';
import styles from './Button.module.scss'; 

interface ButtonProps {
  outlined?: boolean;
  primary?: boolean;
  textOnly?: boolean,
  children: React.ReactNode;
  onClick?: () => void;
  width?: string;
  height?: string;
  fontSize? : string;
  success? : boolean;
}

const Button: React.FC<ButtonProps> = ({
  outlined,
  primary,
  textOnly,
  children,
  onClick,
  width,
  height,
  fontSize,
  success
}) => {

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (onClick) onClick();
  };

  // Determine button class based on props
  const buttonClass = `${primary ? styles.primary : ''} ${outlined ? styles.outlined : ''} ${textOnly ? styles.textOnly : ''} ${success ? styles.success : ''} ${styles.button}`;

  // Apply width and height if provided, otherwise fallback to default or CSS styles
  const buttonStyle = {
    display: 'flex',
    gap: '0.8vw',
    width: width ? width : 'auto', // Use 'auto' to allow the button to grow with its content if width is not specified
    height: height ? height : 'auto', // Similarly, use 'auto' for height
    fontSize: fontSize ? fontSize : '16px',
  };

  return (
    <button style={buttonStyle} onClick={(e) => handleSubmit(e)} className={buttonClass}>
      {children}
    </button>
  );
}

export default Button;
