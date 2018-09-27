import I18n from "lib/i18n";
import Widget from "lib/traitify-widget";

export default class TraitifyUI{
  constructor(traitify, _options = {}){
    const {i18n, ...options} = _options;

    this.traitify = traitify;
    this.i18n = i18n || new I18n();
    this.options = {
      careerOptions: {},
      imageHost: "https://images.traitify.com",
      ...options
    };
    this.callbacks = {};
    this.current = {};
    this.requests = {};
  }
  component(options = {}){
    return new Widget(this, {...this.options, ...options});
  }
  off(_key, callback){
    const key = _key.toLowerCase();

    this.callbacks[key] = this.callbacks[key] || [];
    this.callbacks[key] = this.callbacks[key].filter((_callback)=>(callback !== _callback));

    if(this.callbacks[key].length === 0){ delete this.callbacks[key]; }

    return this;
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
  setLocale(locale){
    this.i18n.setLocale(locale);
    this.trigger("I18n.setLocale", this, this.i18n.locale);

    return this;
  }
  trigger(_key, context, value){
    this.current[_key] = value;

    const key = _key.toLowerCase();
    const widgetID = context.props && context.props.widgetID;
    const widgetKey = widgetID && `widget-${widgetID}.${key}`.toLowerCase();

    if(this.callbacks[widgetKey]){
      this.callbacks[widgetKey].forEach((callback)=>{
        callback.apply(this, [context, value]);
      });
    }

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
