"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// これより下はBBS関係
app.post("/check", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  res.json( {number: bbs.length });
});

app.post("/read", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  const start = Number( req.body.start );
  console.log( "read -> " + start );
  if( start==0 ) res.json( {messages: bbs });
  else res.json( {messages: bbs.slice( start )});
});

app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  const image = req.body.image;
  const like = req.body.like;
  const reply = req.body.reply;
  console.log( [name, message, image, like, reply] );
  // 本来はここでDBMSに保存する
  bbs.push( { name: name, message: message, image:image, like:like, reply:reply } );
  res.json( {number: bbs.length } );
});

app.post("/like", (req, res) => {
  const id = req.body.id;
  bbs[id].like++;
  console.log( id+".like -> "+bbs[id].like );
  res.json( {like: bbs[id].like} );
});

app.post("/reply", (req, res) => {
  const id = req.body.id;

  console.log("reply -> " + id);
  res.json( {message: bbs[id]});
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
