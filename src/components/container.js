import {useCallback, useMemo} from "react";
import Context from "lib/context/object";

export default function Container({children}) {
  const [context, setContext] = useState(null);

  // TOOD: Update from taking a response to taking an action and value
  // TODO: Or maybe update to pass arguments to a separate class like our own Context handler, which essentially is a reducer
  const dispatch = useCallback((action) => {
    setContext({...context, [action.key]: action.value});
  }, []);

  // TODO: Not sure, but maybe we don't need to memoize if we have a handler instance of a class that we just use
  // TODO: But maybe we do and we need to connect this memo with actions running
  const contextValue = useMemo(() => ({
    ...context,
    dispatch
  }), [currentUser, dispatch]);

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
}
