import Promise from 'promise-polyfill';

let setup = function(){
  let mocks = this;
  this.Traitify.request = function(method, path, params){
    return new Promise((resolve, reject)=>{
      let options = {method, path, params};

      let cb = mocks.cbs.filter((_cb)=>{
        return _cb(options);
      })[0];
      
      resolve(cb(options));
    });
  };
};

let Mocks = {
  cbs: [],
  mocks: {},
  addMock: (name, mock)=>{
    Mocks.mocks[name] = mock;
  },
  mock: (name)=>{
    Mocks.cbs.push(Mocks.mocks[name]);
    return Mocks;
  },
  unMock: (name)=>{
    Mocks.cbs = Mocks.cbs.filter((cb)=>{
      return cb != Mocks.mocks[name];
    });
  },
  reset:()=>{
    Mocks.cbs = [];
  },
  Traitify: {},
  setup
};

export default Mocks;