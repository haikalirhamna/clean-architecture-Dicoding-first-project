const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('DeleteReplyUseCase', () => {
  it('should orchestrate delete reply action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const owner = 'user-123';

    // Mock repositories
    const mockReplyRepository = {
      verifyReplyExist: jest.fn().mockResolvedValue(),
      verifyReplyOwner: jest.fn().mockResolvedValue(),
      deleteReplyById: jest.fn().mockResolvedValue(),
    };

    const mockCommentRepository = {
      verifyCommentExist: jest.fn().mockResolvedValue(),
    };

    const mockThreadRepository = {
      verifyAvailableThread: jest.fn().mockResolvedValue(),
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteReplyUseCase.execute(threadId, commentId, replyId, owner);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(commentId, threadId);
    expect(mockReplyRepository.verifyReplyExist).toBeCalledWith(replyId, commentId);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(replyId, owner);
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(replyId);
  });

  it('should throw AuthorizationError when user is not the owner', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const owner = 'user-123';

    const mockReplyRepository = {
      verifyReplyExist: jest.fn().mockResolvedValue(),
      verifyReplyOwner: jest.fn().mockRejectedValue(
        new AuthorizationError('Anda bukan pemilik reply berikut')
      ),
      deleteReplyById: jest.fn(),
    };

    const mockCommentRepository = {
      verifyCommentExist: jest.fn().mockResolvedValue(),
    };

    const mockThreadRepository = {
      verifyAvailableThread: jest.fn().mockResolvedValue(),
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(
      deleteReplyUseCase.execute(threadId, commentId, replyId, owner)
    ).rejects.toThrowError(AuthorizationError);

    expect(mockReplyRepository.deleteReplyById).not.toBeCalled();
  });
});
