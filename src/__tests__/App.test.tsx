import React from 'react'
import {render} from '@testing-library/react'
import App from '../App'

it('renders learn react link', () => {
  expect(() => {
    render(<App />)
  }).not.toThrow()
})
