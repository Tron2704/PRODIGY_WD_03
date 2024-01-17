document.addEventListener('DOMContentLoaded', () => {
    let PlayerNum = 1; 
    let currPlayer = 'X';
    let ActiveGame = true;
    let board = ['', '', '', '', '', '', '', '', ''];

    const onePlayerBtn = document.getElementById('onePlayerBtn');
    const twoPlayersBtn = document.getElementById('twoPlayersBtn');

    onePlayerBtn.addEventListener('click', () => {
        PlayerNum = 1;
        onePlayerBtn.classList.add('active');
        twoPlayersBtn.classList.remove('active');
        resetGame();
    });

    twoPlayersBtn.addEventListener('click', () => {
        PlayerNum = 2;
        twoPlayersBtn.classList.add('active');
        onePlayerBtn.classList.remove('active');
        resetGame();
    });

    const displayPlayer = document.querySelector('.display-player');
    const announcer = document.querySelector('.announcer');
    const announcementText = document.querySelector('.announcer .announcement-text');
    const container = document.querySelector('.container');

    // Create the board
    for (let i = 0; i < 9; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.index = i;
        tile.addEventListener('click', handleTileClick);
        container.appendChild(tile);
    }

    function handleTileClick(event) {
        const index = event.target.dataset.index;

        if (board[index] === '' && ActiveGame) {
            board[index] = currPlayer;
            event.target.textContent = currPlayer;

            if (WinChecker()) {
                announcementText.textContent = `${getCurrPlayerName()} wins!`;
                announcer.classList.remove('hide');
                ActiveGame = false;

                // Hide display-player when there's a winner
            } else if (board.every(cell => cell !== '')) {
                announcementText.textContent = 'It\'s a tie!';
                announcer.classList.remove('hide');
                ActiveGame = false;
            } else {
                currPlayer = currPlayer === 'X' ? 'O' : 'X';
                displayPlayer.textContent = currPlayer;

                if (PlayerNum === 1 && currPlayer === 'O' && ActiveGame) {
                    setTimeout(makeAIMove, 500);
                }
            }
        }
    }

    function makeAIMove() {
        const emptyTiles = board.reduce((acc, value, index) => {
            if (value === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        if (emptyTiles.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyTiles.length);
            const aiMove = emptyTiles[randomIndex];
            board[aiMove] = currPlayer;
            container.children[aiMove].textContent = currPlayer;

            if (WinChecker()) {
                announcementText.textContent = 'AI wins!';
                announcer.classList.remove('hide');
                ActiveGame = false;
            } else if (board.every(cell => cell !== '')) {
                announcementText.textContent = 'It\'s a tie!';
                announcer.classList.remove('hide');
                ActiveGame = false;
            } else {
                currPlayer = 'X';
                displayPlayer.textContent = currPlayer;
            }
        }
    }

    function WinChecker() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winConditions.some(condition => {
            const [a, b, c] = condition;
            return board[a] !== '' && board[a] === board[b] && board[a] === board[c];
        });
    }

    function getCurrPlayerName() {
        return currPlayer === 'X' ? 'Player X' : 'Player O';
    }

    function resetGame() {
        currPlayer = 'X';
        ActiveGame = true;
        board = ['', '', '', '', '', '', '', '', ''];
        displayPlayer.textContent = currPlayer;
        announcementText.textContent = 'Playing...'; 
        announcer.classList.add('hide');

        displayPlayer.style.display = 'inline';

        container.childNodes.forEach(tile => {
            tile.textContent = '';
        });

        if (PlayerNum === 1 && currPlayer === 'O' && ActiveGame) {
            setTimeout(makeAIMove, 500);
        }
    }

    document.getElementById('reset').addEventListener('click', resetGame);
});
