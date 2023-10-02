import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

import {
  Stack,
  Image,
  Form,
  Button,
  Card,
  Spinner,
  Toast,
  ToastContainer,
} from 'react-bootstrap'

import { Typeahead } from 'react-bootstrap-typeahead' // ES2015

import Header from 'components/Header'
import GuessList from 'components/GuessList'
import InfoModal from 'components/InfoModal'
import StatsModal from 'components/StatsModal'
import Countdown from 'components/Countdown'

import { useLocalStorage } from 'components/useLocalStorage'

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

const Home = (props) => {
  useEffect(() => {}, [props.songs])

  let [playing, setPlaying] = useState(false)

  const [gameState, setGameState] = useLocalStorage('gameState', NewGameState)

  //const [guesses, setGuesses] = useState([])
  //const [guesses, setGuesses] = useLocalStorage('guesses', [])
  const [stats, setStats] = useLocalStorage('stats', [0, 0, 0, 0, 0, 0, 0])
  const [currentStreak, setCurrentStreak] = useLocalStorage('currentStreak', 0)
  const [maxStreak, setMaxStreak] = useLocalStorage('maxStreak', 0)

  let [selected, setSelected] = useState([])
  let [playerReady, setPlayerReady] = useState(false)

  let [showInfo, setShowInfo] = useState(false)
  let [showStats, setShowStats] = useState(false)

  let [answer, setAnswer] = useState(() => {
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
    let daysSince = getDateDifference(baseDate, today)
    let sotdIndex = daysSince % songs.length
    let sotd = songs[sotdIndex]
    //let sotd = randomSong

    let offset = daysSince % (parseInt(sotd.duration / 1000) - 20)

    var releaseDate = new Date(2022, 2, 26, 0, 0, 0, 0)
    //let gameNumber = Math.floor(today.getMinutes() / 2)
    let gameNumber = getDateDifference(releaseDate, today)
    return {
      gameNumber,
      ...sotd,
      offset,
    }
  })

  const [url, setUrl] = useState()

  const [toastStatus, setToastStatus] = useState({
    text: '',
    show: false,
    bg: 'Primary',
  })

  useEffect(() => {
    function status(res) {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return res
    }

    let clientid = 'ryYoIJGNq7Iz9rpzj1pDIeWYIrke9OYw'

    Promise.any([
      fetch( 
        'https://corsproxy.io/?' + encodeURIComponent(answer.hlsUrl +
          `?client_id=${clientid}&app_version=1647868284&app_locale=e`)
      ).then(status),
    ])
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url)
      })
  }, [answer.hlsUrl])

  useEffect(() => {
    if (answer.gameNumber != gameState.gameNumber) {
      //reset game
      setGameState({ ...NewGameState, gameNumber: answer.gameNumber })
    }
    if (
      answer.gameNumber - gameState.gameNumber > 1 ||
      gameState.status !== STATUS_SOLVED
    ) {
      setCurrentStreak(0)
    }
  }, [answer.gameNumber])

  let handlePause = () => {
    setPlaying(!playing)
  }

  let [player, setPlayer] = useState()

  let ref = (player) => {
    setPlayer(player)
  }

  let handleProgress = (state) => {
    if (
      state.playedSeconds - answer.offset >=
        attemptLength[gameState.guesses.length] &&
      gameState.status === STATUS_PENDING
    ) {
      setPlaying(false)
    }
  }

  let handlePlay = (state) => {
    if (gameState.status === STATUS_PENDING) player.seekTo(answer.offset)
    else player.seekTo(0)
  }

  let handleGuess = (guess) => {
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
      setToastStatus({
        text: 'Bust out the Candybong',
        show: true,
        bg: 'success',
      })
    } else if (newGuesses.length === attemptLength.length) {
      //failed
      let newStats = [...stats]
      newStats[6]++
      setStats(newStats)
      setCurrentStreak(0)
      status = STATUS_FAILED
      setToastStatus({
        text: 'Are you even a ONCE?',
        show: true,
        bg: 'danger',
      })
    }
    setGameState({ ...gameState, guesses: newGuesses, status: status })
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
          <title>TWeardle (the other TWICE Heardle)</title>
        </Head>

        <main className={[styles.fill, 'container-md'].join(' ')}>
          <Stack gap={2} className={styles.fill}>
            <Header
              onClickInfo={() => setShowInfo(true)}
              onClickStats={() => setShowStats(true)}
            />
            <GuessList guesses={gameState.guesses} answer={answer.title} />
            {gameState.status !== STATUS_PENDING && (
              <>
                <Card bg="secondary" className="p-2">
                  <Stack
                    direction="horizontal"
                    gap={3}
                    className="justify-content-around"
                  >
                    <Countdown />
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => {
                        let shareText = `TWeardle (the other TWICE Heardle) ${gameState.gameNumber}\n\n`
                        if (gameState.status === STATUS_SOLVED)
                          shareText += '🔊'
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
                        setToastStatus({
                          text: 'Copied to clipboard',
                          show: true,
                          bg: 'info',
                        })
                      }}
                    >
                      Share <Icon.Share />
                    </Button>
                  </Stack>
                </Card>

                <Card bg="secondary" className="p-1">
                  <Stack direction="horizontal" gap={3}>
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
            {playerReady ? (
              <div className="bg-dark p-3">
                {gameState.status === STATUS_PENDING && (
                  <Form>
                    <Form.Group className="mb-3" controlId="formGuess">
                      <Typeahead
                        id="guess"
                        onChange={(selected) => {
                          setSelected(selected)
                        }}
                        maxResults={5}
                        paginate={false}
                        paginationText="get rid of me"
                        options={props.titleList || []}
                        placeholder="Guess"
                        minLength={1}
                        onKeyDown={(e) => {
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
              </div>
            ) : (
              <Spinner animation="border" role="status" className="mx-auto">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
          </Stack>
          <ReactPlayer
            volume={0.25}
            url={url}
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
          <ToastContainer className="p-3" position="middle-center">
            <Toast
              onClose={() => {
                setToastStatus({ show: false })
              }}
              show={toastStatus.show}
              delay={2000}
              autohide
              bg={toastStatus.bg}
            >
              <Toast.Body>{toastStatus.text}</Toast.Body>
            </Toast>
          </ToastContainer>
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
      titleList: songs.map((song) => song.title),
    },
  }
}

export default Home
