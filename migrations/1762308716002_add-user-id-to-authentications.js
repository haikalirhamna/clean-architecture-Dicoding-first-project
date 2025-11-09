/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.addColumn('authentications', {
    userId: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
};

exports.down = pgm => {
  pgm.dropColumn('authentications', 'userId');
};
