const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });

  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('error getNextUniqueId');
    } else {
      // console.log('counter.counterFile: ', counter.counterFile);
      var filePath = path.join(exports.dataDir, id + '.txt');
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          console.log('error');
        } else {
          callback(null, {id, text});
        }
      });
    }

  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
  fs.readdir(exports.dataDir, (err, files) => {
    var temp = [];
    files.map(file => {
      var id = file.substring(0, 5);
      var tempObj = {'id': id, 'text': id};
      temp.push(tempObj);
    });
    callback(null, temp);
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  fs.readFile(path.join(exports.dataDir, id + '.txt'), (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {

      callback(null, { id: id, text: text.toString() });
    }
  });

};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

  var filePath = path.join(exports.dataDir, id + '.txt');

  if (fs.existsSync(filePath)) {
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        callback(null, {id, text});
      }

    });
  } else {
    callback(new Error(`No item with id: ${id}`));
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
