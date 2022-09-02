import { useEffect, useRef } from 'react';

/* Although the hook itself is relatively simple, following the concept can significantly
clean up the react component. The data handling is delegated to the dataHandler object,
while the react component only has to focus on the UI rendering logic */

function useDataHandler(instantiatedHandler) {
  /* Another thing to note is that useDataHandler accepts both objects, as well as
  class constructors(the name of the class). Using the latter means that the handler doesn't
  really store any internal state, and is just an intermediary which stores all the required methods.
  This works because in JS, everything is an object. */
  const handlerRef = useRef(instantiatedHandler);
  useEffect(() => () => disposeTheHandler(), []);

  function disposeTheHandler() {
    const handler = handlerRef.current;
    /* Dispose the handler, if the defined handler feels like it has something to 
    dispose of. This eliminates the need for obligatory methods on the Handler object. */
    if ('dispose' in handler) handler.dispose();
  }
  return handlerRef.current;
}

export default useDataHandler;
