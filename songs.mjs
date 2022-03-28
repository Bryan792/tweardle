import axios from 'axios'
import fs from 'fs'
import shuffle from 'shuffle-array'
;(async () => {
  let final = []
  let next =
    'https://api-v2.soundcloud.com/users/208004596/tracks?representation=&limit=100&offset=0&linked_partitioning=1'
  do {
    let result = (
      await axios.get(
        next +
          '&client_id=u8V3dqZ2Fiu0ciuXebiXDmUpKEeVEDmw&app_version=1647868284&app_locale=e'
      )
    ).data
    let songList = result.collection
    for (let {
      title,
      duration,
      full_duration,
      permalink_url,
      policy,
      label_name,
      artwork_url,
      publisher_metadata,
    } of songList) {
      console.log(
        title,
        duration,
        full_duration,
        policy,
        permalink_url,
        label_name,
        artwork_url,
        publisher_metadata.album_title
      )
      if (
        policy !== 'SNIP' &&
        label_name &&
        (label_name.startsWith('WM') ||
          label_name.startsWith('Republic Records')) &&
        !title.toLowerCase().includes('instrumental')
      ) {
        console.log('included')
        final.push({
          title,
          full_duration,
          album: publisher_metadata.album_title,
          artwork_url,
          permalink_url,
        })
      }
    }
    console.log(songList.length)
    console.log(result.next_href)
    next = result.next_href
  } while (next != null)
  shuffle(final)
  console.log(final.length)
  fs.writeFileSync('songs.json', JSON.stringify(final, null, 2))
})()
