exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('memories', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: { // どのユーザーの思い出か
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    event_id: {
      type: 'uuid',
      notNull: false, // NULL許容 (旅全体の思い出の場合)
      references: 'events(id)',
      onDelete: 'CASCADE',
    },
    trip_id: {
      type: 'uuid',
      notNull: false, // NULL許容 (イベントの思い出の場合)
      references: 'trips(id)',
      onDelete: 'CASCADE',
    },
    notes: {
      type: 'text',
      notNull: false,
    },
    rating: {
      type: 'integer',
      notNull: false,
      // CHECK制約で 1-5 の範囲を指定することも可能
      // check: 'rating >= 1 AND rating <= 5',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // event_id と trip_id のどちらか一方が設定されることを保証するCHECK制約 (任意)
  // pgm.addConstraint('memories', 'memories_event_or_trip_check', {
  //   check: '(event_id IS NOT NULL AND trip_id IS NULL) OR (event_id IS NULL AND trip_id IS NOT NULL)',
  // });

  // updated_at を自動更新するトリガーを設定 (usersテーブルで作成した関数を再利用)
  pgm.sql(`
    CREATE TRIGGER set_timestamp_memories
    BEFORE UPDATE ON memories
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  `);
};

exports.down = (pgm) => {
  pgm.dropTable('memories');
};
