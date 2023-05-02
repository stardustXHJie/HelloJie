/*
argument=要匹配值=作为替换的值
支持正则：如argument=\w+->test
支持正则修饰符：如argument=/\w+/g->test
支持多参数，如：argument=匹配值1->替换值1&匹配值2->替换值2

支持改写响应体和请求体体（type=http-response 或 http-request）注意必须打开需要body（requires-body=1）

tips 
修改json格式的键值对可以这样：
argument=("key")\s?:\s?"(.+?)"->$1: "new_value"

s修饰符可以让.匹配换行符，如 argument=/.+/s->hello  
*/

function getRegexp(re_str) {
	let regParts = re_str.match(/^\/(.*?)\/([gims]*)$/);
	if (regParts) {
		return new RegExp(regParts[1], regParts[2]);
	} else {
		return new RegExp(re_str);
	}
}
String.prototype.replaceAll = function(s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
}
let body;
if (typeof $argument == "undefined") {
	console.log("requires $argument");
} else {
	$argument = $argument.replaceAll("，，", ",")
	console.log($argument);
	if ($script.type === "http-response") {
		body = $response.body;
	} else if ($script.type === "http-request") {
		body = $request.body;
	} else {
		console.log("script type error");
	}
}

console.log($script.type)

if (body) {
	$argument.split("&").forEach((item) => {
		if (item) {
			try {
				let [match, replace] = item.split("->");
				let re = getRegexp(match);
				body = body.replaceAll(re, replace);
			} catch (e) {
				console.error(item)
				console.error(e)
			}
		}
	});
	$done({ body });
} else {
	console.log("Not Modify");
	$done({});
}
