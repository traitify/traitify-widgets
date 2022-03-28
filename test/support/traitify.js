import OriginalTraitify from "lib/traitify";

export default class Traitify extends OriginalTraitify {
  ajax = jest.fn(() => (Promise.resolve())).mockName("ajax");
}
