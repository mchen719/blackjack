console.log("Connected")

/*------Constants-------*/
let deck = []
const suits = ["♥", "♦", "♣", "♠"]
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
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
const playAgainButton = document.getElementById("playAgain-button")

hitButton.addEventListener("click", hit)
standButton.addEventListener("click", stand)
startButton.addEventListener("click", startGame)
nextButton.addEventListener("click", nextHand)
playAgainButton.addEventListener("click", playAgain)
/*------Functions-------*/
function createDeck() {
    for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
      for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
        let card = {
          suit: suits[suitIdx],
          value: values[valueIdx]
        }
        deck.push(card)
      }
    }
  }

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]]
    }
  }

function dealCard(hand){
    hand.push(deck.pop())
}

function calculateHand(hand){
    let score = 0
    let aceCount = 0

    for (let i = 0; i < hand.length; i++) {
        let card = hand[i]
        let cardValue = card.value

        if (cardValue === "J" || cardValue === "Q" || cardValue === "K") {
        score += 10
        } else if (cardValue !== "A") {
            score += parseInt(cardValue)
        } else {
            aceCount++;
        }
    }

  score += aceCount;

  for (let i = 0; i < aceCount; i++) {
    if (score + 10 <= 21) {
      score += 10; // Add 10 for each ace (if it doesn"t bust the hand)
    }
  }
  return score
}

function displayHand(hand, elementId, hideSecondCard = false) {
    const handElement = document.getElementById(elementId)
    handElement.innerHTML = ""

    hand.forEach((card, index) => {
        const cardDiv = document.createElement("div")
        cardDiv.classList.add("card")

    // Create elements for the value in the corners and the suit in the middle
        const topLeft = document.createElement("div")
        const bottomRight = document.createElement("div")
        const middle = document.createElement("div")

        topLeft.classList.add("top-left")
        topLeft.textContent = card.value

        bottomRight.classList.add("bottom-right")
        bottomRight.textContent = card.value

        middle.classList.add("middle")
        middle.textContent = card.suit

        cardDiv.appendChild(topLeft)
        cardDiv.appendChild(middle)
        cardDiv.appendChild(bottomRight)

    // Hide the dealer"s second card if specified
        if (hideSecondCard && elementId === "dealer-hand" && index === 1) {
            cardDiv.textContent = "♛"
            cardDiv.classList.add("hidden")
        } else {
            const topLeft = document.createElement("div")
            const bottomRight = document.createElement("div")
            const middle = document.createElement("div")

            topLeft.classList.add("top-left")
            topLeft.textContent = card.value

            bottomRight.classList.add("bottom-right")
            bottomRight.textContent = card.value

            middle.classList.add("middle")
            middle.textContent = card.suit

            cardDiv.appendChild(topLeft)
            cardDiv.appendChild(middle)
            cardDiv.appendChild(bottomRight)
        }
        handElement.appendChild(cardDiv)
    })
}

function startGame(){
    const betAmount = parseInt(document.getElementById("bet").value)
    if (betAmount <= playerBalance){
        placeBet()
  
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
        document.getElementById("start-button").style.display = "none"
        document.getElementById("playAgain-button").style.display = "none"
        

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
        nextButton.style.display = "block"
    }
}

function stand(){
    displayHand(dealerHand, "dealer-hand", false);
    showDealerScore = true
    const dealerScore = calculateHand(dealerHand)
    const playerScore = calculateHand(playerHand)

    if(dealerScore > playerScore && dealerScore <= 21){
        updateScores()
        determineWinner()
        return;
    }

    while(calculateHand(dealerHand)< 17){
        if(dealerScore > playerScore){
            break
        } else {
            dealCard(dealerHand)
            displayHand(dealerHand, "dealer-hand")
        }
        
    }
    updateScores()
    determineWinner()
}

function updateScores(){
    const playerScore = calculateHand(playerHand)
    let dealerScore = calculateHand(dealerHand)
    
    document.getElementById("player-score").innerText = `Score: ${playerScore}`
    const dealerScoreElement = document.getElementById("dealer-score")

    if (showDealerScore) {
          dealerScoreElement.innerText = `Score: ${dealerScore}`
    } else {
        dealerScoreElement.innerText = "Score: ?"
    }
}

function determineWinner(){
    const playerScore = calculateHand(playerHand)
    const dealerScore = calculateHand(dealerHand)

    if(playerScore > 21){
        endRound("Dealer wins! You busted. Place your next bet!")
    } else if (dealerScore > 21){
        endRound("You Win! Dealer Busted. Place your next bet!")
    } else if (playerScore > dealerScore){
        endRound("You win! Place your next bet!")
    } else if (dealerScore > playerScore){
        endRound("Dealer Wins! Place your next bet!")
    } else {
        endRound("It's a tie! Place your next bet!")
    }

    addBet(dealerScore, playerScore)

    if (playerBalance === 0){
        endGame("You lost all your money. Maybe blackjack isn't for you.")
    }
}

function placeBet(){
    const betAmount = parseInt(document.getElementById("bet").value)
    if (betAmount <= playerBalance){
        playerBalance = playerBalance - betAmount
        document.getElementById("player-balance").innerText = playerBalance
    }else{
        alert("Insufficient balance. Please place a valid bet.")
    }
}

function addBet(dealerScore, playerScore){
    const betAmount = parseInt(document.getElementById("bet").value)

    if (playerScore === 21 && (dealerScore > 21 || dealerScore < 21)){
        playerBalance = playerBalance + (betAmount * 2)
    } else if (dealerScore > 21){
        playerBalance = playerBalance + (betAmount * 2)
        console.log(playerBalance)
    } else if (playerScore > dealerScore){
        playerBalance = playerBalance + (betAmount * 2)
        console.log(playerBalance)
    } else if (playerScore === dealerScore){
        playerBalance = playerBalance + betAmount
        console.log(playerBalance)
    } else {
        playerBalance = playerBalance
    }

    document.getElementById("player-balance").innerText = playerBalance
}

function nextHand(){
    const betAmount = parseInt(document.getElementById("bet").value)
    if (betAmount <= playerBalance){
        placeBet()
  
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
        document.getElementById("next-button").style.display = "none"

        updateScores()
    }else{
        alert("Insufficient balance. Please place a valid bet.")
    }
}

function playAgain(){
    playerBalance = 100 
    document.getElementById("player-balance").innerText = playerBalance

    playerHand = []
    dealerHand = []

    document.getElementById("result").innerText = "Place your bet"
    document.getElementById("start-button").style.display = ""
    document.getElementById("start-button").disable = false
    playAgainButton.style.display = "none"
    document.getElementById("dealer-score").innerText = "Score: ?"
}

function endRound(message){
    document.getElementById("result").innerText = message
    document.getElementById("hit-button").disabled = true
    document.getElementById("stand-button").disabled = true
    document.getElementById("start-button").style.display = "none"
    document.getElementById("next-button").style.display = "block"
    document.getElementById("next-button").disabled = false
}

function endGame(message){
    if (playerBalance === 0){
        document.getElementById("result").innerText = message
    }

    document.getElementById("hit-button").disabled = true
    document.getElementById("stand-button").disabled = true
    document.getElementById("start-button").style.display = "none"
    document.getElementById("playAgain-button").style.display = "block"
    document.getElementById("next-button").style.display = "none"
}