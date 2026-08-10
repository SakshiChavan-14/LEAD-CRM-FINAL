import { useState, useEffect } from "react";
import { reportsMockData } from "../data/reportsMockData";

export function useReportsMock() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    // Simulate network latency
    const timer = setTimeout(() => {
      if (isMounted) {
        setData(reportsMockData);
        setIsLoading(false);
      }
    }, 800); // 800ms mock delay for realistic skeleton loading feeling

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return {
    data,
    isLoading,
    error
  };
}
