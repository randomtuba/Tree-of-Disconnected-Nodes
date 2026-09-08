addLayer("t", {
    // general stuff
    name: "tokens",
    symbol: "T",
    position: 1, // horizontal position
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        selection: "RED",
        rand: 0,
        rolled: "GREEN",
        rollCooldown: [5,1],
        streak: 0,
        diceMult: new Decimal(1),
    }},
    color: "#9cd3b0",
    requires: new Decimal(1e98),
    resource: "tokens",
    baseResource: "boxes", // resource required to unlock
    baseAmount() {return player.b.points},
    type: "none",
    row: 2, // 0 is first row
    layerShown(){return hasMilestone("b",2)},
    hotkeys: [
      {key: "r", description: "R: Roll for roulette", onPress(){if (layers.t.clickables[21].canClick()) layers.t.clickables[21].onClick()}},
    ],

    // calculations
    gainMult() {
        mult = new Decimal(1)
        mult = mult.mul(buyableEffect("t",11))
        mult = mult.mul(layers.t.streakMult())
        mult = mult.mul(buyableEffect("m",13))
        mult = mult.mul(player.t.diceMult)
        return mult
    },
    gainExp() {
        let exp = new Decimal(1)
        exp = exp.mul(layers.tr.transistorsEffect())
        return exp
    },
    generation() {
        return this.gainMult().pow(this.gainExp())
    },
    tokensEffect() {
        return player.t.points.pow(2).add(1)
    },
    rollWheel(x) {
        if (x <= getBuyableAmount("t",21).add(getBuyableAmount("t",21).gt(0) ? 18 : 0).toNumber()) {
            return "GREEN"
        } else if (x % 2 == 0) {
            if (x > 18 && x < 29 || x > 0 && x < 11) {
                return "BLACK"
            } else {
                return "RED"
            }
        } else {
            if (x > 10 && x < 19 || x > 28 && x < 37) {
                return "BLACK"
            } else {
                return "RED"
            }
        }
    },
    colorify(str) {
        if (str == "RED") {
            return `<h2 style="color: #960000; text-shadow: 0px 0px 10px #960000">RED</h2>`
        } else if (str == "BLACK") {
            return `<h2 style="color: #000000; text-shadow: 0px 0px 10px #ffffff">BLACK</h2>`
        } else if (str == "GREEN") {
            return `<h2 style="color: #00b500; text-shadow: 0px 0px 10px #00b500">GREEN</h2>`
        }
    },
    streakMult() {
        return Decimal.mul(buyableEffect("t",13),player.t.streak).add(1)
    },
    diceSum() {
        let sum = new Decimal(0)
        for (let i = 101; i < 106; i++) {
            sum = sum.add(player.t.grid[i])
        }

        return sum
    },
    diceMult() {
        let mult = new Decimal(1)

        switch (layers.t.checkDice()) {
            case "Three of a Kind":
                mult = new Decimal(2)
            break
            case "Full House":
                mult = new Decimal(4)
            break
            case "Straight":
                mult = new Decimal(6)
            break
            case "Four of a Kind":
                mult = new Decimal(8)
            break
            case "Yahtzee":
                mult = new Decimal(40)
            break
        }

        mult = mult.mul(buyableEffect("t",23))
        mult = mult.mul(layers.f.infinityFillEffect(3))
        mult = mult.mul(buyableEffect("tr",23))

        return mult
    },
    checkDice() {
        let counter = 0

        // check for all 0
        if (player.t.grid[101] == 0 && player.t.grid[102] == 0 && player.t.grid[103] == 0 && player.t.grid[104] == 0 && player.t.grid[105] == 0) {
            return "Regular"
        }

        // check for yahtzee
        if (player.t.grid[101] == player.t.grid[102] && player.t.grid[102] == player.t.grid[103] && player.t.grid[103] == player.t.grid[104] && player.t.grid[104] == player.t.grid[105]) {
            return "Yahtzee"
        }

        // check for 3-4 of a kind
        let bestCounter = 0
        let template;
        for (let i = 101; i < 105; i++) {
            counter = 0
            for (let j = i+1; j < 106; j++) {
                if (player.t.grid[i] == player.t.grid[j]) {
                    counter++
                    if (counter > bestCounter) bestCounter = counter
                    template = player.t.grid[i]
                }
            }
        }

        if (bestCounter == 3) return "Four of a Kind"

        // check for full house
        if (bestCounter == 2) {
            let outliers = []
            for (let k = 101; k < 106; k++) {
                if (player.t.grid[k] != template) {
                    outliers.push(player.t.grid[k])
                }
            }
            if (outliers[0] == outliers[1]) return "Full House"
            else return "Three of a Kind"
        }

        // check for straight
        counter = 0
        let straightValue = 1
        let done = false
        let incremented;
        while (!done) {
            incremented = false
            for (let i = 101; i < 106; i++) {
                if (player.t.grid[i] == straightValue) {
                    counter++
                    straightValue++
                    incremented = true
                }
            }
            if (!incremented) {
                if (straightValue >= 2) done = true
                else straightValue++
            }

            if (counter >= 5) return "Straight"
        }

        return "Regular"
    },
    automate() {
        if (player.t.autoRoll && hasMilestone("t",0)) {
            if (layers.t.clickables[21].canClick()) layers.t.clickables[21].onClick()
            if (hasMilestone("t",2) && layers.t.clickables[31].canClick()) layers.t.clickables[31].onClick()
        }
    },
    update(diff) {
        if (!player[this.layer].unlocked && player.b.points.gte(1e98)) player[this.layer].unlocked = true
        if (player[this.layer].unlocked) {
            if (player.t.rollCooldown[0] > 0) player.t.rollCooldown[0] -= diff
            if (player.t.rollCooldown[1] > 0) player.t.rollCooldown[1] -= diff
        }
    },

    // UI elements
    tabFormat: [
        "milestones",
        "main-display",
        ["display-text", () => `Your tokens are multiplying gain of matter and boxes by <h2 style="color: #9cd3b0; text-shadow: 0px 0px 10px #9cd3b0">${format(layers.t.tokensEffect())}</h2>x.`],
        "blank",
        ["display-text", () => `Rolled number: ${player.t.rand}`],
        ["display-text", () => `You rolled the color ${layers.t.colorify(player.t.rolled)}`],
        ["display-text", () => `Selected Color: ${layers.t.colorify(player.t.selection)}`],
        ["display-text", () => `Prize: ${formatWhole(layers.t.generation())} token${layers.t.generation().eq(1) ? `` : `s`}`],
        () => getBuyableAmount("t",13).gte(1) ? ["display-text", `<span style="color: #ff00ff">Current Streak: ${formatWhole(player.t.streak)}</span>`] : '',
        () => getBuyableAmount("t",13).gte(1) ? ["display-text", `<span style="color: #ff00ff">Streak Multiplier: ${format(layers.t.streakMult())}x</span>`] : '',
        ["clickables",[1,2]],
        "blank",
        ["display-text", () => `You can press "R" to roll!`],
        "blank",
        () => hasMilestone("t",1) ? ["display-text", `You rolled a <span style="color: #ffff00">${layers.t.checkDice()}</span>`] : '',
        () => hasMilestone("t",1) ? ["display-text", `Prize: <span style="color: #00ffff">${format(layers.t.diceSum())}</span> (sum of dice rolls) * <span style="color: #00ffff">${format(layers.t.diceMult())}</span> (extra mults) = <span style="color: #00ff00">${format(layers.t.diceSum().mul(layers.t.diceMult()))}</span>`] : '',
        () => hasMilestone("t",1) ? ["display-text", `Dice multiplier: <span style="color: #00ff00">${format(player.t.diceMult)}</span>x prize value`] : '',
        "grid",
        () => hasMilestone("t",1) ? ["clickables",[3]] : '',
        () => hasMilestone("t",1) ? "blank" : '',
        "buyables",
    ],
    buyables: {
        11: {
            title: "<h3>Gracious Croupier</h3>",
            cost(x) { return new Decimal(2).mul(Decimal.pow(5, x)) },
            display() { return `<span style="font-size:12px;">Double prize value.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} tokens<br>Effect: ${format(this.effect())}x prize value</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(2, getBuyableAmount(this.layer, this.id))},
        },
        12: {
            title: "<h3>Bonus Spin</h3>",
            cost(x) { return new Decimal(10).mul(Decimal.pow(4, x)) },
            display() { return `<span style="font-size:12px;">Divide the cooldown for wheel rolls by /1.2.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}/25<br>Cost: ${format(this.cost())} tokens<br>Effect: Cooldown is ${format(this.effect())}s</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            purchaseLimit: 25,
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.div(5, Decimal.pow(1.2, getBuyableAmount(this.layer, this.id))).toNumber()},
        },
        13: {
            title: "<h3>Lucky Streak</h3>",
            cost(x) { return new Decimal(50).mul(Decimal.pow(8, x)) },
            display() { return `<span style="font-size:12px;">Add 1 to the streak multiplier increase per win.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} tokens<br>Effect: Streak multiplier increase is ${formatWhole(this.effect())}</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return getBuyableAmount(this.layer, this.id)},
        },
        21: {
            title: "<h3>Weighted Wheel</h3>",
            cost(x) { return new Decimal(10000).mul(Decimal.pow(10, x)).mul(Decimal.pow(1.25, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Increase the chance to roll GREEN.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}/19<br>Cost: ${format(this.cost())} tokens<br>Effect: ${format(this.effect())}% GREEN chance</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            purchaseLimit: 19,
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return getBuyableAmount(this.layer, this.id).eq(0) ? 100/37 : Decimal.mul(getBuyableAmount(this.layer, this.id).add(18), 100/37)},
        },
        22: {
            title: "<h3>Extra Yahtzee</h3>",
            cost(x) { return new Decimal(1e20).mul(Decimal.pow(20, x)) },
            display() { return `<span style="font-size:12px;">Divide the cooldown for dice rolls by /1.2.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}/15<br>Cost: ${format(this.cost())} tokens<br>Effect: Cooldown is ${format(this.effect())}s</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            purchaseLimit: 15,
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.div(1, Decimal.pow(1.2, getBuyableAmount(this.layer, this.id))).toNumber()},
            unlocked() {return hasMilestone("t",1)},
        },
        23: {
            title: "<h3>Chance Square</h3>",
            cost(x) { return new Decimal(1e21).mul(Decimal.pow(50, x)).mul(Decimal.pow(1.25, x.pow(2))) },
            display() { return `<span style="font-size:12px;">Multiply dice multiplier gained per dice roll by 5.<br>Times Bought: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>Cost: ${format(this.cost())} tokens<br>Effect: ${format(this.effect())}x dice multiplier gain</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(5, getBuyableAmount(this.layer, this.id))},
            unlocked() {return hasMilestone("t",1)},
        },
    },
    milestones: {
        0: {
            requirementDescription() {return `${formatWhole(500)} tokens`},
            effectDescription: "Unlock Auto-Roll.",
            done() { return player.t.points.gte(500) },
            unlocked() { return getBuyableAmount("t",13).gte(1) },
            toggles: [
                ["t","autoRoll"],
            ],
        },
        1: {
            requirementDescription() {return `${formatWhole(1e12)} tokens`},
            effectDescription: "Unlock the dice minigame and 2 new buyables.",
            done() { return player.t.points.gte(1e12) },
            unlocked() { return hasMilestone("t",0) },
        },
        2: {
            requirementDescription() {return `${formatWhole(1e25)} tokens`},
            effectDescription: "Auto-Roll applies to the dice minigame and the first 3 dice are guaranteed to be the same number.",
            done() { return player.t.points.gte(1e25) },
            unlocked() { return hasMilestone("t",1) },
        },
    },
    clickables: {
        11: {
            display: `<h2 style="font-size:24px;">RED</h2>`,
            onClick() {
                player.t.selection = "RED"
            },
            canClick() {return true},
            style() {
                let style = {"width": "100px", "min-height": "100px"}
                style["background-color"] = "#960000" // hi flame :)
                return style
            },
        },
        12: {
            display: `<h2 style="font-size:24px;">BLACK</h2>`,
            onClick() {
                player.t.selection = "BLACK"
            },
            canClick() {return true},
            style() {
                let style = {"width": "100px", "min-height": "100px"}
                style["background-color"] = "#000000"
                style["color"] = "#ffffff"
                return style
            },
        },
        13: {
            display: `<h2 style="font-size:24px;">GREEN</h2>`,
            onClick() {
                player.t.selection = "GREEN"
            },
            canClick() {return true},
            style() {
                let style = {"width": "100px", "min-height": "100px"}
                style["background-color"] = "#00b500"
                return style
            },
        },
        21: {
            display() {return `<h2 style="font-size:20px;">Roll${player.t.rollCooldown[0] > 0 ? `<br>(${format(player.t.rollCooldown[0])}s)` : ``}</h2>`},
            onClick() {
                player.t.rand = Math.floor(Math.random() * 37)
                player.t.rolled = layers.t.rollWheel(player.t.rand)
                player.t.rollCooldown[0] = buyableEffect("t",12)
                if (player.t.rolled === player.t.selection) {
                    player.t.points = player.t.points.add(layers.t.generation())
                    player.t.streak++
                } else {
                    player.t.streak = 0
                }
            },
            canClick() {return player.t.rollCooldown[0] <= 0},
            style() {
                let style = {"width": "100px", "min-height": "100px"}
                return style
            },
        },
        31: {
            display() {return `<h2 style="font-size:20px;">Roll${player.t.rollCooldown[1] > 0 ? `<br>(${format(player.t.rollCooldown[1])}s)` : ``}</h2>`},
            onClick() {
                player.t.rollCooldown[1] = buyableEffect("t",22)
                for (let i = 101; i < 106; i++) {
                    player.t.grid[i] = Math.floor((Math.random() * 6) + 1)
                    if (hasMilestone("t",2) && i == 103) {
                        player.t.grid[101] = player.t.grid[i]
                        player.t.grid[102] = player.t.grid[i]
                    }
                }
                player.t.diceMult = player.t.diceMult.add(layers.t.diceSum().mul(layers.t.diceMult()))
            },
            canClick() {return player.t.rollCooldown[1] <= 0},
            style() {
                let style = {"width": "100px", "min-height": "100px"}
                return style
            },
        },
    },
    grid: {
        rows: 1,
        cols: 5,
        getStartData(id) {
            return 0
        },
        getUnlocked(id) {
            return hasMilestone("t",1)
        },
        getCanClick(data, id) {
            return false
        },
        getDisplay(data, id) {
            return data
        },
        getStyle(data, id) {
            const style = {}
            style["max-width"] = "100px"
            style["max-height"] = "100px"
            style["background-color"] = "#ffe8c8"
            style["font-size"] = "20px"
            return style
        }
    }
})