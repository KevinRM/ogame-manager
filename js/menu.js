$(document).ready(function () {
    var btnRecolectProduction = document.getElementById("recolectProduction");
    var btnResetMemory = document.getElementById("resetMemory");

    $(btnRecolectProduction).click(function () {
        chrome.tabs.query({active: true, currentWindow:true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, "recolectProduction", function(response) {
                console.log("Orden completada: " + response);
            });
        });
    });

    $(btnResetMemory).click(function () {
        chrome.tabs.query({active: true, currentWindow:true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, "resetMemory", function(response) {
                console.log("Orden completada: " + response);
            });
        });
    });

    console.log("==> Menu is ready");
});
console.log("Llegue");