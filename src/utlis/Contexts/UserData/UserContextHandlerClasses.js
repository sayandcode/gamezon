/* HANDLERS EXPOSE THE FUNCTIONALITY VIA CONTEXT API */
// Handlers extend the base class by adding access to react hooks,
// and editing the state of the context

class UserContextHandler {
  #user;

  #userData;

  #setUserData;

  #showLoginModal;

  constructor({ user, userData, setUserData, showLoginModal }) {
    // This provides the handler generator access to the context hooks
    this.#user = user;
    this.#userData = userData;
    this.#setUserData = setUserData;
    this.#showLoginModal = showLoginModal;
  }

  #updateItemInUserData(baseName, fnName, ...args) {
    this.#setUserData((oldData) => {
      const oldItem = oldData[baseName];
      const newItem = oldItem[fnName](...args);
      return { ...oldData, [baseName]: newItem, isFromCloud: false };
    });
  }

  extend({
    baseName,
    updateFor: propsNeedingUpdate,
    requireAuthFor: propsNeedingAuth,
    contentsIsArray = false,
  }) {
    // The extended instance has brand new handler properties,
    // but also has the properties and methods of the base class
    const origHandler = this;
    const baseInstance = origHandler.#userData[baseName];

    const handler = {
      get(target, prop) {
        if (propsNeedingAuth.includes(prop))
          if (!origHandler.#user) {
            // if not authorized, just show the login modal and return nothing
            origHandler.#showLoginModal();

            /* The calling of method/key expects the return of a consistent datatype for processing.
            Whether or not you're going to allow the request, or start off another series of actions,
            the closure that's calling the fn deserves the correct return type */
            if (target[prop] instanceof Function) return () => {};
            return null;
          }

        if (propsNeedingUpdate.includes(prop))
          return (...args) =>
            origHandler.#updateItemInUserData(baseName, prop, ...args);

        if (prop === 'contents' && contentsIsArray)
          return Object.values(target[prop]);

        // If none of the above matches just do the normal behaviour
        return target[prop];
      },
    };

    const extendedInstance = new Proxy(baseInstance, handler);
    return extendedInstance;
  }
}

export default UserContextHandler;
