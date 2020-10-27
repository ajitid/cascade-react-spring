import React, { forwardRef } from 'react';

import { FC } from 'shared/types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, type = 'button', ...props }, ref) => {
    return (
      <button ref={ref} type={type} {...props}>
        {children}
      </button>
    );
  }
);

export default Button;
