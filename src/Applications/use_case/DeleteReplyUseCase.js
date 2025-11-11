const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, replyId, owner) {
    const deleteReply = new DeleteReply(threadId, commentId, replyId, owner);
    await this._threadRepository.verifyAvailableThread(deleteReply.threadId);
    await this._commentRepository.verifyCommentExist(deleteReply.commentId, deleteReply.threadId);
    await this._replyRepository.verifyReplyExist(deleteReply.replyId, deleteReply.commentId);
    await this._replyRepository.verifyReplyOwner(deleteReply.replyId, deleteReply.owner);
    // soft delete
    await this._replyRepository.deleteReplyById(deleteReply.replyId);
  }
}

module.exports = DeleteReplyUseCase;
