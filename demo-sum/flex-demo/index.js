;(function(){
	// example-1
	/*function select(arr) {
		var json = {};
		var arr2 = [];
		for (var i = 0; i < arr.length; i++) {
			console.log(json[arr[i]]);
			if (!json[arr[i]]) {
				
				json[arr[i]] = true;
				arr2.push(arr[i])
			}
			
		}
		return arr2
	};
	var arr = [2,3,4,5,6,7,8,7,7,8,9,0,9,1,2],
	    arrGet = select(arr);*/

    // example-2
	/*var data = {
		p1: 1,
		p2: "b"
	};
	for (var i in data) {
		alert(i);    // 弹出值为p1、p2
		alert(eval("data." + i));  // 弹出值为1、b
	}*/
    
    // example-3
	/*var arr = ['a', 'b'];
	for(var index in arr) {
		alert(arr[index]);
	}*/

	// example-4
	var arr = {
		one: 1,
		two: 2,
		three: 3,
		four: 4
	},
	arrs = ['a', 'b', 'c'];

	/*$.each(arr, function(key, value) {
		alert(key);
	});*/

	/*$('.wrap li').each(function() {
		alert($(this).text());
	});*/

	for(var obj in arr) {
		alert(arr[obj]);
	}
})();