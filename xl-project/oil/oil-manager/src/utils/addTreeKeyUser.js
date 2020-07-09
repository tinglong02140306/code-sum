export function addTreeKeyUser(dataSource) {
    let array = [];
    array = dataSource;
    let childrenArray = [];
    for (let i = 0; i <array.length; i++) {
        let obj = {};
        obj.key=array[i].id;
        obj.title =array[i].role_name;
        childrenArray.push(obj);
    }
    let treeData = [];
    let treeObject = {title: "全部", key: "all", children: []};
    treeObject.children = childrenArray;
    treeData = treeData.concat(treeObject);
    return treeData;
}