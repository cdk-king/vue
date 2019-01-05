function formatDatetime(datetime) {
    //时间格式化
    var date = datetime;
    if (date == undefined) {
      return "";
    }
    var tt;
    if(parseInt(date)){
      tt = new Date(parseInt(date)).toLocaleString();
    }else{
      tt = new Date(date).toLocaleString();
    }
    
    return tt;
  }
  export default formatDatetime;