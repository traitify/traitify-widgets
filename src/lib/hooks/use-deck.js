import useLoadedValue from "lib/hooks/use-loaded-value";
import {deckQuery} from "lib/recoil";

export default function useDeck() {
  const deck = useLoadedValue(deckQuery);

  return deck;
}
