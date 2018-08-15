import {render} from "preact";
import {Component} from "components/default";
import {createElement, domHooks} from "support/dom";

jest.mock("lib/with-traitify");
jest.mock("components/results", ()=>(()=>(<div className="mock">Results</div>)));
jest.mock("components/slide-deck", ()=>(()=>(<div className="mock">Slide Deck</div>)));

describe("Default", ()=>{
  domHooks();

  it("renders results", ()=>{
    const element = createElement();
    render(<Component isReady={(type)=>(type === "results")} />, element);

    expect(element.innerHTML).toEqual(`<div class="mock">Results</div>`);
  });

  it("renders slide deck", ()=>{
    const element = createElement();
    render(<Component isReady={(type)=>(type === "slides")} />, element);

    expect(element.innerHTML).toEqual(`<div class="mock">Slide Deck</div>`);
  });

  it("renders div if not ready", ()=>{
    const element = createElement();
    render(<Component isReady={(type)=>(false)} />, element);

    expect(element.innerHTML).toEqual("<div></div>");
  });
});
