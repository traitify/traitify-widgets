import TraitifyWidget from "./traitify-widget";

export default class TraitifyUI{
  constructor(){
    this.options = {
      callbacks: {}
    };

    this.imageHost = "https://images.traitify.com";
  }
  component(options){
    return new TraitifyWidget(this, {...this.options, ...options});
  }
  on(key, callback){
    key = key.toLowerCase();
    this.options.callbacks[key] = this.options.callbacks[key] || [];
    this.options.callbacks[key].push(callback);
    return this;
  }
  setImagePack(pack){
    this.options.imagePack = pack;
    return this;
  }
}
