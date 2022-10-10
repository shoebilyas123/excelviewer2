import { useState } from "react";

const useLoading = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  return {
    loading,
    startLoading,
    stopLoading,
  };
};

export default useLoading;
