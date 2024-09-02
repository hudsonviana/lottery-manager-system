import { useToast } from '@/hooks/use-toast';

const ToastDescription = ({ data, colorClasses, icon }) => {
  return (
    <div
      className={`mx-2 flex items-center mx-auto max-w-lg ${colorClasses.bg}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`${colorClasses.icon} w-5 h-5 sm:w-5 sm:h-5 mr-3`}
      >
        <path fill="currentColor" d={icon}></path>
      </svg>
      <span className={colorClasses.text}>
        {Array.isArray(data)
          ? data.map((dataMsg, index) => <p key={index}>{dataMsg}</p>)
          : data}
      </span>
    </div>
  );
};

const ToastAlert = ({ title = 'Mensagem', data, type = 'info' }) => {
  const { toast } = useToast();

  const selectType = () => {
    const toastStyle = [
      {
        type: 'success',
        colorClasses: {
          bg: 'bg-green-200',
          border: 'border-green-300',
          text: 'text-green-800',
          icon: 'text-green-600',
        },
        icon: 'M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z',
      },
      {
        type: 'info',
        colorClasses: {
          bg: 'bg-blue-200',
          border: 'border-blue-300',
          text: 'text-blue-800',
          icon: 'text-blue-600',
        },
        icon: 'M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm.25,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,12.25,5ZM14.5,18.5h-4a1,1,0,0,1,0-2h.75a.25.25,0,0,0,.25-.25v-4.5a.25.25,0,0,0-.25-.25H10.5a1,1,0,0,1,0-2h1a2,2,0,0,1,2,2v4.75a.25.25,0,0,0,.25.25h.75a1,1,0,1,1,0,2Z',
      },
      {
        type: 'warning',
        colorClasses: {
          bg: 'bg-yellow-200',
          border: 'border-yellow-300',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
        },
        icon: 'M23.119,20,13.772,2.15h0a2,2,0,0,0-3.543,0L.881,20a2,2,0,0,0,1.772,2.928H21.347A2,2,0,0,0,23.119,20ZM11,8.423a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Zm1.05,11.51h-.028a1.528,1.528,0,0,1-1.522-1.47,1.476,1.476,0,0,1,1.448-1.53h.028A1.527,1.527,0,0,1,13.5,18.4,1.475,1.475,0,0,1,12.05,19.933Z',
      },
      {
        type: 'error',
        colorClasses: {
          bg: 'bg-red-200',
          border: 'border-red-300',
          text: 'text-red-800',
          icon: 'text-red-600',
        },
        icon: 'M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z',
      },
    ];

    return toastStyle.find((style) => style.type === type);
  };

  const { colorClasses, icon } = selectType();

  toast({
    className: `${colorClasses.bg} ${colorClasses.border} ${colorClasses.text}`,
    title: title,
    description: (
      <ToastDescription data={data} colorClasses={colorClasses} icon={icon} />
    ),
  });

  return null;
};

export default ToastAlert;
