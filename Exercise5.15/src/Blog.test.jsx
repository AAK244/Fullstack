import axios from 'axios';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Blog from './components/Blog';

vi.mock('axios');

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    id: 1,
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 0,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  };

  const setBlogs = vi.fn();

  axios.put.mockResolvedValue({ data: { ...blog, likes: 1 } });

  render(<Blog blog={blog} blogs={[blog]} setBlogs={setBlogs} user={{ username: 'testuser' }} />);

  const user = userEvent.setup();
  const viewButton = screen.getByText('view');
  await user.click(viewButton);

  const likeButton = screen.getByText('like');
  await user.click(likeButton);
  await user.click(likeButton);

  expect(setBlogs).toHaveBeenCalledTimes(2);
});

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

test('displays blog url and likes when view button is clicked', () => {
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

  const button = screen.getByText('view');
  fireEvent.click(button);

  const urlElement = screen.getByText('https://react-testing-library.com');
  expect(urlElement).toBeDefined();

  const likesElement = screen.getByText('likes 7');
  expect(likesElement).toBeDefined();
});
