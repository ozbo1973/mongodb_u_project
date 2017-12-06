// lab 6 their solution
this.db
  .collection('cart')
  .find({ userId: userId, 'items._id': itemId }, { 'items.$': 1 })
  .limit(1)
  .next(function(err, item) {
    assert.equal(null, err);
    console.log(err);
    if (item != null) {
      item = item.items[0];
    }
    console.log(item);
    callback(item);
  });

// lab 6 mysolution
var cursor = this.db
  .collection('cart')
  .aggregate([
    { $match: { userId: '558098a65133816958968d88' } },
    { $unwind: '$items' },
    { $match: { 'items._id': 2 } },
    { $project: { item: '$items', _id: 0 } }
  ])
  .toArray();

cursor.then(res => {
  //console.log(res[0].item);
  callback(res[0].item);
});

db.cart.findOne(
  { $and: [{ userId: '558098a65133816958968d88' }, { 'items._id': 2 }] },
  { items: '$items' }
);

db.cart.aggregate([
  { $match: { userId: '558098a65133816958968d88' } },
  { $unwind: '$items' },
  { $match: { 'items._id': 2 } },
  { $project: { item: '$items' } }
]);

db.cart.aggregate([
  { $match: { userId: '558098a65133816958968d88' } },
  { $unwind: 'items' },
  { $project: { userId: '$userId', _id: 0 } }
]);

//get categories lab1A
categories.push(
  db.item.aggregate([
    {
      $group: {
        _id: '$category',
        num: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 1,
        num: 1
      }
    },
    { $sort: { _id: 1 } }
  ])
);
var totalCategory = categories.reduce(function(prevVal, elem) {
  return prevVal + elem.num;
}, 0);

//lab 4
db.item.updateOne(
  { _id: 12 },
  {
    $push: {
      reviews: {
        $each: [
          {
            name: 'Brady',
            comment: 'This is a test',
            stars: 3,
            date: ISODate('2017-03-12T09:00:00z')
          }
        ]
      }
    }
  }
);
