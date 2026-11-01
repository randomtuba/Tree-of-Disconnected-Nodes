addLayer("k", {
    // general stuff
    name: "knights",
    symbol: "K",
    position: 0, // horizontal position
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        crystals: new Decimal(0),
        activeKnights: new Decimal(0),
        inBattle: false,
        activeTile: 1,
        battleStats: {
            health: new Decimal(0),
            enemyHealth: new Decimal(0),
            enemyMaxHealth: new Decimal(0),
            enemyAttack: new Decimal(0),
            enemyDefense: new Decimal(0),
        },
        turnCooldown: 0.5,
        territory: new Decimal(0),
        zone: 1,
        excalCharging: false,
        excalProgress: 0,
        crystalsHeld: new Decimal(0),
        excaliburBonus: new Decimal(1),
    }},
    color: "#2e3fff",
    requires: new Decimal(1e72),
    resource: "knights",
    baseResource: "tokens", // resource required to unlock
    baseAmount() {return player.t.points},
    type: "none",
    row: 2, // 0 is first row
    layerShown(){return hasMilestone("t",2)},

    // calculations
    gainMult() {
        mult = new Decimal(0.1)
        mult = mult.mul(buyableEffect("k",13))
        mult = mult.mul(layers.k.excaliburEffect())
        mult = mult.mul(layers.b.cuboidEffect(5))
        if (player.k.zone >= 60) mult = mult.mul(0.1)
        return mult
    },
    gainExp() {
        let exp = new Decimal(1)
        return exp
    },
    generation() {
        return this.gainMult().pow(this.gainExp())
    },
    crystalGen() {
        let gen = player.k.points.mul(2).pow(2)
        gen = gen.mul(buyableEffect("k",12))
        gen = gen.mul(buyableEffect("k",32))
        gen = gen.mul(layers.k.excaliburEffect())
        gen = gen.mul(layers.b.cuboidEffect(5))
        if (player.k.zone >= 60) mult = mult.mul(0.1)
        return gen
    }, 
    knightsEffect() {
        return player.k.points.pow(1.5).add(1)
    },
    knightsCap() {
        return buyableEffect("k",11)
    },
    gridIDToNumber(id) {
        let i = id
        let tileID = 0
        while (i < 800) {
            i += 100
            tileID += 8
        }
        i = i % 100
        tileID += i
        return tileID
    },
    knightStats(str) {
        switch (str) {
            case "maxHealth":
                return player.k.activeKnights.mul(10).mul(buyableEffect("k",14)).mul(buyableEffect("s",23)).mul(buyableEffect("t",33))
            break
            case "attack":
                return player.k.activeKnights.mul(buyableEffect("k",21)).mul(buyableEffect("k",22)).mul(buyableEffect("s",23)).mul(buyableEffect("t",33))
            break
            case "defense":
                return buyableEffect("k",23).mul(buyableEffect("k",24))
            break
        }
    },
    newBattle() {
        player.k.battleStats.enemyMaxHealth = new Decimal((Math.random() * 10) + 5).mul(player.k.activeTile / 2).mul(Decimal.pow(player.k.zone >= 60 ? 36 : 24,player.k.zone - 1)).floor()
        player.k.battleStats.enemyHealth = player.k.battleStats.enemyMaxHealth
        player.k.battleStats.enemyAttack = new Decimal((Math.random() + 1) * 2).mul(player.k.activeTile / 4).mul(Decimal.pow(player.k.zone >= 60 ? 18 : 12,player.k.zone - 1)).floor()
        player.k.battleStats.enemyDefense = player.k.zone > 1 ? new Decimal(Math.random() * 2).mul(player.k.activeTile / 3).mul(Decimal.pow(player.k.zone >= 60 ? 24 : 16,player.k.zone - 2)).floor() : new Decimal(0)
        player.k.turnCooldown = buyableEffect("k",31)
        player.k.inBattle = true
    },
    territoryGain() {
        return new Decimal(player.k.activeTile).mul(Decimal.pow(24, player.k.zone - 1))
    },
    excaliburEffect() {
        return player.k.excaliburBonus.pow(0.1)
    },
    automate() {
        if (player.k.autoFight && hasMilestone("k",3) && !player.k.inBattle) {
            let part = player.k.points.mul(0.5).floor()
            player.k.points = player.k.points.sub(part)
            player.k.activeKnights = player.k.activeKnights.add(part)
            player.k.battleStats.health = layers.k.knightStats("maxHealth")
            layers.k.newBattle()
        }
    },
    update(diff) {
        if (!player[this.layer].unlocked && player.t.points.gte(1e72)) player[this.layer].unlocked = true
        if (player[this.layer].unlocked) {
            if (player.k.points.lt(layers.k.knightsCap()) || hasMilestone("k",1)) player.k.points = player.k.points.add(layers.k.generation().mul(diff))
            else player.k.points = layers.k.knightsCap()
            if (!player.k.excalCharging) player.k.crystals = player.k.crystals.add(layers.k.crystalGen().mul(diff))
            player.k.excaliburBonus = player.k.excaliburBonus.pow(Decimal.pow(0.9, diff))

            // charging excalibur
            if (player.k.excalCharging && player.k.excalProgress < 1) {
                player.k.crystalsHeld = player.k.crystalsHeld.add(layers.k.crystalGen().mul(diff))
                player.k.excalProgress += diff / 10
            } else if (player.k.excalProgress > 1) {
                player.k.excalProgress = 1
            }

            if (player.k.battleStats.health.lte(0)) {
                player.k.inBattle = false
                return
            }

            // battle stuff
            if (player.k.inBattle) {
                player.k.turnCooldown -= diff
                if (player.k.turnCooldown <= 0) {
                    player.k.turnCooldown = buyableEffect("k",31)
                    // enemy attacks first
                    player.k.battleStats.health = player.k.battleStats.health.sub(player.k.battleStats.enemyAttack.sub(layers.k.knightStats("defense")).max(0))
                    // knights attack second
                    player.k.battleStats.enemyHealth = player.k.battleStats.enemyHealth.sub(layers.k.knightStats("attack").sub(player.k.battleStats.enemyDefense).max(0))
                    // update active knights amount
                    player.k.activeKnights = player.k.activeKnights.mul(player.k.battleStats.health.div(layers.k.knightStats("maxHealth"))).ceil().max(0)

                    // enemy defeated, new battle begins
                    if (player.k.battleStats.enemyHealth.lte(0)) {
                        player.k.territory = player.k.territory.add(layers.k.territoryGain())
                        player.k.activeTile++
                        if (player.k.activeTile > 64) {
                            player.k.activeTile = 1
                            player.k.zone++
                        }
                        layers.k.newBattle()
                    }
                }
            }
        }
    },

    // UI elements
    tabFormat: [
        "milestones",
        "main-display",
        ["display-text", () => `Your knights are multiplying the dice multiplier gained per dice roll by <h2 style="color: #2e3fff; text-shadow: 0px 0px 10px #2e3fff">${format(layers.k.knightsEffect())}</h2>x.`],
        "blank",
        ["display-text", () => `You are getting ${format(layers.k.generation())} knights per second${hasMilestone("k",1) ? `` : `, but your knights cap at ${format(layers.k.knightsCap())}`}.`],
        "blank",
        ["display-text", () => `You have <h2 style="color: #2e3fff; text-shadow: 0px 0px 10px #2e3fff">${format(player.k.crystals)}</h2> crystals.`],
        ["display-text", () => `Your knights are gathering <h2 style="color: #2e3fff; text-shadow: 0px 0px 10px #2e3fff">${format(layers.k.crystalGen())}</h2> crystals per second.`],
        "blank",
        ["display-text", () => `Active knights: ${formatWhole(player.k.activeKnights)}`],
        ["clickables",[1,2]],
        "blank",
        () => player.k.zone >= 60 ? ["infobox","z60Info"] : '',
        ["display-text", () => `You have <h2 style="color: #00ff00; text-shadow: 0px 0px 10px #00ff00">${format(player.k.territory)}</h2> territory.`],
        ["display-text", () => `You will gain <h2 style="color: #00ff00; text-shadow: 0px 0px 10px #00ff00">${format(layers.k.territoryGain())}</h2> territory upon completing the current tile.`],
        ["display-text", () => `<span style="color: #ffff00">You are currently in Zone ${formatWhole(player.k.zone)}</span>`],
        () => player.k.inBattle ? ["display-text", `Turn cooldown: ${format(player.k.turnCooldown)}s`] : '',
        () => player.k.inBattle ? ["bar","knightStats"] : '',
        () => player.k.inBattle ? ["bar","enemyStats"] : '',
        "grid",
        "blank",
        ["buyables",[1]],
        () => hasMilestone("k",0) ? ["buyables",[3]] : '',
        ["buyables",[2]],
        "blank",
        () => hasMilestone("k",2) ? ["display-text", `Charging Excalibur will halt your crystal production but will increase held crystals.`] : '',
        () => hasMilestone("k",2) ? ["display-text", `Unleashing Excalibur will give a fleeting multiplier.`] : '',
        () => hasMilestone("k",2) ? ["display-text", `You are getting a <h2 style="color: #7c0000; text-shadow: 0px 0px 10px #7c0000">${format(layers.k.excaliburEffect())}</h2>x bonus to knight and crystal generation!`] : '',
        "blank",
        () => hasMilestone("k",2) ? ["bar","excalibur"] : '',
        () => hasMilestone("k",2) ? ["clickables",[3]] : '',
    ],
    buyables: {
        11: {
            title: "<h3>Training Barracks</h3>",
            cost(x) { return new Decimal(100).mul(Decimal.pow(10, x)).mul(Decimal.pow(1.02, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Double the knights cap.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}/16<br>Cost: ${format(this.cost())} crystals<br>Effect: ${format(this.effect())}x knights cap</span>` },
            canAfford() { return player[this.layer].crystals.gte(this.cost()) },
            purchaseLimit: 16,
            buy() {
                player[this.layer].crystals = player[this.layer].crystals.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(2, getBuyableAmount(this.layer, this.id))},
        },
        12: {
            title: "<h3>Crystal Nexus</h3>",
            cost(x) { return new Decimal(500).mul(Decimal.pow(5, x)).mul(Decimal.pow(1.1, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Double crystal generation.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} crystals<br>Effect: ${format(this.effect())}x crystals/second</span>` },
            canAfford() { return player[this.layer].crystals.gte(this.cost()) },
            buy() {
                player[this.layer].crystals = player[this.layer].crystals.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(2, getBuyableAmount(this.layer, this.id))},
        },
        13: {
            title: "<h3>Royal Enlistment</h3>",
            cost(x) { return new Decimal(1000).mul(Decimal.pow(5, x)).mul(Decimal.pow(1.1, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Multiply knights per second by 2.5x.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} crystals<br>Effect: ${format(this.effect())}x knights/second</span>` },
            canAfford() { return player[this.layer].crystals.gte(this.cost()) },
            buy() {
                player[this.layer].crystals = player[this.layer].crystals.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(2.5, getBuyableAmount(this.layer, this.id))},
        },
        14: {
            title: "<h3>Exercise Gym</h3>",
            cost(x) { return new Decimal(1000).mul(Decimal.pow(5, x)).mul(Decimal.pow(1.15, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Triple max health per knight.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} crystals<br>Effect: ${format(this.effect())}x max health</span>` },
            canAfford() { return player[this.layer].crystals.gte(this.cost()) },
            buy() {
                player[this.layer].crystals = player[this.layer].crystals.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(3, getBuyableAmount(this.layer, this.id))},
        },
        21: {
            title: "<h3>Iron Lance</h3>",
            cost(x) { return new Decimal(10).mul(Decimal.pow(2, x)) },
            display() { return `<span style="font-size:12px;">+2 base ATK per knight.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} territory<br>Effect: Base ATK is ${formatWhole(this.effect())}</span>` },
            canAfford() { return player[this.layer].territory.gte(this.cost()) },
            buy() {
                player[this.layer].territory = player[this.layer].territory.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return getBuyableAmount(this.layer, this.id).mul(2).add(2).pow(buyableEffect("k",33))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#00ff00"}; return style},
        },
        22: {
            title: "<h3>Brilliant Sword</h3>",
            cost(x) { return new Decimal(50).mul(Decimal.pow(5, x)).mul(Decimal.pow(1.1, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Double ATK per knight.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} territory<br>Effect: ${format(this.effect())}x ATK</span>` },
            canAfford() { return player[this.layer].territory.gte(this.cost()) },
            buy() {
                player[this.layer].territory = player[this.layer].territory.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(2, getBuyableAmount(this.layer, this.id))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#00ff00"}; return style},
        },
        23: {
            title: "<h3>Noble Helmet</h3>",
            cost(x) { return new Decimal(100).mul(Decimal.pow(3, x)) },
            display() { return `<span style="font-size:12px;">+2 base total DEF.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} territory<br>Effect: Base DEF is ${formatWhole(this.effect())}</span>` },
            canAfford() { return player[this.layer].territory.gte(this.cost()) },
            buy() {
                player[this.layer].territory = player[this.layer].territory.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return getBuyableAmount(this.layer, this.id).mul(2).pow(buyableEffect("k",34))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#00ff00"}; return style},
        },
        24: {
            title: "<h3>Sacred Shield</h3>",
            cost(x) { return new Decimal(100).mul(Decimal.pow(4, x)).mul(Decimal.pow(1.15, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Triple total DEF.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} territory<br>Effect: ${format(this.effect())}x DEF</span>` },
            canAfford() { return player[this.layer].territory.gte(this.cost()) },
            buy() {
                player[this.layer].territory = player[this.layer].territory.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(3, getBuyableAmount(this.layer, this.id))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#00ff00"}; return style},
        },
        31: {
            title: "<h3>Reaction Testing</h3>",
            cost(x) { return new Decimal(1e7).mul(Decimal.pow(20, x)).mul(Decimal.pow(1.2, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Divide the turn cooldown by /1.1.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}/10<br>Cost: ${format(this.cost())} crystals<br>Effect: Cooldown is ${format(this.effect())}s</span>` },
            canAfford() { return player[this.layer].crystals.gte(this.cost()) },
            purchaseLimit: 10,
            buy() {
                player[this.layer].crystals = player[this.layer].crystals.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return new Decimal(0.5).div(Decimal.pow(1.1, getBuyableAmount(this.layer, this.id))).toNumber()},
        },
        32: {
            title: "<h3>Crystal Hive</h3>",
            cost(x) { return new Decimal(1e8).mul(Decimal.pow(100, x)).mul(Decimal.pow(1.25, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Multiply crystal generation by 5x.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} crystals<br>Effect: ${format(this.effect())}x crystals/second</span>` },
            canAfford() { return player[this.layer].crystals.gte(this.cost()) },
            buy() {
                player[this.layer].crystals = player[this.layer].crystals.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(5, getBuyableAmount(this.layer, this.id))},
        },
        33: {
            title: "<h3>Lance Ascension</h3>",
            cost(x) { return new Decimal(1e9).mul(Decimal.pow(1000, x)).mul(Decimal.pow(1.25, x.pow(2))) },
            display() { return `<span style="font-size:12px;">+0.5 exponent to Iron Lance effect.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} crystals<br>Effect: ^${format(this.effect())} Iron Lance effect</span>` },
            canAfford() { return player[this.layer].crystals.gte(this.cost()) },
            buy() {
                player[this.layer].crystals = player[this.layer].crystals.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.add(1, getBuyableAmount(this.layer, this.id).div(2))},
        },
        34: {
            title: "<h3>Helmet Ascension</h3>",
            cost(x) { return new Decimal(1e10).mul(Decimal.pow(1000, x)).mul(Decimal.pow(1.25, x.pow(2))) },
            display() { return `<span style="font-size:12px;">+0.5 exponent to Noble Helmet effect.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} crystals<br>Effect: ^${format(this.effect())} Noble Helmet effect</span>` },
            canAfford() { return player[this.layer].crystals.gte(this.cost()) },
            buy() {
                player[this.layer].crystals = player[this.layer].crystals.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.add(1, getBuyableAmount(this.layer, this.id).div(2))},
        },
    },
    milestones: {
        0: {
            requirementDescription() {return `Reach Zone 4`},
            effectDescription: "Unlock a second row of crystal buyables.",
            done() { return player.k.zone >= 4 },
            unlocked() { return player.k.zone >= 3 },
        },
        1: {
            requirementDescription() {return `Reach Zone 10`},
            effectDescription: "Knights are uncapped.",
            done() { return player.k.zone >= 10 },
            unlocked() { return hasMilestone("k",0) },
        },
        2: {
            requirementDescription() {return `Reach Zone 18`},
            effectDescription: "Unlock Excalibur.",
            done() { return player.k.zone >= 18 },
            unlocked() { return hasMilestone("k",1) },
        },
        3: {
            requirementDescription() {return `Reach Zone 31`},
            effectDescription: "Unlock Auto-Fight.<br>(Auto-Fight releases 50% of knights to battle when there are no active knights.)",
            done() { return player.k.zone >= 31 },
            unlocked() { return hasMilestone("k",2) },
            toggles: [
                ["k","autoFight"],
            ],
        },
        4: {
            requirementDescription() {return `Reach Zone 60`},
            effectDescription: "Reach the Edge of the World.",
            done() { return player.k.zone >= 60 },
            unlocked() { return hasMilestone("k",4) },
        },
    },
    clickables: {
        11: {
            display: `<h2 style="font-size:24px;">1</h2>`,
            onClick() {
                player.k.points = player.k.points.sub(1)
                player.k.activeKnights = player.k.activeKnights.add(1)
            },
            canClick() {return player.k.points.gte(1) && !player.k.inBattle},
            style() {
                let style = {"width": "100px", "min-height": "100px"}
                return style
            },
        },
        12: {
            display: `<h2 style="font-size:24px;">10%</h2>`,
            onClick() {
                let part = player.k.points.mul(0.1).floor()
                player.k.points = player.k.points.sub(part)
                player.k.activeKnights = player.k.activeKnights.add(part)
            },
            canClick() {return player.k.points.gte(10) && !player.k.inBattle},
            style() {
                let style = {"width": "100px", "min-height": "100px"}
                return style
            },
        },
        13: {
            display: `<h2 style="font-size:24px;">25%</h2>`,
            onClick() {
                let part = player.k.points.mul(0.25).floor()
                player.k.points = player.k.points.sub(part)
                player.k.activeKnights = player.k.activeKnights.add(part)
            },
            canClick() {return player.k.points.gte(4) && !player.k.inBattle},
            style() {
                let style = {"width": "100px", "min-height": "100px"}
                return style
            },
        },
        14: {
            display: `<h2 style="font-size:24px;">50%</h2>`,
            onClick() {
                let part = player.k.points.mul(0.5).floor()
                player.k.points = player.k.points.sub(part)
                player.k.activeKnights = player.k.activeKnights.add(part)
            },
            canClick() {return player.k.points.gte(2) && !player.k.inBattle},
            style() {
                let style = {"width": "100px", "min-height": "100px"}
                return style
            },
        },
        15: {
            display: `<h2 style="font-size:24px;">100%</h2>`,
            onClick() {
                let part = player.k.points.floor()
                player.k.points = player.k.points.sub(part)
                player.k.activeKnights = player.k.activeKnights.add(part)
            },
            canClick() {return player.k.points.gte(1) && !player.k.inBattle},
            style() {
                let style = {"width": "100px", "min-height": "100px"}
                return style
            },
        },
        21: {
            display() {return `<h2>${player.k.inBattle ? `Battling...` : `Off to battle!`}</h2>`},
            onClick() {
                player.k.battleStats.health = layers.k.knightStats("maxHealth")
                layers.k.newBattle()
            },
            canClick() {return player.k.activeKnights.gte(1) && !player.k.inBattle},
            style() {
                let style = {"width": "100px", "min-height": "100px"}
                return style
            },
        },
        31: {
            display() {return `<h2>${player.k.excalCharging ? `Stop Charging` : `Charge`}</h2>`},
            onClick() {
                player.k.excalCharging = !player.k.excalCharging
            },
            canClick() {return player.k.excalProgress < 1},
            style() {
                let style = {"width": "100px", "min-height": "100px"}
                if (this.canClick()) style["background-color"] = "#7c0000"
                return style
            },
        },
        32: {
            display() {return `<h2>Unleash</h2>`},
            onClick() {
                player.k.excalCharging = false
                player.k.excalProgress = 0
                player.k.excaliburBonus = player.k.excaliburBonus.add(player.k.crystalsHeld)
                player.k.crystalsHeld = new Decimal(0)
            },
            canClick() {return player.k.excalProgress >= 1},
            style() {
                let style = {"width": "100px", "min-height": "100px"}
                if (this.canClick()) style["background-color"] = "#7c0000"
                return style
            },
        },
    },
    bars: {
        knightStats: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return player.k.battleStats.health.div(layers.k.knightStats("maxHealth"))},
            display: () => `Your Stats: ${format(player.k.battleStats.health)}/${format(layers.k.knightStats("maxHealth"))} (${format(layers.k.knightStats("attack"))} ATK, ${format(layers.k.knightStats("defense"))} DEF)`,
            fillStyle() { return {"background-color": "#2e3fff"} },
        },
        enemyStats: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return player.k.battleStats.enemyHealth.div(player.k.battleStats.enemyMaxHealth)},
            display: () => `Enemy Stats: ${format(player.k.battleStats.enemyHealth)}/${format(player.k.battleStats.enemyMaxHealth)} (${format(player.k.battleStats.enemyAttack)} ATK, ${format(player.k.battleStats.enemyDefense)} DEF)`,
            fillStyle() { return {"background-color": "#007c00"} },
        },
        excalibur: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return player.k.excalProgress},
            display: () => `Excalibur: ${format(player.k.excalProgress * 100)}% filled (${format(player.k.crystalsHeld)} crystals held)`,
            fillStyle() { return {"background-color": "#7c0000"} },
        },
    },
    grid: {
        rows: 8,
        cols: 8,
        getStartData(id) {
            return 0
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return false
        },
        getStyle(data, id) {
            const style = {}
            style["width"] = "70px"
            style["max-height"] = "70px"
            if (player.k.activeTile > layers.k.gridIDToNumber(id)) style["background-color"] = "#00ff00"
            if (player.k.activeTile == layers.k.gridIDToNumber(id)) style["background-color"] = "#ffffff"
            if (player.k.activeTile < layers.k.gridIDToNumber(id) && player.k.zone <= 60) style["background-color"] = "#2e3fff"
            if (player.k.activeTile < layers.k.gridIDToNumber(id) && player.k.zone >= 60) style["background-color"] = "#87009e"
            return style
        }
    },
    infoboxes: {
        z60Info: {
            title: "The Edge of the World",
            body() { return "After a long journey, you've finally made it. An enormous cliff stands beside you, with an abyss meeting your gaze.<br><br><b>Enemy health, ATK, and DEF jump in difficulty and scale faster. Knight and crystal generation are divided by 10.</b><br><br>Will you triumph over these new evils, or are you too scared to go on?" },
        },
    },
})