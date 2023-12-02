console.log("Connected")

/*------Constants-------*/
let deck = []
const suits = ["♥", "♦", "♣", "♠"]
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
let playerBalance = 100

/*------State Variables-------*/
let playerHand = []
let dealerHand = []
let showDealerScore = false

/*------Cache Elements-------*/


/*------Event Listeners-------*/
const hitButton = document.getElementById("hit-button")
const standButton = document.getElementById("stand-button")
const startButton = document.getElementById("start-button")
const nextButton = document.getElementById("next-button")

hitButton.addEventListener("click", hit)
standButton.addEventListener("click", stand)
startButton.addEventListener("click", startGame)
nextButton.addEventListener("click", nextHand)
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

function displayHand(hand, elementId, hideSecondCard = false) {
    const handElement = document.getElementById(elementId);
    handElement.innerHTML = '';
  
    hand.forEach((card, index) => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
  
      if (hideSecondCard && index === 1) {
        cardDiv.textContent = '♛';
        cardDiv.classList.add('hidden');
      } else {
        cardDiv.textContent = `${card.value} ${card.suit}`;
      }
  
      handElement.appendChild(cardDiv);
    });
  }

function startGame(){
    playerBalance = 100
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

        displayHand(playerHand, "player-hand", hideSecondCard = false)
        displayHand(dealerHand, "dealer-hand", hideSecondCard = true)
        document.getElementById("result").innerText = "Please choose to hit or stand"

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

    if (calculateHand(playerHand) > 21 && playerBalance === 0){
        endGame("You lost all your money! Maybe Blackjack isn't for you.")
    }else if (calculateHand(playerHand) > 21) {
        endRound("Dealer wins! You Busted")
    }
}

function stand(){
    displayHand(dealerHand, 'dealer-hand', false);
    showDealerScore = true
    while(calculateHand(dealerHand)< 17){
        dealCard(dealerHand)
        displayHand(dealerHand, "dealer-hand")
    }
    updateScores()
    determineWinner()
}

function updateScores(){
    const playerScore = calculateHand(playerHand);
    let dealerScore = calculateHand(dealerHand);
    
    document.getElementById("player-score").innerText = `Score: ${playerScore}`
    const dealerScoreElement = document.getElementById("dealer-score")

    if (showDealerScore) {
          dealerScoreElement.innerText = `Score: ${dealerScore}`;
    } else {
        dealerScoreElement.innerText = "Score: ?"
    }
}

function determineWinner(){
    const playerScore = calculateHand(playerHand)
    const dealerScore = calculateHand(dealerHand)

    if (playerBalance === 0){
        endGame("You lost all your money. Maybe blackjack isn't for you.")
    }
    else if(playerScore > 21){
        endRound("Dealer wins! You busted.")
    } else if (dealerScore > 21){
        endRound("You Win! Dealer Busted")
        addBet(dealerScore, playerScore, playerBalance)
    } else if (playerScore > dealerScore){
        endRound("You win!")
        addBet(dealerScore, playerScore, playerBalance)
    } else if (dealerScore > playerScore){
        endRound("Dealer Wins!")
    } else {
        endRound("It's a tie!")
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

function nextHand(){
    const betAmount = parseInt(document.getElementById("bet").value)
    if (betAmount <= playerBalance){
        playerBalance -= betAmount
        document.getElementById("player-balance").innerText = playerBalance

        playerHand = []
        dealerHand = []
       
        dealCard(playerHand)
        dealCard(dealerHand)
        dealCard(playerHand)
        dealCard(dealerHand)

        displayHand(playerHand, "player-hand", hideSecondCard = false)
        displayHand(dealerHand, "dealer-hand", hideSecondCard = true)
        document.getElementById("result").innerText = "Please choose to hit or stand"

        document.getElementById("hit-button").disabled = false
        document.getElementById("stand-button").disabled = false
        document.getElementById("start-button").disabled = true
        document.getElementById("next-button").disabled = true

        showDealerScore = false

        updateScores()
    }else{
        alert("Insufficient balance. Please place a valid bet.")
    }
}

function endRound(message){
    document.getElementById("result").innerText = message
    document.getElementById("hit-button").disabled = true
    document.getElementById("stand-button").disabled = true
    document.getElementById("start-button").disabled = true
    document.getElementById("next-button").disabled = false
}

function endGame(message){
    if (playerBalance === 0){
        document.getElementById("result").innerText = message
    }

    document.getElementById("hit-button").disabled = true
    document.getElementById("stand-button").disabled = true
    document.getElementById("start-button").disabled = false
    document.getElementById("next-button").disabled = true
}