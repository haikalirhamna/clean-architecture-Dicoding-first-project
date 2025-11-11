const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');

describe('GetThreadUseCase', () => {
  it('should get thread detail with comments and replies correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const thread = {
      id: threadId,
      title: 'judul thread',
      body: 'isi thread',
      date: new Date('2025-11-11T00:00:00.000Z'),
      username: 'user1',
    };

    const comments = [
      { id: 'comment-1', content: 'komentar 1', username: 'user2', date: '2025-11-11T01:00:00.000Z' },
      { id: 'comment-2', content: 'komentar 2', username: 'user3', date: '2025-11-11T02:00:00.000Z' },
    ];

    const replies1 = [{ id: 'reply-1', content: 'balasan 1', username: 'user4', date: '2025-11-11T03:00:00.000Z' }];
    const replies2 = [{ id: 'reply-2', content: 'balasan 2', username: 'user5', date: '2025-11-11T04:00:00.000Z' }];

    const mockThreadRepository = {
      verifyAvailableThread: jest.fn().mockResolvedValue(),
      getThreadById: jest.fn().mockResolvedValue(thread),
    };

    const mockCommentRepository = {
      getCommentsByThreadId: jest.fn().mockResolvedValue(comments),
    };

    const mockReplyRepository = {
      getRepliesByCommentId: jest
        .fn()
        .mockImplementation((commentId) => (commentId === 'comment-1' ? replies1 : replies2)),
    };

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const result = await getThreadUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledTimes(2);
    expect(result).toBeInstanceOf(ThreadDetail);
    expect(result.comments[0].replies).toEqual(replies1);
    expect(result.comments[1].replies).toEqual(replies2);
  });
});
