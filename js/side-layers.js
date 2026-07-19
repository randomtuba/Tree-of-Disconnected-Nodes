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
        21: {
            name: "Skynet",
            done() {return player.f.singularities.gte(1e9)},
            tooltip() {return `Reach ${format(1e9)} singularities.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#6cc9fe"; return style},
        },
        31: {
            name: "Conway's weeds",
            done() {return layers.c.upgraderTileCount() >= 80},
            tooltip() {return `Have at least ${formatWhole(80)} upgrader tiles.`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#8c51d8"; return style},
            unlocked() {return player.c.unlocked}
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
    },
})