exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true, // コメント投稿者は必須
      references: 'users(id)',
      onDelete: 'SET NULL', // ユーザー削除時はNULLにする（コメントは残す）
    },
    trip_id: { // コメント対象の旅程
      type: 'uuid',
      notNull: true,
      references: 'trips(id)',
      onDelete: 'CASCADE', // 旅程削除時はコメントも削除
    },
    parent_comment_id: { // 返信先のコメントID
      type: 'uuid',
      notNull: false, // トップレベルコメントはNULL
      references: 'comments(id)',
      onDelete: 'CASCADE', // 親コメント削除時は返信も削除
    },
    body: {
      type: 'text',
      notNull: true,
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

  // updated_at を自動更新するトリガーを設定 (usersテーブルで作成した関数を再利用)
  pgm.sql(`
    CREATE TRIGGER set_timestamp_comments
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  `);
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
