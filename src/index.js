// import 'promise-polyfill';
// import 'isomorphic-fetch';
import { h, render } from 'preact';
import './style';
let App = require('./components/app').default;
var Traitify = {};

let root;

Traitify.ui = class UI {
	static component () {
		return new this();
	}

	static startChain(options){
		let widgets = this.component();
		Object.keys(options).forEach((key)=>{
			widgets[key] = options[key]
		})
		return widgets;
	}

	static render (options){
		this.startChain(options)
	}

	static assessmentId (assessmentid){
		return this.startChain({assessmentId})
	}

	static target (target){
		return this.startChain({target})
	}

	assessmentId (assessmentId){
		this.assessmentId = assessmentId;
		return this;
	}

	target (target){
		this.assessmentId = target;
		return this;
	}

	render () {
  	let App = require('./components/app').default;

		// If target is not a node use query selector to find the target node
		if(typeof this.target == "string"){
			this.target = document.querySelector(this.target || ".tf-widgets")
		}else{
			this.target = target
		}

  	root = render(<App />, this.target, root);
		return this;
  }

	refresh () {
		this.load(this.target)
		return this;
	}
}

// Export Traitify
window.Traitify = Traitify;


if(window.TraitifyDevInitialize == true){

	// require('preact/devtools');   // turn this on if you want to enable React DevTools!
	// set up HMR:
	module.hot.accept('./components/app', () => requestAnimationFrame(window.developmentLoad.reload()) );

	InitJS()
}
