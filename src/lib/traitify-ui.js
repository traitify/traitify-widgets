import TraitifyWidget from "./traitify-widget";

export default class TraitifyUI{
  constructor(){
    this.imageHost = "https://images.traitify.com";

    // DEPRECATION: Calling Widget function from UI
    [
      "allowBack",
      "allowFullScreen",
      "assessmentId",
      "perspective",
      "target",
      "targets"
    ].forEach((option)=>{
      this[option] = (value)=>{
        let options = {};
        options[option] = value;
        return this.component(options);
      };
    });
  }
  component(options){
    return new TraitifyWidget(this, options);
  }
  disableTests(){
    this.testsDisabled = true;
  }
  // DEPRECATION: Calling Widget function from UI
  locale(value){
    return this.component().locale(value);
  }
  // DEPRECATION: Calling Widget function from UI
  on(key, callback){
    return this.component().on(key, callback);
  }
  // DEPRECATION: Calling Widget function from UI
  render(options){
    return this.component(options).render();
  }
  startTests(){
    if(this.client.testMode){ return; }
    this.client.testMode = true;
    setTimeout(::this.client.Test, 0);
  }
}
