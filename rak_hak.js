//rak_hak.js
export async function main(ns) {
	ns.disableLog("ALL");
	var target;
	if (ns.args[0]) {
		target = ns.args[0];
	} else 	target = "foodnstuff";

	var hackScript = "vuln_server.js";

	var serversSeen = ns.scan("home");
	var currentScan;

	for (let i = 0; i < serversSeen.length; i++) {
		currentScan = ns.scan(serversSeen[i])
		for (var j = 0; j < currentScan.length; j++) {
			if (serversSeen.indexOf(currentScan[j]) === -1) {
				serversSeen.push(currentScan[j])
			}
		}
	}
	ns.tprint(serversSeen);

	var working = 0;
	var failed = 0;
	for (let i = 0; i < serversSeen.length; i++) {
		var threadsToUse =  Math.floor((ns.getServerMaxRam(serversSeen[i]) - ns.getServerUsedRam(serversSeen[i])) / ns.getScriptRam(hackScript, "home"));
		await ns.scp(hackScript, "home", serversSeen[i]);
		if (threadsToUse > 0) {
			ns.tprint("[" + serversSeen[i] + "]" + "[" + threadsToUse + " threads] " + "Successful");
			ns.exec(hackScript, serversSeen[i], threadsToUse, target);
			working++;
		} else {
			ns.tprint("[" + serversSeen[i] + "]" + "[" + threadsToUse + " threads] " + "Failed");
			failed++;
		}
	}
	ns.tprint("Succesful: " + working);
	ns.tprint("Failed: " + failed);
}
