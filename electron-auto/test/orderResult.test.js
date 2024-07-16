const orderResult = '{"lattice":[{"json_1best":"{\\"st\\":{\\"sc\\":\\"0.00\\",\\"pa\\":\\"0\\",\\"rt\\":[{\\"ws\\":[{\\"cw\\":[{\\"w\\":\\"打开\\",\\"wp\\":\\"n\\",\\"wc\\":\\"0.0000\\"}],\\"wb\\":13,\\"we\\":72},{\\"cw\\":[{\\"w\\":\\"QQ\\",\\"wp\\":\\"n\\",\\"sm\\":\\"replace_list\\",\\"wc\\":\\"0.0000\\"}],\\"wb\\":73,\\"we\\":116},{\\"cw\\":[{\\"w\\":\\"音乐\\",\\"wp\\":\\"n\\",\\"wc\\":\\"0.0000\\"}],\\"wb\\":117,\\"we\\":172}]}],\\"bg\\":\\"140\\",\\"rl\\":\\"0\\",\\"ed\\":\\"1890\\"}}"},{"json_1best":"{\\"st\\":{\\"sc\\":\\"0.00\\",\\"pa\\":\\"0\\",\\"rt\\":[{\\"ws\\":[{\\"cw\\":[{\\"w\\":\\"播放\\",\\"wp\\":\\"n\\",\\"wc\\":\\"0.0000\\"}],\\"wb\\":1,\\"we\\":52},{\\"cw\\":[{\\"w\\":\\"。\\",\\"wp\\":\\"p\\",\\"wc\\":\\"0.0000\\"}],\\"wb\\":52,\\"we\\":52},{\\"cw\\":[{\\"w\\":\\"\\",\\"wp\\":\\"g\\",\\"wc\\":\\"0.0000\\"}],\\"wb\\":52,\\"we\\":52}]}],\\"bg\\":\\"2110\\",\\"rl\\":\\"0\\",\\"ed\\":\\"2650\\"}}"}],"lattice2":[{"lid":"0","end":"1890","begin":"140","json_1best":{"st":{"sc":"0.00","pa":"0","rt":[{"nb":"1","nc":"1.0","ws":[{"cw":[{"w":"打开","wp":"n","wc":"0.0000"}],"wb":13,"we":72},{"cw":[{"w":"QQ","wp":"n","sm":"replace_list","wc":"0.0000"}],"wb":73,"we":116},{"cw":[{"w":"音乐","wp":"n","wc":"0.0000"}],"wb":117,"we":172}]}],"pt":"replace_list","bg":"140","si":"0","rl":"0","ed":"1890"}},"spk":"段落-0"},{"lid":"0","end":"2650","begin":"2110","json_1best":{"st":{"sc":"0.00","pa":"0","rt":[{"nb":"1","nc":"1.0","ws":[{"cw":[{"w":"播放","wp":"n","wc":"0.0000"}],"wb":1,"we":52},{"cw":[{"w":"。","wp":"p","wc":"0.0000"}],"wb":52,"we":52},{"cw":[{"w":"","wp":"g","wc":"0.0000"}],"wb":52,"we":52}]}],"pt":"reserved","bg":"2110","si":"1","rl":"0","ed":"2650"}},"spk":"段落-0"}]}'


// eslint-disable-next-line @typescript-eslint/no-shadow
function getTextFromOrder(orderResult) {
  let result = '';
  try {
    const json = JSON.parse(orderResult);
    const { lattice } = json;
    // eslint-disable-next-line camelcase
    const { json_1best } = lattice[0];
    const jsonBest = JSON.parse(json_1best);
    const { rt } = jsonBest.st;

    rt.forEach((item) => {
      item.ws.forEach((ws) => {
        ws.cw.forEach((cw) => {
          result = `${result}${cw.w} `;
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
  return result;
}
function main() {
  const result = getTextFromOrder(orderResult);
  console.log(result);
  // console.log(result.lattice[0].json_1best.st.rt[0].ws[0].cw[0].w);
}

let cache = {}
function deepcopy(obj) {
  const result = {}
  for (const key in obj) {
    
    result[key] = deepcopy[key]
    cache[key] = result
  }
  return result
}
main();
