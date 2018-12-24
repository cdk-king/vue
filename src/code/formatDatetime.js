function formatDatetime(datetime) {
    //时间格式化
    var date = datetime;
    if (date == undefined) {
      return "";
    }
    var tt = new Date(parseInt(date)).toLocaleString();
    return tt;
  }
  export default formatDatetime;