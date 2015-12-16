// SmartHome Extension to demonstrate some simple REST functionality to 
// control a SmartHome based on Eclipse SmartHome, openHAB or QIVICON.
// Works with ScratchX (http://scratchx.org/) using the URL
// http://scratchx.org/?url=http://wolter.github.io/ScratchX/smarthome_extension.js#scratch.
// 2015 Sascha Wolter (http://wolter.biz | @saschawolter)

(function (ext) {

    var endpoint = "";
    var eventSource = null;
    var eventReceived = false;
    var eventReceivedTimer = null;
    var eventSourceListener = function (eventPayload) {
        var event = JSON.parse(eventPayload.data);
        console.log(event.topic);
        console.log(event.type);
        console.log(event.payload);
        eventReceived = true;
    }

    ext.set_endpoint = function (url) {
        if (url != endpoint) {
            endpoint = url;
            if (eventSource) {
                eventSource.close();
                eventSource.removeEventListener('message', eventSourceListener);                
            }
            eventSource = new EventSource(endpoint + "events?topics=smarthome/items/*/state");
            eventSource.addEventListener('message', eventSourceListener);
        }
        console.log("set endpoint to " + endpoint);
        return endpoint;
    }
    // Initialize endpoint and event handling
    ext.set_endpoint("http://127.0.0.1:8080/rest/");

    // hat blocks will be repeated as fast as possible, thus "filtering" needs to be done
    ext.when_event = function () {
        if (eventReceived) {
            // According to https://github.com/LLK/scratchx/issues/40 a workaround is needed here
            if (!eventReceivedTimer) {
                eventReceivedTimer = setTimeout(function () {
                    eventReceived = false;
                    eventReceivedTimer = null;
                }, 50);
            }
            console.log("when_event");
            return true;
        }
        return false;
    }

    ext.send = function (item, value, callback) {

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

    ext.receive = function (item, callback) {

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

    var descriptor = {
        blocks: [
            ['r', 'set endpoint to %s', 'set_endpoint', endpoint],
            ['w', 'set state of item %s to %s', 'send', 'DemoSwitch', 'ON'],
            ['R', 'get state from item %s', 'receive', 'DemoSwitch'],
            ['h', 'when state of any item changed', 'when_event']
        ],
        url: 'https://github.com/wolter/ScratchX'
    };

    ScratchExtensions.register('SmartHome', descriptor, ext);
})({});
