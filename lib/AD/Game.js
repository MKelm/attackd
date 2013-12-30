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
  AD.Element.call(this, "game", false);

  this.run = false;
  this.rushRound = 0;
  this.rushRounds = 8;

  this.map = new AD.Map();
  this.inventory = new AD.Inventory();

  this.display = new AD.Display();
  this.display.initialize();
  this.display.drawInventoryArea(this.inventory);
  this.display.drawFieldArea(this.map);
  this.map.calculatePath(); // needs fields coor by display objects

  this.enemyHandler = new AD.EnemyHandler(this.map);

  // register interaction event listeners
  this.addEventListener('inventory-tower-click', ad.util.getEventListener(this, "handleEvent"));
}

AD.Game.prototype = Object.create(AD.Element.prototype);
AD.Game.prototype.constructor = AD.Game;

AD.Game.prototype.start = function() {
  this.enemyHandler.createEnemies(this.rushRound);
  this.display.drawEnemies(this.enemyHandler);
  this.inventory.update();

  this.run = true;
}

AD.Game.prototype.step = function(scope) {
  if (scope.run == true) {
    scope.enemyHandler.moveEnemies(scope.display);
    if (scope.enemyHandler.enemies.length == 0 && scope.rushRound < scope.rushRounds) {
      scope.rushRound++;
      scope.enemyHandler.createEnemies(scope.rushRound);
      scope.display.drawEnemies(scope.enemyHandler);
    }
  }
}

AD.Game.prototype.handleEvent = function(scope, event) {
  switch (event.type) {
    case "inventory-tower-click":
      scope.inventory.towerClick(event.content.towerType);
      break;
  }
}