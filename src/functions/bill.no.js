function add_zero(your_number, length = 2) {
  var num = "" + your_number;
  while (num.length < length) {
    num = "0" + num;
  }
  return num;
}

function bill_no() {
  let date = new Date();
  let year = date.getFullYear();
  let month = add_zero(date.getMonth());
  let day = add_zero(date.getDate());
  let hour = add_zero(date.getHours());
  let minutes = add_zero(date.getMinutes());
  let seconds = add_zero(date.getSeconds());
  // let milliseconds = add_zero(date.getMilliseconds());
  let random = Math.floor(Math.random() * 10);
  return `${year.toString()[2]}${
    year.toString()[3]
  }${month}${day}${hour}${minutes}${seconds}${random}`;
}

module.exports = { add_zero, bill_no };
