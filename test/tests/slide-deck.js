function Init(client){
  client.test("SlideDeck Should Initialize")
    .tag("SlideDeck")
    .tag("event")
    .tag("initialize")
    .step("Setup SlideDeck")
    .step("Listen for", "SlideDeck.initialized")
    .step("Render and Wait for SlideDeck to be Ready")
    .expect("SlideDeck to Initialize", function(){
      this.ok(this["SlideDeck.initialized"] === true);
    });

  client.test("Click Me Event")
    .tag("SlideDeck")
    .tag("event")
    .tag("me")
    .step("Setup SlideDeck")
    .step("Render and Wait for SlideDeck to be Ready")
    .step("Listen for", "SlideDeck.me")
    .step("Click", ".traitify--slide-deck--me")
    .expect("Slide Deck to have Clicked Me", function(){
      this.ok(this["SlideDeck.me"] === true);
    });

  client.test("Click Not Me Event")
    .tag("SlideDeck")
    .tag("event")
    .tag("not me")
    .step("Setup SlideDeck")
    .step("Render and Wait for SlideDeck to be Ready")
    .step("Listen for", "SlideDeck.notMe")
    .step("Click", ".traitify--slide-deck--notMe")
    .expect("Slide Deck to have Clicked Not Me", function(){
      this.ok(this["SlideDeck.notMe"] === true);
    });

  client.test("Update Slide Event")
    .tag("SlideDeck")
    .tag("event")
    .tag("update slide")
    .step("Setup SlideDeck")
    .step("Render and Wait for SlideDeck to be Ready")
    .step("Listen for", "SlideDeck.updateSlide")
    .step("Click", ".traitify--slide-deck--notMe")
    .expect("Slide Deck to Update Slide", function(){
      this.ok(this["SlideDeck.updateSlide"] === true);
    });
}

export default Init;
