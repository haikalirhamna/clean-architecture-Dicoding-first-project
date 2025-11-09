const AddedComment = require('../AddedComment');

describe('AddedComment entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = { id: 'comment-123', content: 'komentar bagus' }; // missing owner

    // Action & Assert
    expect(() => new AddedComment(payload))
      .toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload properties do not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123, // should be string
      content: true, // should be string
      owner: {},
    };

    // Action & Assert
    expect(() => new AddedComment(payload))
      .toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'komentar baru',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new AddedComment(payload);

    // Assert
    expect(id).toEqual('comment-123');
    expect(content).toEqual('komentar baru');
    expect(owner).toEqual('user-123');
  });
});
