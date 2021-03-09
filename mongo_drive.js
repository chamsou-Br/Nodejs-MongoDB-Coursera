const MongoClient = require('mongodb').MongoClient;

const Assert = require('assert');
const { assert } = require('console');

MongoClient.connect('mongodb://localhost:27017/',{ useUnifiedTopology: true , useNewUrlParser: true }, (err , client ) => {

    Assert.equal(err , null);
    const db = client.db('Mongocoursera');
    const DishesCollection = db.collection('Dishes');
    DishesCollection.insertOne({"name" : 'pizza' , "Description" : 'Moste dishe populaire' }).then(res => console.log('inser ' + res.result.ok));
    DishesCollection.insertOne({"name" : 'hdqgr' , "Description" : 'wdkfkjgbtrhliejlm' });
    DishesCollection.findOne({"name" : 'couskous' , "Description" : 'this dishes specially for the arabe' }).then(res => console.log(res))
    DishesCollection.find({}).toArray().then(res => console.log(res)).catch(Error);
    DishesCollection.deleteMany({"name" : 'hdqgr' , "Description" : 'wdkfkjgbtrhliejlm' }, (err , res) => {
            Assert.equal(err , null);
            console.log('delete ' + res.result.n)
    })
    DishesCollection.updateOne({name : 'charba'},{$set:{Description : 'qdjdhfgiu'}})
    DishesCollection.insertOne({name : 'jfg',Age : 18 ,Description : '874512187'}).then(res=> {console.log('inser suceed')}).catch(Error)


  /*  
     DishesCollection.drop((err,delOk) => {
        if (err) console.log('erreur');
     else if (delOk) console.log('collection remove');
     
     }) 
    db.collection('Dishes').drop((err,delOk) => {
        if (err) console.log('erreur');
     else if (delOk) console.log('collection remove');
     
     })
     */
})
