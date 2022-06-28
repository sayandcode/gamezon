import PropTypes from 'prop-types';
import { createContext, useEffect, useMemo, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestoreDB } from '../firebase-config';

export const TodaysOffersContext = createContext({
  spotlightItems: [],
  offerItems: [{ title: '', discount: null /* in percentage */ }],
});

// when app first loads, this component is loaded, which loads
// * 5 random items for spotlight,
// * 50 random items for discount offers,
export default function TodaysOffersContextProvider({ children }) {
  const [spotlightItems, setSpotlightItems] = useState([]);
  const [offerItems, setOfferItems] = useState([]);
  /* useEffect(() => {
    (async () => {
      // get all the game titles
      const allGameTitlesDocSnap = await getDoc(
        doc(firestoreDB, 'games', 'allGameTitles')
      );

      const { allGameTitles } = allGameTitlesDocSnap.data();

      console.log('Run');

      // pick random games
      const randomShuffledGameTitles = allGameTitles.sort(
        () => Math.random() - 0.5
      );

      setSpotlightItems(randomShuffledGameTitles.slice(0, 5));
      setOfferItems(randomShuffledGameTitles.slice(5, 55));
    })();
  }, []); */

  const contextValue = useMemo(
    () => ({
      spotlightItems,
      offerItems,
    }),
    [spotlightItems, offerItems]
  );

  return (
    <TodaysOffersContext.Provider value={contextValue}>
      {children}
    </TodaysOffersContext.Provider>
  );
}

TodaysOffersContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
