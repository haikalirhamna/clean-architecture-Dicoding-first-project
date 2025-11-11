const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, threadId, commentId, owner) {
    const newReply = new NewReply(useCasePayload, threadId, commentId, owner);
    await this._threadRepository.verifyAvailableThread(newReply.threadId);
    await this._commentRepository.verifyCommentExist(newReply.commentId, newReply.threadId);
    const addedReply = await this._replyRepository.addReply(newReply);

    return addedReply;
  }
}

module.exports = AddReplyUseCase;
