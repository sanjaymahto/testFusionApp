var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser');

  //parse application/json and look for raw text                                        
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

/*******************************************Liberary For State Creation******************************************************************/

//Error
var error;

//State Object
var obj;

var valueBeforeChangestr;

//Global Function for Created Object
function createdObject(observableObject) {
  this.state = observableObject;  //Assigned Observable Object to state
  this.lockKey = undefined;       // declaring variable for lock()
  this.valueAfter = undefined;    //Declaring variable to initialize event after unlock
  this.valueBefore = undefined;   //Declaring variable to initialize event after unlock
  this.beforeEventStr = null;          //Declaring the variable for string the string for on Function to get the result before prop change 
  //getState
  //Since State.create does not return the JavaScript object back as it deserialise the JavaScript object to native data-structure, getState function comes to the rescue to get the JavaScript object back. 
  //The function returns the plain old JavaScript object.
  this.getState = function () {
    return this.state;   //returning state Object
  };
  //create
  //Appends property in the existing state (mutates the original state). The is called using two parameters. 
  //The first parameter is where to append the state and the second being what property to append.
  this.create = function () {
    // console.log("Entered into Create Function");
    if (arguments.length == 0) {
      error = "No Argument passed";
      return error;      //Returning error if there is no Argument Passed
    }
    if (arguments.length == 1) {
      if (typeof (arguments[0]) === 'object') {
        var tempobj = arguments[0];
        var tempState = this.state;
        // console.log(tempState);
        var key = Object.keys(tempobj);
        tempState[key] = (arguments[0])[key];
        this.state = tempState;
        // console.log(this.state);
      }
      else {
        error = "please pass object as an Argument.";
        return error;  // Returning error if object is not Passed
      }
    }
    else {
      if (typeof (arguments[1]) === 'object') {
        //Code to extract the key from string
        var str = arguments[0];
        var index = str.indexOf('.');
        var field = str.slice(0, index);
        // console.log(field);
        var tempobj = arguments[1];
        var tempState = this.state;
        var key = str.slice((index + 1), str.length);
        (tempState[field])[key] = tempobj;
        // console.log(tempState);
        this.state = tempState;
      }
      else {
        error = "please pass object as an Argument.";
        return error;
      }
    }
  };
  // prop
  // This acts as getter and setter.
  // If the function is called by passing only one argument, it retrieve the value associated with the property
  this.prop = function () {
    if (arguments.length == 0) {
      error = "Please pass an Argument"
      return error;
    }
    if (arguments.length == 1) {
      var tempState = this.state;
      var tempstr = arguments[0];
      var index = tempstr.indexOf('.');
      var indexArr = tempstr.split('.');
      // console.log(index);
      if (index === -1 || index === '' || index === undefined || index === null) {
        return (tempState[arguments[0]]);
      }
      else {
        if (indexArr.length == 2) {
          var field = tempstr.slice(0, index);
          // console.log(field);
          var fieldValue = tempState[field];
          // console.log(fieldValue);
          var strvalue = tempstr.slice((index + 1), tempstr.length)
          return (fieldValue[strvalue]);
        }
        else {
          var field = tempstr.slice(0, index);
          //  console.log(field);
          var fieldValue = tempState[field];
          //  console.log(fieldValue);
          return (fieldValue[indexArr[1]])[indexArr[2]];
        }
      }
    }
    else {
      let tempState = this.state;
      let tempstr = arguments[0];
      var index = tempstr.indexOf('.');
      var indexArr = tempstr.split('.');
      // console.log(index);
      if (index === -1 || index === '' || index === undefined || index === null) {
        // console.log("Entered into single field");
        var valueBeforeChange = tempState[arguments[0]];
        if (this.beforeEventStr != null) {
          var propArray = this.beforeEventStr.split('.')
          // console.log("PropArray:", propArray);
          if (propArray.length == 1) {
            valueBeforeChange = tempState[propArray[0]];
            valueBeforeChangestr = valueBeforeChange;
            // console.log(valueBeforeChange);
            tempState[arguments[0]] = arguments[1];
            var changedvalue = arguments[1];

            this.valueAfter = changedvalue;
            this.valueBefore = valueBeforeChange;
            if (this.lockKey == false) {
              return this.addEventListener(this.valueBefore, changedvalue);
            }
          }
          else {
            if (propArray.length == 2) {
              valueBeforeChange = (tempState[propArray[0]])[propArray[1]];
              valueBeforeChangestr = valueBeforeChange;
              tempState[arguments[0]] = arguments[1];
              var changedvalue = arguments[1];

              this.valueAfter = changedvalue;
              this.valueBefore = valueBeforeChange;
              if (this.lockKey == false) {
                return this.addEventListener(this.valueBefore, changedvalue);
              }
            }
            else {

              valueBeforeChange = ((tempState[propArray[0]])[propArray[1]])[popArray[2]];
              valueBeforeChangestr = valueBeforeChange;
              tempState[arguments[0]] = arguments[1];
              var changedvalue = arguments[1];

              this.valueAfter = changedvalue;
              this.valueBefore = valueBeforeChange;
              if (this.lockKey == false) {
                return this.addEventListener(this.valueBefore, changedvalue);
              }
            }
          }
        }
        else {
          tempState[arguments[0]] = arguments[1];

        }
      }
      else {
        if (indexArr.length == 2) {
          // console.log("Entered into Nested Array");
          var valueBeforeChange;
          var field = tempstr.slice(0, index);
          //  console.log(field);
          var fieldValue = tempState[field];
          //  console.log(fieldValue);
          var strvalue = fieldValue[indexArr[1]];
          if (this.beforeEventStr != null) {
            var propArray = this.beforeEventStr.split('.')
            // console.log("PropArray:", propArray);
            if (propArray.length == 1) {
              valueBeforeChange = tempState[propArray[0]];
              //  console.log(valueBeforeChange);
              fieldValue[indexArr[1]] = arguments[1];
              var changedvalue = arguments[1];
              this.valueAfter = changedvalue;
              this.valueBefore = valueBeforeChange;
              if (this.lockKey == false) {
                return this.addEventListener(this.valueBefore, changedvalue);
              }
            }
            else {
              if (propArray.length == 2) {
                valueBeforeChange = (tempState[propArray[0]])[propArray[1]];
                fieldValue[indexArr[1]] = arguments[1];
                var changedvalue = arguments[1];
                this.valueAfter = changedvalue;
                this.valueBefore = valueBeforeChange;
                if (this.lockKey == false) {
                  return this.addEventListener(this.valueBefore, changedvalue);
                }
              }
              else {

                valueBeforeChange = ((tempState[propArray[0]])[propArray[1]])[popArray[2]];
                fieldValue[indexArr[1]] = arguments[1];
                var changedvalue = arguments[1];
                this.valueAfter = changedvalue;
                this.valueBefore = valueBeforeChange;
                if (this.lockKey == false) {
                  return this.addEventListener(this.valueBefore, changedvalue);
                }
              }
            }
          }
          else {
            fieldValue[indexArr[1]] = arguments[1];

          }
        }
        else {
          console.log("Enterd in to array with three fields");
          var field = tempstr.slice(0, index);
          //   console.log(field);
          var fieldValue = tempState[field];
          //   console.log(fieldValue);
          var strvalue = (fieldValue[indexArr[1]])[indexArr[2]];
          //   console.log(strvalue);
          if (this.beforeEventStr != null) {
            var propArray = this.beforeEventStr.split('.')
            // console.log("PropArray:", propArray);
            if (propArray.length == 1) {
              valueBeforeChange = tempState[propArray[0]];
              // console.log(valueBeforeChange);
              (fieldValue[indexArr[1]])[indexArr[2]] = arguments[1];
              var changedvalue = arguments[1];
              this.valueAfter = changedvalue;
              this.valueBefore = valueBeforeChange;
              if (this.lockKey == false) {
                return this.addEventListener(this.valueBefore, changedvalue);
              }
            }
            else {
              if (propArray.length == 2) {
                valueBeforeChange = (tempState[propArray[0]])[propArray[1]];
                (fieldValue[indexArr[1]])[indexArr[2]] = arguments[1];
                var changedvalue = arguments[1];
                this.valueAfter = changedvalue;
                this.valueBefore = valueBeforeChange;
                if (this.lockKey == false) {
                  return this.addEventListener(this.valueBefore, changedvalue);
                }
              }
              else {

                valueBeforeChange = ((tempState[propArray[0]])[propArray[1]])[popArray[2]];
                (fieldValue[indexArr[1]])[indexArr[2]] = arguments[1];
                var changedvalue = arguments[1];
                this.valueAfter = changedvalue;
                this.valueBefore = valueBeforeChange;
                if (this.lockKey == false) {
                  return this.addEventListener(this.valueBefore, changedvalue);
                }
              }
            }
          }
          else {
            (fieldValue[indexArr[1]])[indexArr[2]] = arguments[1];

          }
        }
      }
    }
  };
  // on
  // This function takes a single property and handler which is called when any of the properties are changed. 
  // When a single property is changed the handler is called with two parameter, what was the old value of the state property and what is the new value.
  this.on = function (eventStr, eventFunction) {
    this.beforeEventStr = eventStr;
    var tempState = this.state;
    this.lockKey = false;
    this.addEventListener = function (valuesBefore, valuesAfter) {
      var propArray = eventStr.split('.')
      if (propArray.length == 1) {
        var valuesBefore = valuesBefore;
        var valuesAfter = tempState[propArray[0]];
        console.log('Value before prop change: ', valuesBefore);
        console.log('Value after prop change: ', valuesAfter);
        return ('Value before prop change for ' + eventStr + ' is: ' + JSON.stringify(valuesBefore) + "|" + 'Value after prop change for ' + eventStr + ' is: ' + JSON.stringify(valuesAfter))
      }
      else {
        if (propArray.length == 2) {
          var valuesBefore = valuesBefore;
          var valuesAfter = (tempState[propArray[0]])[propArray[1]];
          console.log('Value before prop change: ', valuesBefore);
          console.log('Value after prop change: ', valuesAfter);
          return ('Value before prop change for ' + eventStr + ' is: ' + valuesBefore + "|" + 'Value after prop change for ' + eventStr + ' is: ' + valuesAfter)

        }
        else {
          var valuesBefore = valuesBefore;
          var valuesAfter = ((tempState[propArray[0]])[propArray[1]])[propArray[2]];
          console.log('Value before prop change: ', valuesBefore);
          console.log('Value after prop change: ', valuesAfter);
          return ('Value before prop change for ' + eventStr + ' is: ' + valuesBefore + "|" + 'Value after prop change for ' + eventStr + ' is: ' + valuesAfter)

        }
      }
    }
    return function () { obj.lockKey = undefined; };
  };
  // next
  // Just like the way on works, it just calls the handlers at the start of next event loop (next frame call) with all updates happened in the current frame in single go. 
  // The function definition and output schema remains same as on
  this.Next = function (eventStr, addEventListener) {
    this.beforeEventStr = eventStr;
    var tempState = this.state;
    this.lockKey = true;
    this.addEventListener = function (valuesBefore, valuesAfter) {
      var propArray = eventStr.split('.')
      if (propArray.length == 1) {
        var valuesBefore = valuesBefore;
        var valuesAfter = tempState[propArray[0]];
        console.log('Value before prop change: ', valuesBefore);
        console.log('Value after prop change: ', valuesAfter);
        return ('Value before prop change for ' + eventStr + ' is: ' + JSON.stringify(valuesBefore) + "|" + 'Value after prop change for ' + eventStr + 'is: ' + JSON.stringify(valuesAfter))
      }
      else {
        if (propArray.length == 2) {
          var valuesBefore = valuesBefore;
          var valuesAfter = (tempState[propArray[0]])[propArray[1]];
          console.log('Value before prop change: ', valuesBefore);
          console.log('Value after prop change: ', valuesAfter);
          return ('Value before prop change for ' + eventStr + ' is: ' + valuesBefore + "|" + 'Value after prop change for ' + eventStr + 'is: ' + valuesAfter)

        }
        else {
          var valuesBefore = valuesBefore;
          var valuesAfter = ((tempState[propArray[0]])[propArray[1]])[propArray[2]];
          console.log('Value before prop change: ', valuesBefore);
          console.log('Value after prop change: ', valuesAfter);
          return ('Value before prop change for ' + eventStr + ' is: ' + valuesBefore + "|" + 'Value after prop change for ' + eventStr + 'is: ' + valuesAfter)
        }

      }
    }
    return true;
  };

  // Once lock() is called the state caches all the change that comes after this. 
  // When unlock() is called it applies all the changes to the state and the handler is called.
  this.lock = function () {
    this.lockKey = true;

    return true;
  };


  this.unlock = function () {
    this.lockKey = false;
    return this.addEventListener(this.valueBefore, this.valueAfter);

  };
};

//Function to Create Object
function create(observableObject) {
  if (typeof (observableObject) === 'object') {
    let obsObject = new createdObject(observableObject); //Constructor for creating new State 
    obj = obsObject;
    return obj;
  }
  else {
    error = "Invalid Argument Passed! Please pass Object."
    return error;
  }
};

/******************************************End of Liberary for State Creation****************************************************************** */

//Defining Variable for State Object
var myState = undefined;

//API for Index Page
app.get('/', function (req, res) {
  res.json({ title: " Welcome to State Liberary API'S ", result: '', response: 'No Output' });
});

//API to create State
app.post('/api/v1/state/create', function (req, res) {
  // console.log(req.body.stateObject);

  // console.log(JSON.parse(req.body.stateObject));

  if (req.body == '' || req.body.stateObject == "" || req.body.stateObject == null) {
    res.json({ title: " Welcome to State Liberary API'S ", result: "State not Created! Please Pass Argument.", response: "No Output" })
  }
  else {
    let stateObj = req.body.stateObject;
    if (typeof(stateObj) === 'object') {
      myState = create(stateObj);
      res.json({ title: " Welcome to State Liberary API'S  ", result: "State Created!", response: myState })
    }
    else {
      res.json({ title: " Welcome to State Liberary API'S ", result: "State not Created! Please Pass object Argument.", response: "No Output " })
    }
  }
});

//API to get the State 
app.get('/api/v1/state/get', function (req, res) {
  var response = myState.getState();
  res.json({ title: " Welcome to State Liberary API'S ", result: "State", response: response });
})

//API to Add Property
app.post('/api/v1/create/property', function (req, res) {
  // console.log("body:", req.body);
  // console.log("JSON object", req.body.createPropObj);

  if (req.body == '' || req.body.createPropObj == "" || req.body.createPropObj == null) {
    res.json({ title: " Welcome to State Liberary API'S ", result: "State not Created! Please Pass Argument.", response: "No Output " })
  }
  else {
    var stateObj = req.body.createPropObj;
    if (typeof (stateObj) === 'object') {
      // console.log("My State: ", myState);
      myState.create(stateObj);
      res.json({ title: " Welcome to State Liberary API'S  ", result: "Property Added!", response: 'No Output ' })
    }
    else {
      res.json({ title: " Welcome to State Liberary API'S ", result: "State not Created! Please Pass object Argument.", response: "No Output " })
    }
  }
});

//API to add property using two parameters
app.post('/api/v1/create/property1', function (req, res) {
  // console.log("body:", req.body);
  // console.log("JSON object", req.body.createPropObj);

  if (req.body == '' || req.body.createPropObj == "" || req.body.createPropObjProperty == null) {
    res.json({ title: " Welcome to State Liberary API'S ", result: "State not Created! Please Pass Argument.", response: "No Output " })
  }
  else {
    var stateObj = req.body.createPropObj;
    if (typeof (stateObj) === 'object') {
      // console.log("My State: ", myState);
      myState.create(req.body.createPropObjProperty, stateObj);
      res.json({ title: " Welcome to State Liberary API'S  ", result: "Property Added!", response: 'No Output ' })
    }
    else {
      res.json({ title: " Welcome to State Liberary API'S ", result: "State not Created! Please Pass object Argument.", response: "No Output " })
    }
  }
});

//API to get Property
app.post('/api/v1/get/property', function (req, res) {
  // console.log("body:", req.body);
  // console.log("JSON object", req.body.getProperty);

  if (req.body == '' || req.body.getProperty == "" || req.body.getProperty == null) {
    res.json( { title: " Welcome to State Liberaryy API'S ", result: "State not Created! Please Pass Argument.", response: "No Output " })
  }
  else {
    // console.log("My State: ", myState);
    var response = myState.prop(req.body.getProperty);
    // console.log(response);
    if (response == undefined) {
      res.json({ title: " Welcome to State Liberary API'S  ", result: "Property not Fetched!", response: 'No Output ' })

    }
    else {
      res.json({ title: " Welcome to State Liberary API'S  ", result: "Property Fetched!", response: response })
    }
  }
});

//API to set Property
app.post('/api/v1/set/property', function (req, res) {
  // console.log("body:", req.body.property);
  // console.log("body:", req.body.propertyValue);
  if (req.body == '' || req.body.property == '' || req.body.propertyValue == '') {
    res.json({ title: " Welcome to State Liberary API'S ", result: "State not Created! Please Pass Argument.", response: "No Output " })
  }
  else {
    var response = myState.prop(req.body.property, JSON.parse(req.body.propertyValue));
    // console.log(response);
    if (myState.beforeEventStr == null) {
      res.json({ title: " Welcome to State Liberary API'S  ", result: "Property Value Changed!", response: 'No Output ' })
    }
    else {
      if (response != undefined) {
        res.json({ title: " Welcome to State Liberary API'S  ", result: "Property Value Changed!", response: response })
      }
      else {
        res.json({ title: " Welcome to State Liberary API'S  ", result: "Property Not Fetched!", response: 'No Output' })

      }
    }
  }
});

//API to add Event Listener 
app.post('/api/v1/set/event/on', function (req, res) {
  console.log("body:", req.body);
  if (req.body == '' || req.body.property == '' || req.body.function == '') {
    res.render('index', { title: " Welcome to State Liberary API'S ", result: "on function Didn't Turned on.", response: "No Output " })
  }
  else {
    var response = myState.on(req.body.property, req.body.function);
    if (typeof (response) == 'function') {
      res.render('index', { title: " Welcome to State Liberary API'S  ", result: "On Funtion Turned ON!", response: 'No Output ' })
    }
    else {
      res.render('index', { title: " Welcome to State Liberary API'S  ", result: "On Function Didn't Turned ON!", response: 'No Output' })
    }
  }
});

//API to add Next To an Event
app.post('/api/v1/set/event/next', function (req, res) {

  console.log("body:", req.body);

  if (req.body == '' || req.body.property == '' || req.body.function == '') {
    res.render('index', { title: " Welcome to State Liberary API'S ", result: "Next function Didn't Turned on.", response: "No Output " })
  }
  else {
    var response = myState.Next(req.body.property, req.body.function);
    if (response == true) {
      res.render('index', { title: " Welcome to State Liberary API'S  ", result: "Next Funtion Turned ON!", response:response })
    }
    else {
      res.render('index', { title: " Welcome to State Liberary API'S  ", result: "Next Function Didn't Turned ON!", response: 'No Output' })
    }
  }

})

//API to lock an Event
app.get('/api/v1/set/event/on/lock', function (req, res) {
  var response = myState.lock();
  if (response == true) {
    res.render('index', { title: " Welcome to State Liberary API'S  ", result: "Lock Funtion Turned ON!", response: 'No Output ' })
  }
  else {
    res.render('index', { title: " Welcome to State Liberary API'S  ", result: "Lock Function Didn't Turned ON!", response: 'No Output' })
  }
})

//API to Unlock an Event
app.get('/api/v1/set/event/on/unlock', function (req, res) {
  var response = myState.unlock();
  if (response != undefined) {
    res.render('index', { title: " Welcome to State Liberary API'S  ", result: "Property Value Changed!", response: response })
  }
  else {
    res.render('index', { title: " Welcome to State Liberary API'S  ", result: "Property Not Fetched!", response: 'No Output' })

  }
})

//Application level MiddleWare to Show 404 and 500 Error
app.use(function (err, req, res, next) {
  console.log(err.status);
  res.status(err.status || 500);
  if (err.status == 404) {
    res.render('404', {
      message: err.message,
      error: err
    });
  } else {
    res.render('error', {
      message: err.message,
      error: err
    });
  }
});

//Listening Application on Port: 3000
app.listen(3000, function () {
  console.log('App listening on port 3000!');
});

module.exports = app; // for testing