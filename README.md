# Bomb Game
This is a Bomb Game inspired by "Bomber Man" that is a game where players can move and place bombs on a square stage and survive longer there.
The game offers two styles of play: single player and multi-player. In the single player mode, you can play a game in which you try to survive as long as possible by using bombs to kill the enemies that keep appearing on the stage. Compete with other users to win first place!

Multi-player mode allows up to 4 people to play at the same time, and we are offering 4 rooms for you, so this allows up to 16 players to play!
In this mode, players try to hit their bombs each other and the last surviving player wins! Break the blocks to get as many items as possible and take advantage of the game!

このゲームはコンピュータサイエンス学習プラットフォームである[Recursion](https://recursionist.io/)のチーム開発イベントによって作成されました。
ソロプレイとマルチプレイの両方があり、ソロプレイでは湧き出てくるエネミーを爆弾で倒しながらできるだけステージ内に長く生き残ることが目的です。
ランキング機能も搭載されているので、ほかのプレイヤーたちとスコアを競い合うことができます。
マルチプレイではリアルタイムで最大1ルームにつき4人のプレイヤーでバトルすることができます。アイテムを獲得して、ほかプレイヤーを爆発に巻き込み勝利を目指しましょう！

# How to Play
Use Arrow keys (Up, Down, Left, Right) to move. Put a bomb by punching the space key!

十字キーで移動、スペースキーで爆弾を設置

# Technical
We use a Two-dimensional array to manage a stage. Players and Enemies are painted on a canvas using JavaScript. Restrict player movement, acquire items and place bombs based on stage conditions. We use useIntervals to move players and enemies, based on the directional keys entered by the user.
For Multi-Player mode, [Socket.io](https://github.com/socketio) was our best choice. We connect frontend to a server by using the tool and made it possible to play this game smoothly.

TypeScript, React, Socket.io, Node.js, Google Cloud

# Link
https://bomb-game.netlify.app/

### Images
images we used in this game are from [OpenGameArt](https://opengameart.org/content/bomb-party-the-complete-set)

### Demo Video
<img src="https://user-images.githubusercontent.com/109770597/215923438-1e4cca6f-91cf-4abb-8a93-58e7b3f71e10.gif" width="700" height="400"/>
