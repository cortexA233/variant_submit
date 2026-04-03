# Devlog

## About My Game
* My game's name is _Dance Streamer Simulator_. It is a hyper-casual clicker game that tests players' reaction speed.
* The Game is about performing as a dance streamer live in front of an audience. In each round, the crowd gives you a cue about the kind of dance/switch they want, and you have to quickly choose between two dance styles.
* If you successfully match the crowd’s expectation, your HYPE goes up, your CRASH goes down, when your combo increase, the audience will send you positive comments on the screen.
* Conversely, If your choice don't match the cue, your HYPE goes down, your CRASH goes up. And audience will send negative comments to you. 
* If you CRASH surpass 100 or HYPE goes to 0, you will fail.
* In addition, you will IMMEDIATELY FAIL if you don't give your choice in the time limit.
* As the game goes on, the timer gets shorter, so the pacing becomes more intense. 
* The core fantasy is managing audience expectations in a live performance and staying in rhythm under pressure.


## Timeline
### 2026/3/31 5pm
* Received the Gameplay take-home email.
### 2026/3/31 - 2026/4/1
* Brainstormed 2 ideas.
* start to do some playground and experiment stuff with Phaser.
### 2026/4/1 10pm
* Began to implement.
### 2026/4/2
* Implemented basic gameplay.
### 2026/4/3 12am
* Polished and submitted. 



## One technical challenge I hit with Phaser or Spine
One technical challenge I hit with Phaser was UI architecture. Unlike Unity’s UGUI or Unreal’s UMG, Phaser doesn’t really provide a complete built-in UI management framework, so things like UI components, hierarchy, and lifecycle management had to be handled manually. Since I only spent around 20 hours on this project (including brainstorming and game design), I didn’t have enough time to build a proper UI framework. In the end, I mainly separated different parts of the UI into different classes, such as the start page, HUD, interaction layer, and result page. That was enough to keep the project moving, but it didn't completely solve the problems in UI management and limited reusability. If I had more time, I would definitely invest in a more structured and reusable UI layer.

## What I’d add with another ~48 hours  
I’d separate my answer into 2 parts: On technical side and gameplay side.

* On the technical side:
  * I’d spend more time improving code structure and responsibility separation. The current `GameScene` already uses an FSM to organize flow logic, but a lot of the logic still remains inside `GameScene` instead of being pushed into the individual state classes, so readability and maintainability can still be improved.
  * For the UI, I’d also like to abstract a reusable set of base UI components and page classes. Right now, most of the UI is directly built with Phaser’s native component like `text`, `rectangle` and `graphics`, so reusability and scalability are still quite limited. That would be one of the main areas I’d refine next.

* On the gameplay side: 
  * I’d build a deeper and more dynamic stat system. Right now, the game only really has binary success and failure values, but I’d like different dance moves to have different numerical effects, with more randomness and more meaningful trade-offs. I’d probably take some inspiration from _Reigns_ to make the system feel more strategic and layered.
  * I’d also continue polishing the mechanical feel so the game feels juicier and more satisfying moment to moment.
