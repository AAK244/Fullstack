
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, test, expect, vitest, beforeEach, vi } from 'vitest';
import BlogForm from './BlogForm';
import blogService from '../services/blogs';

vi.mock('../services/blogs');

describe('<BlogForm />', () => {
  beforeEach(() => {
    blogService.create.mockResolvedValue({
      title: 'Testing React forms',
      author: 'Tester',
      url: 'http://testing.com',
      user: { id: 1, username: 'testuser', name: 'Test User' },
    });
  });

  test('calls the event handler it received as props with the right details when a new blog is created', async () => {
    const setBlogs = vitest.fn();
    const setNotification = vitest.fn();
    const setNotificationType = vitest.fn();
    const user = { id: 1, username: 'testuser', name: 'Test User' };

    const { container } = render(
      <BlogForm
        setBlogs={setBlogs}
        blogs={[]}
        setNotification={setNotification}
        setNotificationType={setNotificationType}
        user={user}
      />
    );

    const titleInput = container.querySelector('input[type="text"]');
    const authorInput = container.querySelector('input[type="text"]');
    const urlInput = container.querySelector('input[type="text"]');
    const createButton = screen.getByText('create');

    await act(async () => {
      fireEvent.change(titleInput, {
        target: { value: 'Testing React forms' }
      });
      fireEvent.change(authorInput, {
        target: { value: 'Tester' }
      });
      fireEvent.change(urlInput, {
        target: { value: 'http://testing.com' }
      });
      fireEvent.click(createButton);
    });

    expect(setBlogs).toHaveBeenCalledTimes(1);
    expect(setNotification).toHaveBeenCalledWith(
      'a new blog Testing React forms by Tester added'
    );
    expect(setNotificationType).toHaveBeenCalledWith('success');
    expect(setBlogs.mock.calls[0][0]).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'Testing React forms',
        author: 'Tester',
        url: 'http://testing.com',
        user: user
      })
    ]));
  });
});
