"use strict";
var game = {};
game.container = document.querySelector('.main');
game.elements = {};
game.elements.area = game.container.querySelector('.app');
game.elements.timer = game.container.querySelector('#timeCount');
game.elements.score = game.container.querySelector('#clickCount');
game.elements.accueil = document.querySelector('.accueil');
game.elements.playbutton = game.elements.accueil.querySelector('.button'); 
game.elements.application = document.querySelector('.main');
game.elements.form = document.querySelector('.formContainer');
game.elements.struct = document.querySelectorAll('.const');
game.elements.result = {};
game.elements.result.container = document.querySelector('.formMain'); 
game.elements.result.time = game.elements.result.container.querySelector('.result_temps');
game.elements.result.coups = game.elements.result.container.querySelector('#result_coups');
game.elements.result.score = game.elements.result.container.querySelector('#result_score');
game.elements.cardsDispo = [0,1,2,3,4,5,6,7,8,9,10,11];
game.elements.selected = []; 
game.elements.cardList = [];
game.elements.deck = []; 
game.elements.selectLimit = 6;
game.data = {};
game.data.count = 0;
game.data.time = function () {};
game.data.choosed = [];
game.data.selectCompare = [];
game.data.work = 0; 
game.data.click = 0;
game.data.time = 0;
game.data.coef = 0;
game.data.score = 0;
game.data.pair = 0;
game.data.play = false;
game.data.playerId = 0;
game.methods = {};
// API FACEBOOK // 
// lancer le jeu 
game.methods.init = function () {
   game.methods.play();
   game.data.count = 0;
   game.data.time = function () {};
   game.data.choosed = [];
   game.data.selectCompare = [];
   game.data.work = 0; 
   game.data.click = 0;
   game.data.time = 0;
   game.data.coef = 0;
   game.methods.timer();
   game.methods.chooseCards();
};
// tirage aléatoire 
game.methods.randsort=function(){
   return (Math.random()*2 & 1)?-1:1;
}
// sélectionner les cartes 
game.methods.selectCards = function(limit){
   var select = new Array();
   for ( let i=0; i<limit; i++){
      if ( game.elements.cardsDispo.length==0) 
      {
         break;
      }
      game.elements.cardsDispo.sort(game.methods.randsort);
      select.push(game.elements.cardsDispo.pop())    
   }
   return select;
}
// sélectionner 6 cartes 
game.methods.chooseCards = function() {
   game.elements.cardsDispo = [0,1,2,3,4,5,6,7,8,9,10,11];
   game.elements.selected = game.methods.selectCards(game.elements.selectLimit);
   game.methods.initCardsDeck(); 
}
// Mélanger les cartes 
game.methods.shuffle = function (tableau) {
   var j = 0;
   var valI = '';
   var valJ = valI;
   var l = tableau.length - 1;
   while (l > -1) {
      j = Math.floor(Math.random() * l);
      valI = tableau[l];
      valJ = tableau[j];
      tableau[l] = valJ; 
      tableau[j] = valI;
      l = l - 1;
   }
   return tableau;
};
// Initialise jeu de carte mélangé 
game.methods.initCardsDeck = function(){
   game.elements.cardList = []; 
   for ( var i =0; i<2; i++){
      for ( var j =0; j<game.elements.selected.length; j++){
         game.elements.cardList.push(game.elements.selected[j]);
      }
   }
   game.elements.cardList = game.methods.shuffle(game.elements.cardList);
   game.methods.initGameArea();
};
// créer les cartes sur l'appli 
game.methods.initGameArea = function () {
   for ( var i = 0; i<game.elements.cardList.length; i++)
   {
      var card = document.createElement('div');
      card.classList.add('card');
      card.setAttribute('index',i);
      card.setAttribute('click',0);
      card.innerHTML = "<figure class='front'>1</figure><figure class='back'><img src='assets/img/cards/"+game.elements.cardList[i]+".png' width='100' height='100''></figure>";
      card.addEventListener('click',function(){
         if ( game.data.work == 0)
         {
            if ( this.getAttribute('click') < 1 ) 
            {
               game.data.click += 1; 
               game.elements.score.innerHTML = game.data.click;
               if ( game.data.click == 1 )
               {
                  game.data.play = true; 
               }
               game.methods.compare(this);
            }
            else 
            {
               return false; 
            }
         }
         else {
            return false;
         }

      });
      game.elements.area.append(card);
   }
   game.elements.deck = document.querySelectorAll('.card'); 
}
// compare les deux cartes choisies 
game.methods.compare = function (card) {

   var index = card.getAttribute('index');
   var indexTab = game.elements.cardList[index];
   var name = game.elements.cards[indexTab].name;

   if (game.data.choosed.length < 2) {
      card.classList.add('flipped');
      game.data.choosed.push(game.elements.cards[indexTab]);
      game.data.selectCompare.push(card);
   }
   if ( game.data.choosed.length == 2)
   { 
      game.data.work = 1;
      if ( game.data.choosed[0] != game.data.choosed[1])
      { 
         setTimeout(function() {
            for ( var i = 0; i<2; i++) 
            {
               game.data.selectCompare[i].classList.toggle('flipped');
            }
            game.data.work = 0;
            game.data.coef = 0;
            console.log(game.data.coef);
            game.data.selectCompare = [];
         }, 1000);

         game.data.choosed = [];

      }
      else 
      {
         for ( var i = 0; i<2; i++) 
         {
            game.data.selectCompare[i].setAttribute('click',1);
         }
         game.data.pair += 1;
         game.data.choosed = [];
         game.data.selectCompare = [];
         game.data.work = 0;
         game.data.coef += 1;
         console.log("score était de "+game.data.score);
         game.data.score += 100*game.data.coef;
         console.log("score est de "+game.data.score);
         console.log(game.data.coef);
         console.log('score = '+ game.data.score);

         if ( game.data.pair == 6)
         {
            game.data.play = false;
            game.methods.setResult();
            game.methods.form(); 
         }
      }
   }
   else {
      return false;
   }
};
// chrono 
game.methods.timer = function() {
   setInterval(function()
               { 
      if (game.data.play) 
      {
         game.data.time += 1;
         game.elements.timer.innerHTML = game.data.time; 
      }
   }, 1000);
} 
game.methods.form = function() {
   game.elements.result.time.innerHTML = game.data.time;
   game.elements.result.coups.innerHTML = game.data.click;
   game.elements.result.score.innerHTML = game.data.score;
}
game.methods.play = function() {
   game.elements.accueil.classList.add('hidden');
   game.elements.application.classList.remove('hidden');
}
game.methods.setResult = function() {
   game.elements.form.classList.remove('hidden');
}
game.elements.playbutton.addEventListener('click',function(){
   game.methods.init();
})

