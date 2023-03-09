import dayjs from "dayjs";
import { useEffect, useState } from "react";

const useCountdown = (targetDate: string) => {
  const [countDown, setCountDown] = useState(
    dayjs(targetDate).diff(dayjs(), "seconds")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(dayjs(targetDate).diff(dayjs(), "seconds"));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
  if (countDown <= 0) {
    return [0, 0, 0, 0];
  }
  // calculate time left
  const days = Math.floor(countDown / (60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (60 * 60 * 24)) / (60 * 60)
  );
  const minutes = Math.floor((countDown % (60 * 60)) / (60));
  const seconds = Math.floor((countDown % (60)));

  return [days, hours, minutes, seconds];
};

export { useCountdown };
