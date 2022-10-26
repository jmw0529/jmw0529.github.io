var row = 14; //行数
var col = 14;//列数
var maxCount = 25; //最大地雷数量
var isFirstOpen = true; //第一次打开方格
var grid = init_grid(); //初始化
var count = document.getElementById('count'); //剩余地雷数
count.innerHTML = maxCount; 
var time = document.getElementById('time'); //计时器
var timer=setInterval(function () {
  let seconds = (parseFloat(time.innerHTML) + 0.1).toFixed(1); //保留一位小数
  time.innerHTML = seconds;
}, 100) //定时器 100ms执行一次
//初始化矩阵 (row-行数 col-列数)
function init_grid() {

//生成矩阵html <tr>--行标签 <td>--列标签
let gridHtml = '';
for (let i = 0; i < row; i++) {
gridHtml += '<tr>';
for (let j = 0; j < col; j++) {
  gridHtml +=
    '<td><span class="blocks" onmousedown="block_click(' + i + ',' + j + ',event)"></span></td>';
}
gridHtml += '<tr>';
}
//写入html
document.getElementById("grid").innerHTML = gridHtml;

let blocks = document.getElementsByClassName('blocks');
    let grid = new Array();
    for (let i = 0; i < blocks.length; i++) {
        if (i % col === 0) {
            grid.push(new Array());
        }
        //初始化计雷数
        blocks[i].count = 0;
        grid[parseInt(i / col)].push(blocks[i]);
    }
    return grid;
}

function block_click(_i, _j, e){

  //跳过已打开的方格
  if (grid[_i][_j].isOpen) {
      return;
  }
  //鼠标左键打开方格
  if (e.button === 0) {
     if(isFirstOpen){
      isFirstOpen=false;
      let count=0;
      while(count<=maxCount){
        let ri = Math.floor(Math.random() * row);
        let rj = Math.floor(Math.random() * col);
        if(!(ri === _i && rj === _j) && !grid[ri][rj].isMine){
          grid[ri][rj].isMine = true;
          count ++;
          for (let i = ri - 1; i < ri + 2; i++) {
            for (let j = rj - 1; j < rj + 2; j++) {
                //判断坐标防越界
                if (i > -1 && j > -1 && i < row && j < col) {
                    //计雷数+1
                    grid[i][j].count++;
              }
            }
          }
        }
      }
    }
      //执行打开方格函数
      block_open(_i, _j);

      //打开方格函数
      function block_open(_i, _j) {
  
          let block = grid[_i][_j];
          op(block);
  
          //设定打开方格的状态与样式
          function op(block) {
              block.isOpen = true; //isOpen为自定义属性，设置为true代表已打开
              block.style.background = '#ccc'; //将背景设置为灰色
              block.style.cursor = 'default'; //将鼠标停留样式设置为默认
          }
  
          if (block.isMine) {
            //踩雷
            block.innerHTML = '☼'; //显示为 '雷'
            //遍历矩阵打开所有的地雷方格
            for (let i = 0; i < row; i++) {
                for (let j = 0; j < col; j++) {
                    //找到地雷
                    block = grid[i][j];
                    if (!block.isOpen && block.isMine) {
                        op(block); //设置打开状态和样式
                        block.innerHTML = '☼'; //显示为 '雷'
                    }
                }
            }
            //提示游戏结束
            clearInterval(timer); 
            alert("游戏结束")
              //踩雷
          } else if (block.count === 0) {
              //打开计雷数为0的方格
              for (let i=_i-1;i<=_i+1;i++){
                for(let j=_j-1;j<=_j+1;j++){
                  if(i > -1 && j > -1 && i < row && j < col && !grid[i][j].isOpen && !grid[i][j].isMine){
                    block_open(i, j);
                  }
                }
              }
          } else {
            block.innerHTML = block.count;
              //打开计雷数不为0的方格
          }
        }
        
  }
  //鼠标右键标记方格
  else if (e.button === 2) {
    let block = grid[_i][_j];
    if (block.innerHTML !== '!') {
        block.innerHTML = '!';
        count.innerHTML = parseInt(count.innerHTML) - 1;
    } else {
        block.innerHTML = '';
        count.innerHTML = parseInt(count.innerHTML) + 1;

    }
  }
  let isWin=ture;
  for(let i=0;i<row;i++){
    for(let j=0;j<col;j++){
      let block=grid[i][j];
      if(!block.isMine && !block.isOpen){
        isWin=false;
      }
    }
  }
  if(isWin===ture){
    alert('你赢了（刷新重新开始）')
  }
}
