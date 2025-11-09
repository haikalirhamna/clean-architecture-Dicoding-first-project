const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres Integration Test', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return AddedThread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const newThread = new NewThread(
        { title: 'Judul Thread', body: 'Isi thread yang menarik' },
        'user-123',
      );
      const fakeIdGenerator = () => '123'; // thread-123
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      const addedThread = await threadRepository.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toBe('thread-123');
      expect(threads[0].title).toBe('Judul Thread');
      expect(threads[0].owner).toBe('user-123');

      expect(addedThread).toStrictEqual(
        new AddedThread({ id: 'thread-123', title: 'Judul Thread', owner: 'user-123' }),
      );
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should not throw error when thread exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepository = new ThreadRepositoryPostgres(pool, () => '123');

      // Act & Assert
      await expect(threadRepository.verifyAvailableThread('thread-123'))
        .resolves.not.toThrowError();
    });

    it('should throw NotFoundError when thread does not exist', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, () => '123');

      // Act & Assert
      await expect(threadRepository.verifyAvailableThread('thread-xyz'))
        .rejects.toThrowError(NotFoundError);
    });
  });
});
