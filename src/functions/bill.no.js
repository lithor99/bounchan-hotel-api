module.exports.billNo = async function billNo() {
  let date = new Date();
  let year = date.getFullYear();
  let month = add_zero(date.getMonth());
  let day = add_zero(date.getDate());
  let hour = add_zero(date.getHours());
  let minutes = add_zero(date.getMinutes());
  let seconds = add_zero(date.getSeconds());
  let milliseconds = add_zero(date.getMilliseconds());
  let random = Math.floor(Math.random() * 100);
  return `ipay${year}${month}${day}${hour}${minutes}${seconds}${milliseconds}`;
};
