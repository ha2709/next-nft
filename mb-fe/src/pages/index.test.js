import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './Home';

describe('Home Component', () => {
  test('renders input fields and button', () => {
    render(<Home />);

    const nameInput = screen.getByPlaceholderText(' Enter Name ');
    const descriptionInput = screen.getByPlaceholderText('Enter Description');
    const nricInput = screen.getByPlaceholderText('Enter NRIC');
    const fileInput = screen.getByRole('button', { name: 'Asset' });
    const createButton = screen.getByRole('button', { name: 'Create NFT' });

    expect(nameInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(nricInput).toBeInTheDocument();
    expect(fileInput).toBeInTheDocument();
    expect(createButton).toBeInTheDocument();
  });

  test('user can input values and create NFT', () => {
    render(<Home />);

    const nameInput = screen.getByPlaceholderText(' Enter Name ');
    const descriptionInput = screen.getByPlaceholderText('Enter Description');
    const nricInput = screen.getByPlaceholderText('Enter NRIC');
    const fileInput = screen.getByRole('button', { name: 'Asset' });
    const createButton = screen.getByRole('button', { name: 'Create NFT' });

    fireEvent.change(nameInput, { target: { value: 'Test Name' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(nricInput, { target: { value: '123456789' } });
    fireEvent.change(fileInput, {
      target: {
        files: [new File(['test'], 'test.png', { type: 'image/png' })],
      },
    });

    fireEvent.click(createButton);

    // Add your assertion here to check if the NFT is created successfully or not.
  });
});
