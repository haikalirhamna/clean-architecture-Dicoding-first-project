const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { content, commentId, owner } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies (id, content, comment_id, owner, created_at, is_deleted) VALUES ($1, $2, $3, $4, $5, false) RETURNING id, content, owner',
      values: [id, content, commentId, owner, createdAt],
    };

    const result = await this._pool.query(query);
    
    return new AddedReply(result.rows[0]);
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `
        SELECT r.id, u.username, r.created_at AS date,
        CASE WHEN r.is_deleted THEN '**balasan telah dihapus**' ELSE r.content END AS content
        FROM replies r
        JOIN users u ON r.owner = u.id
        WHERE r.comment_id = $1
        ORDER BY r.created_at ASC
      `,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyReplyExist(replyId, commentId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND comment_id = $2',
      values: [replyId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    const reply = result.rows[0];
    if (reply.owner !== owner) {
      throw new AuthorizationError('Anda bukan pemilik reply berikut');
    }
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1 RETURNING id',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
