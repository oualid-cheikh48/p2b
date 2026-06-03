import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '../components/SearchBar'

describe('SearchBar', () => {
  it('affiche le champ de recherche', () => {
    render(<SearchBar onSearch={() => {}} />)
    expect(screen.getByPlaceholderText('Rechercher une ville, un pays...')).toBeInTheDocument()
  })

  it('appelle onSearch avec la bonne valeur', () => {
    const mockSearch = vi.fn()
    render(<SearchBar onSearch={mockSearch} />)
    
    const input = screen.getByPlaceholderText('Rechercher une ville, un pays...')
    fireEvent.change(input, { target: { value: 'Paris' } })
    fireEvent.submit(input.closest('form'))
    
    expect(mockSearch).toHaveBeenCalledWith('Paris')
  })

  it('affiche le bouton Rechercher', () => {
    render(<SearchBar onSearch={() => {}} />)
    expect(screen.getByText('Rechercher')).toBeInTheDocument()
  })
})
