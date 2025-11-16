const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('scorePoints'),
    },
    cardSprites: {
        avatar: document.getElementById('cardImage'),
        name: document.getElementById('cardName'),
        type: document.getElementById('cardType'),
    },
    fieldCards: {
        player: document.getElementById('playerFieldCard'),
        computer: document.getElementById('computerFieldCard'),
    },
    playerSides: {
        player1: "playerCards",
        computer: "computerCards",
        player1BOX: document.querySelector('#playerCards'),
        computerBOX: document.querySelector('#computerCards'),
    },
    actions: {
        button: document.getElementById('nextDuel'),
    },
};

const pathImages = './src/assets/icons/';

const cardData = [
    {
        id: 0,
        name: "Blue-Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia the Forbidden One",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    }
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', './src/assets/icons/card-back.png');
    cardImage.setAttribute('data-id', IdCard);

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener('mouseover', () => {
            drawSelectedCard(IdCard);
        });

        cardImage.addEventListener('click', () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.classList.add('card');
    }
    return cardImage;
}

async function setCardsField(cardId) {

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = 'block';
    state.fieldCards.computer.style.display = 'block';

    state.cardSprites.avatar.src = '';
    state.cardSprites.name.innerText = '';
    state.cardSprites.type.innerText = '';

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResult = await checkDuelResult(cardId, computerCardId);

    await updateScores();
    await drawButton(duelResult);
}

async function updateScores() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(duelResult) {
    state.actions.button.style.display = 'block';
    state.actions.button.innerText = `${duelResult}`;
}

async function checkDuelResult(playerCardId, computerCardId) {
    let duelResult = 'Empate';
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResult = 'Vitória';
        await playAudio('win');
        state.score.playerScore += 1;
    } else if (playerCard.LoseOf.includes(computerCardId)) {
        duelResult = 'Derrota';
        await playAudio('lose');
        state.score.computerScore += 1;
    }

    return duelResult;
}

async function removeAllCardsImages() {

    let { computerBOX, player1BOX } = state.playerSides;
    let imageElements = computerBOX.querySelectorAll('img');
    imageElements.forEach((img) => img.remove());

    imageElements = player1BOX.querySelectorAll('img');
    imageElements.forEach((img) => img.remove());

}

async function drawSelectedCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = `Attribute: ${cardData[index].type}`;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = '';
    state.actions.button.style.display = 'none';

    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';

    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {
    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById('bgm');
    bgm.play();
}

init();