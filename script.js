const Player = (marker) => {
  const getMarker = () => marker;

  const addMarker = (gameboardArray, item) => {
    const itemIndex = item.dataset.id;
    item.disabled = true;
    gameboardArray[itemIndex] = getMarker();
  };

  return { addMarker, getMarker };
};

const gameBoard = (() => {
  let gameboardArray = ["", "", "", "", "", "", "", "", ""];

  const renderGameboard = () => {
    const gameboardDiv = document.querySelector(".gameboard");

    const gameboardDivItems = Array.from(gameboardDiv.childNodes);

    gameboardDivItems.forEach((item) => item.remove());

    gameboardArray.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.textContent = item;
      itemDiv.dataset.id = index;
      itemDiv.classList.add("item");
      gameboardDiv.appendChild(itemDiv);
    });
  };

  const clearGameBoard = () => {
    gameboardArray.forEach((item, index) => {
      gameboardArray[index] = "";
    });

    renderGameboard();
  };

  return { renderGameboard, gameboardArray, clearGameBoard };
})();

const displayController = (() => {
  const gameboardDiv = document.querySelector(".gameboard");
  const restartButtons = document.querySelectorAll(".restart-btn");
  const endMessage = document.querySelector(".end-game-message");

  const xButton = document.querySelector(".x");
  xButton.classList.toggle("active");

  gameboardDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("item")) {
      const item = e.target;
      if (gameFlow.gameOver || item.textContent !== "") return;

      gameFlow.playRound(item);
      gameBoard.renderGameboard();
    }
  });

  restartButtons.forEach((button) =>
    button.addEventListener("click", () => {
      gameFlow.resetGame();
      if (xButton.classList.contains("active")) return;
      xButton.classList.toggle("active");
    })
  );

  const setEndGameMessage = (winner) => {
    switch (winner) {
      case "Draw":
        endMessage.textContent = "it's a Draw";
        break;
      default:
        endMessage.textContent = `${winner.toUpperCase()} has won!`;
    }
  };

  return { setEndGameMessage };
})();

gameBoard.renderGameboard();
const gameFlow = (() => {
  const player1 = Player("x");
  const player2 = Player("o");

  const xButton = document.querySelector(".x");
  const oButton = document.querySelector(".o");
  const gameOverScreen = document.querySelector(".game-modal");

  let gameOver = false;
  let round = 1;

  const setCurrentPlayer = () => {
    return round % 2 === 1 ? player1 : player2;
  };

  const playRound = (item) => {
    const gameboard = gameBoard.gameboardArray;

    setCurrentPlayer().addMarker(gameboard, item);

    gameBoard.renderGameboard();
    if (setCurrentPlayer().getMarker() === "x") {
      xButton.classList.toggle("active");
      oButton.classList.toggle("active");
    } else {
      oButton.classList.toggle("active");
      xButton.classList.toggle("active");
    }

    if (round === 9) {
      displayController.setEndGameMessage("Draw");
      gameOver = true;
      gameBoard.clearGameBoard();
      return gameOverScreen.classList.remove("hide");
    }

    const checkForWinResult = checkForWin(
      gameboard,
      setCurrentPlayer().getMarker()
    );

    if (checkForWinResult.win) {
      displayController.setEndGameMessage(checkForWinResult.playerMarker);
      gameOver = true;
      gameBoard.clearGameBoard();
      return gameOverScreen.classList.remove("hide");
    }
    round++;
  };

  const resetGame = () => {
    gameBoard.clearGameBoard();

    if (oButton.classList.contains("active"))
      oButton.classList.toggle("active");

    gameOverScreen.classList.add("hide");
    round = 1;
    gameOver = false;
    gameBoard.renderGameboard();
  };

  const checkRowWin = (board, marker) => {
    const rows = [
      [board[0], board[1], board[2]],
      [board[3], board[4], board[5]],
      [board[6], board[7], board[8]],
    ];

    let winResult = {
      win: false,
      playerMarker: "",
    };
    rows.forEach((row) => {
      if (row.every((item) => item === marker)) {
        winResult.win = true;
        winResult.playerMarker = marker;
      } else {
        return;
      }
    });

    return winResult;
  };

  const checkCrossWin = (board, marker) => {
    const crosses = [
      [board[0], board[4], board[8]],
      [board[2], board[4], board[6]],
    ];

    let winResult = {
      win: false,
      playerMarker: "",
    };

    crosses.forEach((cross) => {
      if (cross.every((item) => item === marker)) {
        winResult.win = true;
        winResult.playerMarker = marker;
      } else {
        return;
      }
    });

    return winResult;
  };
  const checkColumnWin = (board, marker) => {
    const columns = [
      [board[0], board[3], board[6]],
      [board[1], board[4], board[7]],
      [board[2], board[5], board[8]],
    ];

    let winResult = {
      win: false,
      playerMarker: "",
    };

    columns.forEach((column) => {
      if (column.every((item) => item === marker)) {
        winResult.win = true;
        winResult.playerMarker = marker;
      } else {
        return;
      }
    });
    return winResult;
  };

  const checkForWin = (board, marker) => {
    const rowWin = checkRowWin(board, marker);
    const columnWin = checkColumnWin(board, marker);
    const crossWin = checkCrossWin(board, marker);

    let winResult = {
      win: false,
      playerMarker: "",
    };

    if (rowWin.win) {
      return rowWin;
    }

    if (columnWin.win) {
      return columnWin;
    }

    if (crossWin.win) {
      return crossWin;
    }

    return winResult;
  };

  const endGame = () => {};

  const getGameOver = () => gameOver;
  return { playRound, getGameOver, resetGame, checkForWin };
})();
