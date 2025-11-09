/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.dropColumn('authentications', 'userId');
};

exports.down = pgm => {
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
