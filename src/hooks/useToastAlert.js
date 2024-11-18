import React from 'react';
import { useToast } from './use-toast';
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiInfo,
  FiMinusCircle,
} from 'react-icons/fi';

const CLASS_MAP = {
  blue: 'bg-blue-200 text-blue-800 border-blue-300',
  gray: 'bg-gray-200 text-gray-800 border-gray-300',
  red: 'bg-red-200 text-red-800 border-red-300',
  green: 'bg-green-200 text-green-800 border-green-300',
  yellow: 'bg-yellow-200 text-yellow-800 border-yellow-300',
};

const getColorIcon = (type) => {
  const types = {
    primary: ['blue', React.createElement(FiInfo, { className: 'mr-2' })],
    secondary: ['gray', React.createElement(FiMinusCircle, { className: 'mr-2' })],
    danger: ['red', React.createElement(FiXCircle, { className: 'mr-2' })],
    success: ['green', React.createElement(FiCheckCircle, { className: 'mr-2' })],
    warning: ['yellow', React.createElement(FiAlertTriangle, { className: 'mr-2' })],
  };
  return types[type] || ['blue', React.createElement(FiInfo, { className: 'mr-2' })];
};

const useToastAlert = () => {
  const { toast, dismiss } = useToast();

  const toastAlert = ({ type, title, message }) => {
    const [color, icon] = getColorIcon(type);

    const className = CLASS_MAP[color];

    const description = Array.isArray(message)
      ? message.map((msg, index) => React.createElement('p', { key: index }, `• ${msg}`))
      : message;

    return toast({
      className,
      title: React.createElement('div', { className: 'flex items-center' }, [
        React.cloneElement(icon, { key: 'icon' }),
        React.createElement('span', { key: 'title' }, title),
      ]),
      description,
    });
  };
  return { toastAlert, dismiss };
};

export default useToastAlert;
