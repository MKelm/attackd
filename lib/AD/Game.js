/*
 * This file is part of AttackD.
 * Copyright 2013-2014 by Martin Kelm - All rights reserved.
 * Project page @ https://github.com/mkelm/skipbo
 *
 * AttackD is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * AttackD is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AttackD. If not, see <http://www.gnu.org/licenses/>.
 */

// game class

AD.Game = function() {
  // use pixi event target to handle display object interaction events
  // see -> https://github.com/MKelm/pixi.js/blob/dev/src/pixi/utils/EventTarget.js
  PIXI.EventTarget.call(this);

  this.run = false;

  this.rushRoundId = 0;
  this.rushRoundsAmount = 8;

  this.map = new AD.Map();
  this.hasFurtherMap = this.map.load();
  this.inventory = new AD.Inventory();

  this.display = new AD.Display();
  this.display.initialize();
  this.display.drawInventoryArea(this.inventory);
  this.display.drawFieldArea(this.map);
  this.map.calculatePath(); // needs fields coor by display objects

  this.gameOverWindow = null, this.welcomeWindow = null, mapChangeWindow = null;

  this.enemyHandler = new AD.EnemyHandler(this);
  this.towerHandler = new AD.TowerHandler(this);

  // register interaction event listeners
  this.addEventListener('window-close-click', ad.util.getEventListener(this, "handleEvent"));
  this.addEventListener('inventory-tower-click', ad.util.getEventListener(this, "handleEvent"));
  this.addEventListener('map-field-click', ad.util.getEventListener(this, "handleEvent"));
}

AD.Game.prototype.constructor = AD.Game;

AD.Game.prototype.start = function() {
  this.inventory.update();
  this.showWelcomeWindow();
}

AD.Game.prototype.update = function(scope) {
  var time = ad.util.time(), timeDiff = time - scope.lastUpdateTime;
  if (scope.enemyHandler.enemies.length == 0) {
    scope.run = false;
    if (scope.rushRoundId < scope.rushRoundsAmount - 1) {
      // rush change
      scope.rushRoundId++;
      scope.enemyHandler.createEnemies(scope.rushRoundId);
      scope.run = true;

    } else if (this.hasFurtherMap == true) {
      // map change
      scope.hasFurtherMap = scope.map.load();
      scope.display.remove();
      scope.enemyHandler.reset();
      scope.towerHandler.reset();
      scope.display.initialize();
      scope.display.drawInventoryArea(scope.inventory);
      scope.display.drawFieldArea(scope.map);
      scope.map.calculatePath();
      scope.inventory.update();
      scope.rushRoundId = 0;
      scope.showMapChangeWindow();

    } else {
      // game over
      if (scope.inventory.money > 0) {
        ad.storage.setTimeMoney(scope.inventory.money);
      }
      ad.storage.loadRanglist(
        function(ranglist) {
          scope.showGameOverWindow(ranglist);
        }
      );
    }
  } else {
    scope.enemyHandler.update(1000 / timeDiff);
    scope.towerHandler.update(1000 / timeDiff);
  }
  scope.lastUpdateTime = ad.util.time();
}

AD.Game.prototype.showWelcomeWindow = function() {
  this.welcomeWindow = new AD.DisplayWindow(this, 600, 310);
  this.welcomeWindow.handle = "welcome";
  this.welcomeWindow.title = "Welcome to AttackD";
  this.welcomeWindow.show();
  this.welcomeWindow.drawTitle();
  this.welcomeWindow.drawCloseButton();
  this.welcomeWindow.drawContentText(
    "You are John Rongold, a commander of a tower building troop. " +
    "The situation is critical, a group of Fooshls plagues the land. " +
    "You have to find a solution with your troop. Go and build some towers " +
    "to defend the area!", 550, 65
  );
}

AD.Game.prototype.showMapChangeWindow = function() {
  this.mapChangeWindow = new AD.DisplayWindow(this, 600, 210);
  this.mapChangeWindow.handle = "mapchange";
  this.mapChangeWindow.title = "Next area";
  this.mapChangeWindow.show();
  this.mapChangeWindow.drawTitle();
  this.mapChangeWindow.drawCloseButton();
  this.mapChangeWindow.drawContentText(
    "There is another area to find a solution for. " +
    "Go and build more towers to defend this area!", 550, 65
  );
}

AD.Game.prototype.showGameOverWindow = function(ranglist) {
  this.gameOverWindow = new AD.DisplayWindow(this, 450, 320);
  this.gameOverWindow.handle = "gameover";
  this.gameOverWindow.title = "Game Over";
  this.gameOverWindow.show();
  this.gameOverWindow.drawTitle();
  this.gameOverWindow.drawContentText("Highscores:", false, 60);
  this.gameOverWindow.drawRanglist(ranglist, 105);
}

AD.Game.prototype.handleEvent = function(scope, event) {
  switch (event.type) {
    case "window-close-click":
      if (event.content.window == "welcome") {
        scope.welcomeWindow.hide();
      } else if (event.content.window == "mapchange") {
        scope.mapChangeWindow.hide();
      }
      scope.enemyHandler.createEnemies(scope.rushRoundId);
      scope.lastUpdateTime = ad.util.time();
      scope.run = true;
      break;
    case "inventory-tower-click":
      scope.inventory.towerClick(event.content.towerType);
      break;
    case "map-field-click":
      var fieldCoor = event.content.mouse.target.position; // field gfx container pos
      scope.map.fieldClick(
        scope,
        event.content.fieldType,
        event.content.fieldPosition,
        { x: fieldCoor.x, y: fieldCoor.y }
      );
      break;
  }
}