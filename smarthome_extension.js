// SmartHome Extension to demonstrate some simple REST functionality to 
// control a SmartHome based on Eclipse SmartHome, openHAB or QIVICON.
// Works with ScratchX (http://scratchx.org/) using the URL
// http://scratchx.org/?url=http://wolter.github.io/ScratchX/smarthome_extension.js#scratch.
// 2015 Sascha Wolter (http://wolter.biz | @saschawolter)

(function (ext) {
    
    var defaultEndpoint = "http://127.0.0.1:8080/rest/";
    var endpoint = "";
    var eventSource = null;
    var eventReceived = null;
    var eventReceivedTimer = null;
    var eventSourceListener = function (eventPayload) {
        // responds with something like {"topic":"smarthome/items/DemoSwitch/statechanged","payload":"{\"type\":\"OnOffType\",\"value\":\"OFF\",\"oldType\":\"OnOffType\",\"oldValue\":\"ON\"}","type":"ItemStateChangedEvent"}
        eventReceived = JSON.parse(eventPayload.data);
        console.log(eventReceived.topic);
        console.log(eventReceived.type);
        console.log(eventReceived.payload);
    }

    // just a helper method to retrieve available items as Array
    getAllItems = function (callback) {

        var url = endpoint + "items";

        $.ajax({
            method: "GET",
            cache: false,
            url: url,
            dataType: "text",
            success: function (data) {
                var jsonList = JSON.parse(data);
                var flatList = new Array();
                for (var i = 0; i < jsonList.length; i++) {
                    flatList.push(jsonList[i].name);
                }
                console.log(flatList);
                callback(flatList);
            },
            error: function (xhr, textStatus, error) {
                console.log(error);
                callback();
            }
        });
    };
    ext.setEndpoint = function (url) {

        if (url != endpoint) {
            endpoint = url;
            if (eventSource) {
                eventSource.close();
                eventSource.removeEventListener('message', eventSourceListener);                
            }
            // usually http://127.0.0.1:8080/rest/events?topics=smarthome/items/*/statechanged            
            eventSource = new EventSource(endpoint + "events?topics=smarthome/items/*/statechanged");
            eventSource.addEventListener('message', eventSourceListener);
        }
        console.log("set endpoint to " + endpoint);
        return endpoint;
    }

    // helper block for predefined items if standard endpoint is used
    ext.getItem = function (item) {
        return item;
    }

    // hat blocks will be repeated as fast as possible, thus "filtering" needs to be done
    ext.whenEvent = function (item) {
        if (eventReceived != null) {
            // According to https://github.com/LLK/scratchx/issues/40 a workaround is needed here
            if (!eventReceivedTimer) {
                eventReceivedTimer = setTimeout(function () {
                    eventReceived = null;
                    eventReceivedTimer = null;
                }, 100);
            }
            // smarthome/items/ITEM/statechanged
            return eventReceived.topic.split("/")[2] == item;
        }
        return false;
    }

    ext.sendCommand = function (command, item, callback) {

        var url = endpoint + "items/" + item;

        console.log("send " + command + " to " + url);

        $.ajax({
            method: "POST",
            cache: false,
            url: url,
            data: command,
            contentType: "text/plain",
            success: function () {
                callback();
            },
            error: function (xhr, textStatus, error) {
                console.log(error);
                callback();
            }
        });
    };

    ext.sendStatus = function (item, value, callback) {

        var url = endpoint + "items/" + item + "/state";

        console.log("send " + value + " to " + url);
   
        $.ajax({
            method: "PUT",
            cache: false,
            url: url,
            data: value,
            contentType: "text/plain",
            success: function () {
                callback();
            },
            error: function (xhr, textStatus, error) {
                console.log(error);
                callback();
            }
        });
    };

    ext.receiveStatus = function (item, callback) {

        var url = endpoint + "items/" + item + "/state";

        $.ajax({
            method: "GET",
            cache: false,
            url: url,
            dataType: "text",
            success: function (data) {
                console.log(data + " received from " + url);
                callback(data);
            },
            error: function (xhr, textStatus, error) {
                console.log(error);
                callback();
            }
        });
    };

    ext._shutdown = function () {
        // Cleanup extension if needed
        console.log('Shutting down...');
    };

    ext._getStatus = function () {
        // Report current extensions status
        return { status: 2, msg: 'Ready' };
    };

    // Initialize endpoint and event handling
    ext.setEndpoint(defaultEndpoint);

    getAllItems(function (list) {
        var descriptor = {
            blocks: [
                ['r', 'set endpoint to %s', 'setEndpoint', endpoint],
                ['r', 'get item %m.items', 'getItem', ""],
                ['w', 'send command %s to item %s', 'sendCommand', 'ON', 'DemoSwitch'],
                ['w', 'set state of item %s to %s', 'sendStatus', 'DemoSwitch', 'ON'],
                ['R', 'get state from item %s', 'receiveStatus', 'DemoSwitch'],
                ['h', 'when state of %s changed', 'whenEvent', 'DemoSwitch']
            ],
            menus: {
                items: list
            },
            url: 'https://github.com/wolter/ScratchX'
        };
        ScratchExtensions.register('SmartHome ', descriptor, ext);
    });

})({});
