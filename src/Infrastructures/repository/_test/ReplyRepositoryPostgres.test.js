const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  const fakeIdGenerator = () => '123';
  const mockPool = { query: jest.fn() };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addReply function', () => {
    it('should persist and return added reply correctly', async () => {
      // Arrange
      const newReply = new NewReply({ content: 'sebuah balasan' }, 'comment-123', 'user-123');
      const expectedAddedReply = new AddedReply({
        id: 'reply-123',
        content: 'sebuah balasan',
        owner: 'user-123',
      });

      mockPool.query.mockResolvedValue({ rows: [{ id: 'reply-123', content: 'sebuah balasan', owner: 'user-123' }] });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(mockPool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual(expectedAddedReply);
      expect(mockPool.query).toBeCalledWith(expect.objectContaining({
        text: expect.stringContaining('INSERT INTO replies'),
      }));
    });
  });

  describe('verifyReplyExist function', () => {
    it('should not throw error if reply exists', async () => {
      mockPool.query.mockResolvedValue({ rowCount: 1 });
      const repo = new ReplyRepositoryPostgres(mockPool, fakeIdGenerator);

      await expect(repo.verifyReplyExist('reply-123', 'comment-123')).resolves.not.toThrow();
    });

    it('should throw NotFoundError if reply does not exist', async () => {
      mockPool.query.mockResolvedValue({ rowCount: 0 });
      const repo = new ReplyRepositoryPostgres(mockPool, fakeIdGenerator);

      await expect(repo.verifyReplyExist('reply-404', 'comment-123')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should not throw error if owner matches', async () => {
      mockPool.query.mockResolvedValue({ rowCount: 1, rows: [{ owner: 'user-123' }] });
      const repo = new ReplyRepositoryPostgres(mockPool, fakeIdGenerator);

      await expect(repo.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrow();
    });

    it('should throw AuthorizationError if owner mismatch', async () => {
      mockPool.query.mockResolvedValue({ rowCount: 1, rows: [{ owner: 'user-456' }] });
      const repo = new ReplyRepositoryPostgres(mockPool, fakeIdGenerator);

      await expect(repo.verifyReplyOwner('reply-123', 'user-123')).rejects.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should soft delete reply correctly', async () => {
      mockPool.query.mockResolvedValue({ rowCount: 1, rows: [{ id: 'reply-123' }] });
      const repo = new ReplyRepositoryPostgres(mockPool, fakeIdGenerator);

      await expect(repo.deleteReplyById('reply-123')).resolves.not.toThrow();
      expect(mockPool.query).toBeCalledWith(expect.objectContaining({
        text: expect.stringContaining('UPDATE replies SET is_deleted = true'),
      }));
    });

    it('should throw NotFoundError if reply not found', async () => {
      mockPool.query.mockResolvedValue({ rowCount: 0 });
      const repo = new ReplyRepositoryPostgres(mockPool, fakeIdGenerator);

      await expect(repo.deleteReplyById('reply-404')).rejects.toThrowError(NotFoundError);
    });
  });
});
