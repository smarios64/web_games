(function() {
    "use strict"
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

    var reset = function() {
        var temp = [];
        openCard = -1;
        gameOverScreen.style.display = 'none';

        for (var i = 0; i < deck.length; ++i) {
            cardPHs[i].innerHTML = "";
            covers[i].style.display = 'none';
            cardPHs[i].appendChild(covers[i]);
            pairs[i] = undefined;
            temp.push(deck[i]);
        }

        var counter = 0;
        while (temp.length > 0) {
            var index = Math.floor(Math.random() * temp.length);
            pairs[counter] = temp[index];
            temp[index].style.display = 'block';
            cardPHs[counter].appendChild(temp[index]);
            temp.splice(index, 1);
            ++counter;
        }
        startBtn.style.display = 'block';
    }

    var onCardClicked = function(e) {
        var index = covers.indexOf(e.currentTarget);
        pairs[index].style.display = 'block';
        covers[index].style.display = 'none';
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
                    covers[tempCard].style.display = 'block';
                    covers[index].style.display = 'block';
                    for (var i = 0; i < covers.length; ++i) {
                        covers[i].onclick = onCardClicked;
                    }
                }, 2000);
            }
            openCard = -1;
        }
    };

    // initialization
    var tableNodes = "";
    for (var i = 0; i < (COLORS.length * 2) / HOR_CARDS_COUNT; ++i) {
        tableNodes += "<tr>";
        for (var j = 0; j < HOR_CARDS_COUNT; ++j) {
            tableNodes += "<td></td>";
        }
        tableNodes += "</tr>";
    }
    document.getElementById('deckTable').innerHTML = tableNodes;
    var cardPHs = document.getElementsByTagName("td"); // this is safe as we currently do not have any tables besides the deck table

    for (var i = 0; i < cardPHs.length; ++i) {
        var cover = document.createElement('div');
        covers.push(cover);
        cover.onclick = onCardClicked;
        cover.className = 'card';
        cover.style.backgroundColor = '#acf';
        cover.innerHTML = '<img src="assets/images/cover.png">'
    }

    for (var i = 0; i < COLORS.length; ++i) {
        for (var j = 0; j < 2; ++j) {
            var card = document.createElement('div');
            deck.push(card);
            card.className = 'card';
            card.style.backgroundColor = COLORS[i];
            card.innerHTML = '<img src="assets/images/card_' + i + '.png">'
            pairs.push(undefined);
        }
    }

    var startBtn = document.getElementById("startBtn");
    startBtn.onclick = function() {
        for (var i = 0; i < pairs.length; ++i) {
            pairs[i].style.display = 'none';
            covers[i].style.display = 'block';
        }
        startBtn.style.display = 'none';
    };
    
    document.getElementById("playAgainBtn").onclick = reset;
    var gameOverScreen = document.getElementById("gameOverScreen");

    // TODO: play music

    reset();

})();