var planets = [];

$(document).ready(function () {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        switch (message) {
            case "recolectProduction": {
                fnRecolectProduction();
            } break;
            case "resetMemory": {
                chrome.storage.local.clear(function () { });
            }
        }

        sendResponse(true);
    });

    chrome.storage.local.get(["inProcessMethod", "isUnderAttack"], function (savedData) {
        var nameMethod = savedData["inProcessMethod"];
        var isUnderAttack = savedData["isUnderAttack"];

        // Check attack
        fnCheckAttack();

        var minRandMinutesIn = 5;
        var maxRandMinutesEx = 13;
        var nextCheck = 0;

        if(isUnderAttack == undefined) {
            nextCheck = Math.floor(minRandMinutesIn + Math.random() * (maxRandMinutesEx - minRandMinutesIn)) * 60000;
        } else {
            nextCheck = 15000;
        }
        console.log("Next check in: " + nextCheck / 60000 + " minutes (" + (nextCheck) + " ms)");
        setInterval(() => {
            document.location.reload();
        }, nextCheck);

        // Continue with method if correspond
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

    chrome.storage.local.get(["currentIndexPlanet", "currentPage", "goNextPlanet"], function (savedData) {
        var currentPlanet = savedData["currentIndexPlanet"];
        var currentPage = savedData["currentPage"];
        var goNextPlanet = savedData["goNextPlanet"];

        // Si no estamos en la pagina de flota nos movemos a ella
        if (currentPage == undefined || currentPage != "fleet1" && currentPage != "fleet2" && currentPage != "fleet3") {
            fnGoFleetPage1();
        } else {
            // Si no tenemos valor, empezamos en el primer planeta
            if (currentPlanet == undefined) {
                currentPlanet = 0;
                chrome.storage.local.set({ "currentIndexPlanet": currentPlanet, "goNextPlanet": false }, function () { });
                planets[currentPlanet].click();

            } else if (currentPlanet <= planets.length - 1) {
                if (!goNextPlanet) {
                    switch (currentPage) {
                        case "fleet1": {
                            chrome.storage.local.set({ "currentPage": "fleet2" }, function () { });

                            var amountResources = parseInt($("#resources_metal").text().replace(/\./g, ""));
                            amountResources += parseInt($("#resources_crystal").text().replace(/\./g, ""));
                            amountResources += parseInt($("#resources_deuterium").text().replace(/\./g, ""));

                            fnSendLargeCargoShips(amountResources);
                        } break;
                        case "fleet2": {
                            chrome.storage.local.set({ "currentPage": "fleet3" }, function () { });

                            document.querySelector("span[class*='planets'] a").click();
                            document.querySelector("a[data-value*='2#28#10#3#L-8']").click();
                            document.querySelector("#continue").click();
                        } break;
                        case "fleet3": {
                            chrome.storage.local.set({ "currentPage": "fleet1", "goNextPlanet": true }, function () { });
                            document.querySelector("#missionButton3").click();
                            document.querySelector("#allresources").click();
                            document.querySelector("#start").click();
                        } break;
                    }
                } else {
                    // Una vez terminado el proceso nos movemos al siguiente planeta
                    currentPlanet++;
                    chrome.storage.local.set({ "currentIndexPlanet": currentPlanet, "goNextPlanet": false }, function () { });

                    if (currentPlanet > planets.length - 1) {
                        document.location.reload();
                    }

                    planets[currentPlanet].click();
                }

                // =======================
                // Hacer una clase de configuracion donde poner todas las palabras estas para tenerlas accesibles y cambiarlas en caso de cambien algun dia
                // Tambien meter por ejemplo la capacidad de carga de las naves
                // Poder introducir el planeta/luna de destino
                // =======================
            } else {
                fnClearStorage(["currentIndexPlanet", "inProcessMethod", "currentPage", "goNextPlanet"]);
            }
        }
    });
}

function fnSendLargeCargoShips(amountResources) {
    var amountShips = amountResources / 35000;
    var amountShipsInt = parseInt(amountShips.toString());

    if (amountShipsInt > 0) {
        var element = document.querySelector("#ship_203");

        element.value = amountShipsInt;
        element.dispatchEvent(new KeyboardEvent("keyup"));
        document.querySelector("#continue").click();
    } else {
        chrome.storage.local.set({ "currentPage": "fleet1", "goNextPlanet": true }, function () { });
        document.location.reload();
    }
}

function fnGoFleetPage1() {
    chrome.storage.local.set({ "currentPage": "fleet1" }, function () { });
    $("a[href*='fleet1']")[0].click();
}

function fnClearStorage(listKeys) {
    chrome.storage.local.remove(listKeys, function () {
        var error = chrome.runtime.lastError;

        if (error) {
            alert("ERROR: " + error);
        } else {
            alert("Proceso completado");
        }
    })
}

function fnCheckAttack() {
    if (document.querySelector("div[class*='soon']") != null) {
        chrome.storage.local.set({ "isUnderAttack": true }, function () { });
        var myAudio = new Audio(chrome.runtime.getURL("/resources/alert.wav"));
        myAudio.play();
    } else {
        chrome.storage.local.remove(["isUnderAttack"], function () { });
    }
}