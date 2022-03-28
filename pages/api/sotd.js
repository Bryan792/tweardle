// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from 'fs'

let songs = JSON.parse(fs.readFileSync('songs.json'))

export default function handler(req, res) {
  res.status(200).json(songs[Math.floor(Math.random() * songs.length)])
}
