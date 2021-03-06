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

// utility class

AD.Util = function() {
  this.jsons = {};
}

AD.Util.prototype.constructor = AD.Util;

AD.Util.prototype.getEventListener = function(obj, func) {
  return function(event) { obj[func](obj, event); };
}

AD.Util.prototype.quit = function(delay) {
  if (typeof delay == "undefined") {
    delay = 0;
  }
  global.setTimeout(function() {
    require('nw.gui').App.closeAllWindows();
  }, delay);
}

AD.Util.prototype.loadJSON = function(json, forceLoad) {
  var result = {};
  if (typeof this.jsons[json] == "undefined") {
    try {
      result = JSON.parse(require('fs').readFileSync(json, { encoding : "utf8" }));
      if (forceLoad !== true) {
        // load json files one time only
        // espacially externals which will be used in multiple data files
        this.jsons[json] = result;
      }
    } catch (err) {
    }
  } else {
    result = this.jsons[json];
  }
  return result;
};

AD.Util.prototype.objectLength = function(object) {
  var size = 0, key;
  for (key in object) {
    if (object.hasOwnProperty(key)) size++;
  }
  return size;
};

AD.Util.prototype.time = function(type, delay) {
  var div = 1;
  if (type == "unix") {
    div = 1000;
  }
  if (!delay > 0) {
    delay = 0;
  }
  var t = new Date().getTime() / div;
  if (type != "formated") {
    return Math.round(t + delay);
  } else {
    var date = new Date(t);
    return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  }
}

AD.Util.prototype.isoDateTime = function(t) {
  var isoDateTime = new Date(t).toISOString();
  //2014-01-06T11:03:48.455Z
  return isoDateTime.substring(0, 10) + " " + isoDateTime.substring(11, 16);
}

AD.Util.prototype.isChance = function(p, max) {
  if (typeof max == "undefined") max = 32767;
  // calculates if a chance exists to do something
  var r = Math.random() * max;
  return r < (max * p)
}

AD.Util.prototype.isRectangesCollision = function(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (x1 <= x2 + w2 &&
          x2 <= x1 + w1 &&
          y1 <= y2 + h2 &&
          y2 <= y1 + h1);
}
