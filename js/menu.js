$(document).ready(function () {
    var btnRecolectProduction = document.getElementById("recolectProduction");

    $(btnRecolectProduction).click(function () {
        $(btnRecolectProduction).attr("disabled", true);

        chrome.tabs.query({active: true, currentWindow:true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, "recolectProduction", function(response) {
                console.log("Orden completada: " + response);

                $(btnRecolectProduction).attr("disabled", false);
            });
        });
    });

    console.log("==> Menu is ready");
});
console.log("Llegue");