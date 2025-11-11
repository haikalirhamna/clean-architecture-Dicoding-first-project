const NewReply = require('../NewReply');

describe('NewReply entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new NewReply(payload, 'thread-123', 'comment-123', 'user-123'))
      .toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action & Assert
    expect(() => new NewReply(payload, 'thread-123', 'comment-123', 'user-123'))
      .toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah balasan',
    };
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const owner = 'user-123';

    // Action
    const newReply = new NewReply(payload, threadId, commentId, owner);

    // Assert
    expect(newReply.content).toEqual(payload.content);
    expect(newReply.threadId).toEqual(threadId);
    expect(newReply.commentId).toEqual(commentId);
    expect(newReply.owner).toEqual(owner);
  });
});
