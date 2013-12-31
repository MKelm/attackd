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

AD.Tower = function(game, position) {
  AD.Element.call(this, "tower", false);

  this.game = game;
  this.type = this.game.inventory.selectedTowerId;

  this.gfx = null;

  // map / field position
  this.position = position;

  this.bulletMaxSpeed = 200;
  this.bulletDelay = 5; // delay between bullets
  this.maxBullets = 1; // max bullets flying at the same time
  this.bullets = []; // all flying bullets of tower
}

AD.Tower.prototype = Object.create(AD.Element.prototype);
AD.Tower.prototype.constructor = AD.Tower;

AD.Tower.prototype.moveBullets = function(targetX, targetY, targetSpeed, fps) {
  // tower middle point as source
  var sourceX = this.gfx.position.x + 50, sourceY = this.gfx.position.y + 50;

  if (this.bullets.length < this.maxBullets) {
    // calculate bullet speed
    var maxSpeed = 200,
      bulletSpeed = (1 / fps) * (
        Math.floor(Math.random() * this.bulletMaxSpeed) + (this.bulletMaxSpeed - this.bulletMaxSpeed * 0.1)
      );
    // calculate aiming values
    var distance = Math.sqrt(Math.pow(sourceX - targetX, 2) + Math.pow(sourceY - targetY, 2));
    var sinAlpha = (sourceY - targetY) / distance;
    var cosAlpha = (sourceX - targetX) / distance;
    var nextX = sourceX - cosAlpha * bulletSpeed, nextY = sourceY - sinAlpha * bulletSpeed;

    // set / draw new bullet
    this.bullets.push(
      {
        gfx: this.game.display.drawBullet(nextX, nextY),
        bulletSpeed : bulletSpeed,
        distance : { target: distance, current: bulletSpeed },
        aimAngle : { sin: sinAlpha, cos: cosAlpha }
      }
    );

  } else {
    for (var i = 0; i < this.bullets.length; i++) {
      if (this.bullets[i].distance.target > this.bullets[i].distance.current) {
        // move bullet if target has not been reached
        this.bullets[i].distance.current += this.bullets[i].bulletSpeed;
        var nextX = sourceX - this.bullets[i].aimAngle.cos * this.bullets[i].distance.current,
            nextY = sourceY - this.bullets[i].aimAngle.sin * this.bullets[i].distance.current;
        this.bullets[i].gfx.position.x = nextX;
        this.bullets[i].gfx.position.y = nextY;

      } else {
        // otherwise remove bullet
        this.game.display.removeObject(this.bullets[i].gfx);
        this.bullets.splice(i, 1);
      }
    }
  }
}