function subString(string) {
  let array = [];
  let ns = string.split("");
  ns.forEach((element) => {
    if (array.includes(element) || array.length === ns.length) {
      console.log(array.toString());
    } else {
      array.push(element);
    }
  });
}

subString("tejats");
