const NewThread = require('../NewThread');

describe('NewThread entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = { title: 'Sebuah Thread' }; // body tidak ada

    // Action & Assert
    expect(() => new NewThread(payload, 'user-123')).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
    };

    // Action & Assert
    expect(() => new NewThread(payload, 'user-123')).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Sebuah Thread',
      body: 'Isi thread yang menarik',
    };
    const owner = 'user-123';

    // Action
    const newThread = new NewThread(payload, owner);

    // Assert
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(owner);
  });
});
