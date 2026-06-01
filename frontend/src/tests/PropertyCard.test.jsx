import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard'

const mockProperty = {
  id: 1,
  title: 'Bel appartement à Paris',
  city: 'Paris',
  country: 'France',
  price_per_night: 85,
  property_type: 'apartment',
  max_guests: 4,
  bedrooms: 2,
  images: [{ image_url: 'https://example.com/image.jpg', is_main: true }],
}

describe('PropertyCard', () => {
  it('affiche le titre du logement', () => {
    render(<MemoryRouter><PropertyCard property={mockProperty} /></MemoryRouter>)
    expect(screen.getByText('Bel appartement à Paris')).toBeInTheDocument()
  })

  it('affiche la ville et le pays', () => {
    render(<MemoryRouter><PropertyCard property={mockProperty} /></MemoryRouter>)
    expect(screen.getByText('📍 Paris, France')).toBeInTheDocument()
  })

  it('affiche le prix par nuit', () => {
    render(<MemoryRouter><PropertyCard property={mockProperty} /></MemoryRouter>)
    expect(screen.getByText('85€ / nuit')).toBeInTheDocument()
  })

  it('affiche le nombre de chambres', () => {
    render(<MemoryRouter><PropertyCard property={mockProperty} /></MemoryRouter>)
    expect(screen.getByText(/2 chambres/i)).toBeInTheDocument()
  })
})
