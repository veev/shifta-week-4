const fs = require('fs');
const traceRoutes = fs.readFileSync('.data/traceroute.txt', 'utf-8');

//console.log(traceRoutes);

let ipLines = traceRoutes.split("\n");
//console.log(ipLines);

let ipAddresses = [];

for (let i = 0; i < ipLines.length; i++) {
  const ipObj = {};

  const ipArray = ipLines[i].split("(");
  //console.log(ipArray);

  ipObj.address = ipArray[1].split(")")[0]
  //console.log(ipObj.address)

  const msArray = ipArray[1].split(")")[1].trim().split("  ")
  ipObj.ms = msArray

  ipAddresses.push(ipObj);
}

//console.log(ipAddresses);
fs.writeFileSync(".data/traceroute.json", JSON.stringify(ipAddresses), 'utf-8');