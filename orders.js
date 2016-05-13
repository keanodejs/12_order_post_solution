// a lot of code is missing here and after!!


app.post(function(req, res) {

    MongoClient.connect(url, function(err, db) {


        var orderCollection = db.collection('orders');
        var userCollection = db.collection('users');
        var prodCollection = db.collection('products');

        // find user
        userCollection.findOne({
            '_id': ObjectID(req.body.user)
        }, function(err, result) {

            var ordersTotal = {};
            ordersTotal.user = result;
            ordersTotal.status = {
                'payment': {
                    'status': 1,
                    'description': 'created'
                },
                'flow': {
                    'status': 1,
                    'description': 'created'
                }
            };
            ordersTotal.shipping = { 'method': { 'code': 1, 'description': 'Post Danmark, packages' } };
            ordersTotal.products = [];
            
            // find products
            req.body.products.forEach(function(element, index, array) {

                prodCollection.findOne({
                    '_id': ObjectID(element)
                }, function(err, result) {

                    ordersTotal.products.push(result);

                    if (index === array.length - 1) {


                        // insert order in db
                        orderCollection.insert(ordersTotal, function(err, result) {

                            res.status(201);
                            res.location('/api/orders/' + result.insertedIds.toString());
                            res.json({
                                "message": "order added"
                            });

                            db.close();
                        });
                    };
                });
            });
        });
    });
});
