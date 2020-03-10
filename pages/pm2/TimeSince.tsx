import { StatelessComponent, useState, useEffect, Fragment } from 'react'
import { timeSince } from '~modules/utils/common'

export const TimeSince: StatelessComponent<{ t: any }> = props => {
  const [time, setTime] = useState(timeSince(props.t))
  useEffect(() => {
    setTime(timeSince(props.t))
  }, [props.t])
  useEffect(() => {
    let timer = setInterval(() => {
      setTime(timeSince(props.t))
    }, 1e3)
    return () => clearInterval(timer)
  }, [props.t])
  return <Fragment>{time}</Fragment>
}
