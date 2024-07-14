const fixJsonString = (jsonString) => {
	try {
		return JSON.stringify(eval(jsonString))
	} catch (error) {
	}
  // 修复单引号问题
  const fixedString = jsonString.replace(/'/g, '"');
  
  // 修复嵌套引号问题
  const fixedString2 = fixedString.replace(/"([^"]+)"/g, function(match, p1) {
    return `"${p1.replace(/"/g, '\\"')}"`;
  });
  
  return fixedString2;
};

module.exports = {
	fixJsonString
}