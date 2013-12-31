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

// handle creation / positions / movement of enemies

AD.EnemyHandler = function(game) {
  AD.Element.call(this, "enemyhandler", false);

  this.game = game;
  this.amountEnemies = [
    5, 10, 20, 40, 80, 120, 160, 200
  ]; // amount of enemies by rush round

  this.enemies = [];
}

AD.EnemyHandler.prototype = Object.create(AD.Element.prototype);
AD.EnemyHandler.prototype.constructor = AD.EnemyHandler;

AD.EnemyHandler.prototype.createEnemies = function(rushRound) {
  for (var i = 0; i < this.amountEnemies[rushRound]; i++) {
    this.enemies[i] = new AD.Enemy();
    this.enemies[i].position = this.game.map.path[this.enemies[i].pathPosition];
  }
  this.game.display.drawEnemies(this);
}

AD.EnemyHandler.prototype.update = function(fps) {
  // move all enemies and remove enemies out of bounds
  var moved = null;
  for (var i = 0; i < this.enemies.length; i++) {
    moved = this.enemies[i].move(this.game.map.path, fps);
    if (moved === null) {
      this.game.display.removeObject(this.enemies[i].gfx);
      this.enemies.splice(i, 1);
    }
  }
}

AD.EnemyHandler.prototype.collectEnemiesInCircle = function(cX, cY, cR) {
  var enemies = [];
  for (var j = 0; j < this.enemies.length; j++) {
    var eX = this.enemies[j].gfx.position.x, eY = this.enemies[j].gfx.position.y, eR = 10;
    if (Math.sqrt(Math.pow(cX - eX, 2) + Math.pow(cY - eY, 2)) < cR + eR) {
      enemies.push(this.enemies[j]);
    }
  }
  return enemies;
}