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

AD.Map = function() {
  AD.Element.call(this, "map", false);

  // move directions / field types:
  // 2 = down, 4 = left, 6 = right, 8 = up
  this.fields = [
    [0, 0, 0, 0, 2, 0, 0, 0, 0, 0 ],
    [0, 2, 4, 4, 4, 0, 6, 6, 2, 0 ],
    [0, 2, 0, 0, 0, 0, 8, 0, 2, 0 ],
    [0, 2, 0, 0, 0, 0, 8, 0, 2, 0 ],
    [0, 2, 0, 0, 6, 6, 8, 0, 2, 0 ],
    [0, 2, 0, 0, 8, 0, 0, 0, 2, 0 ],
    [0, 2, 0, 0, 8, 0, 0, 0, 2, 0 ],
    [0, 2, 0, 0, 8, 0, 2, 4, 4, 0 ],
    [0, 6, 6, 6, 8, 0, 2, 0, 0, 0 ],
    [0, 0, 0, 0, 0, 0, 2, 0, 0, 0 ]
  ];

  this.fieldsCoor = [];
  for (var y = 0; y < 10; y++) {
    if (typeof this.fieldsCoor[y] == "undefined") this.fieldsCoor[y] = [];
    for (var x = 0; x < 10; x++) {
      this.fieldsCoor[y][x] = null;
    }
  }

  this.startPosition = { x: 4, y: 0 };
  this.finishPosition = { x: 6, y: 9 };
  this.currentPosition = null;
}

AD.Map.prototype = Object.create(AD.Element.prototype);
AD.Map.prototype.constructor = AD.Map;

AD.Map.prototype.getFieldType = function(x, y) {
  if (typeof x === "number" && typeof y === "number" &&
      x >= 0 && x <= 9 && y >= 0 && y <= 9) {
    return this.fields[y][x];
  }
  return null;
}

AD.Map.prototype.setFieldCoor = function(x, y, pX, pY) {
  this.fieldsCoor[y][x] = { x: pX, y: pY };
}