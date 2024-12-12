const start_balance = 15000000;
var players = {};
var rent = false;
var rent_info = {};

function clearScreen() {
    document.getElementById("result").value = "";
    document.getElementById("M-button").disabled = true;
    document.getElementById("K-button").disabled = true;
    document.getElementById("multiplication_factor").value = 0;
}

function display(value) {
    document.getElementById("result").value += value;
}

function multiplier(letter) {
    if (letter === 'K') {
        document.getElementById("K-button").disabled = false;
        document.getElementById("M-button").disabled = true;
        document.getElementById("multiplication_factor").value = 1000;
    } else if (letter === 'M') {
        document.getElementById("M-button").disabled = false;
        document.getElementById("K-button").disabled = true;
        document.getElementById("multiplication_factor").value = 1000000;
    }
}

function createPlayerInput() {
    let numPlayer = document.getElementById("num_players").value;
    let playerInputsDiv = document.getElementById("player_inputs");

    playerInputsDiv.innerHTML = "";

    for (let i = 0; i < numPlayer; i++) {
        let input = document.createElement("input");
        input.type = "text";
        input.name = "player" + (i + 1);
        input.placeholder = "Player " + (i + 1) + " Name";
        input.className = "form-control mb-3";
        input.required = true;
        playerInputsDiv.appendChild(input);
    }
}

function refresh() {
    document.getElementById("result").value = "";
    document.getElementById("K-button").disabled = true;
    document.getElementById("M-button").disabled = true;
    document.getElementById("multiplication_factor").value = 0;

    let playerOptions = document.getElementsByName("player");
    playerOptions.forEach((option) => {
        option.checked = false;
    });
}

function executeTransaction(sign, multiplication_factor = document.getElementById("multiplication_factor").value, value = document.getElementById("result").value) {
    let playerOptions = document.getElementsByName("player");
    let player = null;
    for (let option of playerOptions) {
        if (option.checked) {
            player = option.id;
            break;
        }
    }
    if (player == null) {
        return alert("No player selected");
    }

    // Insert alert in case any field is missing
    if (isNaN(value) || value === "") {
        return alert("The value inputted is invalid");
    }

    if (multiplication_factor == 0) {
        return alert("No multiplier was inputted");
    }

    let change = parseFloat(sign + value) * parseFloat(multiplication_factor);
    if (Math.abs(change) < 10000 || Math.abs(change) > 20000000) {
        return alert("Please input a value between 10,000 and 20,000,000.");
    }
    
    let player_balance = players[player];
    if ((player_balance += change) < 0) {
        return alert(`${player} does not have enough funds.`);
    }
    players[player] += change;
    document.getElementById(player).value = players[player];
    document.querySelector(`label[for="${player}"] span`).innerHTML = `${player}: ${players[player]}`;
    refresh();
    return;
}

document.addEventListener("DOMContentLoaded", () => {
    let inputPlayerForm = document.getElementById("inputPlayerPage");
    let calculatorPage = document.getElementById("calculatorPage");

    inputPlayerForm.style.display = "block";
    calculatorPage.style.display = "none";

    let playerInputForm = document.getElementById("inputPlayerForm");
    playerInputForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        let numPlayer = document.getElementById("num_players").value;
        for (let player = 0; player < numPlayer; player++) {
            let playerName = document.getElementsByName(`player${player + 1}`)[0].value;
            if (playerName === "") {
                alert(`Enter a name for player ${player + 1}`);
                break
            } else {
                players[`${playerName}`] = start_balance;
            }
        }
        inputPlayerForm.style.display = "none";
        calculatorPage.style.display = "block";

        let playerDisplay = document.getElementById("player-display");
        for (let name in players) {
            playerLabel = document.createElement("label");
            playerLabel.setAttribute("for", `${name}`);

            let playerButton = document.createElement("input");
            playerButton.type = "radio";
            playerButton.id = name;
            playerButton.name = "player";
            playerButton.value = start_balance;

            let playerInfo = document.createElement("span");
            playerInfo.innerHTML = `${name}: ${players[name]}`;

            playerLabel.appendChild(playerButton);
            playerLabel.appendChild(playerInfo);
            playerDisplay.appendChild(playerLabel);
        }
    });

    let plusButton = document.getElementById("plus");
    plusButton.addEventListener("click", function() {
        if (rent === false) {
            return executeTransaction(this.value);
        }
        executeTransaction("+", rent_info.multiplication_factor, rent_info.value)
        rent = false;
        rent_info = {};
    });

    let minusButton = document.getElementById("minus");
    minusButton.addEventListener("click", function() {
        if (rent === false) {
            return executeTransaction(this.value);
        }
        return alert("Calculator is on rent mode. Please click a player's name followed by the plus button.");
    });

    let goButton = document.getElementById("GO");
    goButton.addEventListener("click", function() {
        if (rent === false) {
            return executeTransaction("+", "1000000", "2");
        }
        return alert("Calculator is on rent mode. Please click a player's name followed by the plus button.");
    });

    let rentButton = document.getElementById("rent");
    rentButton.addEventListener("click", function() {
        rent = true;
        rent_info.multiplication_factor = document.getElementById("multiplication_factor").value;
        rent_info.value = document.getElementById("result").value;
        executeTransaction("-");
        console.log(rent_info);
    });

});
