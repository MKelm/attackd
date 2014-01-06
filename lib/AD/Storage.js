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

// storage class to perform database actions

AD.Storage = function() {
  this.db = openDatabase('addb1', '1.0', 'nxdb1', 2 * 1024 * 1024);
}

AD.Storage.prototype.constructor = NX.Storage;

AD.Storage.prototype.setTimeMoney = function(points) {
  var time = nx.util.time();
  this.db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS ranglist (time unique, money)');
  });
  this.db.transaction(function (tx) {
    tx.executeSql('INSERT INTO ranglist (time, money) VALUES (?, ?)', [time, points]);
  });
}

AD.Storage.prototype.loadRanglist = function(callback) {
  this.db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM ranglist ORDER BY money DESC LIMIT 5', [], function (tx, results) {
      var ranglist = [];
      for (var i = 0; i < results.rows.length; i++) {
        ranglist.push(results.rows.item(i));
      }
      if (callback) callback.call(this, ranglist);
    });
  }, function() { if (callback) callback.call(this, []) });
}