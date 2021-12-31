//rak_hak.ns
export async function main(ns) {
	let targetServer = "foodnstuff";
	let serversSeen = ns.scan("home");
	let currentScan;
	for (let i = 0; i < serversSeen.length; i++) {
		currentScan = ns.scan(serversSeen[i])
		for (var j = 0; j < currentScan.length; j++) {
			if (serversSeen.indexOf(currentScan[j]) === -1) {
				serversSeen.push(currentScan[j])
			}
		}
	}    
	
	for (let i = 0; i < serversSeen.length; i++) {
		var portsRequired = ns.getServerNumPortsRequired(serversSeen[i]);
		var rootAccess = ns.hasRootAccess(serversSeen[i]);
		var portsOpen = 0;

		ns.tprint(rootAccess);
		if (!rootAccess) {
			if (ns.fileExists("BruteSSH.exe", "home")) {
				ns.brutessh(serversSeen[i]);
				portsOpen++;
			}
			if (ns.fileExists("FTPCrack.exe", "home")) {
				ns.ftpcrack(serversSeen[i]);
				portsOpen++;
			}
			if (ns.fileExists("relaySMTP.exe", "home")) {
				ns.relaysmtp(serversSeen[i]);
				portsOpen++;
			}
			if (ns.fileExists("HTTPWorm.exe", "home")) {
				ns.httpworm(serversSeen[i]);
				portsOpen++;
			}
			if (ns.fileExists("SQLInject.exe", "home")) {
				ns.sqlinject(serversSeen[i]);
				portsOpen++;
			}

			if (portsOpen >= portsRequired) {
				ns.nuke(serversSeen[i]);
				portsOpen++;
			}
		}
		ns.tprint("PORTS OPENED: " + portsOpen);
	}


	var working = 0;
	for (let i = 0; i < serversSeen.length; i++) {
		var threadsToUse =  Math.floor((ns.getServerMaxRam(serversSeen[i]) - ns.getServerUsedRam(serversSeen[i])) / ns.getScriptRam("vuln_server.ns", "home"));
		await ns.scp("vuln_server.ns", "home", serversSeen[i]);
		if (threadsToUse > 0) {
			ns.tprint("[" + serversSeen[i] + "]" + "[" + threadsToUse + " threads] " + "Failed");
			ns.exec("vuln_server.ns", serversSeen[i], threadsToUse, targetServer);
			working++;
		} else {
			ns.tprint("[" + serversSeen[i] + "]" + "[" + threadsToUse + " threads] " + "Successful");
		}
	}
	ns.tprint("Succesful: " + working);
}