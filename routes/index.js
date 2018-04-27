
var fs = require('fs');
var express = require('express');
var router = express.Router();
var moment = require('moment');
var ical = require('node-ical')
  , months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var mydata =[];
var dataWeCareAbout = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  var numberOfEvents = 0;
  var theData = ical.parseFile('./calendars/merged.ics', function(err, data) {
    if (err) {console.log(err)};
    // console.log(data);



    for (var k in data){
      if (data.hasOwnProperty(k)){
        var ev = data[k]
        var startDate = new Date(ev.start);
        if (startDate.getFullYear() == 2017) {
          if (startDate.getMonth() > 5) {
            numberOfEvents++;
            dataWeCareAbout.push(moment(startDate).format("YYYY-MM-DD"));
            // console.log(moment(startDate).format("MMMM Do YYYY"));
          }
        } else if (startDate.getFullYear() == 2018) {
          numberOfEvents++;
          dataWeCareAbout.push(moment(startDate).format("YYYY-MM-DD"));
          // console.log(moment(startDate).format("MMMM Do YYYY"));
        }

      }
    }

    dataWeCareAbout.sort();

    function compressArray(original) {

      var compressed = [];
      // make a copy of the input array
      var copy = original.slice(0);

      // first loop goes over every element
      for (var i = 0; i < original.length; i++) {

        var myCount = 0;
        // loop over every element in the copy and see if it's the same
        for (var w = 0; w < copy.length; w++) {
          if (original[i] == copy[w]) {
            // increase amount of times duplicate is found
            myCount++;
            // sets item to undefined
            delete copy[w];
          }
        }

        if (myCount > 0) {
          var a = new Object();
          a.value = original[i];
          a.count = myCount;
          compressed.push(a);
        }
      }

      return compressed;
    };

    var output = compressArray(dataWeCareAbout);


    // console.log(dataWeCareAbout);
    // console.log(output);


    // fs.writeFile("./output/count.txt", JSON.stringify(output), function(err) {
    //     if(err) {
    //         return console.log(err);
    //     }
    //
    //     console.log("The file was saved!");
    // });


    // data.forEach((datum)=>{
    //   var jsStart = new Date(datum.start);
    //   console.log(moment(jsStart).format("MMMM Do YYYY"))
    //   console.log(datum.summary);
    // })

    res.render('index', {numOfEvents: numberOfEvents});
  });

module.exports = router;
