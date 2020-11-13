// jsを記述する際はここに記載していく
'use strict';

var mySwiper = new Swiper ('.swiper-container', {
  // オプション設定
  loop: true,
  speed: 600,
  slidesPerView: 1,
  spaceBetween: 10,
  direction: 'horizontal',
  effect: 'slide',

  // スライダーの自動再生
  autoplay: {
    delay: 3000,
    stopOnLast: false,
    disableOnInteraction: true
  },

  // レスポンシブ化条件
  breakpoints: {
    // 980ピクセル幅以下になったら、
    980: {
      slidePerView: 3,
      spaceBetween: 30
    },
    // 640ピクセル幅以下になったら、
    640: {
      slidePerView: 2,
      spaceBetween: 20
    }
  },

  // ページネーションを表示する場合
  pagination: {
    el: '.swiper-pagination',
  },

  // 前後のスライドへのナビゲーションを表示する場合
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // スクロールバーを表示する場合
  scrollbar: {
    el: '.swiper-scrollbar'
  }
});

// チーズを降らせる
var canvas = document.getElementById('cheese');
var ctx = canvas.getContext("2d");
var imgCnt = 25; // 描画する画像の数
var aryImg = []; // 画像の情報を格納
var cheeseWidth = 1200;  // canvasタグに指定したwidth
var cheeseHeight = 400; // canvasタグに指定したheight
var imgBaseSizeWidth = 100; // 画像の基本サイズ横幅
var imgBaseSizeHeight = 100; // 画像の基本サイズ縦幅
var aspectMax = 1.5;  // アスペクト比計算時の最大値
var aspectMin = 0.5;  // アスペクト比計算時の最小値
var speedMax = 2; // 落下速度の最大値
var speedMin = 0.5 // 落下速度の最小値

// 画像の読み込み
var img = new Image();
img.src = "./img/cheese.png";
img.onload = flow_start;

// 画像のパラメータを設定
function setImagas() {
  var aspect = 0;
  for(var i = 0; i < imgCnt; i++) {
    // 画像サイズにかけるアスペクト比を0.5~1.5倍でランダムで生成
    aspect = Math.random() * (aspectMax - aspectMin) + aspectMin;
    aryImg.push({
      "posX": Math.random() * cheeseWidth, // 初期表示位置x
      "posY": Math.random() * cheeseHeight, // 初期表示位置y
      "sizeW": imgBaseSizeWidth * aspect, // 画像の横幅
      "sizeH": imgBaseSizeHeight * aspect, // 画像の縦幅
      "speedy": Math.random() * (speedMax - speedMin) + speedMin,
    });
  }
}

// 描画、パラメータの更新
var idx = 0;
function flow() {
  // 指定した範囲の描画画面の内容をクリア（x座標、y座標、横幅、縦幅）
  ctx.clearRect(0, 0, cheeseWidth, cheeseHeight);
  for(idx = 0; idx < imgCnt; idx++) {
    aryImg[idx].posY += aryImg[idx].speedy;
    // 画像オブジェクトを描画する（画像オブジェクト、表示x座標、表示y座標）
    ctx.drawImage(img, aryImg[idx].posX, aryImg[idx].posY, aryImg[idx].sizeW, aryImg[idx].sizeH);
    // 範囲外に描画された画像を上に戻す
    if(aryImg[idx].posY >= cheeseHeight) {
      aryImg[idx].posY = -aryImg[idx].sizeH;
    }
  }
}

function flow_start() {
  setImagas();
  setInterval(flow, 10);
}