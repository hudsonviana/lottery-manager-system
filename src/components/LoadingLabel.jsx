import { Loader2 } from 'lucide-react';

const LoadingLabel = ({ label }) => {
  return (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {label}
    </>
  );
};

export default LoadingLabel;
