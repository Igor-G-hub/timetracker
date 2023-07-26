import moment from "moment";

export  const formatSeconds = (seconds: number) => {
    const duration = moment.duration(seconds, 'seconds');
    const momentObj = moment().startOf('day').add(duration);
    const formattedTime = momentObj.format('HH:mm:ss');
    return formattedTime;
  };