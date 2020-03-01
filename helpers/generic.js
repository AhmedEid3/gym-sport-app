// Get Values Of Specific Month
function valuesOfSpecificMonth(obj, specDate) {
  if (!obj) return;
  return obj.filter(sn => {
    let iterateOverDays = new Date(sn.date.getFullYear(), sn.date.getMonth());
    let firstDay = new Date(specDate.getFullYear(), specDate.getMonth());
    let lastDay = new Date(specDate.getFullYear(), specDate.getMonth() + 1);
    return iterateOverDays >= firstDay && iterateOverDays <= lastDay;
  });
}

// Sort Days of Month
function sortByDay(arr) {
  if (!arr) return;
  return arr.sort((a, b) => a.date - b.date);
}

// Find First Day Of Month
function findFirstDayOfMonth(arr, specDate) {
  if (!arr) return;
  return arr.find(sn => {
    let iterateOverDays = new Date(sn.date.getFullYear(), sn.date.getMonth());
    let firstDay = new Date(specDate.getFullYear(), specDate.getMonth());
    let lastDay = new Date(specDate.getFullYear(), specDate.getMonth() + 1);
    return iterateOverDays >= firstDay && iterateOverDays < lastDay;
  });
}

// Find last Day Of Month
function findLastDayOfMonth(arr, specDate) {
  if (!arr) return;
  return arr.find(sn => {
    let iteratOverDays = new Date(sn.date.getFullYear(), sn.date.getMonth());
    let lastDay = new Date(specDate.getFullYear(), specDate.getMonth() + 1);

    return iteratOverDays.toString() === lastDay.toString();
  });
}

// Calculate Sum Of values obj
function sumOfObj(arrObj, attr) {
  return arrObj.reduce((init, obj) => {
    return { [attr]: init[attr] + obj[attr] };
  })[attr];
}

// check status
function sheckStatus(date, currentDate) {
  return date > currentDate;
}

module.exports = {
  valuesOfSpecificMonth,
  sortByDay,
  findFirstDayOfMonth,
  findLastDayOfMonth,
  sumOfObj,
  sheckStatus
};
