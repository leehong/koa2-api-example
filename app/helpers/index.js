import moment from 'moment';

// moment.locale('zh-cn')

exports.timeAgo = function (date) {
  date = moment(date);
  return date.fromNow();
};

exports.formatDate = function (date) {
  date = moment(date);
  return date.format('YYYY-MM-DD HH:mm');
};
