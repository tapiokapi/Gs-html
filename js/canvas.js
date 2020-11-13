'use strict';

// 要素への参照を取得する
var canvas = document.getElementById("myCanvas");
// 2D描画コンテキストを保存する。
var ctx = canvas.getContext("2d");

// 円が描画される位置を定義する
var x = canvas.width / 2;
var y = canvas.height - 30;

// xとyに毎フレーム描画した後に小さな値を加え、ボールが動いているように見せるための変数を定義する。描画される向きを決定
var dx = 5;
var dy = -5;

var ballRadius = 10;
var ballColor = "#0095DD";

// パドルの高さと幅、x軸上の開始地点を定義する。
var paddleHeight = 10;
var paddleWidth = 85;
var paddleX = (canvas.width - paddleWidth) / 2;

// 押されているボタンを定義、初期化する
var rightPressed = false;
var leftPressed = false;

// ブロックの行と列の数
var brickRowCount = 3;
var brickColumnCount = 5;
// 幅と高さ
var brickWidth = 75;
var brickHeight = 20;
// ブロック間の隙間
var brickPadding = 10;
// キャンバスの端に描画されないようにするための上端
var brickOffsetTop = 30;
// 左端からの相対位置
var brickOffsetLeft = 30;

// １つの２次元配列で全てのブロックを記録する。
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
   bricks[c] = [];
   for(var r=0; r<brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
   }
}

// スコアを記録する変数を定義
var score = 0;

// ライフの数を保存する変数を定義
var lives = 3;

// キーボードのキーのどれかに対してkeydownイベントが発火したとき、関数が実行される
document.addEventListener("keydown", keyDownHandler, false);
// キーボードのキーのどれかに対してkeyupイベントが発火したとき、関数が実行される
document.addEventListener("keyup", keyUpHandler, false);
// マウスの動作を監視
document.addEventListener("mousemove", mouseMoveHandler, false);

// パドルの動きをマウスの動きと紐づける
function mouseMoveHandler(e) {
   // ビューポートの水平方向のマウス位置(e.clientX)からキャンバスの左端とビューポートの左端の距離(canvas.offsetLeft)をひいて導出
   var relativeX = e.clientX - canvas.offsetLeft;
   if(relativeX > 0 && relativeX < canvas.width) {
      // パドルの中点で対象に動くように設定
      paddleX = relativeX - paddleWidth / 2;
   }
}

function keyDownHandler(e) {
   if(e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = true;
   }
   else if(e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = true;
   }
}

function keyUpHandler(e) {
   if(e.key == "Left" || e.key == "ArrowRight") {
      rightPressed = false;
   }
   else if(e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = false;
   }
}

// ひとつひとつのブロックの位置をボールの座標と比較する衝突検出関数
function collisionDetection() {
   for(var c=0; c < brickColumnCount; c++) {
      for(var r=0; r<brickRowCount; r++) {
         var b = bricks[c][r];
         // ブロックがアクティブ（状態が1）なら衝突が起きるか確認する
         if(b.status == 1) {
            /*
            もしボールの中央がブロックの１つの座標の内部だったらボールの向きを変える。ボールの中央がブロックの内部にあるためには、次の４つの命題が全て真でなければならない。
            ・ボールのx座標がブロックのx座標より大きい
            ・ボールのx座標がブロックのx座標とその幅の和より小さい
            ・ボールのy座標がブロックのy座標より大きい
            ・ボールのy座標がブロックのy座標とその高さの和より小さい
            */
           if(x > b.x && x < b.x +brickWidth && y > b.y && y < b.y + brickHeight) {
              dy = -dy;
               // 衝突が起きたら、画面上に描画されないようにブロックの状態を0に設定する。
               b.status = 0;
               // スコア変数を増加
               score++;
               // 全てのブロックが崩されたときに勝利を伝えるメッセージ表示
               if(score == brickRowCount * brickColumnCount) {
                  alert("score: " + score + " YOU ARE CHEESE CRAFTSMAN , CONGRATULATIONS!");
                  document.location.reload();
               }
            }
         }
      }
   }
}

// スコア表示作成
function drawScore() {
   // フォントの大きさと種類
   ctx.font = "16px Arial";
   // フォントの色
   ctx.fillStyle = "#0095DD";
   // キャンバス上に配置される実際の文章を設定（最後の２つのパラメータは文章がキャンバス上に置かれる座標）
   ctx.fillText("Score: " + score, 8, 20);
}

// ライフカウンタを描画
function drawLives() {
   ctx.font = "16px Arial";
   ctx.fillStyle = "#0095DD";
   ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawBall() {
   ctx.beginPath();
   ctx.arc(x, y, ballRadius, 0, Math.PI*2);
   ctx.fillStyle = ballColor;
   ctx.fill();
   ctx.closePath();
}

// パドルを描画する
function drawPaddle() {
   ctx.beginPath();
   ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
   ctx.fillStyle = "#afafb0";
   ctx.fill();
   ctx.closePath();
}

// 配列に含まれる全てのブロックを描画
function drawBricks() {
   // 行ループ
   for(var c=0; c < brickColumnCount; c++) {
      // 列ループ
      for(var r=0; r < brickRowCount; r++) {
         // statusプロパティが1なら描画する。
         if(bricks[c][r].status == 1) {
            // それぞれの座標Xは、幅＋ブロック間の隙間に列番号cをかけ、左端からの相対位置を足す
            var brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
            // それぞれの座標Yは、高さ＋ブロック間の隙間に列番号rをかけ、上端からの相対位置を足す
            var brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;
            // ブロックのx座標とy座標を設定
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            // canvas上に描画
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#fcc800";
            ctx.fill();
            ctx.closePath();
         }
      }
   }
}

function draw() {
   /* フレームの後にcanvasを消去する
      パラメータは、四角形の左上端のx、y座標と四角形の右下端のx、y座標。
      この四角形で囲われた領域にある内容全てが消去される
   */
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   drawBricks();
   drawBall();
   drawPaddle();
   drawScore();
   drawLives();
   collisionDetection();

   // 左端と右端で弾ませる
   if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
   }

   // 上端で弾ませる。下端で衝突した時はゲームオーバー状態とする
   if(y + dy < ballRadius) {
      dy = -dy;
   } else if(y + dy > canvas.height - ballRadius) {
      // パドルにも当たっているか確認する
      if(x > paddleX && x < paddleX + paddleWidth) {
         dy = -dy;
      }
      else {
         // ボールが画面下端に当たった時にライフを１つ引く
         lives--;
         // ライフがなければゲームオーバー
         if(!lives) {
            alert("GAME OVER");
            // ページの再読み込みにより、ゲームを再開する
            document.location.reload();
         }
         // ライフがまだ残っていれば、ボールとパドルの位置、ボールの動きがリセットされる。
         else {
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 5;
            dy = -5;
            paddleX = (canvas.width - paddleWidth) / 2;
         }
         // clearInterval(interval);
      }
   }

   // paddleXは左端の0と右端のcanvas.width-paddleWidth間で動きます。
   if(rightPressed && paddleX < canvas.width - paddleWidth) {
      // 右カーソルが押されていたら７ピクセル左に動く
      paddleX += 5;
   }
   else if(leftPressed && paddleX > 0) {
      // 左カーソルが押されていたら７ピクセル右に動く
      paddleX -= 5;
   }
   // フレームごとにxとyを変数dx、dyで更新して、更新されるたびにボールが新しい位置に描画されるようにする。
   x += dx;
   y += dy;
   requestAnimationFrame(draw);
}

draw()

// "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16);

// 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')'