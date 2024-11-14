import React from 'react';
import { useToast } from './use-toast';
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiInfo } from 'react-icons/fi';

const useToastAlert = () => {
  const { toast, dismiss } = useToast();

  const getColorIcon = (type) => {
    const types = {
      primary: ['blue', React.createElement(FiInfo, { className: 'mr-2' })],
      success: ['green', React.createElement(FiCheckCircle, { className: 'mr-2' })],
      warning: ['yellow', React.createElement(FiAlertTriangle, { className: 'mr-2' })],
      danger: ['red', React.createElement(FiXCircle, { className: 'mr-2' })],
    };
    return types[type] || ['blue', React.createElement(FiInfo, { className: 'mr-2' })];
  };

  const toastAlert = ({ type, title, message }) => {
    const [color, icon] = getColorIcon(type);

    const className = [
      `bg-${color}-200`,
      `text-${color}-800`,
      `border-${color}-300`,
    ].join(' ');

    const description = Array.isArray(message)
      ? message.map((msg, index) => React.createElement('p', { key: index }, `• ${msg}`))
      : message;

    return toast({
      className,
      title: React.createElement('div', { className: 'flex items-center' }, [
        [
          React.cloneElement(icon, { key: 'icon' }),
          React.createElement('span', { key: 'title' }, title),
        ],
      ]),
      description,
    });
  };
  return { toastAlert, dismiss };
};

export default useToastAlert;
