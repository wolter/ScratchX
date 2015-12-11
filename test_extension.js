// Test Extension to demonstrate some simple HTTP and REST functionality
// 2015 Sascha Wolter (http://wolter.biz | @saschawolter)

(function (ext) {

    ext.send = function (value, url, callback) {

        console.log("send");

        $.ajax({
            method: "POST",
            cache: false,
            url: url,
            data: {
                state: value
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
                callback(data.state);
            },
            error: function (xhr, textStatus, error) {
                console.log(error);
                callback();
            }
        });
    };

    ext.receive = function (varname, url, callback) {

        console.log("getState");

        $.ajax({
            method: "GET",
            cache: false,
            url: url,
            dataType: "json",
            success: function (data) {
                console.log(data);
                callback(data[varname]);
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
            // Block type, block name, function name, opt. callback
            ['R', 'send %s to %s', 'send', 'ON', 'http://localhost:3000/api/v1/smarthome/virtual/bulb/'],
            ['R', 'receive %s from %s', 'receive', 'state', 'http://localhost:3000/api/v1/smarthome/virtual/bulb/']
        ],
        url: 'http://www.wolter.biz'
    };

    ScratchExtensions.register('Simple REST API', descriptor, ext);
})({});
