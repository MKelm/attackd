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

// handle creation / list of towers and movement of bullets

AD.TowerHandler = function(game) {
  AD.Element.call(this, "enemyhandler", false);

  this.game = game;
  this.towers = [];
}

AD.TowerHandler.prototype = Object.create(AD.Element.prototype);
AD.TowerHandler.prototype.constructor = AD.TowerHandler;

AD.TowerHandler.prototype.addTower = function(fieldPosition, fieldCoor) {
  if (this.game.inventory.selectedTowerId > -1) {
    var tower = new AD.Tower(this.game, fieldPosition);
    tower.gfx = this.game.display.drawTower(
      this.game.inventory.selectedTowerId, fieldCoor.x + 1, fieldCoor.y + 1
    );
    this.towers.push(tower);
    return true;
  }
  return false;
}

AD.TowerHandler.prototype.update = function(fps) {
  var tower = null, activeEnemies = null;

  for (var i = 0; i < this.towers.length; i++) {
    // collect enemies to aim at
    activeEnemies = this.game.enemyHandler.collectEnemiesInCircle(
      this.towers[i].gfx.position.x + 50,
      this.towers[i].gfx.position.y + 50,
      this.towers[i].targetRange
    );

    // detect bullet available and set new bullet
    if (activeEnemies.length > 0 && this.towers[i].bullets.length < 2) {
      for (var j = 0; j < activeEnemies.length; j++) {
        if (this.towers[i].addBullet(activeEnemies[j], fps) == false) break;
      }
    }

    this.towers[i].moveBullets(activeEnemies, fps);
  }
}