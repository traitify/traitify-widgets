/*global Traitify*/
import Airbrake from "airbrake";

class ErrorHandler extends Airbrake{
  constructor(){
    super();
    this.host = "https://airbrake.io";
    this.projectId = "141848";
    this.projectKey = "c48de83d0f02ea6d598b491878c0c57e";
  }
  browser(){
    let nAgt = navigator.userAgent;
    let browserName  = navigator.appName;
    let fullVersion  = "" + parseFloat(navigator.appVersion);
    let majorVersion = parseInt(navigator.appVersion, 10);
    let nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if((verOffset=nAgt.indexOf("Opera")) !== -1){
      browserName = "Opera";
      fullVersion = nAgt.substring(verOffset + 6);
      if((verOffset=nAgt.indexOf("Version")) !== -1){
        fullVersion = nAgt.substring(verOffset + 8);
      }
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if((verOffset=nAgt.indexOf("MSIE")) !== -1){
      browserName = "Microsoft Internet Explorer";
      fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome"
    else if((verOffset=nAgt.indexOf("Chrome")) !== -1){
      browserName = "Chrome";
      fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if((verOffset=nAgt.indexOf("Safari")) !== -1){
      browserName = "Safari";
      fullVersion = nAgt.substring(verOffset + 7);
      if((verOffset=nAgt.indexOf("Version")) !== -1){
        fullVersion = nAgt.substring(verOffset + 8);
      }
    }
    // In Firefox, the true version is after "Firefox"
    else if((verOffset=nAgt.indexOf("Firefox")) !== -1){
      browserName = "Firefox";
      fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if((nameOffset=nAgt.lastIndexOf(" ") + 1) < (verOffset=nAgt.lastIndexOf("/"))){
      browserName = nAgt.substring(nameOffset, verOffset);
      fullVersion = nAgt.substring(verOffset + 1);
      if(browserName.toLowerCase() === browserName.toUpperCase()){
        browserName = navigator.appName;
      }
    }
    // trim the fullVersion string at semicolon/space if present
    if((ix=fullVersion.indexOf(";")) !== -1)
      fullVersion=fullVersion.substring(0, ix);
    if((ix=fullVersion.indexOf(" ")) !== -1)
      fullVersion=fullVersion.substring(0, ix);

    majorVersion = parseInt("" + fullVersion, 10);
    if(isNaN(majorVersion)){
      fullVersion  = "" + parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
    }

    return {
      browserName,
      fullVersion,
      majorVersion
    };
  }
  os(){
    let OSName="Unknown OS";
    if(navigator.appVersion.indexOf("Win") !== -1) OSName="Windows";
    if(navigator.appVersion.indexOf("Mac") !== -1) OSName="MacOS";
    if(navigator.appVersion.indexOf("X11") !== -1) OSName="UNIX";
    if(navigator.appVersion.indexOf("Linux") !== -1) OSName="Linux";
    return OSName;
  }
  params(){
    return {
      "errors": [
        {
          "type": this.type,
          "message": this.message
        }
      ],
      "context": {
        "os": this.os(),
        "hostname": window.location.host,
        "language": "Javascript",
        "environment": this.env(),
        "version": Traitify.__version__,
        "url:": window.location.href,
        "browser": this.browser()
      },
      "session": {
        "publicKey": Traitify.publicKey,
        "host": Traitify.host
      }
    };
  }
  hostHas(env){
    return window.location.host.indexOf(env) !== -1;
  }
  env(){
    if(this.hostHas("lvh.me:3000")){
      return "development";
    }else if(this.hostHas("stag.traitify.com")){
      return "staging";
    }else if(this.hostHas("traitify.com")){
      return "production";
    }else{
      return "Client";
    }
  }
}
export default ErrorHandler;
