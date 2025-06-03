exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('tags', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: {
      type: 'varchar(50)',
      notNull: true,
      unique: true,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    // updated_at はタグ名が変わらない限り不要か
  });
};

exports.down = (pgm) => {
  pgm.dropTable('tags');
};
