# Chess Ronin 001 – Full Design & Prototype Brief

## 1. Concept

Chess Ronin 001 is an asymmetric, chess-adjacent strategy game:
- One player controls a **single Ronin**
- One player controls an **Army**
- The objective is to **rescue the Emperor**

Core tension:
- Ronin = infiltration, timing, positioning
- Army = prediction, control, containment

---

## 2. Core Rules

### Board
- Standard 8×8 chess board

### Pieces

#### Ronin (White)
- Moves like a King (1 square any direction)
- Only one piece

#### Army (Black)
- Multiple pieces (pawns, rooks, knights, etc.)
- Can move **up to 2 pieces per turn**

#### Emperor (Neutral)
- Static piece
- Located centrally

---

## 3. Win Conditions

- Ronin wins:
  - Move adjacent to Emperor
  - Spend next turn performing **Rescue action**

- Army wins:
  - Capture the Ronin

---

## 4. Design Intent

Keep:
- Simple rules
- High tension
- Fast turns

Avoid:
- Overly complex chess rules
- Too many piece types
- Slowing the game down

---

## 5. Prototype (Single HTML File)

Save as: `chess-ronin-001.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Chess Ronin 001</title>
  <style>
    body { font-family: sans-serif; text-align: center; background: #f9f9f9; }
    #board { display: grid; grid-template-columns: repeat(8, 60px); margin: 20px auto; border: 2px solid #333; }
    .square { width: 60px; height: 60px; display: flex; justify-content: center; align-items: center; }
    .light { background: #eee; }
    .dark { background: #999; }
    .piece { font-size: 28px; cursor: pointer; }
    button { margin: 5px; padding: 8px 12px; }
  </style>
</head>
<body>

<h1>Chess Ronin 001</h1>

<div>
  <button onclick="resetGame()">Reset</button>
  <button onclick="endTurn()">End Turn</button>
  <button onclick="rescue()">Rescue</button>
</div>

<div id="board"></div>

<script>
let board, turn, moves, selected;

function init(){
  board = Array(8).fill().map(()=>Array(8).fill(""));
  board[4][4] = "E";
  board[0][0] = "R";
  board[7][7] = "K";
  turn = "ronin";
  moves = 2;
  selected = null;
  draw();
}

function draw(){
  const el = document.getElementById("board");
  el.innerHTML="";
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const d=document.createElement("div");
      d.className="square "+((r+c)%2?"dark":"light");
      d.onclick=()=>click(r,c);
      d.innerText = board[r][c];
      el.appendChild(d);
    }
  }
}

function click(r,c){
  if(selected){
    move(selected[0],selected[1],r,c);
    selected=null;
  } else {
    selected=[r,c];
  }
}

function move(sr,sc,r,c){
  board[r][c]=board[sr][sc];
  board[sr][sc]="";
  if(turn==="army"){
    moves--;
    if(moves===0){turn="ronin";moves=2;}
  } else {
    turn="army";
  }
  draw();
}

function endTurn(){
  turn = turn==="ronin"?"army":"ronin";
  moves=2;
}

function rescue(){
  alert("Check adjacency manually for now");
}

function resetGame(){
  init();
}

init();
</script>

</body>
</html>
```

---

## 6. Next Steps

### Gameplay
- Add move validation
- Add highlighting
- Improve rescue mechanic clarity

### UX
- Better visuals
- Piece icons
- Turn indicators

### Expansion
- AI opponent
- Online multiplayer
- Army configuration system

---

## 7. One-Line Pitch

“A lone Ronin must infiltrate a guarded board and rescue the Emperor before being trapped by an army that moves twice as fast.”

---

END
