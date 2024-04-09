import { useState } from "react";
import { useEffect } from "react";

const BASE_URL = 'https://deckofcardsapi.com/api/deck/'

/**Component to fetch and display cards.
 *
 * Props: none
 *
 * State:
 * - deck: id of deck
 * - cards: array of objects like [{code, image}]
 * - remaining: number of remaining cards in deck
 *
 * App -> Cards
 */

function Cards() {
    const [deck, setDeck] = useState();
    const [cards, setCards] = useState([]);

    /** Fetch new deck on mount */
    useEffect(function fetchDeckOnMount() {
        async function fetchDeck() {
            const resp = await fetch(`${BASE_URL}new/shuffle/?deck_count=1`);
            const data = await resp.json();
            console.log(data);
            setDeck(data.deck_id);
        }
        fetchDeck();
    }, []);

    /** Fetch new card on button click. */
    async function handleClick() {
        const resp = await fetch(`${BASE_URL}${deck}/draw/?count=52`);
        const data = await resp.json();
        console.log(data);
        const newCards = data.cards.map(c => ({code: c.code, image: c.image}));
        if (data.remaining === 0 && newCards.length === 0) {
            alert('Error: no cards remaining!');
            return;
        }
        setCards(cards => [...cards, ...newCards]);
    }

    return (
        <div>
            {cards.map(c => <div key={c.code}><img src={c.image} /></div>)}
            <button onClick={handleClick}>GIMME A CARD!</button>
        </div>
    )
}

export default Cards;