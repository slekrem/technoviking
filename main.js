var pcap = require("pcap"),
    tcp_tracker = new pcap.TCPTracker(),
    pcap_session = pcap.createSession("en1", "arp");

var getIPAddressAsStringFromArray = function(array) {
  return array[0] + '.' + array[1] + '.' + array[2] + '.' + array[3];
}

var handleAlarm = function() {
  console.log("ALARM");
  console.log("\007");
}

var hosts = [ ];
var lastPacketTime = Date.now();
var diffCount;
console.log(new Date(lastPacketTime));
pcap_session.on('packet', function (raw_packet) {
  // bereite vor ...
  var packet = pcap.decode.packet(raw_packet),
      senderIp = getIPAddressAsStringFromArray(packet.payload.payload.sender_pa.addr),
      targetIp = getIPAddressAsStringFromArray(packet.payload.payload.target_pa.addr);

  // handle source ip
  var hostsWithSameSenderIp = hosts.filter(function(host) {
    if (host.ip == senderIp)
      return true;
    return false;
  });
  if (hostsWithSameSenderIp.length == 0) {
    hosts.push({
      ip: senderIp
    });
    //console.log(hosts[hosts.length -1]);
  }

  // handle attack
  var diff = Date.now() - lastPacketTime;
  //console.log(diff);
  if (diff < 10) {
    ++diffCount
  } else {
    diffCount = 0;
  }
  if (diffCount == 5)
    handleAlarm();
  lastPacketTime = Date.now();
});
