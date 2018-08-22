/* global elements:true */
export function createElement(){
  const element = document.createElement("div");
  elements.push(element);
  document.body.appendChild(element);
  return element;
}

export function domHooks(){
  beforeAll(()=>{
    global.elements = [];
  });

  beforeEach(()=>{
    elements.forEach((element)=>{
      element.innerHTML = "";
    });
  });

  afterAll(()=>{
    elements.forEach((element)=>{
      element.parentNode.removeChild(element);
    });
    elements = [];
  });
}
