(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.bsbiatlas = {}, global.d3));
}(this, (function (exports, d3) { 'use strict';

  // the BRC Atlat Javascript library ().
  // CSV access functions designed to be used with data in the general format indicated below.
  //"hectad","to 1929","1930 - 1949","1950 - 1969","1970 - 1986","1987 - 1999","2000 - 2009","2010 - 2019","atlasstatus"
  //"SE84",1,0,0,0,0,0,0,

  function getCSV(identifier) {
    var file = './bsbi/demoMvp/atlas_taxa_2020_08_25/hectad-dateclass-status/' + identifier.replace(".", "_") + '.csv';
    console.log('file', file);
    return file;
  }

  function change_1987_1999_vs_2000_2019(identifier) {
    return change(identifier, ['1987 - 1999'], ['2000 - 2009', '2010 - 2019'], 'Change from 1987-1999 to 2000-2019');
  }
  function change_1930_1969_vs_2000_2019(identifier) {
    return change(identifier, ['1930 - 1949', '1950 - 1969'], ['2000 - 2009', '2010 - 2019'], 'Change from 1930-1969 to 2000-2019');
  }

  function change(identifier, early, late, legendTitle) {
    var shapes = ['square', 'triangle-up', 'triangle-down'];
    var colours = ['#FAD0C8', '#DD5A2F', '#525252'];
    return new Promise(function (resolve, reject) {
      d3.csv(getCSV(identifier), function (r) {
        var presentEarly = early.some(function (f) {
          return r[f] === '1';
        });
        var presentLate = late.some(function (f) {
          return r[f] === '1';
        });
        var i;

        if (presentEarly && presentLate) {
          i = 0; //present
        } else if (!presentEarly && presentLate) {
          i = 1; //gain
        } else if (presentEarly && !presentLate) {
          i = 2; //loss
        } else {
          i = 100; //not present in either period
        }

        if (r.hectad && i < 100) {
          return {
            gr: r.hectad,
            colour: colours[i],
            shape: shapes[i]
          };
        }
      }).then(function (data) {
        resolve({
          records: data,
          size: 1,
          precision: 10000,
          opacity: 0.9,
          legend: {
            title: legendTitle,
            lines: [{
              colour: '#DD5A2F',
              text: 'Gain',
              shape: 'triangle-up'
            }, {
              colour: '#FAD0C8',
              text: 'No change',
              shape: 'square'
            }, {
              colour: '#525252',
              text: 'Loss',
              shape: 'triangle-down'
            }]
          }
        });
      })["catch"](function (e) {
        reject(e);
      });
    });
  }

  function bsbiHectadDateClassesNewest(identifier) {
    return bsbiHectadDateClasses(identifier, true, 'Date classes (newest on top)');
  }
  function bsbiHectadDateClassesOldest(identifier) {
    return bsbiHectadDateClasses(identifier, false, 'Date classes (oldest on top)');
  }

  function bsbiHectadDateClasses(identifier, newestOnTop, legendTitle) {
    var colours = ["#FEF4E4", "#FEE1BB", "#FECFA9", "#FDAF8A", "#EB8070", "#CA4C4C", "#F34C4C"];
    var dateClassCols = ["to 1929", "1930 - 1949", "1950 - 1969", "1970 - 1986", "1987 - 1999", "2000 - 2009", "2010 - 2019"];

    if (newestOnTop) {
      dateClassCols = dateClassCols.reverse();
      colours = colours.reverse();
    }

    return new Promise(function (resolve, reject) {
      d3.csv(getCSV(identifier), function (r) {
        if (r.hectad) {
          var colour;

          for (var i = 0; i < dateClassCols.length; i++) {
            if (Number(r[dateClassCols[i]])) {
              colour = colours[i];
              break;
            }
          }

          if (!colour) {
            // No categories were specified for hectad
            // indicate this missing data with black dot
            colour = 'magenta';
          }

          return {
            gr: r.hectad,
            colour: colour
          };
        }
      }).then(function (data) {
        resolve({
          records: data,
          size: 1,
          shape: 'circle',
          precision: 10000,
          opacity: 0.9,
          legend: {
            title: legendTitle,
            lines: [{
              colour: '#FEF4E4',
              text: 'Before 1930'
            }, {
              colour: '#FEE1BB',
              text: '1930-1949'
            }, {
              colour: '#FECFA9',
              text: '1950-1969'
            }, {
              colour: '#FDAF8A',
              text: '1970-1986'
            }, {
              colour: '#EB8070',
              text: '1987-1999'
            }, {
              colour: '#CA4C4C',
              text: '2000-2009'
            }, {
              colour: '#F34C4C',
              text: '2010-2019'
            }]
          }
        });
      })["catch"](function (e) {
        reject(e);
      });
    });
  }

  function nativeSpeciesStatus(identifier) {
    //Native (n)
    //Alien (a)
    //Present (y) - I'm not sure if this should be labelled as 'present' or 'native or alien' (not intermediate) 
    //Reintroduced (w) - this will be very rarely used
    //There may also be Casual (c) or that might be treated as Present or Native - I'll check with Kevin
    var colours = {
      missing: '#F2CC35',
      //no value yet
      n: 'blue',
      //native
      a: 'red',
      //non-native (alien),
      y: 'grey',
      w: 'blue',
      bullseye: 'red'
    };
    return new Promise(function (resolve, reject) {
      d3.csv(getCSV(identifier), function (r) {
        if (r.hectad) {
          var atlasstatus = r.atlasstatus ? r.atlasstatus : 'missing'; //const atlasstatus = r.atlasstatus ? r.atlasstatus : 'w'

          return {
            gr: r.hectad,
            shape: atlasstatus === "w" ? 'bullseye' : 'circle',
            colour: colours[atlasstatus],
            colour2: colours.bullseye
          };
        }
      }).then(function (data) {
        // For any that are bullseye, create new blahs
        resolve({
          records: data,
          precision: 10000,
          opacity: 0.8,
          size: 1,
          legend: {
            title: 'Native status',
            lines: [{
              colour: 'blue',
              text: 'Native',
              shape: 'circle'
            }, {
              colour: 'red',
              text: 'Alien',
              shape: 'circle'
            }, {
              colour: 'grey',
              text: 'Present',
              shape: 'circle'
            }, {
              colour: 'blue',
              colour2: 'red',
              text: 'Reintroduced',
              shape: 'bullseye'
            }, {
              colour: '#F2CC35',
              text: '(data missing)',
              shape: 'circle'
            }]
          }
        });
      })["catch"](function (e) {
        reject(e);
      });
    });
  }
  function bsbiHectadDateTetFreq(identifier) {
    var fields = ["to 1929", "1930 - 1949", "1950 - 1969", "1970 - 1986", "1987 - 1999", "2000 - 2009", "2010 - 2019"];
    var colour = d3.scaleLinear().domain([1, 13, 25]).range(['#edf8b1', '#7fcdbb', '#2c7fb8']);
    return new Promise(function (resolve, reject) {
      d3.csv(getCSV(identifier), function (r) {
        var fake = fields.reduce(function (t, f) {
          return t + Number(r[f]);
        }, 1);
        fake = fake ? fake / 7 * 25 : 0;

        if (r.hectad) {
          return {
            gr: r.hectad,
            colour: colour(fake)
          };
        }
      }).then(function (data) {
        resolve({
          records: data,
          size: 1,
          shape: 'circle',
          precision: 10000,
          opacity: 0.9,
          legend: {
            title: 'Tetrad frequency',
            lines: [{
              colour: '#edf8b1',
              text: '1 tetrad'
            }, {
              colour: '#7fcdbb',
              text: '13 tetrads'
            }, {
              colour: '#2c7fb8',
              text: '25 tetrads'
            }]
          }
        });
      })["catch"](function (e) {
        reject(e);
      });
    });
  }

  var name = "bsbiatlas";
  var version = "0.0.5";
  var description = "Javascript data access library for BSBI Atlas mapping project.";
  var type = "module";
  var browser = "dist/bsbiatlas.umd.js";
  var browsermin = "dist/bsbiatlas.min.umd.js";
  var scripts = {
  	lint: "npx eslint src",
  	test: "jest",
  	build: "rollup --config"
  };
  var author = "CEH Biological Records Centre";
  var license = "GPL-3.0-only";
  var files = [
  	"dist"
  ];
  var repository = {
  	type: "git",
  	url: "https://github.com/BiologicalRecordsCentre/BSBI-Atlas.git"
  };
  var dependencies = {
  	d3: "^5.16.0"
  };
  var devDependencies = {
  	"@babel/core": "^7.10.4",
  	"@babel/preset-env": "^7.10.4",
  	"@rollup/plugin-babel": "^5.0.4",
  	"@rollup/plugin-commonjs": "^13.0.0",
  	"@rollup/plugin-json": "^4.1.0",
  	"@rollup/plugin-node-resolve": "^8.1.0",
  	eslint: "^7.4.0",
  	"eslint-plugin-jest": "^23.17.1",
  	jest: "^26.1.0",
  	rollup: "^2.23.0",
  	"rollup-plugin-css-only": "^2.1.0",
  	"rollup-plugin-eslint": "^7.0.0",
  	"rollup-plugin-terser": "^6.1.0"
  };
  var pkg = {
  	name: name,
  	version: version,
  	description: description,
  	type: type,
  	browser: browser,
  	browsermin: browsermin,
  	scripts: scripts,
  	author: author,
  	license: license,
  	files: files,
  	repository: repository,
  	dependencies: dependencies,
  	devDependencies: devDependencies
  };

  // to assist with trouble shooting.

  console.log("Running ".concat(pkg.name, " version ").concat(pkg.version));

  exports.bsbiHectadDateClassesNewest = bsbiHectadDateClassesNewest;
  exports.bsbiHectadDateClassesOldest = bsbiHectadDateClassesOldest;
  exports.bsbiHectadDateTetFreq = bsbiHectadDateTetFreq;
  exports.change_1930_1969_vs_2000_2019 = change_1930_1969_vs_2000_2019;
  exports.change_1987_1999_vs_2000_2019 = change_1987_1999_vs_2000_2019;
  exports.nativeSpeciesStatus = nativeSpeciesStatus;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
