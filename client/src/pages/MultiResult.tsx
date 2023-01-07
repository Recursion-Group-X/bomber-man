import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const MultiResult: React.FC = () => {
  const location = useLocation()
  useEffect(() => {
    console.log(location.state.data)
  }, [])

  return <div>MultiResult</div>
}

export default MultiResult
