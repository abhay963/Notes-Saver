import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='flex flex-row gap-4 place-content-evenly mb-2'>
    <NavLink to='/'>
    Home
    </NavLink>

    <NavLink
    to='/pastes'
    >
    Pastes
    </NavLink>
    </div>
  )
}

export default Navbar
