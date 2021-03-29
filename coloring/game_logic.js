(function() {
    "use strict"

    const TOTAL_DRAWINGS = 1;
    const drawing = document.getElementById("main_image");
    const colors = document.getElementsByClassName("palette");

    var currentColor = colors[0];

    function selectColor() {
        currentColor.style.border = "5px solid black";
        currentColor = this;
        currentColor.style.border = "8px solid #0f0";
    }

    function fillPath() {
        this.style.fill = currentColor.style.backgroundColor;
    }
    
    drawing.addEventListener("load", function() {
        const colorAreas = drawing.contentDocument.getElementById('colorAreas').children;
        for (var element of colorAreas) {
            element.onclick = fillPath;
        }
    }, false);

    for (var color of colors) {
        color.onclick = selectColor;
    }

    selectColor.call(colors[0]);
    drawing.data = "./assets/drawing_" + Math.floor(Math.random() * TOTAL_DRAWINGS) + ".svg";
})();