const obj = ({ file }) => {
    let isVant = file && file.dirname && file.dirname.indexOf("vant") > -1;
    let rootValue = isVant ? 37.5 : 75;
    return rootValue;
}
module.exports = obj;