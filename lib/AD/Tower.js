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

  this.game = game;
  this.type = this.game.inventory.selectedTowerId;

  this.gfx = null;

  // map / field position
  this.position = position;
  this.targetRange = 204;

  this.bullets = []; // all flying bullets of tower
  this.bulletMaxSpeed = -1;
  this.bulletTiming = { delay: -1, lastShoot: -1 }; // delay between bullets
  this.bulletHitPoints = -1;

  // max bullets flying at the same time
  switch (this.type) {
    case 0: // canon
      this.maxBullets = 1;
      this.bulletTiming.delay = 1000;
      this.bulletHitPoints = 100;
      this.bulletMaxSpeed = 200;
      break;
    case 1: // gun
      this.maxBullets = 20;
      this.bulletTiming.delay = 0;
      this.bulletHitPoints = 10;
      this.bulletMaxSpeed = 300;
      break;
    case 2: // laser
      this.maxBullets = 1; // laser beams
      // delay for beam impulses
      this.bulletTiming.delay = 400;
      this.bulletHitPoints = 200;
      this.bulletMaxSpeed = 800;
      break;
    case 3: // quake
      this.maxBullets = 1; // quake wave
      this.bulletTiming.delay = 1500;
      this.bulletHitPoints = 10; // a wave can hit one enemy as long as it goes through it
      this.bulletMaxSpeed = 100;
      break;
  }
}

AD.Tower.prototype.constructor = AD.Tower;

AD.Tower.prototype.addBullet = function(enemy, fps) {
  // enemy xy as target
  var enemyX = enemy.sprite.position.x, enemyY = enemy.sprite.position.y, distance = 0;
  // tower middle point as source
  var towerMidX = this.gfx.position.x + 50, towerMidY = this.gfx.position.y + 50;

  // check for bullet slots and correct bullet timing
  for (var i = this.bullets.length; i < this.maxBullets; i++) {

    var shootTimeDiff = ad.util.time() - this.bulletTiming.lastShoot;
    if (this.bulletTiming.lastShoot == -1 || shootTimeDiff >= this.bulletTiming.delay) {

      // calculate bullet / impulse speed
      var speed = Math.floor(Math.random() * this.bulletMaxSpeed) + (this.bulletMaxSpeed - this.bulletMaxSpeed * 0.4),
        currentSpeed = (1 / fps) * speed; // current speed is current passed distance to target too

      if (this.type == 0 || this.type == 1) {
        // calculate variance to hit moving target better
        var varEnemyX = enemyX, varEnemyY = enemyY;
        var enemySpeed = (1 / fps) * enemy.speed;

        // second solution search nearest bullet to target distance to target for correct bullet hit
        var calculate = true, step = 1, tmpSpeed = 0;
        do {
          switch (enemy.position.direction) {
            case 2: // down
              varEnemyY += enemySpeed;
              break;
            case 4: // left
              varEnemyX -= enemySpeed;
              break;
            case 8: // up
              varEnemyY -= enemySpeed;
              break;
            case 6: // right
              varEnemyX += enemySpeed;
              break;
          }

          // calculate next position to aim at, needs distance to enemy with valid bullet speed
          distance = Math.sqrt(Math.pow(towerMidX - varEnemyX, 2) + Math.pow(towerMidY - varEnemyY, 2));
          if (distance / step < currentSpeed) {
            calculate = false;
          } else if (distance > this.targetRange) {
            calculate = false;
          }
          step++;
        } while (calculate == true);

        var cosAlpha = (towerMidX - varEnemyX) / distance;
        var sinAlpha = (towerMidY - varEnemyY) / distance;
        var nextX = towerMidX - cosAlpha * currentSpeed, nextY = towerMidY - sinAlpha * currentSpeed;

      } else if (this.type == 2) {
        // distance to enemy == length of laser beam
        distance = Math.sqrt(Math.pow(towerMidX - enemyX, 2) + Math.pow(towerMidY - enemyX, 2));
      }

      // set / draw new bullet
      var bullet = {
        gfx: null,
        speed : speed,
        distance : { target: distance, current: currentSpeed },
        aimAngle : { sin: sinAlpha, cos: cosAlpha }
      };
      switch (this.type) {
        case 0: // canon
        case 1: // gun
          bullet.gfx = this.game.display.drawBullet(nextX, nextY);
          break;
        case 2: // laser
          bullet.gfx = this.game.display.drawLaserBeam(
            towerMidX, towerMidY, enemyX, enemyY
          );
          bullet.targetEnemy = enemy;
          break;
        case 3: // quake
          bullet.gfx = this.game.display.drawQuakeWave(towerMidX, towerMidY, 1);
          bullet.ignoreEnemy = []; // to ignore enemies which are in quake radius after a hit
          break;
      }

      this.bullets.push(bullet);
      this.bulletTiming.lastShoot = ad.util.time();
    }
  }

  return this.bullets.length < this.maxBullets;
}

AD.Tower.prototype.moveBullets = function(enemies, fps) {
  // tower middle point as source
  var towerMidX = this.gfx.position.x + 50, towerMidY = this.gfx.position.y + 50, removeBullet = false;

  for (var i = 0; i < this.bullets.length; i++) {
    // each bullet / impulse goes to max target range
    if (this.targetRange > this.bullets[i].distance.current) {
      // move bullet / impulse position if target has not been reached
      this.bullets[i].distance.current += (1 / fps) * this.bullets[i].speed;

      if (this.type == 0 || this.type == 1) {
        var nextX = towerMidX - this.bullets[i].aimAngle.cos * this.bullets[i].distance.current,
          nextY = towerMidY - this.bullets[i].aimAngle.sin * this.bullets[i].distance.current;

        this.bullets[i].gfx.position.x = nextX;
        this.bullets[i].gfx.position.y = nextY;

        // canon / gun bullets can have a variance, so we have to make a detailed hit detection
        for (var j = 0; j < enemies.length; j++) {
          if (Math.sqrt(
                Math.pow(nextX - enemies[j].sprite.position.x, 2) +
                Math.pow(nextY - enemies[j].sprite.position.y, 2)
              ) <= 10) {
            // bullet to enemy hit
            enemies[j].hitPoints = enemies[j].hitPoints - this.bulletHitPoints;
            removeBullet = true;
          }
        }

      } else if (this.type == 2) {
        // laser beam with direct beam connection to enemy
        this.game.display.removeObject(this.bullets[i].gfx);
        this.bullets[i].gfx = this.game.display.drawLaserBeam(
          towerMidX, towerMidY,
          this.bullets[i].targetEnemy.sprite.position.x, this.bullets[i].targetEnemy.sprite.position.y
        );
        if (this.bullets[i].distance.current > this.bullets[i].distance.target) {
          // laser beam impulse to enemy hit
          this.bullets[i].targetEnemy.hitPoints = this.bullets[i].targetEnemy.hitPoints - this.bulletHitPoints;
          removeBullet = true;
        }

      } else if (this.type == 3) {

        this.game.display.removeObject(this.bullets[i].gfx);
        this.bullets[i].gfx = this.game.display.drawQuakeWave(towerMidX, towerMidY, this.bullets[i].distance.current);

        for (var j = 0; j < enemies.length; j++) {
          var distance = Math.sqrt(
            Math.pow(towerMidX - enemies[j].sprite.position.x, 2) +
            Math.pow(towerMidY - enemies[j].sprite.position.y, 2)
          );

          if (Math.abs(this.bullets[i].distance.current - 10) < distance &&
              distance < this.bullets[i].distance.current + 10) {
            // quake wave to enemy hit
            enemies[j].hitPoints = enemies[j].hitPoints - this.bulletHitPoints;
          }
        }
      }

    } else {
      removeBullet = true;
    }

    if (removeBullet == true) {
      this.game.display.removeObject(this.bullets[i].gfx);
      this.bullets.splice(i, 1);
    }
  }
}