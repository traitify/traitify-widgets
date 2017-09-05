function Init(client){
  client.test("SlideDeck Should Initialize")
    .tag("SlideDeck")
    .tag("event")
    .tag("initialize")
    .step("Setup Scratch")
    .step("Load Traitify UI with SlideDeck assessment id")
    .step("Set scratch as Target")
    .step("Render and Wait for SlideDeck to Initialize")
    .expect("SlideDeck should be Ready", function(){
      this.ok(this.scratch.innerHTML.indexOf("Not Me") != -1);
    });

  client.test("Click Me Event")
    .tag("SlideDeck")
    .tag("event")
    .tag("me")
    .step("Initialize SlideDeck")
    .step("Listen for", "slidedeck.me")
    .step("Click", ".traitify--slide-deck--me")
    .expect("Slide Deck to have Clicked Me", function(){
      this.ok(this["slidedeck.me"] == true);
    });

  client.test("Click Not Me Event")
    .tag("SlideDeck")
    .tag("event")
    .tag("not me")
    .step("Initialize SlideDeck")
    .step("Listen for", "slidedeck.notMe")
    .step("Click", ".traitify--slide-deck--notMe")
    .expect("Slide Deck to have Clicked Not Me", function(){
      this.ok(this["slidedeck.notMe"] == true);
    });

  client.test("Answer Slide Event")
    .tag("SlideDeck")
    .tag("event")
    .tag("answer slide")
    .step("Initialize SlideDeck")
    .step("Listen for", "slidedeck.AnswerSlide")
    .step("Click", ".traitify--slide-deck--notMe")
    .expect("Slide Deck to have Clicked Not Me", function(){
      this.ok(this["slidedeck.AnswerSlide"] == true);
    });
}

export default Init;
