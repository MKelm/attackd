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

  this.container = null;
}

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
  var fWidth = 102, fHeight = 102, sprite = null, eventContent = {}, callback = null;
  var coorX = 0, coorY = -510, fieldValue = null;
  var textureGrass = PIXI.Texture.fromImage("data/gfx/field_grass.png"),
      textureDirt = PIXI.Texture.fromImage("data/gfx/field_dirt.png");

  for (var fY = 0; fY < 10; fY++) {
    coorX = -600;
    for (var fX = 0; fX < 10; fX++) {
      fieldType = map.getFieldType(fX, fY);
      map.setFieldCoor(fX, fY, coorX + 51, coorY + 51);

      sprite = new PIXI.Sprite((fieldType == 0) ? textureGrass : textureDirt);
      sprite.width = fWidth;
      sprite.height = fHeight;
      sprite.position = { x: coorX, y: coorY };

      if (fieldType == 0) {
        sprite.setInteractive(true);
        eventContent = {};
        $.extend(eventContent, { fieldType: fieldType, fieldPosition: { x: fX, y: fY } });
        callback = function(mouse) {
          $.extend(eventContent, { mouse: mouse });
          ad.game.dispatchEvent({ type: "map-field-click", content: eventContent });
        };
        sprite.click = callback;
      }
      this.addObject(sprite);

      coorX += fWidth;
    }
    coorY += fHeight;
  }
}

AD.Display.prototype.drawInventoryArea = function(inventory) {
  var invWidth = 170, invHeight = 1024;
  var invGfx = new PIXI.DisplayObjectContainer();
  invGfx.position = { x: 620 - invWidth, y: -0.5 * invHeight };

  // draw inventory box with background
  var gfx = new PIXI.Graphics();
  gfx.beginFill(0xFFCD35);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.drawRect(0, 0, invWidth, invHeight);
  invGfx.addChild(gfx);

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

  // last text elements for money status
  var style = {font: 26 + "px " + "Arial", fill: "4E4E4E"};
  var tMoneyTitle = new PIXI.Text("Money:", style);
  tMoneyTitle.anchor = { x: 0.5, y: 0.5 };
  tMoneyTitle.position = { x: invWidth / 2, y: invHeight - 70 };
  invGfx.addChild(tMoneyTitle);

  var tMoney = new PIXI.Text(inventory.money + "$", style);
  tMoney.anchor = { x: 0.5, y: 0.5 };
  tMoney.position = { x: invWidth / 2, y: invHeight - 45 };
  invGfx.addChild(tMoney);

  this.addObject(invGfx);
  inventory.gfx = invGfx;
  return invGfx;
}

AD.Display.prototype.drawTower = function (type, x, y, inventoryData, targetGfx) {
  var tWidth = 100, tHeight = 100;
  var tGfx = new PIXI.DisplayObjectContainer();
  tGfx.position = { x: x || 0, y: y || 0 };

  if (typeof inventoryData != "undefined") {
    // title costs green for available inventory item
    var style = {font: 26 + "px " + "Arial", fill: "1EB000"};
    var tTitle = new PIXI.Text(inventoryData.title, style);
    tTitle.anchor = { x: 0.5, y: 0.5 };
    tTitle.position = { x: tWidth / 2, y: tHeight + 10 };
    tTitle.visible = false;
    tGfx.addChild(tTitle);

    var tCosts = new PIXI.Text(inventoryData.costs + "$", style);
    tCosts.anchor = { x: 0.5, y: 0.5 };
    tCosts.position = { x: tWidth / 2, y: tHeight + 35 };
    tCosts.visible = false;
    tGfx.addChild(tCosts);

    // title costs red for unavailable inventory item
    style.fill = "E00E00";
    var tTitle = new PIXI.Text(inventoryData.title, style);
    tTitle.anchor = { x: 0.5, y: 0.5 };
    tTitle.position = { x: tWidth / 2, y: tHeight + 10 };
    tGfx.addChild(tTitle);

    var tCosts = new PIXI.Text(inventoryData.costs + "$", style);
    tCosts.anchor = { x: 0.5, y: 0.5 };
    tCosts.position = { x: tWidth / 2, y: tHeight + 35 };
    tGfx.addChild(tCosts);
  }

  var towerHandle = null;
  switch (type) {
    case 0: towerHandle = "canon"; break;
    case 1: towerHandle = "gun"; break;
    case 2: towerHandle = "laser"; break;
    case 3: towerHandle = "quake"; break;
  }
  var texture = PIXI.Texture.fromImage("data/gfx/tower_"+towerHandle+".png");
  var sprite = new PIXI.Sprite(texture);
  sprite.position = { x: -2, y: -2 };
  // click event sprite for inventory tower items
  if (typeof inventoryData != "undefined") {
    sprite.setInteractive(true);
    var eventContent = {};
    $.extend(eventContent, { towerType: type });
    var callback = function(mouse) {
      $.extend(eventContent, { mouse: mouse });
      ad.game.dispatchEvent({ type: "inventory-tower-click", content: eventContent });
    };
    sprite.click = callback;
  }
  tGfx.addChild(sprite);

  if (typeof targetGfx != "undefined") {
    targetGfx.addChild(tGfx);
  } else {
    this.addObject(tGfx);
  }
  return tGfx;
}

AD.Display.prototype.drawEnemies = function(enemyHandler) {
  var startCoor = enemyHandler.game.map.getStartCoor();
  // draw new enemies for each rush round
  for (var i = 0; i < enemyHandler.enemies.length; i++) {
    enemyHandler.enemies[i].gfx = this.drawEnemy(startCoor.x, startCoor.y);
  }
}

AD.Display.prototype.drawEnemy = function(x, y) {
  var texture = PIXI.Texture.fromImage("data/gfx/fooshl.png");
  var sprite = new PIXI.Sprite(texture);
  sprite.anchor = { x: 0.5, y: 0.5 };
  sprite.position = { x: x, y: y };

  this.addObject(sprite);
  return sprite;
}

AD.Display.prototype.drawBullet = function(x, y) {
  var radius = 5;
  var gfx = new PIXI.Graphics();
  gfx.position = { x: x, y: y };
  gfx.beginFill(0xF9D500);
  gfx.lineStyle(3, 0xFFFFFF);
  gfx.drawCircle(0, 0, radius);
  this.addObject(gfx);
  return gfx;
}

AD.Display.prototype.drawLaserBeam = function(sX, sY, tX, tY) {
  var gfx = new PIXI.Graphics();
  gfx.lineStyle(3, 0xFF4040);
  gfx.moveTo(sX, sY);
  gfx.lineTo(tX, tY);
  this.addObject(gfx);
  return gfx;
}

AD.Display.prototype.drawQuakeWave = function(x, y, r) {
  var gfx = new PIXI.Graphics();
  gfx.lineStyle(3, 0xFF4040);
  gfx.drawCircle(x, y, r);
  this.addObject(gfx);
  return gfx;
}