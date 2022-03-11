import Moment from 'moment';

export const convertUnixToNormal = (_unix) => {
    const normalDateFormat = Moment(_unix * 1000).format('yyyy/MM/DD HH:mm a');
    return normalDateFormat;
};

export const convertNormalToUnix = (_date) => {
    const unixDateFormat = Moment(_date).unix();
    return unixDateFormat;
};
