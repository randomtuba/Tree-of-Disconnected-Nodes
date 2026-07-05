addLayer("m", {
    // general stuff
    name: "matter",
    symbol: "M",
    position: 0, // horizontal position
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        multiplier: [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
        power: [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
        particles: {
            protons: new Decimal(0), // boosts powers generation BUT hurts electron gain
            electrons: new Decimal(0), // divides matter multiplier costs BUT hurts proton gain
            muons: new Decimal(0), // divides 2nd electron effect BUT hurts tau particle gain
            tau: new Decimal(0), // boosts electron gain BUT hurts muon gain
            gluons: new Decimal(0), // raises the base output of the 1st slider
            photons: new Decimal(0), // raises the base output of the 2nd slider
        },
        slider: [0.5,0,0],
        sliderTime: 0,
        frozen: false,
    }},
    color: "#ff56f7",
    resource: "matter",
    type: "none",
    row: 0, // 0 is first row
    layerShown(){return true},

    // calculations
    gainMult() {
        mult = new Decimal(1)
        for (let i = 1; i < 7; i++) mult = mult.mul(layers.m.powerMult(i))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    generation() {
        return this.gainMult().pow(this.gainExp())
    },
    powerMult(x) {
        return new Decimal(player[this.layer].power[x]).sqrt().add(1)
    },
    powerGen(x) {
        let gen = Decimal.pow(2, player[this.layer].multiplier[x]).mul(player[this.layer].multiplier[x])
        gen = gen.mul(layers.m.particleEff("proton",1))
        gen = gen.mul(layers.f.fluidEffect())
        return gen
    },
    multiplierCost(x) {
        let cost = Decimal.pow(Decimal.pow(10, Decimal.pow(2, x - 1)), Decimal.add(player[this.layer].multiplier[x], 1))
        cost = cost.div(layers.m.particleEff("electron",1))
        return cost
    },
    particleGen(str) {
        switch (str) {
            case "proton":
                if ((player.m.slider[0] < 0.5 && hasMilestone("m",0)) || (hasMilestone("m",3) && player.m.slider[0] == 0.5)) {
                    let gen = Decimal.pow(2,((0.5 - player.m.slider[0]) * 4) ** 2).pow(layers.m.particleEff("gluon"))
                    if (hasMilestone("m",3) && player.m.slider[0] == 0.5) gen = Decimal.pow(16, layers.m.particleEff("gluon"))
                    gen = gen.div(layers.m.particleEff("electron",2))
                    gen = gen.mul(layers.f.vaporEffect())
                    return gen
                } else return new Decimal(0)
            break
            case "electron":
                if ((player.m.slider[0] > 0.5 && hasMilestone("m",0)) || (hasMilestone("m",3) && player.m.slider[0] == 0.5)) {
                    let gen = Decimal.pow(2,((player.m.slider[0] - 0.5) * 4) ** 2).pow(layers.m.particleEff("gluon"))
                    if (hasMilestone("m",3) && player.m.slider[0] == 0.5) gen = Decimal.pow(16, layers.m.particleEff("gluon"))
                    gen = gen.div(layers.m.particleEff("proton",2))
                    gen = gen.mul(layers.m.particleEff("tau",1))
                    gen = gen.mul(layers.f.vaporEffect())
                    return gen
                } else return new Decimal(0)
            break
            case "muon":
                if ((player.m.slider[1] < 0.5 && hasMilestone("m",1)) || (hasMilestone("m",4) && player.m.slider[1] == 0)) {
                    let gen = Decimal.mul(162, 0.5 - player.m.slider[1]).pow(layers.m.particleEff("photon"))
                    if (hasMilestone("m",4) && player.m.slider[1] == 0) gen = Decimal.pow(81, layers.m.particleEff("photon"))
                    gen = gen.div(layers.m.particleEff("tau",2))
                    gen = gen.mul(layers.f.vaporEffect())
                    return gen
                } else return new Decimal(0)
            break
            case "tau":
                if ((player.m.slider[1] > 0.5 && hasMilestone("m",1)) || (hasMilestone("m",4) && player.m.slider[1] == 0)) {
                    let gen = Decimal.mul(162, player.m.slider[1] - 0.5).pow(layers.m.particleEff("photon"))
                    if (hasMilestone("m",4) && player.m.slider[1] == 0) gen = Decimal.pow(81, layers.m.particleEff("photon"))
                    gen = gen.div(layers.m.particleEff("muon",2))
                    gen = gen.mul(layers.f.vaporEffect())
                    return gen
                } else return new Decimal(0)
            break
            case "gluon":
                let trueSlider = ((player.m.slider[2] + 0.02) / 2) + 0.5
                if (hasMilestone("m",2)) {
                    let gen
                    if (trueSlider > 0.4 && trueSlider < 0.6) gen = new Decimal(50)
                    else if (trueSlider < 0.4) gen = Decimal.sub(50, 50 * (1 - (trueSlider / 0.4)))
                    else if (trueSlider > 0.6) gen = Decimal.sub(50, 50 * ((trueSlider - 0.6) / 0.4))
                    gen = gen.mul(layers.f.vaporEffect())
                    return gen
                } else return new Decimal(0)
            break
        }
    },
    particleEff(str,x) {
        let type = player.m.particles[str + (str == "tau" ? "" : "s")]
        switch (str) {
            case "proton":
                if (x == 1) return type.pow(0.75).add(1)
                if (x == 2) return type.add(1).log10().add(1)
            break
            case "electron":
                if (x == 1) return type.cbrt().add(1)
                if (x == 2) return type.add(1).log10().add(1).div(layers.m.particleEff("muon",1))
            break
            case "muon":
                if (x == 1) return type.pow(1.5).add(1)
                if (x == 2) return type.add(1).log10().add(1)
            break
            case "tau":
                if (x == 1) return type.pow(1.5).add(1)
                if (x == 2) return type.add(1).log10().add(1)
            break
            case "gluon":
                return type.add(1).log10().add(1).ln().add(1)
            break
            case "photon":
                return type.add(1).log10().add(1).ln().add(1)
            break
        }
    },
    automate() {
      if (player.m.autoMults && hasMilestone("m",5)) {
        if (player.m.points.gte(layers.m.multiplierCost(1))) player.m.multiplier[1] = player.m.points.mul(layers.m.particleEff("electron",1)).log(10).floor()
        if (player.m.points.gte(layers.m.multiplierCost(2))) player.m.multiplier[2] = player.m.points.mul(layers.m.particleEff("electron",1)).log(100).floor()
        if (player.m.points.gte(layers.m.multiplierCost(3))) player.m.multiplier[3] = player.m.points.mul(layers.m.particleEff("electron",1)).log(10000).floor()
        if (player.m.points.gte(layers.m.multiplierCost(4))) player.m.multiplier[4] = player.m.points.mul(layers.m.particleEff("electron",1)).log(1e8).floor()
        if (player.m.points.gte(layers.m.multiplierCost(5))) player.m.multiplier[5] = player.m.points.mul(layers.m.particleEff("electron",1)).log(1e16).floor()
        if (player.m.points.gte(layers.m.multiplierCost(6))) player.m.multiplier[6] = player.m.points.mul(layers.m.particleEff("electron",1)).log(1e32).floor()
      }
    },
    update(diff) {
        player[this.layer].points = player[this.layer].points.add(this.generation().mul(diff))
        for (let i = 1; i < 7; i++) {
            player[this.layer].power[i] = player[this.layer].power[i].add(layers.m.powerGen(i).mul(diff))
        }
        player[this.layer].particles.protons = player[this.layer].particles.protons.add(layers.m.particleGen("proton").mul(diff))
        player[this.layer].particles.electrons = player[this.layer].particles.electrons.add(layers.m.particleGen("electron").mul(diff))
        player[this.layer].particles.muons = player[this.layer].particles.muons.add(layers.m.particleGen("muon").mul(diff))
        player[this.layer].particles.tau = player[this.layer].particles.tau.add(layers.m.particleGen("tau").mul(diff))
        if (player.m.frozen) player[this.layer].particles.gluons = player[this.layer].particles.gluons.add(layers.m.particleGen("gluon").mul(diff))
        if (player.m.frozen) player[this.layer].particles.photons = player[this.layer].particles.photons.add(layers.m.particleGen("gluon").mul(diff))
        if (!player.m.frozen) player[this.layer].slider[1] -= diff / (hasMilestone("m",2) ? 10 : 50)
        player[this.layer].slider[1] = Math.max(player[this.layer].slider[1],0)
        if (hasMilestone("m",2) && !player.m.frozen) player[this.layer].sliderTime += 0.05
        if (hasMilestone("m",2) && !player.m.frozen) player[this.layer].slider[2] += Math.cos(player.m.sliderTime)*0.05
    },

    // UI elements
    tabFormat: [
        "milestones",
        "main-display",
        ["display-text", () => `You are getting ${format(layers.m.generation())} matter per second.`],
        "buyables",
        "blank",
        ["display-text", () => `You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[1])}</h2> Tier 1 Matter Multipliers.<br>You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[1])}</h2> Tier 1 power. (${format(layers.m.powerGen(1))}/sec)<br>(Multiplier: ${format(layers.m.powerMult(1))}x)`],
        ["clickables", [1]],
        "blank",
        () => player.m.multiplier[1].gt(0) ? ["display-text", `You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[2])}</h2> Tier 2 Matter Multipliers.<br>You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[2])}</h2> Tier 2 power. (${format(layers.m.powerGen(2))}/sec)<br>(Multiplier: ${format(layers.m.powerMult(2))}x)`] : '',
        () => player.m.multiplier[1].gt(0) ? ["clickables", [2]] : '',
        "blank",
        () => player.m.multiplier[2].gt(0) ? ["display-text", `You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[3])}</h2> Tier 3 Matter Multipliers.<br>You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[3])}</h2> Tier 3 power. (${format(layers.m.powerGen(3))}/sec)<br>(Multiplier: ${format(layers.m.powerMult(3))}x)`] : '',
        () => player.m.multiplier[2].gt(0) ? ["clickables", [3]] : '',
        "blank",
        () => player.m.multiplier[3].gt(0) ? ["display-text", `You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[4])}</h2> Tier 4 Matter Multipliers.<br>You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[4])}</h2> Tier 4 power. (${format(layers.m.powerGen(4))}/sec)<br>(Multiplier: ${format(layers.m.powerMult(4))}x)`] : '',
        () => player.m.multiplier[3].gt(0) ? ["clickables", [4]] : '',
        "blank",
        () => player.m.multiplier[4].gt(0) ? ["display-text", `You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[5])}</h2> Tier 5 Matter Multipliers.<br>You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[5])}</h2> Tier 5 power. (${format(layers.m.powerGen(5))}/sec)<br>(Multiplier: ${format(layers.m.powerMult(5))}x)`] : '',
        () => player.m.multiplier[4].gt(0) ? ["clickables", [5]] : '',
        "blank",
        () => player.m.multiplier[5].gt(0) ? ["display-text", `You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[6])}</h2> Tier 6 Matter Multipliers.<br>You have <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[6])}</h2> Tier 6 power. (${format(layers.m.powerGen(6))}/sec)<br>(Multiplier: ${format(layers.m.powerMult(6))}x)`] : '',
        () => player.m.multiplier[5].gt(0) ? ["clickables", [6]] : '',
        "blank",
        () => hasMilestone("m",0) ? ["bar","slider1"] : '',
        () => hasMilestone("m",0) ? ["clickables",[7]] : '',
        () => hasMilestone("m",0) ? ["display-text", `<span style="color: #72e0ff">You have ${format(player.m.particles.protons)} protons, multiplying gain of Matter Multiplier powers by ${format(layers.m.particleEff("proton",1))}x<br>and dividing electron gain by /${format(layers.m.particleEff("proton",2))}.</span>`] : '',
        "blank",
        () => hasMilestone("m",0) ? ["display-text", `<span style="color: #ff7272">You have ${format(player.m.particles.electrons)} electrons, dividing the cost of Matter Multipliers by /${format(layers.m.particleEff("electron",1))}<br>and dividing proton gain by /${formatSmall(layers.m.particleEff("electron",2))}.</span>`] : '',
        "blank",
        () => hasMilestone("m",1) ? ["bar","slider2"] : '',
        () => hasMilestone("m",1) ? ["clickables",[8]] : '',
        () => hasMilestone("m",1) ? ["display-text", `This slider naturally decays.`] : '',
        "blank",
        () => hasMilestone("m",1) ? ["display-text", `<span style="color: #ffc95d">You have ${format(player.m.particles.muons)} muons, dividing the 2nd electron effect by /${format(layers.m.particleEff("muon",1))}<br>and dividing tau particle gain by /${format(layers.m.particleEff("muon",2))}.</span>`] : '',
        "blank",
        () => hasMilestone("m",1) ? ["display-text", `<span style="color: #85fe84">You have ${format(player.m.particles.tau)} tau particles, multiplying electron gain by ${format(layers.m.particleEff("tau",1))}x<br>and dividing muon gain by /${format(layers.m.particleEff("tau",2))}.</span>`] : '',
        "blank",
        () => hasMilestone("m",2) ? ["bar","slider3"] : '',
        () => hasMilestone("m",2) ? ["clickables",[9]] : '',
        () => hasMilestone("m",2) ? ["display-text", `Freezing this slider in the center will provide the max production.`] : '',
        () => hasMilestone("m",2) ? ["display-text", `Freezing the 3rd slider also freezes the 2nd slider.`] : '',
        "blank",
        () => hasMilestone("m",2) ? ["display-text", `<span style="color: #c56fff">You have ${format(player.m.particles.gluons)} gluons, raising the base output of the 1st slider by ^${format(layers.m.particleEff("gluon"))}.</span>`] : '',
        "blank",
        () => hasMilestone("m",2) ? ["display-text", `<span style="color: #fffd74">You have ${format(player.m.particles.photons)} photons, raising the base output of the 2nd slider by ^${format(layers.m.particleEff("photon"))}.</span>`] : '',
        "blank",
        "blank",
    ],
    milestones: {
        0: {
            requirementDescription() {return `${format(1e7)} matter`},
            effectDescription: "Unlock the first slider.",
            done() { return player.m.points.gte(1e7) },
            unlocked() { return player.m.multiplier[3].gt(0) },
        },
        1: {
            requirementDescription() {return `${format(1e21)} matter`},
            effectDescription: "Unlock the second slider.",
            done() { return player.m.points.gte(1e21) },
            unlocked() { return player.m.multiplier[5].gt(0) },
        },
        2: {
            requirementDescription() {return `${format(1e44)} matter`},
            effectDescription: "Unlock the third slider, and the second slider decays faster.",
            done() { return player.m.points.gte(1e44) },
            unlocked() { return player.m.multiplier[6].gt(0) },
        },
        3: {
            requirementDescription() {return `${format(1e60)} matter`},
            effectDescription: "You can produce protons and electrons when the 1st slider is centered.",
            done() { return player.m.points.gte(1e60) },
            unlocked() { return hasMilestone("m",2) },
        },
        4: {
            requirementDescription() {return `${format(1e80)} matter`},
            effectDescription: "You can produce muons and tau particles when the 2nd slider is empty.",
            done() { return player.m.points.gte(1e80) },
            unlocked() { return player.f.unlocked },
        },
        5: {
            requirementDescription() {return `${format(1e120)} matter`},
            effectDescription: "Autobuy Multiplier Multipliers without consuming matter.",
            done() { return player.m.points.gte(1e120) },
            unlocked() { return player.f.unlocked },
            toggles: [
                ["m","autoMults"],
            ],
        },
    },
    clickables: {
        11: {
            display() {return `Buy for ${format(layers.m.multiplierCost(1))} matter`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(1))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(1))
                player.m.multiplier[1] = player.m.multiplier[1].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        21: {
            display() {return `Buy for ${format(layers.m.multiplierCost(2))} matter`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(2))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(2))
                player.m.multiplier[2] = player.m.multiplier[2].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        31: {
            display() {return `Buy for ${format(layers.m.multiplierCost(3))} matter`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(3))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(3))
                player.m.multiplier[3] = player.m.multiplier[3].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        41: {
            display() {return `Buy for ${format(layers.m.multiplierCost(4))} matter`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(4))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(4))
                player.m.multiplier[4] = player.m.multiplier[4].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        51: {
            display() {return `Buy for ${format(layers.m.multiplierCost(5))} matter`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(5))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(5))
                player.m.multiplier[5] = player.m.multiplier[5].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        61: {
            display() {return `Buy for ${format(layers.m.multiplierCost(6))} matter`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(6))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(6))
                player.m.multiplier[6] = player.m.multiplier[6].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        71: {display: `<h2><-</h2>`,onClick() {player.m.slider[0] -= 0.25},canClick() {return player.m.slider[0] > 0},style() {return {"width": "75px", "min-height": "75px"}},},
        72: {display: `<h2>-></h2>`,onClick() {player.m.slider[0] += 0.25},canClick() {return player.m.slider[0] < 1},style() {return {"width": "75px", "min-height": "75px"}},},
        81: {display: `<h2>-></h2>`,onClick() {player.m.slider[1] += 0.2; player.m.slider[1] = Math.min(player.m.slider[1],1)},canClick() {return player.m.slider[1] < 1},style() {return {"width": "75px", "min-height": "75px"}},},
        91: {display() {return `<h3>${player.m.frozen ? `Unfreeze` : `Freeze`}</h3>`},onClick() {player.m.frozen = !player.m.frozen},canClick() {return true},style() {return {"width": "75px", "min-height": "75px"}},},
    },
    bars: {
        slider1: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return player.m.slider[0]},
            display: () => `Producing ${format(layers.m.particleGen("proton"))} protons and ${format(layers.m.particleGen("electron"))} electrons per second`,
            fillStyle() { return {"background-color": "#c00eb7"} },
        },
        slider2: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return player.m.slider[1]},
            display: () => `Producing ${format(layers.m.particleGen("muon"))} muons and ${format(layers.m.particleGen("tau"))} tau particles per second`,
            fillStyle() { return {"background-color": "#680b63"} },
        },
        slider3: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return ((player.m.slider[2] + 0.02) / 2) + 0.5},
            display: () => `${player.m.frozen ? `Producing ${format(layers.m.particleGen("gluon"))} gluons and photons per second` : `Will start producing when frozen`}`,
            fillStyle() { return {"background-color": "#a94ea6"} },
        },
    },
})