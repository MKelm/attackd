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
  this.position = { x: 0, y: 0 }; // map / field position
  this.speed = Math.floor(Math.random() * 5) + 1;
}

AD.Enemy.prototype = Object.create(AD.Element.prototype);
AD.Enemy.prototype.constructor = AD.Enemy;