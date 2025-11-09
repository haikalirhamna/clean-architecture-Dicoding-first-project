const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    const threadData = await this._threadRepository.getThreadById(threadId);
    return new DetailThread(threadData);
  }
}

module.exports = GetThreadUseCase;
