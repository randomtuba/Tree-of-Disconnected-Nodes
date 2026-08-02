addLayer("ach", {
    // general stuff
    name: "achievements",
    symbol: "★",
    position: 0, // horizontal position
    startData() { return {
        unlocked: true,
    }},
    color: "#999999",
    tooltip: "Achievements",
    type: "none",
    row: "side", // side layer
    layerShown(){return true},

    // UI elements
    tabFormat: [
        () => !player.f.unlocked ? ["display-text", `Nothing to see here as of now...`] : '',
        () => player.f.unlocked ? ["display-text", `You unlock one row for every node unlocked and one column for every other node unlocked.`] : '',
        "blank",
        () => player.f.unlocked ? "achievements" : '',
    ],
    achievements: {
        11: {
            name: "Floating point overflow",
            done() {return player.m.points.gte(Decimal.pow(2, 1024))},
            tooltip() {return `Reach ${format(Decimal.pow(2, 1024))} matter.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#ff56f7"; return style},
        },
        12: {
            name: "Strong interactions",
            done() {return player.m.particles.gluons.gte(1e128)},
            tooltip() {return `Reach ${format(1e128)} gluons.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#ff56f7"; return style},
            unlocked() {return player.s.unlocked},
        },
        21: {
            name: "Skynet",
            done() {return player.f.singularities.gte(1e9)},
            tooltip() {return `Reach ${format(1e9)} singularities.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#6cc9fe"; return style},
        },
        22: {
            name: "Things are heating up",
            done() {return player.f.planckPoints.gte(1e21)},
            tooltip() {return `Reach ${format(1e21)} Planck points.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#6cc9fe"; return style},
            unlocked() {return player.s.unlocked},
        },
        31: {
            name: "Conway's weeds",
            done() {return layers.c.upgraderTileCount() >= 80},
            tooltip() {return `Have at least ${formatWhole(80)} upgrader tiles.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#8c51d8"; return style},
            unlocked() {return player.c.unlocked}
        },
        32: {
            name: "Unconditional loop",
            done() {return hasMilestone("c",6)},
            tooltip() {return `Get the 7th chips milestone.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#8c51d8"; return style},
            unlocked() {return player.s.unlocked},
        },
        41: {
            name: "Extrusion",
            done() {return player.s.dimensionUpgrades[3].gte(3)},
            tooltip() {return `Reach a primary string depth of 3m.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#2ec766"; return style},
            unlocked() {return player.s.unlocked}
        },
        42: {
            name: "Quint-essential",
            done() {return player.s.stringTypes[5].gte(55555)},
            tooltip() {return `Reach ${format(55555)} quinary strings.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#2ec766"; return style},
            unlocked() {return player.s.unlocked}
        },
    },
})

addLayer("help", {
    // general stuff
    name: "help",
    symbol: "?",
    position: 1, // horizontal position
    startData() { return {
        unlocked: true,
    }},
    color: "#ffffff",
    tooltip: "Help",
    type: "none",
    row: "side", // side layer
    layerShown(){return true},

    // UI format
    tabFormat: {
        "About": {
            content: [
                ["display-text", () => `Note: This is not a tutorial menu, it is the help menu.`],
            ],
        },
        "Matter": {
            buttonStyle: {
                "border-color": "#ff56f7",
            },
            content: [
                ["display-text", () => `I awoke in a vast, formless void. At first, I was unable to open my eyes. Carefully, my eyelids receded and lifted. It was initially difficult to tell whether my eyes were open or closed.<br><br>
                I tried moving. I attempted to flail my arms, but they stood still. My limbs felt encased in rock, as if the weight of the world was tied to me. I tried shaking my legs, but they too refused to comply with my intentions.<br><br>
                After a while, I thought about using my voice. I called out, desperate for an answer.<br><br>
                "Is anyone there? I need help!" I tried to say, but it came out muffled. It was like a hand was pressed to my mouth. My throat felt tight.<br><br>
                The abyss gave no response.<br><br>
                "I'm all alone! I can't move! Please, someone help me!" I thought.<br><br>
                I wanted to scream, but I could not. I wanted tears to run down my face, to feel something, but even the ducts in my eyes refused to move my tears.<br><br>
                "Please..."<br><br>
                If reality exists in the mind, then my mind was empty. Nothing but darkness encompassed my perception. Yet, there was so much pressure around me.<br><br>
                I believed that the world around me was conspiring against me to break my resolve. It wanted me to shake my fist at my fate and hopelessly surrender to the void. But I will not comply! Just as my body refuses to obey me, I will not stand down to what is thrown at me. I will escape this prison...this torment!<br><br>
                At some moment, I will find out how to move. And I will get out of here.<br><br>
                Can you hear me?`],
            ],
        },
        "Fluid": {
            unlocked() {return player.f.unlocked},
            buttonStyle: {
                "border-color": "#6cc9fe",
            },
            content: [
                ["display-text", () => `I think I've discovered something. Due to my limited senses, I didn't realize the feeling at first. It's as if this place is the only stimuli I've ever experienced. Such a stifling location will do that to you.<br><br>
                I was at the bottom of an endless ocean. Dark waters stretched all around me. The sea constricted me, compressing my lungs until they could not retaliate. I felt the sand underneath my feet, the tiny pebbles sliding between my toes, bustling toward some unknown destination.<br><br>
                For a while, I slowly trained myself to move my legs again. Now aware of the water around me, I slowly waded my legs through the currents. I drifted my feet around to kick the sand. I so badly wanted to feel texture any way I could.<br><br>
                I was bored. My mind began to drift. I typically pace when I'm trying to make sense of my thoughts; unfortunately, I didn't have that luxury at the moment.<br><br>
                For most of my life, I have felt pressure on top of me. Whether that was good grades, kind behavior, or the right perception, I followed. I want others to be happy. Why can't I say the same for myself?<br><br>
                Think about this for a moment. Have you ever sacrificed your own well-being for the convenience of others?<br><br>
                I sometimes feared that I would inevitably work a job that I hated; worse, I would never be hired because of a nonexistent market. I even thought that I wasn't supposed to exist in this world, and that it rejects me, for its systems were not designed with me in mind. Perhaps that's why I was trapped here.<br><br>
                I tried to take a deep breath, yet I choked on the water as it rushed into my throat. I coughed. That's the first time I was able to shout.<br><br>
                I attempted to clear my head. Let's shift to an optimistic perspective.<br><br>
                I genuinely believe that the world will get better over time. New concepts will be normalized, more opportunities will be accessible, and technology will improve.<br><br>
                Despite whatever pressures you have mounted on yourself, please remember that the future is uncertain, so you can be the one to shape it.`],
            ],
        },
        "Chips": {
            unlocked() {return player.c.unlocked},
            buttonStyle: {
                "border-color": "#8c51d8",
            },
            content: [
                ["display-text", () => `Within this new environment, I eventually regained the ability to move around freely. The more that I exercised my muscles in this pressurized location, the more that my limbs adjusted to become useful again.<br><br>
                At one point, I grew curious. I stretched my left leg forward, slowly pressing my foot down into the sand. Then, I consciously made my left leg into a pivot. Picking up my right leg, I was able to place my foot down further than my left foot. I had figured out how to walk!<br><br>
                Every now and then, I walked around and explored my new habitat. I made sure to draw a circle in the sand from where I had first spawned. Initially, I only traveled a few meters forward and then retreated anxiously. But as I continued my movements, I became more daring with my pathing.<br><br>
                Ten meters. Twenty meters. Fifty meters. At some point, I decided that I was going to keep moving forward in a straight line. I would refuse to walk back until I found something interesting. Now that I had sealed my mental pact, I gazed wistfully into the horizon of the undersea and began my long trek.<br><br>
                For a long time, I didn't see anything but the preexisting water and sand that I had unfortunately grown accustomed to. However, this changed when I was approximately 300 meters into my journey.<br><br>
                There was a light. A blinking green light, far away from me. But I could still see it. I grew so excited that at some point my body forgot to recognize the pressure around me.<br><br>
                I attempted to jump, and my feet were lifted off the ground. However, I didn't fall back down. I flailed my arms, and yet they only pushed me forward. At that moment, I realized that I was able to freely swim.<br><br>
                I kept swimming and reached the green light. It was coming from a small computer on a desk. Alongside the computer was a keyboard and mouse. Why was this here at the bottom of the ocean? It probably didn't even work. But why was the setup so neatly put together?<br><br>
                This reminds me about something. Humans naturally want to figure out the solutions to everything. Oftentimes, forcing neat answers to all of life's questions forms a misconstrued picture.<br><br>
                Many of us so badly want to pretend that we are fully rational creatures. However, in the farthest corners of our brains, there exists an irrational mind. One with thoughts, desires, and emotions that we cannot fully understand. We try to logically reason through why these thoughts are wrong or irrelevant; yet, they continue to return.<br><br>
                I think I just need to accept that my world is inherently irrational, too.`],
            ],
        },
        "Strings": {
            unlocked() {return player.s.unlocked},
            buttonStyle: {
                "border-color": "#2ec766",
            },
            content: [
                ["display-text", () => `Carefully sitting down in the desk chair that was in front of me, I began to stare blankly at the empty computer monitor. After traveling this distance, I was relieved to have time to consider my steps going forward.<br><br>
                Would this computer work underwater? If so, what's on it? Would it help me at all? I guess there was only one way to find out.<br><br>
                I pressed the power button and began to hear a soft whirring. I had only heard the sound of the water moving around me for so long, so my ears were sensitive to this newfound noise. I welcomed this new stimulus.<br><br>
                Believe me, I was in shock when the monitor flashed brightly. I ignored any questions that poured into my mind regarding how the computer was working while submerged at this depth because I was unaware of how I awoke sumberged at this depth, too.<br><br>
                Unfortunately, the computer did not possess an operating system. The white screen transitioned into an old-school terminal. A green ">" symbol with a flickering bar demanded my attention.<br><br>
                I didn't know any computer programming, so I didn't know if I would get anywhere. I tried to type one simple command, hoping that it worked.<br><br>
                <span style="color:#00ff00">"> start"</span><br>
                <span style="color:#ff0000">"ERROR: Invalid command. Type 'help' for available commands."</span><br><br>
                Well, that seemed like good advice.<br><br>
                <span style="color:#00ff00">"> help"</span><br>
                <span style="color:#00ff00">"AVAILABLE COMMANDS: help, matter, fluid, chips, strings"</span><br><br>
                I thought to myself that those were overly specific and strange commands. Nevertheless, I ignored that sentiment and tried each command in succession. I was surprised to see that the pages that were displayed were my thoughts relating to my oceanic imprisonment.<br><br>
                I read the starting words of the "matter" page. "I awoke in a vast, formless void. At first, I was unable to open my eyes..."<br><br>
                My head felt heavy. I felt like I was going to be sick. After some additional reading, I typed the last available command.<br><br>
                <span style="color:#00ff00">"> strings"</span><br><br>
                Rather than there being paragraphs displayed, a 3D ASCII display of a fluctuating grid appeared. Some text was written out at the bottom the screen, claiming that this was a quantum physics simulation.<br><br>
                You know, after reading some of my transcribed thoughts through these commands, I recognize that I may come across as preachy or pretentious, as if I think I'm describing very deep or original feelings or perspectives that no one's ever said before when I'm actually making a fool out of myself. The truth is that I simply want to get out of here, okay?`],
            ],
        },
    },
})