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

  this.rushRounds = 8;
  this.amountEnemies = [
    10, 20, 50, 80, 120, 160, 300, 450
  ]; // amount of enemies by rush round

  this.enemies = [];
}

AD.EnemyHandler.prototype = Object.create(AD.Element.prototype);
AD.EnemyHandler.prototype.constructor = AD.EnemyHandler;

AD.EnemyHandler.prototype.createEnemies = function(rushRound) {
  var amount = this.amountEnemies[rushRound];

  for (var i = 0; i < amount; i++) {
    this.enemies[i] = new AD.Enemy();
    this.enemies[i].position.x = this.map.startPosition.x;
    this.enemies[i].position.y = this.map.startPosition.y;
  }
}