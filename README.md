Wireframe: https://photos.app.goo.gl/1ew87AecwAMCxnD16


///Pseudocode 
Start the Blackjack game
    Initialize player's balance with a default amount

    Loop until the player decides to quit or runs out of money
        Display player's balance
        Ask the player for their bet amount

        Deal two cards to the player and the dealer (Hide the second card)
        Calculate and display the scores for the player and the dealer (hide dealer's score)

        If player's score is 21:
            Display "Blackjack! You win!" and award the bet amount multiplied by 2 to the player's balance
            Continue to the next round

        Ask the player to Hit or Stand:
            While player chooses to Hit:
                Deal a card to the player
                Calculate and display the updated score for the player
                If player's score exceeds 21 (bust), the player loses the round

        If player chooses to Stand:
            Reveal the hidden dealer card and display the dealer's hand
            Dealer keeps Hitting until their score reaches 17 or higher

            If dealer's score exceeds 21 (bust):
                Player wins the round and the bet amount is awarded to the player's balance

            Compare the scores:
                If player's score is higher than dealer's score and does not exceed 21:
                    Player wins the round and the bet amount is awarded to the player's balance
                If dealer's score is higher than player's score and does not exceed 21:
                    Player loses the round and the bet amount is deducted from the player's balance
                If both have the same score, it's a tie, and the bet amount is returned to the player

        Ask the player if they want to play another round or quit
    End the game

