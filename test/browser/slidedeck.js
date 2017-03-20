require("polyfills");
import Factories from "../support/factories";
import "../steps/slide-deck";
/*global sinon,expect,StepTest*/

/*eslint-disable prefer-arrow-callback*/
StepTest.test("Slidedeck Should Initialize")
        .step("Setup Scratch")
        .step("Load Traitify UI with SlideDeck assessment id")
        .step("Mock Slides")
        .step("Set scratch as Target")
        .step("Render and Wait for SlideDeck to Initialize")
        .expect("SlideDeck should be Ready", function(){
          expect(this.scratch.innerHTML).to.contain("Not Me");
        });

StepTest.test("Click Me Event")
        .step("Initialize SlideDeck")
        .step("Listen for", "slidedeck.me")
        .step("Click", ".traitify--slidedeck--me")
        .expect("Slide Deck to have Clicked Me", function(){
          expect(this["slidedeck.me"]).to.eql(true);
        });
  
StepTest.test("Click Not Me Event")
        .step("Initialize SlideDeck")
        .step("Listen for", "slidedeck.notMe")
        .step("Click", ".traitify--slidedeck--notMe")
        .expect("Slide Deck to have Clicked Not Me", function(){
          expect(this["slidedeck.notMe"]).to.eql(true);
        });

StepTest.test("Answer Slide Event")
        .step("Initialize SlideDeck")
        .step("Listen for", "slidedeck.AnswerSlide")
        .step("Click", ".traitify--slidedeck--notMe")
        .expect("Slide Deck to have Clicked Not Me", function(){
          expect(this["slidedeck.AnswerSlide"]).to.eql(true);
        });

/*eslint-enable prefer-arrow-callback*/