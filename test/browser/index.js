/*global StepTest*/
import Traitify from "traitify";
import Setup from "../support/setup";
import Results from "../tests/results";
import SlideDeck from "../tests/slide-deck";

StepTest.Traitify = Traitify;
Setup(StepTest);
Results(StepTest);
SlideDeck(StepTest);
