import moment from 'moment'
moment().format()
import { useCallback, useEffect, useRef, useState } from 'react'

const calculateDuration = () => {
  let now = moment()
  return moment.duration(
    now
      .clone()
      .endOf('day')
      .diff(now)
  )
}

export default function Countdown() {
  const [duration, setDuration] = useState(calculateDuration())
  const timerRef = useRef(0)
  const timerCallback = useCallback(() => {
    setDuration(calculateDuration())
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(timerCallback, 1000)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div>
      <h6 className="text-center">Next TWeardle</h6>
      <h3 className="text-center">{moment.utc(duration.asMilliseconds()).format('HH:mm:ss')}</h3>
    </div>
  )
}
