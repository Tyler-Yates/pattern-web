$(document).ready(function () {
    // Add event listeners to the buttons
    add_button_event_listeners();
});

function randomHSL(){
    return "hsla(" + ~~(360 * Math.random()) + "," +
                    "70%,"+
                    "80%,1)"
}

// Add listeners
function add_button_event_listeners() {
    console.log("Initializing button event listeners");

    // Clicking on a hexagon
    $(".hexagon-outer").on('click', 'div', function () {
        const hexClicked = $(this)[0];

        console.log(hexClicked);
        console.log(randomHSL());
        hexClicked.style.background = randomHSL();
    });
}
