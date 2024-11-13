import React from 'react';
import { useToast } from './use-toast';

const useToastAlert = () => {
  const { toast, dismiss } = useToast();

  const getColor = (type) => {
    const typeColor = {
      primary: 'blue',
      warning: 'yellow',
      danger: 'red',
      success: 'green',
    };
    return typeColor[type] || 'blue';
  };

  const toastAlert = ({ type, title, message }) => {
    const color = getColor(type);

    const className = [
      `bg-${color}-200`,
      `text-${color}-800`,
      `border-${color}-300`,
    ].join(' ');

    const description = Array.isArray(message)
      ? message.map((msg, index) => React.createElement('p', { key: index }, `• ${msg}`))
      : message;

    return toast({ className, title, description });
  };
  return { toastAlert, dismiss };
};

export default useToastAlert;
