var vm = new Vue({
    el: "#smsApp",
    data: {
        waitingMessage: "Waiting for requests...",
        requests: [],
        snackbar_msg: null,
        snackbar: false
    },
    methods: {
        reconnect() {
            socket.emit('phone_connected', true);
            this.snackbar_msg = "Connected";
            this.snackbar = true;
        },
        clear() {
            this.snackbar_msg = "Logs cleared";
            this.snackbar = true;
            this.requests = [];
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
        vm.snackbar_msg = "Connected";
        vm.snackbar = true;

        socket.on('text', function (data) {
            vm.requests.push({
                body: "Sending message",
                number: data.number,
                timestamp: new Date(),
                icon: 'hourglass_full'
            });
            if (SMS) SMS.sendSMS(data.number, data.message, function () {
                //cordova.plugins.backgroundMode.wakeUp();
                vm.requests.push({
                    body: "Message sent",
                    number: data.number,
                    timestamp: new Date(),
                    icon: 'check_circle'
                });
            }, function () {
                vm.requests.push({
                    body: "Message not sent",
                    number: data.number,
                    timestamp: new Date(),
                    icon: 'error'
                });
            });
            console.log(data)
        });
    }
};
