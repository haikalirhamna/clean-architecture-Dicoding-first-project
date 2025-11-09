const InvariantError = require('../../Commons/exceptions/InvariantError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, threadId, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments (id, content, thread_id, owner, is_deleted, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, content, thread_id, owner',
      values: [id, content, threadId, owner, false],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan thread');
    }
    
    return new AddedComment(result.rows[0]);
  }
}

module.exports = CommentRepositoryPostgres;