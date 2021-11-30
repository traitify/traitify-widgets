import useGlobalMock from "./use-global-mock";

export default function useWindowMock(key) {
  useGlobalMock(window, key);
}
