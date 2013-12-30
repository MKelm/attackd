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

AD.Enemy = function() {
  AD.Element.call(this, "enemy", false);

  this.gfx = null;
  // map / field position
  this.position = { x: -1, y: -1 };

  var maxSpeed = 200;
  this.speed = Math.floor(Math.random() * maxSpeed) + (maxSpeed - maxSpeed * 0.1);
}

AD.Enemy.prototype = Object.create(AD.Element.prototype);
AD.Enemy.prototype.constructor = AD.Enemy;

AD.Enemy.prototype.move = function(map) {
  // movement speed depends on fps
  var dt = 1 / ((ad.userConfig.fps > -1) ? ad.userConfig.fps : 30);
  var speed = dt * this.speed;
  // detect correct move direction and source enemy / target field coor
  var moveDirection = map.getFieldType(this.position.x, this.position.y);
  var fieldCoor = map.getFieldCoor(this.position.x, this.position.y);
  var gfxCoor = { x: this.gfx.position.x, y: this.gfx.position.y };

  // detect last field to move to field border, otherwise distance to next field mid point
  var distance = (this.position.x == map.endPosition.x && this.position.y == map.endPosition.y) ?
    51 : 102;
  // change field position on next field mid point
  var changeFieldPosition = false;

  switch (moveDirection) {
    case 2: // down
      if (gfxCoor.y < fieldCoor.y + distance) {
        this.gfx.position.y += speed;
      } else {
        changeFieldPosition = true;
      }
      break;
    case 4: // left
      if (gfxCoor.x > fieldCoor.x - distance) {
        this.gfx.position.x -= speed;
      } else {
        changeFieldPosition = true;
      }
      break;
    case 8: // up
      if (gfxCoor.y > fieldCoor.y - distance) {
        this.gfx.position.y -= speed;
      } else {
        changeFieldPosition = true;
      }
      break;
    case 6: // right
      if (gfxCoor.x < fieldCoor.x + distance) {
        this.gfx.position.x += speed;
      } else {
        changeFieldPosition = true;
      }
      break;
  }

  if (changeFieldPosition == true) {
    var nextPos = map.getNextFieldPos(this.position.x, this.position.y);
    if (nextPos !== null) {
      this.position.x = nextPos.x;
      this.position.y = nextPos.y;
    } else {
      return null;
    }
  }
  return true;
}