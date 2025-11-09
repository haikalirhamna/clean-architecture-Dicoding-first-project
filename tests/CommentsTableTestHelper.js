/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', content = 'Komentar default', threadId = 'thread-123', owner = 'user-123', is_delete = false, created_at = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO comments (id, content, thread_id, owner, is_delete, created_at) VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, threadId, owner, is_delete, created_at],
    };

    await pool.query(query);
  },

  async findCommentById(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
