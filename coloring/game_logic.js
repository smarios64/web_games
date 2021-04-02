(function() {
    "use strict"

    const TOTAL_DRAWINGS = 2; // don't forget to increment as you add new images
    const drawing = document.getElementById("main_image");
    const colors = document.getElementsByClassName("color_pick");
    var currentColor = colors[0];
    var imgIndex = Number.parseInt(location.href.substr(location.href.indexOf('?') + 1)); // select an image based on url params 
    if (Number.isNaN(imgIndex) || imgIndex >= TOTAL_DRAWINGS) { // in case we fail to parse the url params, load a random image
        imgIndex = Math.floor(Math.random() * TOTAL_DRAWINGS);
    }

    function selectColor() {
        currentColor.style.border = "3px solid #bbb";
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
    drawing.data = "./assets/drawing_" + imgIndex + ".svg";
})();