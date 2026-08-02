addLayer("s", {
    // general stuff
    name: "strings",
    symbol: "S",
    position: 0, // horizontal position
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        stringTypes: [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
        dimensionUpgrades: [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)], // 20 total
        flavor: [],
    }},
    color: "#2ec766",
    requires: new Decimal(1e49),
    resource: "strings",
    baseResource: "chips", // resource required to unlock
    baseAmount() {return player.c.points},
    type: "none",
    row: 1, // 0 is first row
    layerShown(){return hasMilestone("c",3)},

    // calculations
    gainMult() {
        mult = new Decimal(1)
        mult = mult.mul(layers.s.stringTypeEffect(1))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    generation() {
        return this.gainMult().pow(this.gainExp())
    },
    stringTypeGen(x) {
        switch (x) {
            case 1:
                if (player.s.dimensionUpgrades[1].eq(0)) return new Decimal(0)
                else return Decimal.pow(1.5,player.s.dimensionUpgrades[1]).mul(Decimal.pow(2,player.s.dimensionUpgrades[2])).mul(Decimal.pow(2.5,player.s.dimensionUpgrades[3])).mul(Decimal.pow(3,player.s.dimensionUpgrades[4])).mul(layers.s.stringTypeEffect(2)).mul(player.s.flavor.includes(2) ? 100 : 1)
            break;
            case 2:
                if (player.s.dimensionUpgrades[5].eq(0)) return new Decimal(0)
                else return Decimal.pow(1.5,player.s.dimensionUpgrades[5]).mul(Decimal.pow(2,player.s.dimensionUpgrades[6])).mul(Decimal.pow(2.5,player.s.dimensionUpgrades[7])).mul(Decimal.pow(3,player.s.dimensionUpgrades[8])).mul(layers.s.stringTypeEffect(3)).mul(player.s.flavor.includes(2) ? 100 : 1)
            break;
            case 3:
                if (player.s.dimensionUpgrades[9].eq(0)) return new Decimal(0)
                else return Decimal.pow(1.5,player.s.dimensionUpgrades[9]).mul(Decimal.pow(2,player.s.dimensionUpgrades[10])).mul(Decimal.pow(2.5,player.s.dimensionUpgrades[11])).mul(Decimal.pow(3,player.s.dimensionUpgrades[12])).mul(layers.s.stringTypeEffect(4)).mul(player.s.flavor.includes(2) ? 100 : 1)
            break;
            case 4:
                if (player.s.dimensionUpgrades[13].eq(0)) return new Decimal(0)
                else return Decimal.pow(1.5,player.s.dimensionUpgrades[13]).mul(Decimal.pow(2,player.s.dimensionUpgrades[14])).mul(Decimal.pow(2.5,player.s.dimensionUpgrades[15])).mul(Decimal.pow(3,player.s.dimensionUpgrades[16])).mul(layers.s.stringTypeEffect(5)).mul(player.s.flavor.includes(2) ? 100 : 1)
            break;
            case 5:
                if (player.s.dimensionUpgrades[17].eq(0)) return new Decimal(0)
                else return Decimal.pow(1.5,player.s.dimensionUpgrades[17]).mul(Decimal.pow(2,player.s.dimensionUpgrades[18])).mul(Decimal.pow(2.5,player.s.dimensionUpgrades[19])).mul(Decimal.pow(3,player.s.dimensionUpgrades[20])).mul(player.s.flavor.includes(2) ? 100 : 1)
            break;
        }
    },
    stringTypeEffect(x) {
        switch (x) {
            case 1:
                return player.s.stringTypes[1].pow(player.s.flavor.includes(1) ? 1.275 : 1.25).add(1)
            break;
            case 2:
                return player.s.stringTypes[2].pow(player.s.flavor.includes(1) ? 1.275 : 1.25).add(1)
            break;
            case 3:
                return player.s.stringTypes[3].pow(player.s.flavor.includes(1) ? 1.275 : 1.25).add(1)
            break;
            case 4:
                return player.s.stringTypes[4].pow(player.s.flavor.includes(1) ? 1.275 : 1.25).add(1)
            break;
            case 5:
                return player.s.stringTypes[5].pow(player.s.flavor.includes(1) ? 1.275 : 1.25).add(1)
            break;
        }
    },
    stringsEffect() {
        return player.s.points.pow(1.25).add(1)
    },
    getStringName(x) {
        let arr = ["","primary","secondary","tertiary","quaternary","quinary"]
        return arr[x]
    },
    dimensionCost(type, x) {
        let amt = player.s.dimensionUpgrades[((type-1)*4) + x]
        let cost = new Decimal(0)
        if (type == 1) cost = Decimal.mul(Decimal.pow(10, x), Decimal.pow(Decimal.pow(6, x), amt)).mul(Decimal.pow(1.5, amt.pow(2)))
        if (type == 2) cost = Decimal.mul(Decimal.mul(1e8, Decimal.pow(100, x-1)), Decimal.pow(Decimal.pow(12, x), amt)).mul(Decimal.pow(1.5, amt.pow(2)))
        if (type == 3) cost = Decimal.mul(Decimal.mul(1e18, Decimal.pow(1000, x-1)), Decimal.pow(Decimal.pow(18, x), amt)).mul(Decimal.pow(1.5, amt.pow(2)))
        if (type == 4) cost = Decimal.mul(Decimal.mul(1e140, Decimal.pow(100000, x-1)), Decimal.pow(Decimal.pow(10000, x), amt)).mul(Decimal.pow(2, amt.pow(2)))
        if (type == 5) cost = Decimal.mul(Decimal.mul(1e205, Decimal.pow(1e10, x-1)), Decimal.pow(Decimal.pow(1e8, x), amt)).mul(Decimal.pow(2, amt.pow(2)))
        if (x == 4) cost = cost.mul(1e40)
        if (player.s.flavor.includes(3)) cost = cost.div(100000)
        return cost
    },
    update(diff) {
        if (!player[this.layer].unlocked && player.c.points.gte(1e49)) player[this.layer].unlocked = true
        if (player[this.layer].unlocked) {
            player.s.points = player.s.points.add(layers.s.generation().mul(diff))
            Vue.set(player.s.stringTypes, 1, player.s.stringTypes[1].add(layers.s.stringTypeGen(1).mul(diff)))
            Vue.set(player.s.stringTypes, 2, player.s.stringTypes[2].add(layers.s.stringTypeGen(2).mul(diff)))
            Vue.set(player.s.stringTypes, 3, player.s.stringTypes[3].add(layers.s.stringTypeGen(3).mul(diff)))
            Vue.set(player.s.stringTypes, 4, player.s.stringTypes[4].add(layers.s.stringTypeGen(4).mul(diff)))
            Vue.set(player.s.stringTypes, 5, player.s.stringTypes[5].add(layers.s.stringTypeGen(5).mul(diff)))
        }
    },

    // UI elements
    tabFormat: [
        "milestones",
        "main-display",
        ["display-text", () => `Your strings are multiplying bytes generation by <h2 style="color: #2ec766; text-shadow: 0px 0px 10px #2ec766">${format(layers.s.stringsEffect())}</h2>x.`],
        ["display-text", () => `You are getting ${format(layers.s.generation())} string${layers.s.generation().eq(1) ? `` : `s`} per second.`],
        () => hasMilestone("s",1) ? "blank" : '',
        () => hasMilestone("s",1) ? ["display-text", `You can only have ${hasMilestone("s",3) ? `up to three` : `one`} string flavor${hasMilestone("s",3) ? `s` : ``} active at a time. Click a string flavor to activate it.`] : '',
        () => hasMilestone("s",1) ? ["clickables",[6]] : '',
        "blank",
        ["strings-table", () => player],
        "buyables",
    ],
    milestones: {
        0: {
            requirementDescription() {return `${format(1e50)} strings`},
            effectDescription: "Unlock a new dimension upgrade for all string types.",
            done() { return player.s.points.gte(1e50) },
            unlocked() { return player.s.dimensionUpgrades[9].gte(1) },
        },
        1: {
            requirementDescription() {return `${format(1e81)} strings`},
            effectDescription: "Unlock the Up and Top string flavors.",
            done() { return player.s.points.gte(1e81) },
            unlocked() { return hasMilestone("s",0) },
        },
        2: {
            requirementDescription() {return `${format(1e142)} strings`},
            effectDescription: "Unlock the Charm string flavor and a new string type.",
            done() { return player.s.points.gte(1e142) },
            unlocked() { return hasMilestone("s",1) },
        },
        3: {
            requirementDescription() {return `${format(1e210)} strings`},
            effectDescription: "Unlock a new string type and you can activate up to 3 string flavors.",
            done() { return player.s.points.gte(1e210) },
            unlocked() { return hasMilestone("s",2) },
        },
    },
    clickables: {
        11: {
            display() {return `Buy for ${format(layers.s.dimensionCost(1,1))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(1,1))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(1,1))
                Vue.set(player.s.dimensionUpgrades, 1, player.s.dimensionUpgrades[1].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        12: {
            display() {return `Buy for ${format(layers.s.dimensionCost(1,2))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(1,2))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(1,2))
                Vue.set(player.s.dimensionUpgrades, 2, player.s.dimensionUpgrades[2].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        13: {
            display() {return `Buy for ${format(layers.s.dimensionCost(1,3))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(1,3))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(1,3))
                Vue.set(player.s.dimensionUpgrades, 3, player.s.dimensionUpgrades[3].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        14: {
            display() {return `Buy for ${format(layers.s.dimensionCost(1,4))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(1,4))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(1,4))
                Vue.set(player.s.dimensionUpgrades, 4, player.s.dimensionUpgrades[4].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        21: {
            display() {return `Buy for ${format(layers.s.dimensionCost(2,1))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(2,1))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(2,1))
                Vue.set(player.s.dimensionUpgrades, 5, player.s.dimensionUpgrades[5].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        22: {
            display() {return `Buy for ${format(layers.s.dimensionCost(2,2))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(2,2))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(2,2))
                Vue.set(player.s.dimensionUpgrades, 6, player.s.dimensionUpgrades[6].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        23: {
            display() {return `Buy for ${format(layers.s.dimensionCost(2,3))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(2,3))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(2,3))
                Vue.set(player.s.dimensionUpgrades, 7, player.s.dimensionUpgrades[7].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        24: {
            display() {return `Buy for ${format(layers.s.dimensionCost(2,4))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(2,4))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(2,4))
                Vue.set(player.s.dimensionUpgrades, 8, player.s.dimensionUpgrades[8].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        31: {
            display() {return `Buy for ${format(layers.s.dimensionCost(3,1))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(3,1))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(3,1))
                Vue.set(player.s.dimensionUpgrades, 9, player.s.dimensionUpgrades[9].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        32: {
            display() {return `Buy for ${format(layers.s.dimensionCost(3,2))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(3,2))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(3,2))
                Vue.set(player.s.dimensionUpgrades, 10, player.s.dimensionUpgrades[10].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        33: {
            display() {return `Buy for ${format(layers.s.dimensionCost(3,3))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(3,3))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(3,3))
                Vue.set(player.s.dimensionUpgrades, 11, player.s.dimensionUpgrades[11].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        34: {
            display() {return `Buy for ${format(layers.s.dimensionCost(3,4))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(3,4))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(3,4))
                Vue.set(player.s.dimensionUpgrades, 12, player.s.dimensionUpgrades[12].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        41: {
            display() {return `Buy for ${format(layers.s.dimensionCost(4,1))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(4,1))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(4,1))
                Vue.set(player.s.dimensionUpgrades, 13, player.s.dimensionUpgrades[13].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        42: {
            display() {return `Buy for ${format(layers.s.dimensionCost(4,2))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(4,2))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(4,2))
                Vue.set(player.s.dimensionUpgrades, 14, player.s.dimensionUpgrades[14].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        43: {
            display() {return `Buy for ${format(layers.s.dimensionCost(4,3))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(4,3))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(4,3))
                Vue.set(player.s.dimensionUpgrades, 15, player.s.dimensionUpgrades[15].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        44: {
            display() {return `Buy for ${format(layers.s.dimensionCost(4,4))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(4,4))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(4,4))
                Vue.set(player.s.dimensionUpgrades, 16, player.s.dimensionUpgrades[16].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        51: {
            display() {return `Buy for ${format(layers.s.dimensionCost(5,1))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(5,1))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(5,1))
                Vue.set(player.s.dimensionUpgrades, 17, player.s.dimensionUpgrades[17].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        52: {
            display() {return `Buy for ${format(layers.s.dimensionCost(5,2))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(5,2))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(5,2))
                Vue.set(player.s.dimensionUpgrades, 18, player.s.dimensionUpgrades[18].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        53: {
            display() {return `Buy for ${format(layers.s.dimensionCost(5,3))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(5,3))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(5,3))
                Vue.set(player.s.dimensionUpgrades, 19, player.s.dimensionUpgrades[19].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        54: {
            display() {return `Buy for ${format(layers.s.dimensionCost(5,4))} strings`},
            canClick() {return player.s.points.gte(layers.s.dimensionCost(5,4))},
            onClick() {
                player.s.points = player.s.points.sub(layers.s.dimensionCost(5,4))
                Vue.set(player.s.dimensionUpgrades, 20, player.s.dimensionUpgrades[20].add(1))
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        61: {
            display: `<h2>Up</h2>`,
            tooltip: `Increases the string type effect exponent (^1.25 -> ^1.275)`,
            onClick() {
                if (player.s.flavor.includes(1)) {
                    player.s.flavor.splice(player.s.flavor.indexOf(1), 1)
                } else {
                    player.s.flavor.push(1)
                }
            },
            canClick() {return player.s.flavor.length < (hasMilestone("s",3) ? 3 : 1) || player.s.flavor.includes(1)},
            style() {
                let style = {"width": "75px", "min-height": "75px"}
                if (player.s.flavor.includes(1)) style["background-color"] = "red"
                else if (player.s.flavor.length < (hasMilestone("s",3) ? 3 : 1)) style["background-color"] = "#ffaaaa"
                return style
            },
        },
        62: {
            display: `<h2>Top</h2>`,
            tooltip: `Multiplies gain of all string types by 100 (excluding regular strings)`,
            onClick() {
                if (player.s.flavor.includes(2)) {
                    player.s.flavor.splice(player.s.flavor.indexOf(2), 1)
                } else {
                    player.s.flavor.push(2)
                }
            },
            canClick() {return player.s.flavor.length < (hasMilestone("s",3) ? 3 : 1) || player.s.flavor.includes(2)},
            style() {
                let style = {"width": "75px", "min-height": "75px"}
                if (player.s.flavor.includes(2)) style["background-color"] = "blue"
                else if (player.s.flavor.length < (hasMilestone("s",3) ? 3 : 1)) style["background-color"] = "#aaaaff"
                return style
            },
        },
        63: {
            display: `<h2>Charm</h2>`,
            tooltip: `Divides cost of all dimension upgrades by 100,000`,
            onClick() {
                if (player.s.flavor.includes(3)) {
                    player.s.flavor.splice(player.s.flavor.indexOf(3), 1)
                } else {
                    player.s.flavor.push(3)
                }
            },
            canClick() {return player.s.flavor.length < (hasMilestone("s",3) ? 3 : 1) || player.s.flavor.includes(3)},
            style() {
                let style = {"width": "75px", "min-height": "75px"}
                if (player.s.flavor.includes(3)) style["background-color"] = "#00ff00"
                else if (player.s.flavor.length < (hasMilestone("s",3) ? 3 : 1)) style["background-color"] = "#aaffaa"
                return style
            },
            unlocked() {return hasMilestone("s",2)}
        },
    },
})