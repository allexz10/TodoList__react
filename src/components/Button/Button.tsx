import React from 'react';

type Props = {
 onClick:() => void;
  children: string;
};

const Button: React.FC<Props> = ({ children, onClick }) => (

  <button onClick={onClick} className="button" type="button">
    {children}
  </button>

);

export default Button;
