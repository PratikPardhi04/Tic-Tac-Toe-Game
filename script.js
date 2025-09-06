(function(){
  const boardEl=document.getElementById("board");
  const msg=document.getElementById("message");
  const resetBtn=document.getElementById("reset");
  const scoreX=document.getElementById("score-x");
  const scoreO=document.getElementById("score-o");
  const scoreD=document.getElementById("score-d");
  const btn2p=document.getElementById("mode-2p");
  const btnBot=document.getElementById("mode-bot");

  let board=Array(9).fill(null);
  let current="X";
  let scores={X:0,O:0,D:0};
  let mode="2p"; 
  const winCombos=[
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  function render(){
    boardEl.innerHTML="";
    board.forEach((val,i)=>{
      const c=document.createElement("div");
      c.className="cell";
      if(val){
        c.textContent=val;
        c.classList.add("taken",val.toLowerCase());
      }
      c.addEventListener("click",()=>play(i));
      boardEl.appendChild(c);
    });
  }

  function play(i){
    if(board[i]||winnerCheck(board)) return;
    board[i]=current;
    render();
    const win=winnerCheck(board);
    if(win){
      highlight(win.combo);
      msg.textContent=`Player ${win.player} wins!`;
      scores[win.player]++; updateScore();
      return;
    }
    if(board.every(Boolean)){
      msg.textContent="It's a draw!";
      scores.D++; updateScore();
      return;
    }
    current=current==="X"?"O":"X";
    msg.textContent=`Player ${current}'s turn`;

    if(mode==="bot" && current==="O"){
      setTimeout(botMove,500);
    }
  }


  function botMove(){
    // Try to win
    for(const combo of winCombos){
      const [a,b,c]=combo;
      if(board[a]==="O" && board[b]==="O" && !board[c]) return play(c);
      if(board[a]==="O" && board[c]==="O" && !board[b]) return play(b);
      if(board[b]==="O" && board[c]==="O" && !board[a]) return play(a);
    }
    // Try to block X
    for(const combo of winCombos){
      const [a,b,c]=combo;
      if(board[a]==="X" && board[b]==="X" && !board[c]) return play(c);
      if(board[a]==="X" && board[c]==="X" && !board[b]) return play(b);
      if(board[b]==="X" && board[c]==="X" && !board[a]) return play(a);
    }
    // Otherwise pick random
    let empty=board.map((v,i)=>v?null:i).filter(v=>v!==null);
    if(empty.length===0) return;
    const rand=empty[Math.floor(Math.random()*empty.length)];
    play(rand);
  }

  function winnerCheck(b){
    for(const combo of winCombos){
      const [a,b1,c]=combo;
      if(b[a]&&b[a]===b[b1]&&b[a]===b[c]){
        return {player:b[a],combo};
      }
    }
    return null;
  }

  function highlight(combo){
    const cells=boardEl.querySelectorAll(".cell");
    combo.forEach(i=>cells[i].classList.add("win"));
  }

  function updateScore(){
    scoreX.textContent=scores.X;
    scoreO.textContent=scores.O;
    scoreD.textContent=scores.D;
  }

  function reset(){
    board=Array(9).fill(null);
    current="X";
    render();
    msg.textContent="Player X's turn";
  }

  resetBtn.addEventListener("click",reset);

  btn2p.addEventListener("click",()=>{
    mode="2p"; btn2p.classList.add("active"); btnBot.classList.remove("active");
    reset();
  });
  btnBot.addEventListener("click",()=>{
    mode="bot"; btnBot.classList.add("active"); btn2p.classList.remove("active");
    reset();
  });

  render();
})();