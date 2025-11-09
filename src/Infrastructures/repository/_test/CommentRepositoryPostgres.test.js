const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('CommentRepositoryPostgres Integration Test', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return AddedComment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const newComment = new NewComment(
        { content: 'Komentar pertama di thread ini' },
        'thread-123',
        'user-123',
      );

      const fakeIdGenerator = () => '123'; // will result in comment-123
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Act
      const addedComment = await commentRepository.addComment(newComment);

      // Assert: periksa data di DB
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toBe('comment-123');
      expect(comments[0].content).toBe('Komentar pertama di thread ini');
      expect(comments[0].owner).toBe('user-123');

      // Assert: periksa return entity
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'Komentar pertama di thread ini',
          owner: 'user-123',
        }),
      );
    });

    it('should throw InvariantError when insert fails', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Simulasikan payload tanpa setup user/thread agar gagal (FK constraint)
      const newComment = new NewComment(
        { content: 'Komentar gagal' },
        'thread-xxx',
        'user-xxx',
      );

      // Act & Assert
      await expect(commentRepository.addComment(newComment))
        .rejects.toThrowError();
    });
  });
});
