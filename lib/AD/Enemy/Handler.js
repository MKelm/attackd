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

AD.EnemyHandler = function(map) {
  AD.Element.call(this, "enemyhandler", false);

  this.map = map;

  this.amountEnemies = [
    5, 5, 5, 5, 5, 5, 5, 5
  ]; // amount of enemies by rush round

  this.enemies = [];
}

AD.EnemyHandler.prototype = Object.create(AD.Element.prototype);
AD.EnemyHandler.prototype.constructor = AD.EnemyHandler;

AD.EnemyHandler.prototype.createEnemies = function(rushRound) {
  for (var i = 0; i < this.amountEnemies[rushRound]; i++) {
    this.enemies[i] = new AD.Enemy();
    this.enemies[i].position.x = this.map.startPosition.x;
    this.enemies[i].position.y = this.map.startPosition.y;
    this.enemies[i].setPositionSettings(this.map);
  }
}

AD.EnemyHandler.prototype.moveEnemies = function(display) {
  var scope = this, moved = null;

  for (var i = 0; i < this.enemies.length; i++) {
    moved = this.enemies[i].move(this.map);
    if (moved === null) {
      display.removeObject(this.enemies[i].gfx);
      this.enemies.splice(i, 1);
    }
  }
}