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
  this.endPosition = { x: 6, y: 9 };
  this.path = [];
}

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

AD.Map.prototype.getFieldCoor = function(x, y) {
  return this.fieldsCoor[y][x];
}

AD.Map.prototype.getNextFieldPos = function(x, y) {
  var fieldType = this.getFieldType(x, y), oldX = x, oldY = y;
  if (fieldType == 2 && y < 9) {
    y++; // down
  } else if (fieldType == 8 && y > 0) {
    y--; // up
  } else if (fieldType == 4 && x > 0) {
    x--; // left
  } else if (fieldType == 6 && x < 9) {
    x++; // right
  }
  if (x == oldX && y == oldY) {
    return null;
  }
  return { x: x, y: y };
}

AD.Map.prototype.getNextFieldCoor = function(x, y) {
  var nextFieldPos = this.getNextFieldPos(x, y);
  return this.getFieldCoor(nextFieldPos.x, nextFieldPos.y);
}

AD.Map.prototype.getStartCoor = function() {
  // detect start coordinates by map start position
  var startX = this.startPosition.x, startY = this.startPosition.y;
  var coorX = this.fieldsCoor[startY][startX].x,
      coorY = this.fieldsCoor[startY][startX].y;
  // get correct bound start position by field position and movement direction
  var fieldType = this.getFieldType(startX, startY);
  if (startX == 0 && startY == 0) {
    // upper left field
    if (fieldType == 2) {
      coorY -= 51;
    } else if (fieldType == 6) {
      coorX -= 51;
    }
  } else if (startX == 0 && startY == 9) {
    // lower left field
    if (fieldType == 8) {
      coorY += 51;
    } else if (fieldType == 6) {
      coorX -= 51;
    }
  } else if (startX == 9 && startY == 0) {
    // upper right field
    if (fieldType == 2) {
      coorY -= 51;
    } else if (fieldType == 4) {
      coorX += 51;
    }
  } else if (startX == 9 && startY == 9) {
    // lower right field
    if (fieldType == 8) {
      coorY += 51;
    } else if (fieldType == 4) {
      coorX += 51;
    }
  } else if (startX != 0 && startX != 9 && startY == 0) {
    // upper side field field type 2 only
    coorY -= 51;
  } else if (startX != 0 && startX != 9 && startY == 9) {
    // lower side field type 8 only
    coorY += 51;
  } else if (startX == 0 && startY != 0 && startY != 9) {
    // left side field type 6 only
    coorX -= 51;
  } else if (startX == 9 && startY != 0 && startY != 9) {
    // right side field type 4 only
    coorX += 51;
  }
  return { x: coorX, y: coorY };
}

AD.Map.prototype.calculatePath = function() {
  var calculate = true, c = 0, path = [], direction = -1, nextPosition = {};
  do {
    if (c == 0) {
      path[c] = { x: this.startPosition.x, y: this.startPosition.y };
    } else {
      path[c] = { x: nextPosition.x, y: nextPosition.y };
    }

    path[c].coor = this.getFieldCoor(path[c].x, path[c].y);
    path[c].direction = this.getFieldType(path[c].x, path[c].y);
    nextPosition = { x: path[c].x, y: path[c].y };
    switch (path[c].direction) {
      case 2: // down
        nextPosition.y += 1;
        break;
      case 4: // left
        nextPosition.x -= 1;
        break;
      case 8: // up
        nextPosition.y -= 1;
        break;
      case 6: // right
        nextPosition.x += 1;
        break;
    }

    if (path[c].x == this.endPosition.x && path[c].y == this.endPosition.y) {
      calculate = false;
    }
    c++;
  } while (calculate === true);
  this.path = path;
}

AD.Map.prototype.fieldClick = function(game, fieldType, fieldPosition, fieldCoor) {
  if (fieldType == 0 && game.inventory.selectedTowerId > -1) {
    game.towerHandler.addTower(fieldPosition, fieldCoor);
    game.inventory.payTower();
  }
}