const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postReplieHandler,
  },
  {
    method: 'DELETE',
    path: ' /threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: handler.deleteReplieHandler,
  },
]);

module.exports = routes;