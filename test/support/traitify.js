import OriginalTraitify from "lib/traitify";

export default class Traitify extends OriginalTraitify{
  ajax = jest
    .fn(()=>new Promise((resolve)=>resolve()))
    .mockName("ajax")
}
