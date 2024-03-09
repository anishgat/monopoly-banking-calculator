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