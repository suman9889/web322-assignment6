/*********************************************************************************
*  WEB322 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
*  assignment has been copied manually or electronically from any other source (including web sites) or 
*  distributed to other students.
* 
*  Name: Sumanjit Kaur
*  Student ID: 129642203
*  Date: 11/8/2023 
*
*  Cyclic Web App URL: https://lemon-buffalo-tux.cyclic.app/about
*
*  GitHub Repository URL: https://github.com/suman9889/web322-assignment6
*
********************************************************************************/ 


const Sequelize = require('sequelize');

var sequelize = new Sequelize('nfpofhad', 'nfpofhad', 'bVWs04SQbd4DUmuHCWK_2gJf0HTw-02z', {
    host: 'stampy.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});


var Category = sequelize.define('Category', {
    category: Sequelize.STRING
});


var Item = sequelize.define('Item', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN,
    price: Sequelize.DOUBLE
});

Item.belongsTo(Category, {foreignKey: 'category'});

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve('operation was a success');
        }).catch(() => {
            reject("unable to sync the database");
        });
    })
}


module.exports.getItemById = function(id){
    return new Promise((resolve,reject)=>{
        Item.findAll({
            where: {
                id: id
            }
        }).then((data) => {
            resolve(data[0]);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.getAllItems = function(){
    return new Promise((resolve, reject) => {
        Item.findAll().then(data=>{
            resolve(data);
        }).catch( err =>{
            reject("no results returned");
        });
    });
}

module.exports.getPublishedItems = function(){
    return new Promise((resolve, reject) => {
        Item.findAll({
            where: {
                published: true
            }
        }).then( data => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.getCategories = function(){
    return new Promise((resolve, reject) => {
        Category.findAll().then((data) => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.addItem = function(itemData){
    return new Promise((resolve, reject) => {
        itemData.published = itemData.published ? true : false;

        for (let props in itemData) {
            if(itemData[props] == ""){
                itemData[props] = null;
            }
        }

        itemData.postDate = new Date();

        Item.create(itemData).then(() => {
            resolve(Item);
        }).catch((err) => {
            reject("unable to create post.");
        });
    });
}

module.exports.getItemsByCategory = function(category){
    return new Promise((resolve, reject) => {
        Item.findAll({
            where: {
                category: category
            }
        }).then((data) => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.getItemsByMinDate = function(minDateStr) {
    const { gte } = Sequelize.Op;
    return new Promise((resolve, reject) => {
        Item.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                  }
            }
        }).then( data => {
            resolve(data);
        }).catch((err) => {
            reject("no results returned");
        });
    });
}

module.exports.getPublishedItemsByCategory = function(category){
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true,
                category: category
            }
        }).then((data) => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}


module.exports.addCategory = function (categoryData) {
    return new Promise((resolve, reject) => {

        for (var props in categoryData) {
            if (categoryData[props] === '')
            categoryData[props] = null;
        }

        Category.create(categoryData).then(() => {
            resolve();
        }).catch((e) => {
            reject("unable to create category");
        });

    });
}

module.exports.deleteCategoryById = function (id) {
    return new Promise((resolve, reject) => {
        Category.destroy({
            where: {
                id: id
            }
        }).then( data => {
            resolve(data);
        }).catch(() => {
            reject("unable to delete category");
        });
    });
}

module.exports.deletePostById = function (id) {
    return new Promise((resolve, reject) => {
        Item.destroy({
            where: {
                id: id
            }
        }).then( data => {
            resolve(data);
        }).catch(() => {
            reject("unable to delete item");
        });
    });
}

