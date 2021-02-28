(function() {
    "use strict"
    const X_GLOBAL_OFFSET = 185;
    const Y_GLOBAL_OFFSET = 70;
    const X_CARD_OFFSET = 110;
    const Y_CARD_OFFSET = 110;
    const HOR_CARDS_COUNT = 4;
    const COLORS = [
        'tomato',
        'lightgreen',
        'cyan',
        'skyblue',
        'pink',
        'yellow',
        'greenyellow',
        'orange'
    ];

    var deck = []; // this should never change after initialization
    var covers = []; // this should never change after initialization
    var pairs = [];
    var openCard = -1;
    var startBtn;
    var gameOverScreen;

    var reset = function() {
        var temp = [];
        openCard = -1;
        gameOverScreen.style.display = 'none';
        for (var i = 0; i < deck.length; ++i) {
            pairs[i] = undefined;
            deck[i].style.display = 'none';
            temp.push(deck[i]);
        }

        var counter = 0;
        while (temp.length > 0) {
            var index = Math.floor(Math.random() * temp.length);
            pairs[counter] = temp[index];
            temp[index].style.left = ((counter % HOR_CARDS_COUNT) * X_CARD_OFFSET + X_GLOBAL_OFFSET) + "px";
            temp[index].style.top = (Math.floor(counter / HOR_CARDS_COUNT) * Y_CARD_OFFSET + Y_GLOBAL_OFFSET) + "px";
            temp[index].style.display = 'block';
            temp.splice(index, 1);
            ++counter;
        }
        startBtn.style.display = 'block';
    }

    var onCardClicked = function(e) {
        var index = covers.indexOf(e.currentTarget);
        pairs[index].style.display = 'block';
        if (openCard < 0) {
            openCard = index;
        }
        else {
            // did we find a match?
            if (pairs[index].style.backgroundColor === pairs[openCard].style.backgroundColor) {
                // remove the cards from pairs[]
                pairs[openCard] = pairs[index] = undefined;

                // TODO: play success sound

                // check if we ran out of pairs and if so, game over
                var gameOver = true;
                for (var i = 0; i < pairs.length; ++i) {
                    if (pairs[i]) {
                        gameOver = false;
                        break;
                    }
                }
                if (gameOver) {
                    setTimeout(function() {
                        // TODO: play applause sound

                        gameOverScreen.style.display = 'block';
                    }, 1000);
                }
            }
            else {
                // TODO: play fail sound

                // remove events temporarily
                for (var i = 0; i < covers.length; ++i) {
                    covers[i].onclick = undefined;
                }
                // flip cards back down
                var tempCard = openCard;
                setTimeout(function() {
                    pairs[tempCard].style.display = 'none';
                    pairs[index].style.display = 'none';
                    for (var i = 0; i < covers.length; ++i) {
                        covers[i].onclick = onCardClicked;
                    }
                }, 2000);
            }
            openCard = -1;
        }
    };

    // initialization
    var canvas = document.getElementById("canvas");
    for (var i = 0; i < 16; ++i) {
        var cover = document.createElement('div');
        var card = document.createElement('div');
        covers.push(cover);
        cover.onclick = onCardClicked;
        cover.className = 'card';
        cover.style.backgroundColor = '#acf';
        cover.style.boxShadow = '0 0 6px black';
        cover.style.left = ((i % HOR_CARDS_COUNT) * X_CARD_OFFSET + X_GLOBAL_OFFSET) + "px";
        cover.style.top =  (Math.floor(i / HOR_CARDS_COUNT) * Y_CARD_OFFSET + Y_GLOBAL_OFFSET) + "px";
        cover.innerHTML = '<img src="assets/images/cover.png">'
        canvas.appendChild(cover);
    }

    for (var i = 0; i < COLORS.length; ++i) {
        for (var j = 0; j < 2; ++j) {
            var card = document.createElement('div');
            deck.push(card);
            card.className = 'card';
            card.style.backgroundColor = COLORS[i];
            card.innerHTML = '<img src="assets/images/card_' + i + '.png">'
            canvas.appendChild(card);
            pairs.push(undefined);
        }
    }
    
    startBtn = document.getElementById("startBtn");
    startBtn.onclick = function() {
        for (var i = 0; i < pairs.length; ++i) {
            pairs[i].style.display = 'none';
        }
        startBtn.style.display = 'none';
    };
    
    document.getElementById("playAgainBtn").onclick = reset;
    gameOverScreen = document.getElementById("gameOverScreen");

    // TODO: play music

    reset();

})();