
let klass = {
  cbs: [],
  mocks: {},
  addMock: (name, mock)=>{
    klass.mocks[name] = mock;
  },
  mock: (name)=>{
    klass.cbs.push(klass.mocks[name]);
  },
  unMock: (name)=>{
    klass.cbs = klass.cbs.filter((cb)=>{
      return cb != klass.mocks[name];
    });
  },
  Traitify: {},
  setup: ()=>{
    klass.Traitify.request = function(method, path, params){
      let options = {method, path, params};
      let cb = klass.currentCbs.filter((_cb)=>{
        return _cb(options);
      })[0];

      return {
        then: cb(options)
      };
    };
  }
};

export default klass;