var planets = [];

$(document).ready(function () {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        switch (message) {
            case "recolectProduction": {
                fnRecolectProduction();
            } break;
        }

        sendResponse(true);
    });

    chrome.storage.local.get("inProcessMethod", function (inProcessMethod) {
        var nameMethod = inProcessMethod["inProcessMethod"];

        switch (nameMethod) {
            case "fnRecolectProduction": {
                fnRecolectProduction();
            } break;
        }
    });
});

function fnRecolectProduction() {
    // Indicamos en la funcion que estamos
    chrome.storage.local.set({ "inProcessMethod": "fnRecolectProduction" }, function () { });

    planets = $(".planetlink");

    chrome.storage.local.get(["currentIndexPlanet", "currentPage"], function (savedData) {
        var currentPlanet = savedData["currentIndexPlanet"];
        var currentPage = savedData["currentPage"];

        // Si no estamos en la pagina de flota nos movemos a ella
        console.log(currentPage);
        if (currentPage == undefined || currentPage != "fleet1" /*y fleet 2 y fleet 3*/) {
            fnGoFleetPage();
        } else {
            // Si no tenemos valor, empezamos en el primer planeta
            if (currentPlanet == undefined) {
                currentPlanet = 0;
                planets[currentPlanet].click();
                //chrome.storage.local.set({ "currentIndexPlanet": currentPlanet }, function () { });
            }

            if (currentPlanet < planets.length - 1) {
                currentPlanet++;

                planets[currentPlanet].click();

                chrome.storage.local.set({ "currentIndexPlanet": currentPlanet }, function () { });
            } else {
                fnClearStorage(["currentIndexPlanet", "inProcessMethod", "currentPage"]);
            }
        }
    });
}

function fnSendLargeCargoShips() {

}

function fnGoFleetPage() {
    chrome.storage.local.set({ "currentPage": "fleet1" }, function () { });
    $("a[href*='fleet1']")[0].click();
}

function fnClearStorage(listKeys) {
    chrome.storage.local.remove(listKeys, function () {
        var error = chrome.runtime.lastError;

        if (error) {
            console.log("Error => " + error);
        } else {
            console.log("Valores eliminados");
        }
    })
}