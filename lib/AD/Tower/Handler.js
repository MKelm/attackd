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
    var tower = new AD.Tower(this.game.inventory.selectedTowerId, fieldPosition);
    tower.gfx = this.game.display.drawTower(
      this.game.inventory.selectedTowerId, fieldCoor.x + 1, fieldCoor.y + 1
    );
    this.towers.push(tower);
    return true;
  }
  return false;
}

AD.TowerHandler.prototype.update = function(fps) {
  // first collect enemies to aim at
  var tower = null, activeEnemies = null;

  for (var i = 0; i < this.towers.length; i++) {
    var tX = this.towers[i].gfx.position.x + 50, tY = this.towers[i].gfx.position.y + 50;
    activeEnemies = this.game.enemyHandler.collectEnemiesInCircle(tX, tY, 204);

    // detect bullet available and set new bullet
    if (activeEnemies.length > 0 && this.towers[i].bullets.length < 2) {
      for (var j = 0; j < activeEnemies.length; j++) {
        var eX = activeEnemies[j].gfx.position.x, eY = activeEnemies[j].gfx.position.y;

        if (this.towers[i].bullets.length == 0) {
          // calculate bullet speed
          var maxSpeed = 200,
              bulletSpeed = (1 / fps) * (Math.floor(Math.random() * maxSpeed) + (maxSpeed - maxSpeed * 0.1));
          // calculate aiming values
          var dET = Math.sqrt(Math.pow(tX-eX, 2) + Math.pow(tY-eY, 2));
          var sinAlpha = (tY-eY)/dET;
          var cosAlpha = (tX-eX)/dET;
          var nextX = tX - cosAlpha * bulletSpeed, nextY = tY - sinAlpha * bulletSpeed;
          // set / draw new bullet
          this.towers[i].bullets.push(
            {
              gfx: this.game.display.drawBullet(nextX, nextY),
              bulletSpeed : bulletSpeed,
              distance : { target: dET, current: bulletSpeed },
              aimAngle : { sin: sinAlpha, cos: cosAlpha }
            }
          );

        } else if (this.towers[i].bullets[0].distance.target > this.towers[i].bullets[0].distance.current) {
          // move bullet if target has not been reached
          this.towers[i].bullets[0].distance.current += this.towers[i].bullets[0].bulletSpeed;
          var nextX = tX - this.towers[i].bullets[0].aimAngle.cos * this.towers[i].bullets[0].distance.current,
              nextY = tY - this.towers[i].bullets[0].aimAngle.sin * this.towers[i].bullets[0].distance.current;
          this.towers[i].bullets[0].gfx.position.x = nextX;
          this.towers[i].bullets[0].gfx.position.y = nextY;
        }

        break; // just one enemy for tests
      }
    }
  }
}