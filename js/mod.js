let modInfo = {
	name: "Tree of Disconnected Nodes",
	author: "randomtuba",
	pointsName: "",
	modFiles: ["tree.js", "side-layers.js", "matter.js", "fluid.js", "chips.js", "strings.js", "boxes.js", "tokens.js", "knights.js"],

	discordName: "tuba's new place",
	discordLink: "https://discord.gg/HhcavwM5rm",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "Act 1 Part 7",
	name: "Knights",
}

let changelog = `<h1>Changelog</h1><br>
	<span style="font-size:11px;">If this game gets abandoned, don't forget me ok?</span><br><br>
	<h3>Act 1 Part 7: Knights (11/1/2026)</h3><br>
	<b>Endgame: Reach Zone 62</b><br>
		- Added the Knights node.<br>
		- Added 6 achievements.<br>
		- Added new milestones.<br>
		- Added oscillations.<br>
		- Added a new cuboids type.<br>
		- Added a new tokens minigame.<br><br>
	<h3>Act 1 Part 6: Tokens (9/7/2026)</h3><br>
	<b>Endgame: 1.00e72 tokens</b><br>
		- Added the Tokens node.<br>
		- Added 5 achievements.<br>
		- Added new milestones.<br>
		- Added matter buyables.<br>
		- Added Singular Infinity.<br>
		- Added transistors.<br><br>
	<h3>Act 1 Part 5: Boxes (8/8/2026)</h3><br>
	<b>Endgame: 1.00e98 boxes</b><br>
		- Added the Boxes node.<br>
		- Added 2 achievements.<br>
		- Added 1 strings milestone.<br>
		- Added 3 string flavors.<br><br>
	<h3>Act 1 Part 4: Strings (8/1/2026)</h3><br>
	<b>Endgame: 1.00e380 strings</b><br>
		- Added the Strings node.<br>
		- Added 5 achievements.<br>
		- Added 1 fluid milestone.<br>
		- Added 3 chips milestones.<br><br>
	<h3>Act 1 Part 3: Chips (7/18/2026)</h3><br>
	<b>Endgame: 1.00e49 chips</b><br>
		- Added the Chips node.<br>
		- Added 1 achievement.<br>
		- Added 3 fluid milestones.<br>
		- The background color changes depending on latest node unlocked.<br><br>
	<h3>Act 1 Part 2: Fluid (7/4/2026)</h3><br>
	<b>Endgame: 1.00e42 fluid</b><br>
		- Added the Fluid node.<br>
		- Added 2 achievements.<br>
		- Added 2 matter milestones.<br><br>
	<h3>Act 1 Part 1: Matter (6/28/2026)</h3><br>
	<b>Endgame: 1.00e66 matter</b><br>
		- Added the Matter node.<br>
		- Added the Achievements menu.<br>
		- Added the Help menu.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything","boxReset","rollDice","newBattle"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	gain = gain.add(player.m.multiplier[1].add(player.m.multiplier[2]).add(player.m.multiplier[3]).add(player.m.multiplier[4]).add(player.m.multiplier[5]).add(player.m.multiplier[6]))
	gain = gain.mul(player.f.singularities.sqrt().add(1))
	gain = gain.mul(player.f.planckPoints.cbrt().add(1))
	gain = gain.mul(getBuyableAmount("c",11).add(getBuyableAmount("c",12)).add(getBuyableAmount("c",13)).add(getBuyableAmount("c",21)).add(getBuyableAmount("c",22)).add(getBuyableAmount("c",23)).add(getBuyableAmount("c",31)).add(getBuyableAmount("c",32)).add(getBuyableAmount("c",33)).add(1))
	gain = gain.mul(player.s.stringTypes[1].add(1)).mul(player.s.stringTypes[2].add(1)).mul(player.s.stringTypes[3].add(1)).mul(player.s.stringTypes[4].add(1)).mul(player.s.stringTypes[5].add(1))
	gain = gain.mul(player.b.cuboids[0].pow(10).add(1))
	gain = gain.mul(player.b.cuboids[1].pow(10).add(1))
	gain = gain.mul(player.b.cuboids[2].pow(10).add(1))
	gain = gain.mul(player.b.cuboids[3].pow(10).add(1))
	gain = gain.mul(player.t.diceMult.pow(100))
	gain = gain.mul(Decimal.pow("1e1000", player.k.zone))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	() => `Current Endgame: Reach Zone 62`,
]

// Determines when the game "ends"
function isEndgame() {
	return player.k.zone >= 62
}



// Less important things beyond this point!

// Style for the background, can be a function
function backgroundStyle() {
  	let ret = {}

  	if (!player.f.unlocked) ret["background-color"] = "#1e0a1d"
	else if (!player.c.unlocked) ret["background-color"] = "#0c161c"
	else if (!player.s.unlocked) ret["background-color"] = "#150c1c"
	else if (!player.b.unlocked) ret["background-color"] = "#05140b"
	else if (!player.t.unlocked) ret["background-color"] = "#1d0d00"
	else if (!player.k.unlocked) ret["background-color"] = "#181f1b"
	else ret["background-color"] = "#060924"

  	return ret
}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}