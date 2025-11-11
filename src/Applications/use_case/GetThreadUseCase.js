const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    for (const comment of comments) {
      comment.replies = await this._replyRepository.getRepliesByCommentId(comment.id);
    }
    return new ThreadDetail({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date.toISOString(),
      username: thread.username,
      comments
    });
  }
}

module.exports = GetThreadUseCase;
