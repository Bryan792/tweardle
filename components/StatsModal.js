import React, { useEffect, useState } from 'react'
import { Modal, Button, Row, Col, Container, Stack } from 'react-bootstrap'
import { Bar } from 'react-chartjs-2'

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js'

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

const Stat = props => (
  <div {...props}>
    <div className="text-center">{props.stat}</div>
    <div className="text-center">{props.label}</div>
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
        <Modal.Title>STATS</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack
    direction="horizontal"
    gap={3}
    className="mx-auto justify-content-center"
    >
          <Stat stat={played} label={'Played'} />
          <Stat
    stat={parseInt((wins / played) * 100 || 0)}
    label={'Win %'}
    />
          <Stat stat={props.currentStreak} label={'Current Streak'} />
          <Stat stat={props.maxStreak} label={'Max Streak'} />
        </Stack>

        <Bar
    options={{
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          display: false,
          grid: {
            display: false,
          },
        },
      },
      responsive: true,
      plugins: {
        tooltip: {
          enabled: false
        },
        legend: {
          display: false
        },
        datalabels: {
          formatter: value => {
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
          backgroundColor: [
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 0, 1)',
          ],
        },
      ],
    }}
    />
      </Modal.Body>
    </Modal>
  )
}

StatsModal.displayName = 'StatsModal'

export default StatsModal
