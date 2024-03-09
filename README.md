# MONOPOLY ELECTRONIC BANKING CALCULATOR
#### Video Demo:  <URL HERE>
#### Description:
This is a monopoly calculator that can be used in place of the physical banking device provided with the board game. The calculator supports up to 10 players.

The home page of the calculator is a form that asks the user for the number of players playing, and automatically generates the corresponding number of input fields for the players' names. When the create game button is clicked, the app assigns 15 million dollars to each player to start off with.

In the calculator page, the user can input a value into the display box, either by typing or by manually pressing the buttons on the user interface. The user then selects the player who's bank balance will be affected, as well as a multiplier (million or thousand), with likens the interface to that of the physical object. Changes to a players bank balance in stored in an SQL database, that resets itself when a new game is started. The players and their updated balance is displayed at the top of the calculator. The maximum transaction amount is 20 million, and players cannot have negative balances. Triggering these errors would result in the user being redirected to the calculator page.

The calculator page can only be accessed once a game is started. 