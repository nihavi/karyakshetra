var exQueue = new Array();

var newQueue = new Array();

var exPointer = 0;

Base = {

    addOp: function (states) {
        console.log(states)
        var pastState = states.pastState;
        var newState = states.newState;
        

    /*
    
    * pastState - previous state to be restored on undo
    
    * newState - next state to be rendered on viewer
    
    *
    
    * Will not return anything
    
    */

        exQueue[exPointer] = pastState;

        exPointer++;

        exQueue[exPointer] = null;

        newQueue.push(newState);

    },

    undo: function () {

    /*
    
    * if undo is possible,
    
    * This function will call module's 'performOp' function with pastState
    
    * Assuming module is an object with performOp function defined
    
    *
    
    * module.performOp should return pastState and newState in an object
    
    * with properties of same names
    
    *
    
    * Will not return anything
    
    */

        if (exPointer > 0) {

            var op = module.performOp(exQueue[exPointer - 1]);

            if (exQueue.length == exPointer + 1)

                exQueue[exPointer + 1] = null;

            exQueue[exPointer] = op.pastState;

            exPointer--;

            exQueue[exPointer] = null;

            newQueue.push(op.newState);

        }

    },

    redo: function () {

        /*
    
    * if redo is possible,
    
    * This function will call module's 'performOp' function with newState
    
    * Assuming module is an object with performOp function defined
    
    *
    
    * module.performOp should return pastState and newState in a object
    
    * with properties of same names
    
    *
    
    * Will not return anything
    
    */

        if (exQueue[exPointer + 1] != null) {

            var op = module.performOp(exQueue[exPointer + 1]);

            exQueue[exPointer] = op.pastState;

            exPointer++;

            exQueue[exPointer] = null;

            newQueue.push(op.newState);

        }

    }

}