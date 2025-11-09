const DeleteComment = require('../DeleteComment');

describe('DeleteComment entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      // commentId missing
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new DeleteComment(payload))
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,      // should be string
      commentId: true,    // should be string
      owner: {},          // should be string
    };

    // Action & Assert
    expect(() => new DeleteComment(payload))
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-456',
      owner: 'user-123',
    };

    // Action
    const deleteComment = new DeleteComment(payload);

    // Assert
    expect(deleteComment.threadId).toEqual(payload.threadId);
    expect(deleteComment.commentId).toEqual(payload.commentId);
    expect(deleteComment.owner).toEqual(payload.owner);
  });
});
