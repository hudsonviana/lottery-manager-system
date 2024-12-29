import { Loader2 } from 'lucide-react';

const LoadingLabel = ({ label, loaderIconSize = 'h-4 w-4' }) => {
  return (
    <>
      <Loader2 className={`mr-2 animate-spin ${loaderIconSize}`} />
      {label}
    </>
  );
};

export default LoadingLabel;
