import { useState } from "react";
import { useEffect } from "react";

const BASE_URL = 'https://deckofcardsapi.com/api/deck/'

/**Component to fetch and display cards.
 *
 * Props: none
 *
 * State:
 * - deck: object like {id, isShuffling}
 * - cards: array of objects like [{code, image}]
 *
 *
 * App -> Cards
 */

function Cards() {
    const [deck, setDeck] = useState({id: null, isShuffling: false});
    const [cards, setCards] = useState([]);

    /** Fetch new deck on mount */
    useEffect(function fetchDeckOnMount() {
        async function fetchDeck() {
            const resp = await fetch(`${BASE_URL}new/shuffle/?deck_count=1`);
            const data = await resp.json();
            setDeck({id: data.deck_id, isShuffling: false});
        }
        fetchDeck();
    }, [deck]);

    /** Fetch new card on button click. */
    async function handleClick() {
        const resp = await fetch(`${BASE_URL}${deck.id}/draw/?count=1`);
        const data = await resp.json();
        console.log(data);
        const newCards = data.cards.map(c => ({code: c.code, image: c.image}));
        if (data.remaining === 0 && newCards.length === 0) {
            alert('Error: no cards remaining!');
            return;
        }
        setCards(cards => [...cards, ...newCards]);
    }

    /** Changes isShuffling to true and empties the cards list */
    function shuffle() {
        setDeck({...deck, isShuffling: true});
        setCards([]);
    }

    return (
        <div>
            {cards.map(c => <div key={c.code}><img src={c.image} /></div>)}
            <button onClick={handleClick}>GIMME A CARD!</button>
            <button disabled={deck.isShuffling} onClick={shuffle}>Shuffle</button>
        </div>
    )
}

export default Cards;