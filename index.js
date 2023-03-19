const IP_ADDRESS_BULB = '192.168.1.75';
const IP_ADDRESS_PC = '192.168.1.19';

const artNet = require("artnet-protocol");
// import { ArtNetController } from 'artnet-protocol/dist/index.js';
// import { ArtDmx } from 'artnet-protocol/dist/protocol.js';
let dgram = require('dgram');

let client = dgram.createSocket('udp4');
const controller = new artNet.ArtNetController();
let prevValues = [0, 0, 0];

setupUdpCallbacks();

// controller.bind('0.0.0.0');
controller.bind(IP_ADDRESS_PC);
// The controller is now listening and responding to discovery traffic

// Send DMX data (Sequence 0, Physical input port 0, Universe 0.
// controller.sendBroadcastPacket(new ArtDmx(0, 0, 0, [255, 0, 0]));

controller.on('dmx', (dmx) => {
    // dmx contains an ArtDmx object
    if (prevValues[0] === dmx.data[0] && prevValues[1] === dmx.data[1] && prevValues[2] === dmx.data[2] )
        return;
    let msg = getMessageWithColorBrightness(dmx.data[0], dmx.data[1], dmx.data[2], 100);
    prevValues = [dmx.data[0], dmx.data[1], dmx.data[2]];
    client.send(msg, 0, msg.length, 38899, IP_ADDRESS_BULB, function (err, bytes) {
        console.log("sent message with colors: ", dmx.data[0], dmx.data[1], dmx.data[2]);
    });
});

function setupUdpCallbacks() {
    // https://nodejs.org/api/dgram.html#socketbindport-address-callback
    client.on('error', (err) => {
        console.error(`client error:\n${err.stack}`);
        client.close();
    });

    client.on('message', (msg, rinfo) => {
        console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    });

    client.on('listening', () => {
        const address = client.address();
        console.log(`client listening ${address.address}:${address.port}`);
    });

    client.bind(38899);
}

// https://aleksandr.rogozin.us/blog/2021/8/13/hacking-philips-wiz-lights-via-command-line
function getMessageWithColorBrightness(r, g, b, dimming) {
    let msg = {
        "id":1,
        "method": "setPilot",
        "params": {
            "r": r,
            "g": g,
            "b": b,
            "dimming": dimming
        }
    };
    return JSON.stringify(msg);
}
