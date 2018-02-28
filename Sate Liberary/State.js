(function (window) {
    "use strict";

    // This function will contain all code
    function myLibrary() {

        let _stateObject = {};

        //Error
        let error;

        //State Object
        var obj;

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
                        var value = Object.values(tempobj);
                        tempState[key] = value[0];
                        this.state = tempState;
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
                                // console.log(valueBeforeChange);
                                tempState[arguments[0]] = arguments[1];
                                var changedvalue = arguments[1];

                                this.valueAfter = changedvalue;
                                this.valueBefore = valueBeforeChange;
                                if (this.lockKey == false) {
                                    this.addEventListener(valueBeforeChange, changedvalue);
                                }
                            }
                            else {
                                if (propArray.length == 2) {
                                    valueBeforeChange = (tempState[propArray[0]])[propArray[1]];
                                    tempState[arguments[0]] = arguments[1];
                                    var changedvalue = arguments[1];

                                    this.valueAfter = changedvalue;
                                    this.valueBefore = valueBeforeChange;
                                    if (this.lockKey == false) {
                                        this.addEventListener(valueBeforeChange, changedvalue);
                                    }
                                }
                                else {

                                    valueBeforeChange = ((tempState[propArray[0]])[propArray[1]])[popArray[2]];
                                    tempState[arguments[0]] = arguments[1];
                                    var changedvalue = arguments[1];

                                    this.valueAfter = changedvalue;
                                    this.valueBefore = valueBeforeChange;
                                    if (this.lockKey == false) {
                                        this.addEventListener(valueBeforeChange, changedvalue);
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
                                        this.addEventListener(valueBeforeChange, changedvalue);
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
                                            this.addEventListener(valueBeforeChange, changedvalue);
                                        }
                                    }
                                    else {

                                        valueBeforeChange = ((tempState[propArray[0]])[propArray[1]])[popArray[2]];
                                        fieldValue[indexArr[1]] = arguments[1];
                                        var changedvalue = arguments[1];
                                        this.valueAfter = changedvalue;
                                        this.valueBefore = valueBeforeChange;
                                        if (this.lockKey == false) {
                                            this.addEventListener(valueBeforeChange, changedvalue);
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
                                        this.addEventListener(this.valueBefore, changedvalue);
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
                                            this.addEventListener(this.valueBefore, changedvalue);
                                        }
                                    }
                                    else {

                                        valueBeforeChange = ((tempState[propArray[0]])[propArray[1]])[popArray[2]];
                                        (fieldValue[indexArr[1]])[indexArr[2]] = arguments[1];
                                        var changedvalue = arguments[1];
                                        this.valueAfter = changedvalue;
                                        this.valueBefore = valueBeforeChange;
                                        if (this.lockKey == false) {
                                            this.addEventListener(this.valueBefore, changedvalue);
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
                        // console.log('Value before prop change: ', valuesBefore);
                        console.log('Value after prop change: ', valuesAfter);
                    }
                    else {
                        if (propArray.length == 2) {
                            var valuesBefore = valuesBefore;
                            var valuesAfter = (tempState[propArray[0]])[propArray[1]];
                            console.log('Value before prop change: ', valuesBefore);
                            console.log('Value after prop change: ', valuesAfter);
                        }
                        else {
                            var valuesBefore = valuesBefore;
                            var valuesAfter = ((tempState[propArray[0]])[propArray[1]])[propArray[2]];
                            console.log('Value before prop change: ', valuesBefore);
                            console.log('Value after prop change: ', valuesAfter);
                        }
                    }
                }
                return function () { obj.lockKey = undefined; };
            };
            // next
            // Just like the way on works, it just calls the handlers at the start of next event loop (next frame call) with all updates happened in the current frame in single go. 
            // The function definition and output schema remains same as on
            this.Next = function (eventStr, addEventListener) {
                var tempState = this.state;
                this.addEventListener = function (valuesBefore, valuesAfter) {
                    var propArray = eventStr.split('.')
                    if (propArray.length == 1) {
                        var valuesBefore = valuesBefore;
                        var valuesAfter = tempState[propArray[0]];
                        // console.log('Value before prop change: ', valuesBefore);
                        console.log('Value after prop change: ', valuesAfter);
                    }
                    else {
                        if (propArray.length == 2) {
                            var valuesBefore = valuesBefore;
                            var valuesAfter = (tempState[propArray[0]])[propArray[1]];
                            console.log('Value before prop change: ', valuesBefore);
                            console.log('Value after prop change: ', valuesAfter);

                        }
                        else {
                            var valuesBefore = valuesBefore;
                            var valuesAfter = ((tempState[propArray[0]])[propArray[1]])[propArray[2]];
                            console.log('Value before prop change: ', valuesBefore);
                            console.log('Value after prop change: ', valuesAfter);
                        }

                    }
                }

            };

            // Once lock() is called the state caches all the change that comes after this. 
            // When unlock() is called it applies all the changes to the state and the handler is called.
            this.lock = function () {
                this.lockKey = true;
            };
            this.unlock = function () {
                this.lockKey = false;
                this.addEventListener(this.valueBefore, this.valueAfter);

            };
        };

        //static create
        //Takes a simple JavaScript Object and make it observable. 
        //This returns the new object as a state instance which can be used to observe property change.
        _stateObject.create = function (observableObject) {
            if (typeof (observableObject) === 'object') {
                let obsObject = new createdObject(observableObject); //Constructor for creating new State 
                obj = obsObject;
                return obsObject;
            }
            else {
                error = "Invalid Argument Passed! Please pass Object."
                return error;
            }
        };

        return _stateObject;
    }

    // We need that our library is globally accesible, then we save in the window
    if (typeof (window.State) === 'undefined') {
        window.State = myLibrary();
    }

})(window); // We send the window variable withing our function
