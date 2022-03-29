import React, { useEffect, useState } from 'react'
import { Modal, Button, Row, Col, Container, Stack } from 'react-bootstrap'
import { Bar } from 'react-chartjs-2'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import ChartDataLabels from 'chartjs-plugin-datalabels'

import { useLocalStorage } from 'components/useLocalStorage'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)

const Stat = (props) => (
  <div style={{ width: '60px' }} {...props}>
    <h4 className="text-center">{props.stat}</h4>
    <h6 className="text-center">{props.label}</h6>
  </div>
)

const StatsModal = (props) => {
  const [played, setPlayed] = useState(0)
  const [wins, setWins] = useState(0)

  useEffect(() => {
    let played = props.stats.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    )
    setPlayed(played)
    setWins(played - props.stats[6])
  }, [props.stats])

  return (
    <Modal {...props}>
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">STATS</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Stack
            direction="horizontal"
            gap={4}
            className="mx-auto justify-content-center align-items-start"
          >
            <Stat stat={played} label={'Played'} />
            <Stat stat={parseInt((wins / played) * 100 || 0)} label={'Win %'} />
            <Stat stat={props.currentStreak} label={'Current Streak'} />
            <Stat stat={props.maxStreak} label={'Max Streak'} />
          </Stack>
          <hr />
          <Bar
            options={{
              indexAxis: 'y',
              tooltips: {
                enabled: false,
              },
              legend: {
                display: false,
              },
              scales: {
                x: {
                  display: false,
                  grid: {
                    display: false,
                  },
                },
                y: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: 'white',
                  },
                },
              },
              responsive: true,
              plugins: {
                tooltip: {
                  enabled: false,
                },
                legend: {
                  display: false,
                },
                datalabels: {
                  formatter: (value) => {
                    return value > 0 ? value : ''
                  },
                  anchor: 'end',
                  align: 'start',
                  labels: {
                    value: {
                      color: 'white',
                    },
                  },
                },
              },
            }}
            data={{
              labels: ['1', '2', '3', '4', '5', '6'],
              datasets: [
                {
                  label: 'TEST',
                  data: props.stats.slice(0, 6),
                  backgroundColor: ['#3498db'],
                },
              ],
            }}
          />
        </Container>
      </Modal.Body>
    </Modal>
  )
}

StatsModal.displayName = 'StatsModal'

export default StatsModal
