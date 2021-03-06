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
            // did we find a match?
            if (pairs[index].card.style.backgroundColor === pairs[openCard].card.style.backgroundColor) {
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

                // remove events temporarily
                for (var i = 0; i < covers.length; ++i) {
                    covers[i].onclick = undefined;
                }
                // flip cards back down
                const tempCard = openCard;
                setTimeout(function() {
                    pairs[tempCard].card.style.boxShadow = pairs[index].card.style.boxShadow = '0 0 5px 5px red';
                    wrongAudio.play();
                    setTimeout(function() {
                        pairs[tempCard].card.style.boxShadow = pairs[index].card.style.boxShadow = '0 0 6px black';
                        pairs[tempCard].card.style.display = pairs[index].card.style.display = 'none';
                        covers[tempCard].style.display = covers[index].style.display = 'block';
                        for (var i = 0; i < covers.length; ++i) {
                            covers[i].onclick = onCardClicked;
                        }
                    }, 1000);
                }, 1000);
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
    const cardPHs = document.getElementsByTagName("td"); // this is safe as we currently do not have any tables besides the deck table

    for (var i = 0; i < cardPHs.length; ++i) {
        var cover = document.createElement('div');
        covers.push(cover);
        cover.onclick = onCardClicked;
        cover.className = 'card';
        cover.style.backgroundColor = '#acf';
        cover.innerHTML = '<img src="assets/images/cover.png">'
    }

    for (var i = 0; i < COLORS.length; ++i) {
        var audio = new Audio('assets/audio/card_' + i + '.mp3');
        for (var j = 0; j < 2; ++j) {
            var card = document.createElement('div');
            deck.push({ card: card, audio: audio });
            card.className = 'card';
            card.style.backgroundColor = COLORS[i];
            card.innerHTML = '<img src="assets/images/card_' + i + '.png">'
            pairs.push(undefined);
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