import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Blog from './components/Blog';

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    id: 1,
    title: 'Component testing is done with react-testing-library',
    author: 'Dan Abramov',
    url: 'https://react-testing-library.com',
    likes: 7,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen'
    }
  };

  render(<Blog blog={blog} blogs={[]} setBlogs={() => {}} user={{ username: 'mluukkai' }} />);

  const titleElement = screen.getByText('Component testing is done with react-testing-library Dan Abramov');
  expect(titleElement).toBeDefined();

  const urlElement = screen.queryByText('https://react-testing-library.com');
  expect(urlElement).toBeNull();

  const likesElement = screen.queryByText('likes 7');
  expect(likesElement).toBeNull();
});
