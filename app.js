/*
    Date: 2015-12-19
*/
var app = {
    self : {},
    db   : {},

    // Is API available?
    test : function () {
        console.log("app.test");
        $('#storeavailable').html(app.storageAvailable('indexedDB'));
    },
    // create/open database
    test2 : function () {
        console.log("app.test2");
        var result = indexedDB.open('indexedDB.test', 1);
        result.onsuccess = function (event) {
            app.db = event.target.result;
            $('#opendbResult').html('indexedDB.test created');
        };
        result.onerror = function (event) {
            $('#opendbResult').addClass('red');
            $('#opendbResult').html('DB error:' + event.target.errorCode);
        };        
    },
    // Delete database https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory/deleteDatabase
    // Doesn't register success if DB recently created
    test3 : function () {
        console.log("app.test3");
        var result = indexedDB.deleteDatabase('indexedDB.test');
        result.onsuccess = function (event) {
            app.db = {};
            $('#opendbResult').addClass('green');
            $('#opendbResult').html('DELETED indexedDB.test');
        };
        result.onerror = function (event) {
            $('#opendbResult').html('DB error:' + event.target.errorCode);
        };        
    },
    // create StoreObject
    test4 : function () {
        console.log("app.test4");
        var result = indexedDB.open('indexedDB.test', 1);

        result.onupgradeneeded = function(e) {
            var thisDB = e.target.result;
 
            if(!thisDB.objectStoreNames.contains("people")) {
                thisDB.createObjectStore("people", { autoIncrement: true });
                $('#opendbResult').html('indexedDB.test and objectStore created');
            }
            console.log('indexedDB.test onupgradeneeded.');
        };

        result.onsuccess = function (event) {
            app.db = event.target.result;
            //$('#opendbResult').html('indexedDB.test open, after first time.');
            console.log('indexedDB.test onsuccess.');
        };
        result.onerror = function (event) {
            $('#opendbResult').addClass('red');
            $('#opendbResult').html('DB error:' + event.target.errorCode);
        };        
    },
    // create data
    test5 : function () {
        console.log("app.test5");
        var person = $('#data').val();
        var transaction = app.db.transaction(["people"],"readwrite");
        var store       = transaction.objectStore("people");
        //Perform the add
        var request = store.add({name:person});
 
        request.onerror = function(e) {
            console.log("Error",e.target.error.name);
            //some type of error handler
        }
 
        request.onsuccess = function(e) {
            console.log("Woot! Did it", JSON.stringify(e));
            $('#opendbResult').html("Woot! Did it");
        }
        $('#data').val('');
    },
    // read data
    test6 : function () {
        console.log("app.test6");
        var transaction = app.db.transaction(["people"],"readonly");
        var store       = transaction.objectStore("people");
        //var store       = transaction.index("index");
        //Perform the add
        var request = store.get("1");
 
        request.onerror = function(e) {
            console.log("Error",e.target.error.name);
            //some type of error handler
        }
 
        request.onsuccess = function(e) {
            console.log(JSON.stringify(e));
            var result = e.target.result;
            console.log(JSON.stringify(request));
            console.log(JSON.stringify(result));
            console.log("Woot! Did it");
            $('#dataObject').val(result);
            //$('#opendbResult').html("Woot! Did it" + result);
        }
    },

    // See alternate method: http://code.tutsplus.com/tutorials/working-with-indexeddb--net-34673 under "Let's Get Started"
    storageAvailable: function (type) {
        return ("indexedDB" in window) ?  true : false;
    }

};