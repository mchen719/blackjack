console.log("Connected")

/*------Constants-------*/
let deck = []
const suits = ["Hearts", "Diamonds", "Clubs", "Spades"]
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]


/*------State Variables-------*/
let playerHand = []
let dealerHand = []

/*------Cache Elements-------*/


/*------Event Listeners-------*/


/*------Functions-------*/
function createDeck() {
    for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
      for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
        let card = {
          suit: suits[suitIdx],
          value: values[valueIdx]
        };
        deck.push(card);
      }
    }
  }

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

function dealCard(hand){
    hand.push(deck.pop())
}

function calculateHand(hand){
    let score = 0
    let hasAce = false

    for (let i = 0; i < hand.length; i++){
        let card = hand[i]
        let cardValue = card.value 

        if (cardValue === "A"){
            hasAce = true
        }

        if (cardValue === "J" || cardValue === "Q" || cardValue === "K"){
            score += 10
        } else if (cardValue !== "A"){
            score += parseInt(cardValue)
        }
    }
    if (hasAce && score + 11 <= 21){
        score += 11
    } else if (hasAce){
        score += 1
    }
    return score
}


  createDeck()
  shuffleDeck()
  dealCard(playerHand)
  dealCard(dealerHand)
  dealCard(playerHand)
  dealCard(dealerHand)
  console.log(deck)
  console.log(playerHand)
  console.log(dealerHand)
  console.log(calculateHand(playerHand))
  console.log(calculateHand(dealerHand))