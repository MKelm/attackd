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

AD.Tower = function(type, position) {
  AD.Element.call(this, "tower", false);

  this.type = type;

  this.gfx = null;

  // map / field position
  this.position = position;

  this.bulletSpeed = 10;
  this.bulletDelay = 5; // delay between bullets
  this.bullets = []; // all flying bullets of tower
}

AD.Tower.prototype = Object.create(AD.Element.prototype);
AD.Tower.prototype.constructor = AD.Tower;

AD.Tower.prototype.moveBullets = function() {

  // movement speed depends on fps
  var dt = 1 / ((ad.userConfig.fps > -1) ? ad.userConfig.fps : 30);
  var speed = dt * this.speed;
  var midPointCoor = { x: this.gfx.position.x + 50, y: this.gfx.position.y + 50 };
}