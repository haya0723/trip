exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('favorite_places', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    place_id: { // Google Place IDなど、外部サービスの場所IDを想定
      type: 'varchar(255)',
      notNull: true,
    },
    name: { // 表示用の冗長データ
      type: 'varchar(255)',
      notNull: false,
    },
    address: { // 表示用の冗長データ
      type: 'text',
      notNull: false,
    },
    category: { // 表示用の冗長データ
      type: 'varchar(100)',
      notNull: false,
    },
    latitude: { // 表示用の冗長データ
      type: 'decimal(9,6)',
      notNull: false,
    },
    longitude: { // 表示用の冗長データ
      type: 'decimal(9,6)',
      notNull: false,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    // updated_at はお気に入り登録日が変わることはないので不要か、あるいは場所情報更新時に使うか
  });

  // user_id と place_id の組み合わせでUNIQUE制約を追加
  pgm.addConstraint('favorite_places', 'favorite_places_user_id_place_id_unique', {
    unique: ['user_id', 'place_id'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('favorite_places');
};
