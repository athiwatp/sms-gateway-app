var vm = new Vue({
    el: "#smsApp",
    data: {
        waitingMessage: "Waiting for requests...",
        requests: [],
        snackbar: false
    },
    methods: {
        reconnect() {
            socket.emit('phone_connected', true);
            this.snackbar = true;
        }
    }
})

var socket = io("http://10.10.120.76:3030");

var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function (id) {

        //cordova.plugins.backgroundMode.enable();

        socket.emit('phone_connected', true);
        vm.snackbar = true;

        socket.on('text', function (data) {
            vm.requests.push({
                body: `Sending message to ${data.number}...`,
                timestamp: new Date(),
                icon: 'hourglass_full'
            });
            if (SMS) SMS.sendSMS(data.number, data.message, function () {
                //cordova.plugins.backgroundMode.wakeUp();
                vm.requests.push({
                    body: `Message sent to ${data.number}...`,
                    timestamp: new Date(),
                    icon: 'check_circle'
                });
            }, function () {
                vm.requests.push({
                    body: "An error occured",
                    timestamp: new Date(),
                    icon: 'error'
                });
            });
            console.log(data)
        });
    }
};
