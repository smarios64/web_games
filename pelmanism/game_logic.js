(function() {
    "use strict"
    const TOTAL_PAIRS = 24;
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

    const deck = []; // this should never change after initialization
    const covers = []; // this should never change after initialization
    const pairs = [];
    const correctAudio = new Audio('./assets/audio/correct.mp3');;
    const wrongAudio = new Audio('./assets/audio/wrong.mp3');;
    const congratsAudio = new Audio('./assets/audio/congratulations.mp3');;
    var openCard = -1;


    const reset = function() {
        const temp = [];
        openCard = -1;
        gameOverScreen.style.display = 'none';
        var index = Math.floor(Math.random() * TOTAL_PAIRS)

        for (var i = 0; i < COLORS.length; ++i) {
            for (var j = 0; j < 2; ++j) {
                cardPHs[i * 2 + j].innerHTML = "";
                covers[i * 2 + j].style.display = 'none';
                cardPHs[i * 2 + j].appendChild(covers[i * 2 + j]);
                pairs[i * 2 + j] = undefined;
                var card = deck[((index + i) % TOTAL_PAIRS) * 2 + j];
                card.card.style.backgroundColor = COLORS[i];
                temp.push(card);
            }
        }

        var counter = 0;
        while (temp.length > 0) {
            index = Math.floor(Math.random() * temp.length);
            pairs[counter] = temp[index];
            temp[index].card.style.display = 'block';
            cardPHs[counter].appendChild(temp[index].card);
            temp.splice(index, 1);
            ++counter;
        }
        startBtn.style.display = 'block';
    }

    const onCardClicked = function(e) {
        const index = covers.indexOf(e.currentTarget);
        pairs[index].card.style.display = 'block';
        pairs[index].card.style.boxShadow = '0 0 5px 5px yellow';
        covers[index].style.display = 'none';

        pairs[index].audio.play();
        
        if (openCard < 0) {
            openCard = index;
        }
        else {
            // remove events temporarily
            for (var i = 0; i < covers.length; ++i) {
                covers[i].onclick = undefined;
            }

            // did we find a match?
            if (pairs[index].id === pairs[openCard].id) {
                // remove the cards from pairs[]
                var openCards = [pairs[openCard].card, pairs[index].card];
                pairs[openCard] = pairs[index] = undefined;

                // check if we ran out of pairs and if so, game over
                var gameOver = true;
                for (var i = 0; i < pairs.length; ++i) {
                    if (pairs[i]) {
                        gameOver = false;
                        break;
                    }
                }

                setTimeout(function() {
                    openCards[0].style.boxShadow = openCards[1].style.boxShadow = '0 0 5px 5px #0f8';
                    correctAudio.play();
                    setTimeout(function() {
                        if (gameOver) {
                            congratsAudio.play();
                            gameOverScreen.style.display = 'block';
                        }
                        openCards[0].style.boxShadow = openCards[1].style.boxShadow = '0 0 6px black';
                    }, 1000);
                }, 1000);
            }
            else {
                // flip cards back down
                const tempCard = openCard;
                setTimeout(function() {
                    pairs[tempCard].card.style.boxShadow = pairs[index].card.style.boxShadow = '0 0 5px 5px red';
                    wrongAudio.play();
                    setTimeout(function() {
                        pairs[tempCard].card.style.boxShadow = pairs[index].card.style.boxShadow = '0 0 6px black';
                        pairs[tempCard].card.style.display = pairs[index].card.style.display = 'none';
                        covers[tempCard].style.display = covers[index].style.display = 'block';
                    }, 1000);
                }, 1000);
            }

            // add events back
            setTimeout(function () {
                for (var i = 0; i < covers.length; ++i) {
                    covers[i].onclick = onCardClicked;
                }
            }, 2000);
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
    const cardPHs = document.getElementsByTagName("td"); // this is safe as we currently do not have any tables besides the deck table

    for (var i = 0; i < cardPHs.length; ++i) {
        var cover = document.createElement('div');
        covers.push(cover);
        cover.onclick = onCardClicked;
        cover.className = 'card';
        cover.style.backgroundColor = '#acf';
        cover.innerHTML = '<img src="assets/images/cover.png" draggable="false">';
        pairs.push(undefined);
    }

    for (var i = 0; i < TOTAL_PAIRS; ++i) {
        var audio = new Audio('assets/audio/card_' + i + '.mp3');
        for (var j = 0; j < 2; ++j) {
            var card = document.createElement('div');
            deck.push({ card: card, audio: audio, id: i });
            card.className = 'card';
            card.innerHTML = '<img src="assets/images/card_' + i + '.png" draggable="false">'
        }
    }

    var startBtn = document.getElementById("startBtn");
    startBtn.onclick = function() {
        for (var i = 0; i < pairs.length; ++i) {
            pairs[i].card.style.display = 'none';
            covers[i].style.display = 'block';
        }
        startBtn.style.display = 'none';
    };
    
    document.getElementById("playAgainBtn").onclick = reset;
    const gameOverScreen = document.getElementById("gameOverScreen");

    reset();
})();