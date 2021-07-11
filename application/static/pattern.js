$(document).ready(function () {
    // Add event listeners to the buttons
    add_button_event_listeners();
});

var isPressedDown = false;

function randomHSL(){
    return "hsla(" + ~~(360 * Math.random()) + "," +
                    "70%,"+
                    "80%,1)"
}

function get_hexagons_per_row() {
    const hexagon = document.getElementById("hex-1");

    const containerWidth = document.getElementById("hex-container").offsetWidth;
    const containerPadding = parseInt(window.getComputedStyle(document.getElementById("hex-container")).paddingLeft, 10);
    const overallContainerWidth = containerWidth - (containerPadding * 2);

    const hexagonWidth = hexagon.parentElement.offsetWidth;
    const hexagonMargin = parseInt(window.getComputedStyle(hexagon.parentElement).marginLeft, 10);

    const overallHexagonWidth = hexagonWidth + (hexagonMargin * 2);
    return Math.floor(overallContainerWidth / overallHexagonWidth);
}

function add_hexagon_element(hexagonId, neighbors) {
    const neighbor = document.getElementById(`hex-${hexagonId}`);
    if (neighbor != null) {
        neighbors.push(neighbor);
    }
}

function get_neighboring_hexagons_odd_row(hexagonId, hexagonsPerRow) {
    const neighbors = [];

    // Left
    if ((hexagonId - 1) % hexagonsPerRow != 0) {
        add_hexagon_element(hexagonId - 1, neighbors);
    }

    // Up-left
    add_hexagon_element(hexagonId - hexagonsPerRow, neighbors);

    // Up-right
    if ((hexagonId - hexagonsPerRow) % hexagonsPerRow != 0) {
        add_hexagon_element(hexagonId - hexagonsPerRow + 1, neighbors);
    }

    // Right
    if ((hexagonId) % hexagonsPerRow != 0) {
        add_hexagon_element(hexagonId + 1, neighbors);
    }

    // Down-left
    add_hexagon_element(hexagonId + hexagonsPerRow, neighbors);

    // Down-right
    if ((hexagonId + hexagonsPerRow) % hexagonsPerRow != 0) {
        add_hexagon_element(hexagonId + hexagonsPerRow + 1, neighbors);
    }

    return neighbors;
}

function get_neighboring_hexagons_even_row(hexagonId, hexagonsPerRow) {
    const neighbors = [];

    // Left
    if ((hexagonId - 1) % hexagonsPerRow != 0) {
        add_hexagon_element(hexagonId - 1, neighbors);
    }

    // Up-left
    if ((hexagonId - hexagonsPerRow - 1) % hexagonsPerRow != 0) {
        add_hexagon_element(hexagonId - hexagonsPerRow - 1, neighbors);
    }

    // Up-right
    add_hexagon_element(hexagonId - hexagonsPerRow, neighbors);

    // Right
    if ((hexagonId) % hexagonsPerRow != 0) {
        add_hexagon_element(hexagonId + 1, neighbors);
    }

    // Down-left
    if ((hexagonId + hexagonsPerRow - 1) % hexagonsPerRow != 0) {
        add_hexagon_element(hexagonId + hexagonsPerRow - 1, neighbors);
    }

    // Down-right
    add_hexagon_element(hexagonId + hexagonsPerRow, neighbors);

    return neighbors;
}

function get_neighboring_hexagons(hexagon) {
    const hexagonId = parseInt(hexagon.id.replace("hex-", ""), 10);
    const hexagonsPerRow = get_hexagons_per_row();

    const rowNumber = Math.floor((hexagonId - 1) / hexagonsPerRow);
    console.info(rowNumber);

    if (rowNumber % 2 == 0) {
        return get_neighboring_hexagons_even_row(hexagonId, hexagonsPerRow);
    } else {
        return get_neighboring_hexagons_odd_row(hexagonId, hexagonsPerRow);
    }
}

function click_hexagon(hexagon) {
    console.log(hexagon);
    hexagon.style.background = randomHSL();

    const neighbors = get_neighboring_hexagons(hexagon);
    neighbors.forEach(function(x){
        x.style.background = randomHSL();
    })
}

// Add listeners
function add_button_event_listeners() {
    console.log("Initializing button event listeners");

    $("#hex-container").mousedown(function() {
        isPressedDown = true;
    })

    $("#hex-container").mouseup(function() {
        isPressedDown = false;
    })

    // Clicking on a hexagon
    $(".hexagon-outer").on('mouseenter', 'div', function () {
        if(!isPressedDown) {
            return;
        }

        const hexClicked = $(this)[0];
        click_hexagon(hexClicked);
    });
    $(".hexagon-outer").on('click', 'div', function () {
        const hexClicked = $(this)[0];
        click_hexagon(hexClicked);
    });
}
