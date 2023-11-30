console.log("Connected")

/*------Constants-------*/
let deck = []
const suits = ["♥", "♦", "♣", "♠"]
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
let playerBalance = 100

/*------State Variables-------*/
let playerHand = []
let dealerHand = []

/*------Cache Elements-------*/


/*------Event Listeners-------*/
const hitButton = document.getElementById("hit-button")
const standButton = document.getElementById("stand-button")
const startButton = document.getElementById("start-button")

hitButton.addEventListener("click", hit)
standButton.addEventListener("click", stand)
startButton.addEventListener("click", startGame)
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

function displayHand(hand, elementId) {
    const handElement = document.getElementById(elementId);
    handElement.innerHTML = '';
  
    hand.forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
      cardDiv.textContent = `${card.value} ${card.suit}`;
      handElement.appendChild(cardDiv);
    });
  }

function startGame(){
    const betAmount = parseInt(document.getElementById("bet").value)
    if (betAmount <= playerBalance){
        playerBalance -= betAmount
        document.getElementById("player-balance").innerText = playerBalance

        deck = []
        playerHand = []
        dealerHand = []
        createDeck()
        shuffleDeck()
        dealCard(playerHand)
        dealCard(dealerHand)
        dealCard(playerHand)
        dealCard(dealerHand)

        displayHand(playerHand, "player-hand")
        displayHand(dealerHand, "dealer-hand")

        document.getElementById("hit-button").disabled = false
        document.getElementById("stand-button").disabled = false
        document.getElementById("start-button").disabled = true

        updateScores()
    }else{
        alert("Insufficient balance. Please place a valid bet.")
    }
}

function hit(){
    dealCard(playerHand)
    displayHand(playerHand, "player-hand")
    updateScores()

    if (calculateHand(playerHand) > 21) {
        endGame("Dealer wins! You Busted")
    }
}

function stand(){
    while(calculateHand(dealerHand)< 17){
        dealCard(dealerHand)
        displayHand(dealerHand, "dealer-hand")
    }
    updateScores()
    determineWinner()
}

function updateScores(){
    const playerScore = calculateHand(playerHand)
    const dealerScore = calculateHand(dealerHand)

    document.getElementById("player-score").innerText = `Score: ${playerScore}`
    document.getElementById("dealer-score").innerText = `Score: ${dealerScore}`
}

function determineWinner(){
    const playerScore = calculateHand(playerHand)
    const dealerScore = calculateHand(dealerHand)

    if (playerScore > 21){
        endGame("Dealer wins! You busted.")
    } else if (dealerScore > 21){
        endGame("You Win! Dealer Busted")
        addBet(dealerScore, playerScore, playerBalance)
    } else if (playerScore > dealerScore){
        endGame("You win!")
        addBet(dealerScore, playerScore, playerBalance)
    } else if (dealerScore > playerScore){
        endGame("Dealer Wins!")
    } else {
        endGame("It's a tie!")
        addBet(dealerScore, playerScore, playerBalance)
    }
}

function addBet(dealerScore, playerScore, playerBalance){
    const betAmount = parseInt(document.getElementById("bet").value)

    if (dealerScore > 21){
        playerBalance = playerBalance + (betAmount * 1.5)
    } else if (playerScore > dealerScore){
        playerBalance = playerBalance + (betAmount * 1.5)
    } else {
        playerBalance = playerBalance + betAmount
    }

    document.getElementById("player-balance").innerText = playerBalance

}

function endGame(message){
    document.getElementById("result").innerText = message
    document.getElementById("hit-button").disabled = true
    document.getElementById("stand-button").disabled = true
    document.getElementById("start-button").disabled = false
}
