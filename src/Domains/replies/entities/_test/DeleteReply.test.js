const DeleteReply = require('../DeleteReply');

describe('DeleteReply entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action & Assert
    expect(() => new DeleteReply(payload.threadId, payload.commentId, payload.replyId, payload.owner))
      .toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      commentId: {},
      replyId: true,
      owner: 999,
    };

    // Action & Assert
    expect(() => new DeleteReply(payload.threadId, payload.commentId, payload.replyId, payload.owner))
      .toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteReply object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    // Action
    const deleteReply = new DeleteReply(payload.threadId, payload.commentId, payload.replyId, payload.owner);

    // Assert
    expect(deleteReply.threadId).toEqual(payload.threadId);
    expect(deleteReply.commentId).toEqual(payload.commentId);
    expect(deleteReply.replyId).toEqual(payload.replyId);
    expect(deleteReply.owner).toEqual(payload.owner);
  });
});
