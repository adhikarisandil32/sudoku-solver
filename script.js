// using backtracking algorithm

const solveButton = document.getElementById("solve-button")
const clearButton = document.getElementById("clear-button")
const fixButton = document.getElementById("fix-button")
const individualGrids = document.querySelectorAll("#individual-grid")
const errorMessageElement = document.getElementById("error-message")
const rows = 9
const columns = 9
const blockSize = {
  rows: 3,
  columns: 3,
}

// console.log(Array.from({ length: gridLengthHorizontal }, (_, i) => i))
individualGrids.forEach((grid) => {
  grid.addEventListener("input", (e) => {
    const innerText = e.target.innerText

    if (innerText.length > 0) {
      e.target.innerText = innerText.slice(0, 1)
    }
  })
})

clearButton.addEventListener("click", () => {
  displayError(false)

  individualGrids.forEach((grid) => {
    if (!grid.dataset.fixed) {
      grid.innerText = ""
    }
  })
})

fixButton.addEventListener("click", () => {
  displayError(false)

  if (!checkForValidInput()) {
    displayError(true, "Invalid Input. Please check!!")
    return
  }

  individualGrids.forEach((grid) => {
    if (grid.innerText) {
      grid.setAttribute("data-fixed", true)
      grid.classList.add("text-blue-800")
      grid.removeAttribute("contenteditable")
    }
  })
})

solveButton.addEventListener("click", () => {
  fixButton.click()

  if (!checkForValidInput()) return

  const board = getSudokuBoard()

  backtrack(0, 0, board)
})

function checkForValidInput() {
  let valid = true

  individualGrids.forEach((grid) => {
    if (isNaN(grid.innerText) || grid.innerText === "0") valid = false
  })

  return valid
}

function displayError(status, message) {
  if (!status) {
    errorMessageElement.innerText = ""
    return
  }

  errorMessageElement.innerText = message
}

function getSudokuBoard() {
  const sudokuArray = Array.from({ length: rows }, (_, idx) => [])

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      sudokuArray[i][j] = Number(individualGrids[rows * i + j].innerText)
    }
  }

  return sudokuArray
}

let count = 0

function backtrack(r, c, board) {
  count++
  if (c > columns - 1) {
    r++
    c = 0
  }
  if (r > rows - 1) return board

  if (board[r][c] > 0) {
    backtrack(r, c + 1, board)
  } else {
    for (let n = 1; n <= 9; n++) {
      if (isValid(n, r, c, board)) {
        board[r][c] = n
        individualGrids[r * 9 + c].innerText = board[r][c]
        backtrack(r, c + 1, board)
      }
    }
    //15 clicks after this, you land to solution
    if (!isSolved(board)) board[r][c] = 0
  }
}

function isSolved(board) {
  let solved = true

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (board[i][j] <= 0) solved = false
    }
  }

  return solved
}

function isValid(number, r, c, board) {
  // check if given number is valid in given row and column in the board
  // r & c -> row & column of the number
  // lr, lc -> large row, large column; there are three large rows and three large columns of blocks
  const lr = Math.floor(r / 3)
  const lc = Math.floor(c / 3)

  const rowArray = board[r]
  const columnArray = []
  const blockArray = []

  for (let i = 0; i < rows; i++) {
    columnArray.push(board[i][c])
  }

  for (let i = lr * blockSize.rows; i < (lr + 1) * blockSize.rows; i++) {
    for (let j = lc * blockSize.columns; j < (lc + 1) * blockSize.columns; j++) {
      blockArray.push(board[i][j])
    }
  }

  if (rowArray.includes(number) || columnArray.includes(number) || blockArray.includes(number)) return false

  return true
}
