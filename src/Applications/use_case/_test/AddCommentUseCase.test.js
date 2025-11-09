const AddCommentUseCase = require('../AddCommentUseCase');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Komentar yang sangat membantu',
    };
    const threadId = 'thread-123';
    const owner = 'user-123';

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner,
    });

    /** creating dependency of use case */
    const mockCommentRepository = {};
    const mockThreadRepository = {};

    /** mocking needed functions */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload, threadId, owner);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread)
      .toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.addComment)
      .toHaveBeenCalledWith(new NewComment(useCasePayload, threadId, owner));
    expect(addedComment).toStrictEqual(mockAddedComment);
  });
});
