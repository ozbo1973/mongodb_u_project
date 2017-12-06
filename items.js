/*
  Copyright (c) 2008 - 2016 MongoDB, Inc. <http://mongodb.com>

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

function ItemDAO(database) {
  'use strict';

  this.db = database;

  this.getCategories = function(callback) {
    'use strict';

    var query = [
      {
        $group: {
          _id: '$category',
          num: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];

    this.db
      .collection('item')
      .aggregate(query)
      .toArray((err, res) => {
        assert.equal(null, err);
        if (err) {
          console.log(err);
        }

        res.unshift({
          _id: 'All',
          num: res.reduce(function(prevVal, elem) {
            return prevVal + elem.num;
          }, 0)
        });

        callback(res);
      });
  };

  this.getItems = function(category, page, itemsPerPage, callback) {
    'use strict';

    this.db
      .collection('item')
      .find(this.objFind(category))
      .sort({ _id: 1 })
      .skip(itemsPerPage * page)
      .limit(itemsPerPage)
      .toArray((err, res) => {
        assert.equal(null, err);
        if (err) {
          console.log(err);
        }

        callback(res);
      });
  };

  this.getNumItems = function(category, callback) {
    'use strict';

    // var cursor =
    this.db
      .collection('item')
      .find(this.objFind(category))
      .count((err, res) => {
        assert.equal(null, err);
        if (err) {
          console.log(err);
        }

        callback(res);
      });
  };

  this.searchItems = function(query, page, itemsPerPage, callback) {
    'use strict';

    this.db
      .collection('item')
      .find({ $text: { $search: query } })
      .sort({ _id: 1 })
      .skip(itemsPerPage * page)
      .limit(itemsPerPage)
      .toArray((err, res) => {
        assert.equal(null, err);
        if (err) {
          console.log(err);
        }

        callback(res);
      });
  };

  this.getNumSearchItems = function(query, callback) {
    'use strict';

    this.db
      .collection('item')
      .find({ $text: { $search: query } })
      .count((err, res) => {
        assert.equal(null, err);
        if (err) {
          console.log(err);
        }

        callback(res);
      });
  };

  this.getItem = function(itemId, callback) {
    'use strict';

    this.db.collection('item').findOne({ _id: itemId }, (err, res) => {
      assert.equal(null, err);
      if (err) {
        console.log(err);
      }

      callback(res);
    });
  };

  this.getRelatedItems = function(callback) {
    'use strict';

    this.db
      .collection('item')
      .find({})
      .limit(4)
      .toArray(function(err, relatedItems) {
        assert.equal(null, err);
        callback(relatedItems);
      });
  };

  this.addReview = function(itemId, comment, name, stars, callback) {
    'use strict';

    var reviewDoc = {
      name: name,
      comment: comment,
      stars: stars,
      date: Date.now()
    };

    var query = {
      $push: {
        reviews: {
          $each: [reviewDoc]
        }
      }
    };

    this.db.collection('item').updateOne({ _id: itemId }, query, (err, res) => {
      assert.equal(null, err);
      if (err) {
        console.log(err);
      }
      callback(itemId);
    });
  };

  this.createDummyItem = function() {
    'use strict';

    var item = {
      _id: 1,
      title: 'Gray Hooded Sweatshirt',
      description: 'The top hooded sweatshirt we offer',
      slogan: 'Made of 100% cotton',
      stars: 0,
      category: 'Apparel',
      img_url: '/img/products/hoodie.jpg',
      price: 29.99,
      reviews: []
    };

    return item;
  };

  this.objFind = function(category) {
    var objFind = { category: { $ne: {} } };
    if (category !== 'All') {
      objFind = { category: category };
    }
    return objFind;
  };
}

module.exports.ItemDAO = ItemDAO;
