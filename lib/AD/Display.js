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

AD.Display.prototype.drawFieldArea = function(map) {
  var sX = 0, sY = -510, fieldValue = null;
  for (var i = 0; i < 10; i++) {
    sX = -600;
    for (var j = 0; j < 10; j++) {
      fieldType = map.getFieldType(j, i);
      this.drawField(sX, sY, fieldType);
      sX += 102;
    }
    sY += 102;
  }
}

AD.Display.prototype.drawField = function(x, y, fieldType) {
  var fWidth = 102, fHeigth = 102;
  var fieldGfx = new PIXI.DisplayObjectContainer();
  fieldGfx.position = { x: x, y: y };

  // draw field box without bg
  var gfx = new PIXI.Graphics();
  if (fieldType != 0) {
    gfx.beginFill(0x35B3FF);
  }
  gfx.lineStyle(3, 0xFFFFFF)
  gfx.drawRect(0, 0, fWidth, fHeigth);
  fieldGfx.addChild(gfx);

  if (fieldType != 0) {
    // draw diagonal background stripes
    this.drawDiagonalLines(fieldGfx, fWidth, fHeigth);
  }

  this.addObject(fieldGfx);
  this.gfx.push(fieldGfx);
  return this.gfx.length-1;
}

AD.Display.prototype.drawInventarArea = function() {
  var invWidth = 256 / 1.5, invHeigth = 1024;
  var invGfx = new PIXI.DisplayObjectContainer();
  invGfx.pivot = {x: 0.5, y: 0.5 };
  invGfx.position = { x: 640 - invWidth, y: -0.5 * invHeigth };

  // draw inventar box with background
  var gfx = new PIXI.Graphics();
  gfx.beginFill(0xFFCD35);
  gfx.lineStyle(3, 0xFFFFFF)
  gfx.drawRect(0, 0, invWidth, invHeigth);
  invGfx.addChild(gfx);

  // draw diagonal background stripes
  this.drawDiagonalLines(invGfx, invWidth, invHeigth);

  // draw inventar items
  this.drawCanonTower(30, 30, true, invGfx);
  this.drawRocketTower(30, 160, true, invGfx);

  this.addObject(invGfx);
  this.gfx.push(invGfx);
  return this.gfx.length-1;
}

AD.Display.prototype.drawDiagonalLines = function(targetGfx, width, heigth, lineSpace) {
  if (typeof lineSpace == "undefined") lineSpace = 15;
  for (var y = 0; y < width + heigth; y++) {
    if (y % lineSpace == 0) {
      var tY = y, tX = 0;
      do {
        tY--;
        tX++;
      } while (tX < width && tY > 0);
      var sX = 0, sY = y;
      if (sY > heigth) {
        do {
          sY--;
          sX++;
        } while (sY > heigth);
      }
      gfx = new PIXI.Graphics();
      gfx.lineStyle(3, 0xFFFFFF);
      gfx.moveTo(sX, sY);
      gfx.lineTo(tX, tY);
      targetGfx.addChild(gfx);
    }
  }
}

AD.Display.prototype.drawCanonTower = function(x, y, title, targetGfx) {
  var tWidth = 100, tHeigth = 100;
  var tGfx = new PIXI.DisplayObjectContainer();
  tGfx.position = { x: x || 0, y: y || 0 };

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.moveTo(10, 90);
  gfx.lineTo(40, 30);
  gfx.lineTo(60, 30);
  gfx.lineTo(90, 90);
  gfx.lineTo(10, 90);
  tGfx.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.drawRect(20, 10, 60, 20);
  tGfx.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.drawRect(80, 12, 10, 15);
  tGfx.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.drawRect(10, 12, 10, 15);
  tGfx.addChild(gfx);

  if (title == true) {
    var style = {font: Math.floor(38 * ad.pixi.screen.ratio) + "px " + "Arial", fill: "4C4C4C"};
    var tTitle = new PIXI.Text("Canon Tower", style);
    tTitle.anchor = { x: 0.5, y: 0.5 };
    tTitle.position = { x: tWidth / 2, y: tHeigth + 10 };
    tGfx.addChild(tTitle);
  }

  if (typeof targetGfx != "undefined") {
    targetGfx.addChild(tGfx);
  } else {
    this.addObject(tGfx);
    this.gfx.push(tGfx);
    return this.gfx.length-1;
  }
}

AD.Display.prototype.drawRocketTower = function(x, y, title, targetGfx) {
  var tWidth = 100, tHeigth = 100;
  var tGfx = new PIXI.DisplayObjectContainer();
  tGfx.position = { x: x || 0, y: y || 0 };

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.moveTo(10, 90);
  gfx.lineTo(40, 30);
  gfx.lineTo(60, 30);
  gfx.lineTo(90, 90);
  gfx.lineTo(10, 90);
  tGfx.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.drawRect(70, 25, 30, 10);
  tGfx.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.drawRect(70, 45, 30, 10);
  tGfx.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.drawRect(0, 25, 30, 10);
  tGfx.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.drawRect(0, 45, 30, 10);
  tGfx.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.moveTo(10, 10);
  gfx.lineTo(50, 20);
  gfx.lineTo(90, 10);
  gfx.lineTo(70, 40);
  gfx.lineTo(90, 70);
  gfx.lineTo(50, 60);
  gfx.lineTo(10, 70);
  gfx.lineTo(30, 40);
  gfx.lineTo(10, 10);
  tGfx.addChild(gfx);

  if (title == true) {
    var style = {font: Math.floor(38 * ad.pixi.screen.ratio) + "px " + "Arial", fill: "4C4C4C"};
    var tTitle = new PIXI.Text("Rocket Tower", style);
    tTitle.anchor = { x: 0.5, y: 0.5 };
    tTitle.position = { x: tWidth / 2, y: tHeigth + 10 };
    tGfx.addChild(tTitle);
  }

  if (typeof targetGfx != "undefined") {
    targetGfx.addChild(tGfx);
  } else {
    this.addObject(tGfx);
    this.gfx.push(tGfx);
    return this.gfx.length-1;
  }
}