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
  this.targetRange = 200;

  this.bulletMaxSpeed = 50;
  this.bulletDelay = 5; // delay between bullets
  this.maxBullets = 1; // max bullets flying at the same time
  this.bullets = []; // all flying bullets of tower
}

AD.Tower.prototype = Object.create(AD.Element.prototype);
AD.Tower.prototype.constructor = AD.Tower;

AD.Tower.prototype.addBullet = function(enemy, fps) {

  if (this.bullets.length < this.maxBullets) {
    var enemyX = enemy.gfx.position.x, enemyY = enemy.gfx.position.y;
    // tower middle point as source
    var towerMidX = this.gfx.position.x + 50, towerMidY = this.gfx.position.y + 50;

    // calculate bullet speed
    var speed = Math.floor(Math.random() * this.bulletMaxSpeed) + (this.bulletMaxSpeed - this.bulletMaxSpeed * 0.1),
      currentSpeed = (1 / fps) * speed; // current speed is current passed distance to target too

    // calculate distance from tower to enemy
    var distance = Math.sqrt(Math.pow(towerMidX - enemyX, 2) + Math.pow(towerMidY - enemyY, 2));

    // calculate variance to hit moving target better;
    var varEnemyX = enemyX, varEnemyY = enemyY;
    var enemySpeed = (1 / fps) * enemy.speed;
    var stepsToTarget = distance / currentSpeed;
    // todo: improve distance calculation!
    var distanceForEnemy = distance / (currentSpeed / enemySpeed);

    switch (enemy.position.direction) {
      case 2: // down
        varEnemyY += distanceForEnemy;
        break;
      case 4: // left
        varEnemyX -= distanceForEnemy;
        break;
      case 8: // up
        varEnemyY -= distanceForEnemy;
        break;
      case 6: // right
        varEnemyX += distanceForEnemy;
        break;
    }
    distance = Math.sqrt(Math.pow(towerMidX - varEnemyX, 2) + Math.pow(towerMidY - varEnemyY, 2));
    // todo: add more and improved logic to handle waypoints with direction change later !!!

    // draw line for enemy direction for tests
    var gfx = new PIXI.Graphics();
    gfx.lineStyle(3, 0xFF50E9);
    gfx.moveTo(enemyX, enemyY);
    gfx.lineTo(varEnemyX, varEnemyY);
    ad.game.display.container.addChild(gfx);

    // calculate next position to aim at
    var cosAlpha = (towerMidX - varEnemyX) / distance;
    var sinAlpha = (towerMidY - varEnemyY) / distance;
    var nextX = towerMidX - cosAlpha * currentSpeed, nextY = towerMidY - sinAlpha * currentSpeed;

    // set / draw new bullet
    this.bullets.push(
      {
        gfx: this.game.display.drawBullet(nextX, nextY),
        speed : speed,
        distance : { target: distance, current: currentSpeed },
        aimAngle : { sin: sinAlpha, cos: cosAlpha }
      }
    );

    // draw line to target for tests
    var gfx = new PIXI.Graphics();
    gfx.lineStyle(3, 0x76FF50);
    gfx.moveTo(towerMidX, towerMidY);
    gfx.lineTo(towerMidX - cosAlpha * distance, towerMidY - sinAlpha * distance);
    ad.game.display.container.addChild(gfx);
  }
}

AD.Tower.prototype.moveBullets = function(fps) {
  // tower middle point as source
  var towerMidX = this.gfx.position.x + 50, towerMidY = this.gfx.position.y + 50;

  for (var i = 0; i < this.bullets.length; i++) {
    // each bullet flies to max target range
    if (this.targetRange > this.bullets[i].distance.current) {
      // move bullet if target has not been reached
      this.bullets[i].distance.current += (1 / fps) * this.bullets[i].speed;
      var nextX = towerMidX - this.bullets[i].aimAngle.cos * this.bullets[i].distance.current,
          nextY = towerMidY - this.bullets[i].aimAngle.sin * this.bullets[i].distance.current;
      this.bullets[i].gfx.position.x = nextX;
      this.bullets[i].gfx.position.y = nextY;

    } else {
      console.log(1);
      // otherwise remove bullet
      this.game.display.removeObject(this.bullets[i].gfx);
      this.bullets.splice(i, 1);
    }
  }
}