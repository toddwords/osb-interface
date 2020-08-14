var udp = require('dgram');

// --------------------creating a udp server --------------------

// // creating a udp server
// var server = udp.createSocket('udp4');

// // emits when any error occurs
// server.on('error',function(error){
//   console.log('Error: ' + error);
//   server.close();
// });

// // emits on new datagram msg
// server.on('message',function(msg,info){
//   console.log('Data received from client : ' + msg.toString());
//   console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);

// //sending msg
// server.send(msg,info.port,'localhost',function(error){
//   if(error){
//     client.close();
//   }else{
//     console.log('Data sent !!!');
//   }

// });

// });

// //emits when socket is ready and listening for datagram msgs
// server.on('listening',function(){
//   var address = server.address();
//   var port = address.port;
//   var family = address.family;
//   var ipaddr = address.address;
//   console.log('Server is listening at port' + port);
//   console.log('Server ip :' + ipaddr);
//   console.log('Server is IP4/IP6 : ' + family);
// });

// //emits after the socket is closed using socket.close();
// server.on('close',function(){
//   console.log('Socket is closed !');
// });

// server.bind(2222);

// setTimeout(function(){
// server.close();
// },8000);

// -------------------- udp client ----------------
console.log("amplitude: " + amplitude)
var buffer = require('buffer');
// creating a client socket
var client = udp.createSocket('udp4') ;
// var client = udp.createSocket({type:'udp4', lookup: function(){dns.lookup("192.168.1.3",{hints:0},function(err, address, family){console.log('address: %j family: IPv%s', address, family)})}}) ;

//buffer msg
let data;

client.on('message',function(msg,info){
  var msg = msg.toString()
  // console.log(msg)
  if(msg.indexOf("position") > -1){
    console.log("msg: " + msg)
  	var ms = msg.trim().split(" ")[1].slice(0,-1)
    if(updateFromPackets)
  	   updateTime(parseFloat(ms)/1000)
  }
  if(msg.indexOf("env") > -1){
    // console.log(msg)
    amplitude = parseFloat(msg.trim().split(" ")[1].slice(0,-1))/300
    console.log(amplitude)
  }
});
client.bind(50001)

client.on('listening',function(){
  var address = client.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Server is listening at port' + port);
  console.log('Server ip :' + ipaddr);
  console.log('Server is IP4/IP6 : ' + family);
});
var data1 = Buffer.from('hello\n');
var data2 = Buffer.from('test2;\n');

console.log(data1)
setTimeout(function(){sendToClient("hello from startup")},1000)
// setInterval(function(){
// 	client.send([data1,data2],50000,'127.0.0.1',function(error){
//   if(error){
//     client.close();
//   }else{
//     console.log('Data sent !!!');
//   }
//   });
// },1000)

function sendToClient(msg){
  let data =  Buffer.from(msg+"\n")
  client.send(data, 50000,'localhost',function(error){
    if(error){
      console.log(error)
      client.close();
    }else{
      console.log('Data sent !!!');
      console.log(msg)
    }
  });
}