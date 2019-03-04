function test(a,b){
  if(typeof a === 'number' && typeof b === 'number'){
    return a+b
  }else{
    return `${a}${b}`;
  }
}
test(1,2);
