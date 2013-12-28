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

AD.Display = function() {
  AD.Element.call(this, "display", false);

  this.gfx = [];

  this.container = null;
}

AD.Display.prototype = Object.create(AD.Element.prototype);
AD.Display.prototype.constructor = AD.Display;

AD.Display.prototype.initialize = function() {
  this.container = new PIXI.DisplayObjectContainer();
  this.container.pivot = {x: 0.5, y: 0.5 };
  this.container.position = {x: ad.pixi.screen.width/2, y: ad.pixi.screen.height/2 };

  this.container.scale = {x: ad.pixi.screen.ratio, y: ad.pixi.screen.ratio};
  ad.pixi.stage.addChild(this.container);
}

AD.Display.prototype.addObject = function(object) {
  this.container.addChild(object);
}

AD.Display.prototype.removeObject = function(object) {
  this.container.removeChild(object);
}

AD.Display.prototype.drawInventarArea = function() {
  var invWidth = 112, invHeigth = 1024;
  var invGfx = new PIXI.DisplayObjectContainer();
  invGfx.pivot = {x: 0.5, y: 0.5 };
  invGfx.position = { x: 512 - invWidth, y: -0.5 * invHeigth };

  // draw inventar box with background
  var gfx = new PIXI.Graphics();
  gfx.beginFill(0xFFCD35);
  gfx.lineStyle(3, 0xFFFFFF)
  gfx.drawRect(0, 0, 112, 1024);
  invGfx.addChild(gfx);

  // draw diagonal background stripes
  for (var y = 0; y < invWidth + invHeigth; y++) {
    if (y % 15 == 0) {
      var tY = y, tX = 0;
      do {
        tY--;
        tX++;
      } while (tX < invWidth && tY > 0);
      var sX = 0, sY = y;
      if (sY > invHeigth) {
        do {
          sY--;
          sX++;
        } while (sY > invHeigth);
      }
      gfx = new PIXI.Graphics();
      gfx.lineStyle(3, 0xFFFFFF);
      gfx.moveTo(sX, sY);
      gfx.lineTo(tX, tY);
      invGfx.addChild(gfx);
    }
  }

  this.addObject(invGfx);
  this.gfx.push(invGfx);
  return this.gfx.length-1;
}