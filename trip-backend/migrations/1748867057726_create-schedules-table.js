exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('schedules', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    trip_id: {
      type: 'uuid',
      notNull: true,
      references: 'trips(id)',
      onDelete: 'CASCADE',
    },
    date: {
      type: 'date',
      notNull: true,
    },
    day_description: {
      type: 'text',
      notNull: false,
    },
    hotel_name: {
      type: 'varchar(255)',
      notNull: false,
    },
    hotel_address: {
      type: 'text',
      notNull: false,
    },
    hotel_check_in_time: {
      type: 'time',
      notNull: false,
    },
    hotel_check_out_time: {
      type: 'time',
      notNull: false,
    },
    hotel_reservation_number: {
      type: 'varchar(255)',
      notNull: false,
    },
    hotel_notes: {
      type: 'text',
      notNull: false,
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

  // trip_id と date の組み合わせでUNIQUE制約を追加 (任意)
  // pgm.addConstraint('schedules', 'schedules_trip_id_date_unique', {
  //   unique: ['trip_id', 'date']
  // });

  // updated_at を自動更新するトリガーを設定 (usersテーブルで作成した関数を再利用)
  pgm.sql(`
    CREATE TRIGGER set_timestamp_schedules
    BEFORE UPDATE ON schedules
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  `);
};

exports.down = (pgm) => {
  pgm.dropTable('schedules');
};
