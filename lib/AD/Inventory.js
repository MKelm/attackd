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
    { title: "Canon Tower", costs: 500 },
    { title: "Gun Tower", costs: 1000 },
    { title: "Laser Tower", costs: 1800 },
    { title: "Quake Tower", costs: 2500 }
  ];
}

AD.Inventory.prototype = Object.create(AD.Element.prototype);
AD.Inventory.prototype.constructor = AD.Inventory;

AD.Inventory.prototype.updateInventory = function(display) {
  // update inventory items and status messages
}

AD.Inventory.prototype.handleEvent = function(scope, event) {
  // handle tower mouse down click event
  if (event.type == "inventory-tower-mousedown") {

  }
}