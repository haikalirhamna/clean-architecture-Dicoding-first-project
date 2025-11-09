const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }
  
  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    console.log(threadId);
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(request.payload, threadId, owner);
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    try {
      await deleteCommentUseCase.execute({ threadId, commentId, owner });
      return h.response({ status: 'success' }).code(200);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return h.response({ status: 'fail', message: error.message }).code(404);
      }
      if (error.name === 'AuthorizationError') {
        return h.response({ status: 'fail', message: error.message }).code(403);
      }
      // fallback internal error
      return h.response({ status: 'error', message: 'Terjadi kesalahan server' }).code(500);
    }
  }
}

module.exports = CommentsHandler;