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

AD.Display.prototype.drawFieldArea = function(map) {
  var coorX = 0, coorY = -510, fieldValue = null;
  for (var fY = 0; fY < 10; fY++) {
    coorX = -600;
    for (var fX = 0; fX < 10; fX++) {
      fieldType = map.getFieldType(fX, fY);
      map.setFieldCoor(fX, fY, coorX + 51, coorY + 51);
      this.drawField(coorX, coorY, fieldType);
      coorX += 102;
    }
    coorY += 102;
  }
}

AD.Display.prototype.drawField = function(x, y, fieldType) {
  var fWidth = 102, fHeigth = 102;
  var fieldGfx = new PIXI.DisplayObjectContainer();
  fieldGfx.position = { x: x, y: y };

  var gfx = new PIXI.Graphics();
  if (fieldType != 0) {
    gfx.beginFill(0x35B3FF);
  }
  gfx.lineStyle(3, 0xFFFFFF)
  gfx.drawRect(0, 0, fWidth, fHeigth);
  fieldGfx.addChild(gfx);

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
  return fieldGfx;
}

AD.Display.prototype.drawInventoryArea = function(inventory) {
  var invWidth = 256 / 1.5, invHeigth = 1024;
  var invGfx = new PIXI.DisplayObjectContainer();
  invGfx.pivot = {x: 0.5, y: 0.5 };
  invGfx.position = { x: 640 - invWidth, y: -0.5 * invHeigth };

  // draw inventory box with background
  var gfx = new PIXI.Graphics();
  gfx.beginFill(0xFFCD35);
  gfx.lineStyle(3, 0xFFFFFF)
  gfx.drawRect(0, 0, invWidth, invHeigth);
  invGfx.addChild(gfx);

  // draw diagonal background stripes
  this.drawDiagonalLines(invGfx, invWidth, invHeigth);

  // inventory tower item positions
  var invTowerPos = [
    { x: 35, y: 30 }, // canon tower
    { x: 35, y: 180 }, // gun tower
    { x: 35, y: 330 }, // laser tower
    { x: 35, y: 480 } // quake tower
  ];

  for (var i = 0; i < inventory.towers.length; i++) {
    inventory.towers[i].gfx = this.drawTower(
      i, invTowerPos[i].x, invTowerPos[i].y, inventory.towers[i], invGfx
    );
  }

  this.addObject(invGfx);
  return invGfx;
}

AD.Display.prototype.drawTower = function (type, x, y, inventoryData, targetGfx) {
  var tWidth = 100, tHeigth = 100;
  var tGfx = new PIXI.DisplayObjectContainer();
  tGfx.position = { x: x || 0, y: y || 0 };

  if (typeof inventoryData != "undefined") {
    // title costs green for available inventory item
    var style = {font: Math.floor(38 * ad.pixi.screen.ratio) + "px " + "Arial", fill: "1EB000"};
    var tTitle = new PIXI.Text(inventoryData.title, style);
    tTitle.anchor = { x: 0.5, y: 0.5 };
    tTitle.position = { x: tWidth / 2, y: tHeigth + 10 };
    tGfx.addChild(tTitle);

    var tCosts = new PIXI.Text(inventoryData.costs + "$", style);
    tCosts.anchor = { x: 0.5, y: 0.5 };
    tCosts.position = { x: tWidth / 2, y: tHeigth + 30 };
    tGfx.addChild(tCosts);

    // title costs red for unavailable inventory item
    style.fill = "E00E00";
    var tTitle = new PIXI.Text(inventoryData.title, style);
    tTitle.anchor = { x: 0.5, y: 0.5 };
    tTitle.position = { x: tWidth / 2, y: tHeigth + 10 };
    tGfx.addChild(tTitle);

    var tCosts = new PIXI.Text(inventoryData.costs + "$", style);
    tCosts.anchor = { x: 0.5, y: 0.5 };
    tCosts.position = { x: tWidth / 2, y: tHeigth + 30 };
    tGfx.addChild(tCosts);
  }

  switch (type) {
    case 0: this.drawCanonTower(tGfx); break;
    case 1: this.drawGunTower(tGfx); break;
    case 2: this.drawLaserTower(tGfx); break;
    case 3: this.drawQuakeTower(tGfx); break;
  }

  if (typeof targetGfx != "undefined") {
    targetGfx.addChild(tGfx);
  } else {
    this.addObject(tGfx);
  }
  return tGfx;
}

AD.Display.prototype.drawCanonTower = function(tGfx) {
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
}

AD.Display.prototype.drawGunTower = function(tGfx) {
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
}

AD.Display.prototype.drawLaserTower = function(tGfx) {
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
  gfx.drawRect(25, 10, 50, 30);
  tGfx.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.moveTo(5, 25);
  gfx.lineTo(25, 12.5);
  gfx.lineTo(25, 28.5);
  gfx.lineTo(5, 25);
  tGfx.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.moveTo(95, 25);
  gfx.lineTo(75, 12.5);
  gfx.lineTo(75, 28.5);
  gfx.lineTo(95, 25);
  tGfx.addChild(gfx);
}

AD.Display.prototype.drawQuakeTower = function(tGfx) {
  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.drawRect(10, 75, 80, 15);
  tGfx.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.drawRect(35, 50, 30, 25);
  tGfx.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.moveTo(10, 35);
  gfx.lineTo(25, 50);
  gfx.lineTo(50, 35);
  gfx.lineTo(40, 20);
  gfx.lineTo(10, 35);
  tGfx.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.moveTo(90, 35);
  gfx.lineTo(75, 50);
  gfx.lineTo(50, 35);
  gfx.lineTo(60, 20);
  gfx.lineTo(90, 35);
  tGfx.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x280261);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.moveTo(10, 10);
  gfx.lineTo(50, 50);
  gfx.lineTo(90, 10);
  gfx.lineTo(10, 10);
  tGfx.addChild(gfx);
}

AD.Display.prototype.drawEnemies = function(enemyHandler) {
  var startCoor = enemyHandler.map.getStartCoor();

  // draw new enemies for each rush round
  for (var i = 0; i < enemyHandler.enemies.length; i++) {
    enemyHandler.enemies[i].gfx = this.drawEnemy(startCoor.x, startCoor.y);
  }
}

AD.Display.prototype.drawEnemy = function(x, y) {
  var width = 20, heigth = 20;
  var gfx = new PIXI.Graphics();
  gfx.pivot = { x: width/2, y: heigth/2 };
  gfx.position = { x: x, y: y };
  gfx.beginFill(0xDD0800);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.drawRect(0, 0, width, heigth);

  this.addObject(gfx);
  return gfx;
}