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

AD.Inventory = function() {
  AD.Element.call(this, "inventory", false);

  this.money = 1000; // dollars
  this.gfx = null;

  this.towers = [
    { title: "Canon Tower", costs: 250, available: false, gfx: null, selected: false },
    { title: "Gun Tower", costs: 750, available: false, gfx: null, selected: false },
    { title: "Laser Tower", costs: 1500, available: false, gfx: null, selected: false },
    { title: "Quake Tower", costs: 3000, available: false, gfx: null, selected: false }
  ];
  this.selectedTowerId = -1;
}

AD.Inventory.prototype = Object.create(AD.Element.prototype);
AD.Inventory.prototype.constructor = AD.Inventory;

AD.Inventory.prototype.update = function(display) {
  // update inventory tower items
  for (var i = 0; i < this.towers.length; i++) {

    if (this.towers[i].costs > this.money) {
      this.towers[i].available = false;
      if (this.selectedTowerId == i) selectedTowerId = -1;
      // set red tower text elements to visible
      this.towers[i].gfx.children[0].visible = false;
      this.towers[i].gfx.children[1].visible = false;
      this.towers[i].gfx.children[2].visible = true;
      this.towers[i].gfx.children[3].visible = true;
    } else {
      this.towers[i].available = true;
      // set green tower text elements to visible
      this.towers[i].gfx.children[0].visible = true;
      this.towers[i].gfx.children[1].visible = true;
      this.towers[i].gfx.children[2].visible = false;
      this.towers[i].gfx.children[3].visible = false;
    }
  }
  // update money status
  var moneyTextGfxId = this.gfx.children.length - 1;
  this.gfx.children[moneyTextGfxId].setText(this.money + "$");
}

AD.Inventory.prototype.towerClick = function(towerId) {
  // handle tower click event
  if (this.towers[towerId].available == true) {
    this.selectedTowerId = towerId;
    console.log("selected tower "+towerId);
  }
}