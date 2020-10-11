var awsIot = require("aws-iot-device-sdk");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
let a = "NoFire";
let b = "NoLeakage";
let water=0;
let fan=0;
let error=0;
var device = awsIot.device({
  keyPath: "d4355f3e77-private.pem.key",
  certPath: "d4355f3e77-certificate.pem.crt",
  caPath: "AmazonRootCA1.pem",
  clientId: "co326",
  host: "aqggby5s4s93e-ats.iot.us-east-1.amazonaws.com",
});

device.on("connect", function () {
  console.log("connect");

  device.subscribe("outTopic");
  device.subscribe("Temp");
	//error=0;
  console.log("published");
});

device.subscribeToDevices;

app.get("/", function (req, res) {
	
  res.sendFile(__dirname + "/index.html");
  //res.send(a.toString());
  //res.json({ title: "api", message: "root" });
});

app.get("/test", (req, res) => {
  //res.sendFile(__dirname +"/views/test.html",);

  device.on("message", function (topic, payload) {
    a = payload;
  });
 // if(a.toString()==="null"){error=1}
 
  //console.log(a.toString());
  if (a.toString() === "Fire") {
    device.publish("inTopic", JSON.stringify(6));
	res.json({ Fire:"Fire", Gas: "No Leakage" });
	water=1;
	a="No Fire";
  }

  else if (a.toString() === "Gas Leakage") {
    device.publish("inTopic", JSON.stringify(7));
	res.json({ Fire: "No Fire", Gas:"Gas Leakage" }); 
	fan=1;
	a="No Leakage";
  }
  else if(a.toString()===null){
	 res.json({ Fire: "Connection Error", Gas: "Connection Error" }); 
  }
  else{
	  
	 res.json({ Fire: "No Fire", Gas: "No Leakage" }); 
  }
  

});

app.get("/control", (req, res) => {
  //res.sendFile(__dirname +"/views/test.html",);

  
	if (fan==1&&water==1) {
    
	res.json({ Fan:"On", Water: "On" });
	
	}
	else if (fan==1&&water==0) {
    res.json({ Fan:"On", Water: "Off" });
	}
	else if (fan==0&&water==1) {
    res.json({ Fan:"Off", Water: "On" });
	}
	else{
	res.json({ Fan:"Off", Water: "Off" });	
		
	}
 
  

});

app.get("/temp", (req, res) => {
if(!isNaN(a.toString())){
res.json({ Temperature:parseInt(a.toString())/10});	
	
}
});
app.post("/fire", function (req, res) {
  //var user_name = req.body.user;
  // var password = req.body.password;
  // console.log("User name = " + user_name + ", password is " + password);
  device.publish("inTopic", JSON.stringify(1));
  water=0;
  res.end("yes");
});
app.post("/gas", function (req, res) {
  //var user_name = req.body.user;
  // var password = req.body.password;
  // console.log("User name = " + user_name + ", password is " + password);
  device.publish("inTopic", JSON.stringify(2));
  fan=0;
  res.end("yes");
});

app.listen(3000, () => {
  console.log("Started on PORT 3000");
});
