/*
 * Title: Data File
 * Description: Files CRUD
 * Author: Saud
 * Date: 01-23-2021
 */

// Dependencies
const fs = require('fs');
const path = require('path');

// Module scaffolding
const lib = {};

// Configuration
lib.configure = {};

// Base directory - .data folder
lib.basedir = path.join(__dirname, '../.data/');

// Write data to file - sub folder directory in .data folder, file name, data, callback
lib.create = (dir, file, data, callback) => {
  // Open file
  fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data  to string
      const stringData = JSON.stringify(data);

      // create file
      fs.writeFile(fileDescriptor, stringData, (err2) => {
        if (!err2) {
          fs.close(fileDescriptor, (err3) => {
            if (err3) {
              callback(true);
            } else {
              callback(false);
            }
          });
        } else {
          callback('Error during file write');
        }
      });
    } else {
      callback('Could not create new file.');
    }
  });
};

// Read data from a file - sub folder directory in .data folder, file name, callback
lib.read = (dir, file, callback) => {
  // read file
  fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
    callback(err, data);
  });
};

// Update data in a file - sub folder directory in .data folder, file name, data, callback
lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Truncate the file
      fs.ftruncate(fileDescriptor, (err2) => {
        if (err2) {
          callback('Could not truncate the file');
        } else {
          // Convert data  to string
          const stringData = JSON.stringify(data);

          // create file
          fs.writeFile(fileDescriptor, stringData, (err3) => {
            if (err3) {
              callback(true);
            } else {
              // close file
              fs.close(fileDescriptor, (err4) => {
                if (err4) {
                  callback(true);
                } else {
                  callback(false);
                }
              });
            }
          });
        }
      });
    } else {
      callback('Could not update the file.');
    }
  });
};

// Delete data file - sub folder directory in .data folder, file name, callback
lib.delete = (dir, file, callback) => {
  // delete file
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (err) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

// get all data files (by name)
lib.list = (dir, callback) => {
  // read file
  fs.readdir(`${lib.basedir + dir}/`, (err, files) => {
    if (!err && files) {
      // Extract file names only
      const filenames = [];

      files.forEach((file) => {
        filenames.push(file.replace('.json', ''));
      });

      callback(false, filenames);
    } else {
      callback(true);
    }
  });
};

// Export lib
module.exports = lib;
