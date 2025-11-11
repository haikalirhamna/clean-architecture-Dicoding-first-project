const AddReplyUseCase = require('../AddReplyUseCase');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

describe('AddReplyUseCase', () => {
  it('should orchestrate add reply action correctly', async () => {
    // Arrange
    const useCasePayload = { content: 'sebuah balasan' };
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const owner = 'user-123';

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner,
    });

    const mockReplyRepository = {
      addReply: jest.fn().mockResolvedValue(expectedAddedReply),
    };

    const mockCommentRepository = {
      verifyCommentExist: jest.fn().mockResolvedValue(),
    };

    const mockThreadRepository = {
      verifyAvailableThread: jest.fn().mockResolvedValue(),
    };

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload, threadId, commentId, owner);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(commentId, threadId);
    expect(mockReplyRepository.addReply).toBeCalledWith(expect.any(NewReply));
    expect(addedReply).toStrictEqual(expectedAddedReply);
  });
});
