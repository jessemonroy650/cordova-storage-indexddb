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
            console.log("name:" + app.db.name);
            console.log("version:" + app.db.version);
            console.log("objectStoreNames:" +  JSON.stringify(app.db.objectStoreNames));
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
            console.log("name:" + thisDB.name);
            console.log("keyPath:" + thisDB.keyPath);
            console.log("indexNames:" + thisDB.indexNames);
            console.log("autoIncrement:" + thisDB.autoIncrement);
        };

        result.onsuccess = function (event) {
            app.db = event.target.result;
            //$('#opendbResult').html('indexedDB.test open, after first time.');
            console.log('indexedDB.test onsuccess.');
            console.log("name:" + app.db.name);
            console.log("version:" + app.db.version);
            console.log("objectStoreNames:" +  JSON.stringify(app.db.objectStoreNames));
        };
        result.onerror = function (event) {
            $('#opendbResult').addClass('red');
            $('#opendbResult').html('DB error:' + event.target.errorCode);
        };        
    },
    // create data
    test5 : function () {
        console.log("app.test5");
        //if ( app.db !== {} ) { alert("app.db does not exist."); return; }
        var the_name = $('#name').val();
        var the_email = $('#email').val();
        var transaction = app.db.transaction(["people"],"readwrite");
        var store       = transaction.objectStore("people");
        console.log("name:" + store.name);
        console.log("keyPath:" + store.keyPath);
        console.log("indexNames:" + JSON.stringify(store.indexNames));
        console.log("autoIncrement:" + store.autoIncrement);

        //Perform the add
        var request = store.add({name:the_name,email:the_email});
 
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

        //Perform the add
        var request = store.get(2);
 
        request.onerror = function(e) {
            console.log("Error",e.target.error.name);
            //some type of error handler
        }
 
        request.onsuccess = function(e) {
            var result = e.target.result;
            console.log("Woot! Did it:" + JSON.stringify(result));
            $('#dataObject').html("test" + JSON.stringify(result));
        }
    },

    // See alternate method: http://code.tutsplus.com/tutorials/working-with-indexeddb--net-34673 under "Let's Get Started"
    storageAvailable: function (type) {
        return ("indexedDB" in window) ?  true : false;
    }

};