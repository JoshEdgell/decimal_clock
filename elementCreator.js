const elementCreator = function(object){
  let element = document.createElement('div');
    return element;
};


let object = {
  type: 'p',
  classes: ['one', 'two', 'three', 'four'],
  attributes: {
    id: 1,
    value: 0,
    text: 'Here is some text',

  }
};

console.log(elementCreator(object));
