export function formatData(obj) {
    let date =  new Date(obj);
    let y = date.getFullYear();
    let m = "0"+(date.getMonth()+1);
    let d = "0"+date.getDate();
    return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
}