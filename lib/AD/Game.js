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

  this.map = new AD.Map();

  this.display = new AD.Display();
  this.display.initialize();
  this.display.drawInventarArea();
  this.display.drawFieldArea(this.map);

  this.enemyHandler = new AD.EnemyHandler(this.map);
}

AD.Game.prototype = Object.create(AD.Element.prototype);
AD.Game.prototype.constructor = AD.Game;

AD.Game.prototype.start = function() {
  this.enemyHandler.createEnemies();
  this.display.drawEnemies(this.enemyHandler);

  // game step for enemies' movement and tower actions
  ad.intervals.gameStep = setInterval(this.step.curry(this), 50);
}

AD.Game.prototype.step = function(scope) {
  scope.enemyHandler.moveEnemies();
}