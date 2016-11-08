var pcap = require('pcap'),
    pcap_session = pcap.createSession("en1", "");

pcap_session.on('packet', function (raw_packet) {
  // do some stuff with a raw packet
  console.log(raw_packet)
});
