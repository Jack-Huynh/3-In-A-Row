(function(){
    fetch('https://prog2700.onrender.com/threeinarow/random')
  .then(response => response.json())
  .then(data => {
    let puzzleData=data.rows;
    
    let Table=document.createElement('table');

    Table.style.borderCollapse="collapse";

    let countToggle=0;

    let timerElement = document.createElement('div');
    timerElement.setAttribute('id', 'timer');
    timerElement.textContent = '00:00';
    let timerInterval;

    for(let i=0; i<puzzleData.length; i++){

        let newRow=document.createElement('tr');

        for(let j=0; j<puzzleData.length; j++){

            let newCell=document.createElement('td');

            if(!puzzleData[i][j].canToggle&&puzzleData[i][j].currentState===1){
              newCell.style.backgroundColor="blue";
            }
            else if(!puzzleData[i][j].canToggle&&puzzleData[i][j].currentState===2){
              newCell.style.backgroundColor="white";
            }
            else{
              newCell.classList.add("clickable");
              newCell.style.backgroundColor="gray";
              newCell.setAttribute("row", i);
              newCell.setAttribute("column", j);
            }
            
            newCell.style.border="1px solid black";

            newCell.style.height="60px";

            newCell.style.width="60px";

            newCell.style.textAlign="center";

            newRow.appendChild(newCell);

            if(puzzleData[i][j].canToggle){//count toggle cell
              countToggle++;
            }
        }
        Table.appendChild(newRow);
    }

    let jsonBoard=[];
      
    for(let i=0; i<puzzleData.length; i++){
      let initRows=[];
      for(let j=0; j<puzzleData.length; j++){
        initRows.push(0);
      }
      jsonBoard.push(initRows);
    }

    Table.addEventListener('click', function(event) {
      let cell = event.target;
      if (cell.classList.contains('clickable')) {
        if(cell.style.backgroundColor==="gray"){
          cell.style.backgroundColor="blue";
          cell.setAttribute("currentState", 1);

        }else if(cell.style.backgroundColor==="blue"){
          cell.style.backgroundColor="white";
          cell.setAttribute("currentState", 2);
        }else{
          cell.style.backgroundColor="gray";
          cell.setAttribute("currentState", 0);
        }
      }
      
      for(let i=0; i<jsonBoard.length; i++){
        for(let j=0; j<jsonBoard.length; j++){
          if(cell.getAttribute("row")==i && cell.getAttribute("column")==j){
            jsonBoard[i][j]=cell.getAttribute("currentState");
          }
        }
      }
      let finds=document.querySelectorAll("td");
      mistakeDraw(finds);
    });

    let checkButton = document.createElement('button');
    checkButton.textContent = 'Check Puzzle';
    
    let message=document.createElement("p");

    checkButton.addEventListener('click', function() {
      let countCorrect=0;
      let flag=true;
      for(let i=0; i<puzzleData.length; i++){
        for(let j=0; j<puzzleData.length; j++){
          if(jsonBoard[i][j]!=0){
            if(jsonBoard[i][j]==puzzleData[i][j].correctState){
              flag=true;
              countCorrect++;
            }else{
              flag=false;
              break;
            }
          }
        }
        if(!flag){
          break;
        }
      }
      
      if(countCorrect==countToggle){
        message.textContent='You did it !';
        clearInterval(timerInterval);
      }else if(flag){ 
        message.textContent='So far so good';
      }else{
        message.textContent='Something is wrong';
      }
    });
      
      let checkbox = document.createElement('input');
      checkbox.type = 'checkbox';

      let label = document.createElement('label');
      label.setAttribute('for', 'mistakeCheckbox');
      label.textContent = 'Show mistake';

    checkbox.addEventListener('change', function() {
      let finds=document.querySelectorAll("td");
      mistakeDraw(finds);
    });
    
      document.getElementById('theGame').appendChild(timerElement);
      timer();
      document.getElementById('theGame').appendChild(Table);

      document.getElementById('theGame').appendChild(checkButton);

      document.getElementById('theGame').appendChild(checkbox);
      document.getElementById('theGame').appendChild(label);

      document.getElementById('theGame').appendChild(message);

      function mistakeDraw(finds){
        if(checkbox.checked){
          for(let i=0; i<puzzleData.length; i++){
            for(let j=0; j<puzzleData.length; j++){
                if(jsonBoard[i][j]!=puzzleData[i][j].correctState&&jsonBoard[i][j]!=0){//check type
                  finds[i*puzzleData.length+j].innerText="X";
                }else{
                  finds[i*puzzleData.length+j].textContent="";
                }
              }
          }
        }else{
          for(let i=0; i<(puzzleData.length*puzzleData.length); i++){
              finds[i].textContent="";
          }
        }
      }
      
      function timer(){
        let timerDisplay = document.querySelector('#timer');
        let startTime = new Date();
        timerInterval = setInterval(() => {
          let elapsedTime = new Date() - startTime;
          let minutes = Math.floor(elapsedTime / 60000);
          let seconds = Math.floor((elapsedTime % 60000) / 1000);
          let timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          timerDisplay.innerHTML = timeDisplay;
        }, 1000);
      }
  })
})()
//Note: We can not put an event listener to another event listener inside a nested loops because once the inside listener is clicked, all the previously attached event listeners will also execute 