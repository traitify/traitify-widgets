import TraitifyWidget from "lib/traitify-widget";

export default class TraitifyUI{
  constructor(){
    this.options = {
      imageHost: "https://images.traitify.com"
    };

    this.callbacks = {};
    this.data = {};
    this.requests = {};
  }
  component(options = {}){
    return new TraitifyWidget(this, {...this.options, ...options});
  }
  on(_key, callback){
    const key = _key.toLowerCase();

    this.callbacks[key] = this.callbacks[key] || [];
    this.callbacks[key].push(callback);

    return this;
  }
  setImagePack(pack){
    this.options.imagePack = pack;

    return this;
  }
  trigger(_key, context, value){
    this.data[_key] = value;

    const key = _key.toLowerCase();

    if(this.callbacks[key]){
      this.callbacks[key].forEach((callback)=>{
        callback.apply(this, [context, value]);
      });
    }

    if(this.callbacks.all){
      this.callbacks.all.forEach((callback)=>{
        callback.apply(this, [key, context, value]);
      });
    }

    return this;
  }
}
