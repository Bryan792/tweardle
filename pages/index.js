import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {
  useEffect,
  useState
} from 'react'
import ReactPlayer from 'react-player'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import {
  Stack,
  Image
} from 'react-bootstrap'
import {
  Typeahead
} from 'react-bootstrap-typeahead' // ES2015

import Header from 'components/Header'
import GuessList from 'components/GuessList'
import InfoModal from 'components/InfoModal'
import StatsModal from 'components/StatsModal'
import Countdown from 'components/Countdown'

import {
  useLocalStorage
} from 'components/useLocalStorage'

import NoSSRWrapper from 'components/no-ssr-wrapper'

import * as Icon from 'react-bootstrap-icons'

const attemptLength = [1, 2, 3, 4, 8, 16]

const STATUS_PENDING = 'PENDING'
const STATUS_SOLVED = 'SOLVED'
const STATUS_FAILED = 'FAILED'

const NewGameState = {
  gameNumber: -1,
  guesses: [],
  status: STATUS_PENDING,
}

const Home = props => {
  useEffect(() => {
  }, [props.songs])

  let [playing, setPlaying] = useState(false)

  const [gameState, setGameState] = useLocalStorage(
    'gameState',
    NewGameState
  )

  //const [guesses, setGuesses] = useState([])
  //const [guesses, setGuesses] = useLocalStorage('guesses', [])
  const [stats, setStats] = useLocalStorage('stats', [0, 0, 0, 0, 0, 0, 0])
  const [currentStreak, setCurrentStreak] = useLocalStorage(
    'currentStreak',
    0
  )
  const [maxStreak, setMaxStreak] = useLocalStorage('maxStreak', 0)

  let [selected, setSelected] = useState([])
  let [playerReady, setPlayerReady] = useState(false)

  let [showInfo, setShowInfo] = useState(false)
  let [showStats, setShowStats] = useState(false)

  let [answer, setAnswer] = useState(()=>{

    let songs = props.songs

    let randomSong = songs[Math.floor(Math.random() * songs.length)]

    function getDateDifference(e, a) {
      var s = new Date(e),
        t = new Date(a).setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0)
      return Math.floor(t / 864e5)
    }

    var baseDate = new Date(2015, 9, 20, 0, 0, 0, 0)

    var today = new Date()
    today.setDate(today.getDate())
    //let daysSince = Math.floor(today.getMinutes() / 2)
    let daysSince = getDateDifference(baseDate,today)
    let sotdIndex = daysSince % songs.length
    let sotd = songs[sotdIndex]
    //let sotd = randomSong

    let offset = daysSince % (parseInt(sotd.full_duration / 1000) - 30)

    var releaseDate = new Date(2022, 2, 26, 0, 0, 0, 0)
    //let gameNumber = Math.floor(today.getMinutes() / 2)
    let gameNumber = getDateDifference(releaseDate, today)
    return {
        gameNumber,
        ...sotd,
        offset
      }
  })

  useEffect(() => {
    if (answer.gameNumber != gameState.gameNumber) {
      //reset game
      setGameState({ ...NewGameState,
        gameNumber: answer.gameNumber
      })
    }
    if (
      answer.gameNumber - gameState.gameNumber > 1 ||
      gameState.status !== STATUS_SOLVED
    ) {
      setCurrentStreak(0)
    }
  })

  let handlePause = () => {
    setPlaying(!playing)
  }

  let [player, setPlayer] = useState()

  let ref = player => {
    setPlayer(player)
  }

  let handleProgress = state => {
    if (
      state.playedSeconds - answer.offset >=
      attemptLength[gameState.guesses.length] &&
      gameState.status === STATUS_PENDING
    ) {
      setPlaying(false)
    }
  }

  let handlePlay = state => {
    if (gameState.status === STATUS_PENDING) player.seekTo(answer.offset)
    else player.seekTo(0)
  }

  let handleGuess = guess => {
    if (!guess) return

    let newGuesses = [...gameState.guesses, guess]
    let status = gameState.status

    if (guess === answer.title) {
      //solved
      let newStats = [...stats]
      newStats[gameState.guesses.length]++
        setStats(newStats)
      setCurrentStreak(currentStreak + 1)
      setMaxStreak(Math.max(currentStreak + 1, maxStreak))
      status = STATUS_SOLVED
    } else if (newGuesses.length === attemptLength.length) {
      //failed
      let newStats = [...stats]
      newStats[6]++
        setStats(newStats)
      setCurrentStreak(0)
      status = STATUS_FAILED
    }
    setGameState({ ...gameState,
      guesses: newGuesses,
      status: status
    })
    setSelected([])
  }

  return (
    <NoSSRWrapper>
      <div>
        <style global jsx>{`
          html,
          body,
          body > div:first-child,
          div#__next,
          div#__next > div {
            height: 100%;
          }
        `}</style>

        <Head>
          <title>TWeardle {answer.gameNumber}</title>
        </Head>

        <main className={[styles.fill, 'container-md', 'pb-3'].join(' ')}>
          <Stack gap={2} className={styles.fill}>
            <Header
              onClickInfo={() => setShowInfo(true)}
              onClickStats={() => setShowStats(true)}
            />
            <GuessList
              guesses={gameState.guesses}
              answer={answer.title}
            />
            {gameState.status !== STATUS_PENDING && (
              <>
                <Card bg="secondary" className="p-2">
                <Stack direction="horizontal" gap={3}
              className="justify-content-around">
                  <Countdown />
                  <Button
                    variant="primary"
                    onClick={() => {
                      let shareText = `TWeardle ${gameState.gameNumber}\n\n`
                      if (gameState.status === STATUS_SOLVED) shareText += '🔊'
                      else shareText += '🔇'
                      for (let i = 0; i < 6; i++) {
                        let guess = gameState.guesses[i]
                        if (!guess) shareText += '⬜'
                        else if (guess === 'Skipped') shareText += '⬛'
                        else if (guess === answer.title) shareText += '🟩'
                        else shareText += '🟥'
                      }
                      shareText += '\nhttps://tweardle.bryanching.net/'
                      navigator.clipboard.writeText(shareText)
                    }}
                  >
                    Share <Icon.Share />
                  </Button>
                </Stack>
              </Card>

                <Card bg="secondary" className="p-1">
                <Stack
                  direction="horizontal"
                  gap={3}
                >
                  <Image
                    thumbnail
                    fluid
                    style={{ height: '7rem' }}
                    src={answer.artwork_url.replace('large', 't500x500')}
                  />
                  <div className="mx-auto">
                    <h3>{answer.title + '\n'}</h3>
                    <small className="text-muted">{answer.album}</small>
                  </div>
                </Stack>
                </Card>
              </>
            )}
            {playerReady && (
              <>
                {gameState.status === STATUS_PENDING && (
                  <Form>
                    <Form.Group className="mb-3" controlId="formGuess">
                      <Typeahead
                        id="guess"
                        onChange={selected => {
                          setSelected(selected)
                        }}
                        maxResults={5}
                        paginate={false}
                        paginationText="get rid of me"
                        options={props.titleList || []}
                        placeholder="Guess"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleGuess(selected[0])
                          }
                        }}
                        selected={selected}
                        dropup={true}
                      />
                    </Form.Group>
                  </Form>
                )}

                <Stack direction="horizontal" gap={3}>
                  {gameState.status === STATUS_PENDING && (
                    <Button
                      variant="secondary"
                      onClick={() => handleGuess('Skipped')}
                    >
                      {gameState.guesses.length < attemptLength.length - 1
                        ? 'Skip'
                        : 'Give Up'}
                    </Button>
                  )}

                  {!playing ? (
                    <Icon.PlayCircle
                      size={50}
                      role="button"
                      className="mx-auto"
                      onClick={handlePause}
                    />
                  ) : (
                    <Icon.StopCircle
                      size={50}
                      role="button"
                      className="mx-auto"
                      onClick={handlePause}
                    />
                  )}

                  {gameState.status === STATUS_PENDING && (
                    <Button
                      variant="success"
                      onClick={() => handleGuess(selected[0])}
                    >
                      Submit
                    </Button>
                  )}
                </Stack>
              </>
            )}
          </Stack>
          <ReactPlayer
            volume={0.25}
            url={answer.permalink_url}
            ref={ref}
            playing={playing}
            style={{ display: 'none' }}
            onProgress={handleProgress}
            progressInterval={100}
            onReady={() => {
              setPlayerReady(true)
            }}
            onStart={() => {
              player.seekTo(answer.offset)
            }}
            onPlay={handlePlay}
          />

          <InfoModal
            show={showInfo}
            onHide={() => {
              setShowInfo(false)
            }}
            centered
          />
          <StatsModal
            show={showStats}
            onHide={() => {
              setShowStats(false)
            }}
            centered
            stats={stats}
            currentStreak={currentStreak}
            maxStreak={maxStreak}
          />
        </main>
      </div>
    </NoSSRWrapper>
  )
}

import fs from 'fs'
export async function getStaticProps(context) {
  let songs = JSON.parse(fs.readFileSync('songs.json'))
  return {
    props: {
      songs,
      titleList: songs.map(song => song.title),
    },
  }
}

export default Home
