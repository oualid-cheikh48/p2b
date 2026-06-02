import { render, screen, fireEvent } from '@testing-library/react'
import Toast from '../components/Toast'

describe('Toast', () => {
  it('affiche le message', () => {
    render(<Toast message="Erreur de connexion" type="error" onClose={() => {}} />)
    expect(screen.getByText('Erreur de connexion')).toBeInTheDocument()
  })

  it('appelle onClose quand on clique sur le bouton fermer', () => {
    const mockClose = vi.fn()
    render(<Toast message="Test" type="success" onClose={mockClose} />)
    
    fireEvent.click(screen.getByText('✕'))
    expect(mockClose).toHaveBeenCalled()
  })

  it('affiche le bon style pour le type success', () => {
    const { container } = render(<Toast message="Succès" type="success" onClose={() => {}} />)
    expect(container.firstChild).toHaveClass('text-green-400')
  })

  it('affiche le bon style pour le type error', () => {
    const { container } = render(<Toast message="Erreur" type="error" onClose={() => {}} />)
    expect(container.firstChild).toHaveClass('text-red-400')
  })
})
