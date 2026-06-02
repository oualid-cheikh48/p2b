import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../components/Navbar'

// Mock du store
vi.mock('../store/authStore', () => ({
  default: () => ({
    user: null,
    logout: vi.fn(),
  }),
}))

describe('Navbar', () => {
  it('affiche le logo ETNAir', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>)
    expect(screen.getByText(/P2B/i)).toBeInTheDocument()
  })

  it('affiche les liens Connexion et Inscription quand non connecté', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>)
    expect(screen.getByText('Connexion')).toBeInTheDocument()
    expect(screen.getByText("S'inscrire")).toBeInTheDocument()
  })

  it('affiche le lien Logements', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>)
    expect(screen.getByText('Logements')).toBeInTheDocument()
  })
})
