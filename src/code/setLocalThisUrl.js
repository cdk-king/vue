
function setLocalThisUrl(self){
    //var self = this;语法错误?
    //console.log(self.url);
    if(self.$url!=null){
        self.url = self.$url;
    }
    //console.log(self.url);
}
export default setLocalThisUrl;