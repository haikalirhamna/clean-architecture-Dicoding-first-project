const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;
    const deleteComment = new DeleteComment(threadId, commentId, owner);
    await this._threadRepository.verifyAvailableThread(deleteComment.threadId);
    await this._commentRepository.verifyCommentExist(deleteComment.commentId, deleteComment.threadId);
    try {
      await this._commentRepository.verifyCommentOwner(deleteComment.commentId, deleteComment.owner);
    } catch (error) {
      throw new AuthorizationError('Anda bukan pemilik komentar ini');
    }
    await this._commentRepository.deleteCommentById(deleteComment.commentId);
  }
}

module.exports = DeleteCommentUseCase;
