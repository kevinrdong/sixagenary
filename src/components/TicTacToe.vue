<template>
  <div class="game-container">
    <h1>圈圈叉叉遊戲</h1>
    <div 
      :class="['status', statusClass]" 
      v-text="statusText"
    ></div>
    <div class="game-board">
      <button
        v-for="(cell, index) in board"
        :key="index"
        class="cell"
        :disabled="cell !== '' || !gameActive"
        @click="handleCellClick(index)"
      >
        {{ cell }}
      </button>
    </div>
    <button class="reset-button" @click="resetGame">
      重新開始
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'TicTacToe',
  setup() {
    const board = ref(Array(9).fill(''))
    const currentPlayer = ref('X')
    const gameActive = ref(true)
    
    const winningConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]

    const statusText = computed(() => {
      if (!gameActive.value) {
        if (checkDraw()) {
          return '平手！'
        }
        const winner = currentPlayer.value === 'X' ? 'O' : 'X'
        return `${winner} 獲勝！`
      }
      return `輪到 ${currentPlayer.value}`
    })

    const statusClass = computed(() => {
      if (!gameActive.value) {
        return checkDraw() ? 'draw' : 'winner'
      }
      return 'turn'
    })

    const checkWinner = () => {
      return winningConditions.some(condition => {
        const [a, b, c] = condition
        return board.value[a] !== '' && 
               board.value[a] === board.value[b] && 
               board.value[b] === board.value[c]
      })
    }

    const checkDraw = () => {
      return board.value.every(cell => cell !== '')
    }

    const handleCellClick = (index) => {
      if (board.value[index] !== '' || !gameActive.value) {
        return
      }

      board.value[index] = currentPlayer.value

      if (checkWinner()) {
        gameActive.value = false
        return
      }

      if (checkDraw()) {
        gameActive.value = false
        return
      }

      currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
    }

    const resetGame = () => {
      board.value = Array(9).fill('')
      currentPlayer.value = 'X'
      gameActive.value = true
    }

    return {
      board,
      currentPlayer,
      gameActive,
      statusText,
      statusClass,
      handleCellClick,
      resetGame
    }
  }
}
</script>

<style scoped>
.game-container {
  text-align: center;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.game-board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 5px;
  margin: 20px auto;
  background-color: #333;
  padding: 5px;
  border-radius: 5px;
  justify-content: center;
}

.cell {
  background-color: white;
  border: none;
  font-size: 36px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s;
}

.cell:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.cell:disabled {
  cursor: not-allowed;
}

.status {
  font-size: 18px;
  margin: 20px 0;
  font-weight: bold;
}

.winner {
  color: #4CAF50;
}

.draw {
  color: #FF9800;
}

.turn {
  color: #2196F3;
}

.reset-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background-color: #45a049;
}
</style>