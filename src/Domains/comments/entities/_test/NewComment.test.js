const NewComment = require('../NewComment');

describe('NewComment entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {}; // content missing
    const threadId = 'thread-123';
    const owner = 'user-123';

    // Action & Assert
    expect(() => new NewComment(payload, threadId, owner))
      .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when content is not a string', () => {
    // Arrange
    const payload = { content: 123 };
    const threadId = 'thread-123';
    const owner = 'user-123';

    // Action & Assert
    expect(() => new NewComment(payload, threadId, owner))
      .toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment object correctly', () => {
    // Arrange
    const payload = { content: 'Sebuah komentar baru' };
    const threadId = 'thread-123';
    const owner = 'user-123';

    // Action
    const { content, threadId: thread, owner: user } = new NewComment(payload, threadId, owner);

    // Assert
    expect(content).toEqual('Sebuah komentar baru');
    expect(thread).toEqual('thread-123');
    expect(user).toEqual('user-123');
  });
});
