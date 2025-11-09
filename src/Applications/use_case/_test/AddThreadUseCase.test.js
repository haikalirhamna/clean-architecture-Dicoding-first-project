const AddThreadUseCase = require('../AddThreadUseCase');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Sebuah Thread',
      body: 'Isi dari thread',
    };
    const owner = 'user-123';

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner,
    });

    // Mocking dependency
    const mockThreadRepository = {
      addThread: jest.fn().mockResolvedValue(mockAddedThread),
    };

    // Create instance of use case
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Act
    const addedThread = await addThreadUseCase.execute(useCasePayload, owner);

    // Assert
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
      new NewThread(useCasePayload, owner),
    );
    expect(addedThread).toStrictEqual(mockAddedThread);
  });
});
