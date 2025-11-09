const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, threadId, owner) {
    const newComment = new NewComment(useCasePayload, threadId, owner);
    await this._threadRepository.verifyAvailableThread(newComment.threadId);
    const addedComment = await this._commentRepository.addComment(newComment);
    return addedComment;
  }
}

module.exports = AddCommentUseCase;