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

// global object initialization
var ad = ad || {};

$(document).ready(function() {
  global.setTimeout(function() {
    //try {
      ad.util = new AD.Util();
      ad.storage = new AD.Storage();

      ad.version = new AD.Version();
      ad.version.updateHashesFile(); // for maintainer

      ad.userConfig = ad.util.loadJSON('./user/data/config.json');
      ad.intervals = {};
      ad.pixi = new AD.Pixi();

      ad.game = new AD.Game();

      // add/start the pixi renderer
      document.body.appendChild(ad.pixi.renderer.view);
      requestAnimFrame(ad.pixi.animate.curry(ad.pixi));

      ad.pixi.loadAssets(function() { ad.game.start(); });

    //} catch (err) {
      //console.log(err);
    //}
  }, 0.00000001); // use timeout to detect fullscreen size correctly
});
