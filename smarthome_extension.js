// SmartHome Extension to demonstrate some simple REST functionality to 
// control a SmartHome based on Eclipse SmartHome, openHAB or QIVICON.
// Works with ScratchX (http://scratchx.org/) using the URL
// http://scratchx.org/?url=http://wolter.github.io/ScratchX/smarthome_extension.js#scratch.
// 2015 Sascha Wolter (http://wolter.biz | @saschawolter)

(function (ext) {

    var endpoint = "http://127.0.0.1:8080/rest/";
    ext.set_endpoint = function (url, callback) {
        console.log("set endpoint to " + url);
        endpoint = url;
        return endpoint;
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
    
    var event_received = false;
    var event_source = null;
    // hat blocks will be repeatd as fast as possible, thus "filtering" needs to be done
    ext.when_event = function (source) {
        if (event_source != source) {
            console.log("new event source");
            event_source = source;
            event_received = false;
            var eventSource = new EventSource(event_source);
            eventSource.addEventListener('message', function (eventPayload) {
                var event = JSON.parse(eventPayload.data);
                console.log(event.topic);
                console.log(event.type);
                console.log(event.payload);
                event_received = true;
            });
        }
        if (!event_received) {
            return false;
        }
        event_received = false;
        console.log("when_event");
        return true;
    }

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
            ['r', 'evaluate JavaScript ' + endpoint, 'set_endpoint'],
            /*['r', 'set endpoint to %s', 'set_endpoint', endpoint],*/
            ['w', 'set state of item %s to %s', 'send', 'DemoSwitch', 'ON'],
            ['R', 'get state from item %s', 'receive', 'DemoSwitch'],
            ['h', 'when event %s', 'when_event', "events?topics=smarthome/items/DemoSwitch/state"]
        ],
        url: 'https://github.com/wolter/ScratchX'
    };

    ScratchExtensions.register('SmartHome', descriptor, ext);
})({});
