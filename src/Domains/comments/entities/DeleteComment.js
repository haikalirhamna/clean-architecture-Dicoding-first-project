class DeleteComment {
  constructor(threadId, commentId, owner) {
    this._validate(threadId, commentId, owner);

    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _validate(threadId, commentId, owner) {
    if (!threadId || !commentId || !owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteComment;
