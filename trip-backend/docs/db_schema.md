# データベーススキーマ設計

このドキュメントは、旅行計画アプリケーションのPostgreSQLデータベーススキーマを定義します。

## 1. users テーブル

ユーザー情報を格納するテーブル。

| カラム名        | データ型         | 制約                               | 説明                                   |
| --------------- | ---------------- | ---------------------------------- | -------------------------------------- |
| id              | UUID             | PRIMARY KEY, DEFAULT gen_random_uuid() | ユーザーID (一意な識別子)              |
| nickname        | VARCHAR(50)      | NOT NULL                           | ニックネーム (表示名)                  |
| email           | VARCHAR(255)     | NOT NULL, UNIQUE                   | メールアドレス (ログインにも使用)        |
| password_hash   | VARCHAR(255)     | NOT NULL                           | ハッシュ化されたパスワード             |
| created_at      | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | アカウント作成日時                     |
| updated_at      | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 最終更新日時                         |

**補足:**
- `gen_random_uuid()` 関数を使用するには、事前に `CREATE EXTENSION IF NOT EXISTS "pgcrypto";` を実行して拡張機能を有効にする必要があります。
- `updated_at` は、トリガーを使用してレコード更新時に自動的に更新されるように設定することを推奨します。

---

*(ここに他のテーブル定義を追加していく)*

## 2. user_profiles テーブル

ユーザーのプロフィール詳細情報を格納するテーブル。`users` テーブルと1対1で関連付けられる。

| カラム名        | データ型         | 制約                               | 説明                               |
| --------------- | ---------------- | ---------------------------------- | ---------------------------------- |
| user_id         | UUID             | PRIMARY KEY, REFERENCES users(id) ON DELETE CASCADE | ユーザーID (usersテーブルの外部キー) |
| bio             | TEXT             |                                    | 自己紹介文                         |
| avatar_url      | VARCHAR(2048)    |                                    | アバター画像のURL                  |
| created_at      | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | プロフィール作成日時                 |
| updated_at      | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | プロフィール最終更新日時             |

**補足:**
- `user_id` は `users` テーブルの `id` を参照する外部キーであり、主キーも兼ねます (1対1関係)。
- `ON DELETE CASCADE` により、`users` テーブルからユーザーが削除された場合、関連するプロフィール情報も自動的に削除されます。
- `updated_at` は、トリガーを使用してレコード更新時に自動的に更新されるように設定することを推奨します。

---

## 3. trips テーブル

旅行計画の基本情報を格納するテーブル。

| カラム名        | データ型         | 制約                               | 説明                                     |
| --------------- | ---------------- | ---------------------------------- | ---------------------------------------- |
| id              | UUID             | PRIMARY KEY, DEFAULT gen_random_uuid() | 旅行計画ID (一意な識別子)                |
| user_id         | UUID             | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | 作成したユーザーのID (usersテーブル外部キー) |
| name            | VARCHAR(255)     | NOT NULL                           | 旅行名                                   |
| period_summary  | VARCHAR(255)     |                                    | 期間の概要 (例: "2024/08/10 - 2024/08/15 (5泊6日)") |
| start_date      | DATE             |                                    | 開始日 (詳細な期間管理用)                |
| end_date        | DATE             |                                    | 終了日 (詳細な期間管理用)                |
| destinations    | TEXT             |                                    | 主な目的地 (カンマ区切りなど、または別テーブル) |
| status          | VARCHAR(50)      | DEFAULT '計画中'                   | 旅行のステータス (例: 計画中, 予約済み, 旅行中, 完了, キャンセル) |
| cover_image_url | VARCHAR(2048)    |                                    | カバー画像のURL                          |
| is_public       | BOOLEAN          | NOT NULL, DEFAULT FALSE            | 公開設定 (true: 公開, false: 非公開)     |
| created_at      | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時                                 |
| updated_at      | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 最終更新日時                             |

**補足:**
- `destinations` カラムは、単純なテキストとして格納するか、正規化して `trip_destinations` のような中間テーブルと `destinations` マスターテーブルを作成するか検討の余地があります。今回は簡易的にTEXT型とします。
- `status` カラムは、ENUM型として定義することも可能です。
- `updated_at` はトリガーで自動更新推奨。

---

## 4. schedules テーブル

日毎のスケジュール情報を格納するテーブル。特定の旅行計画 (`trips` テーブル) に属する。

| カラム名        | データ型         | 制約                               | 説明                               |
| --------------- | ---------------- | ---------------------------------- | ---------------------------------- |
| id              | UUID             | PRIMARY KEY, DEFAULT gen_random_uuid() | スケジュールID (一意な識別子)        |
| trip_id                  | UUID             | NOT NULL, REFERENCES trips(id) ON DELETE CASCADE | 関連する旅行計画のID (tripsテーブル外部キー) |
| date                     | DATE             | NOT NULL                           | スケジュールの日付                   |
| day_description          | TEXT             |                                    | その日の概要やテーマ (例: "移動と市内観光") |
| hotel_name               | VARCHAR(255)     |                                    | 宿泊ホテル名                         |
| hotel_address            | TEXT             |                                    | 宿泊ホテルの住所                     |
| hotel_check_in_time      | TIME             |                                    | チェックイン時間                     |
| hotel_check_out_time     | TIME             |                                    | チェックアウト時間                   |
| hotel_reservation_number | VARCHAR(255)     |                                    | ホテルの予約番号                     |
| hotel_notes              | TEXT             |                                    | ホテルに関する備考                   |
| created_at               | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時                           |
| updated_at               | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 最終更新日時                       |

**補足:**
- `trip_id` と `date` の組み合わせでUNIQUE制約を設けることも検討できます（1つの旅行計画で同じ日付のスケジュールは1つのみとする場合）。
- ホテル関連情報は、1日に1つのホテルを想定し、`schedules` テーブルに直接カラムとして含めます。より複雑なケース（1日に複数ホテルなど）を考慮する場合は、別途 `hotels` テーブルを作成し、リレーションシップを設計する必要があります。
- `updated_at` はトリガーで自動更新推奨。

---

## 5. events テーブル

各日の具体的なイベント（行動、食事、移動など）情報を格納するテーブル。特定の日毎スケジュール (`schedules` テーブル) に属する。

| カラム名                 | データ型         | 制約                               | 説明                                     |
| ------------------------ | ---------------- | ---------------------------------- | ---------------------------------------- |
| id                       | UUID             | PRIMARY KEY, DEFAULT gen_random_uuid() | イベントID (一意な識別子)                |
| schedule_id              | UUID             | NOT NULL, REFERENCES schedules(id) ON DELETE CASCADE | 関連する日毎スケジュールのID (schedulesテーブル外部キー) |
| time                     | TIME             |                                    | イベントの開始時刻 (例: '10:00')         |
| name                     | VARCHAR(255)     | NOT NULL                           | イベント名                               |
| category                 | VARCHAR(50)      |                                    | イベントのカテゴリ (例: 観光, 食事, 移動, 宿泊) |
| description              | TEXT             |                                    | イベントの詳細説明                       |
| location_name            | VARCHAR(255)     |                                    | 場所の名称                               |
| location_address         | TEXT             |                                    | 場所の住所                               |
| location_latitude        | DECIMAL(9,6)     |                                    | 場所の緯度                               |
| location_longitude       | DECIMAL(9,6)     |                                    | 場所の経度                               |
| estimated_duration_minutes | INTEGER          |                                    | 推定所要時間 (分単位)                    |
| type                     | VARCHAR(50)      |                                    | イベントタイプ (例: activity, meal, travel, hotel_checkin) |
| created_at               | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時                                 |
| updated_at               | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 最終更新日時                             |

**補足:**
- `location_` 関連のカラムは、外部の場所情報サービス (Google Places APIなど) のIDを保存し、詳細は別途取得する形も考えられます。今回は直接情報を格納する形とします。
- `type` カラムは、フロントエンドでの表示制御や特別な処理（例: 移動イベントのルート検索）に利用できます。
- `time` カラムの順序でイベントが表示されるため、`schedule_id` と `time` でソートすることが多いでしょう。
- `updated_at` はトリガーで自動更新推奨。

---

## 6. memories テーブル

イベントまたは旅行全体に関する思い出（ノート、評価、メディアファイルへのリンクなど）を格納するテーブル。

| カラム名        | データ型         | 制約                               | 説明                                     |
| --------------- | ---------------- | ---------------------------------- | ---------------------------------------- |
| id              | UUID             | PRIMARY KEY, DEFAULT gen_random_uuid() | 思い出ID (一意な識別子)                  |
| user_id         | UUID             | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | この思い出を作成したユーザーのID           |
| event_id        | UUID             | REFERENCES events(id) ON DELETE CASCADE, NULLABLE | 関連するイベントのID (イベントの思い出の場合) |
| trip_id         | UUID             | REFERENCES trips(id) ON DELETE CASCADE, NULLABLE  | 関連する旅行計画のID (旅行全体の思い出の場合) |
| notes           | TEXT             |                                    | 思い出のノート、感想                     |
| rating          | INTEGER          |                                    | 評価 (例: 1-5段階)                     |
| created_at      | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時                                 |
| updated_at      | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 最終更新日時                             |

**補足:**
- `event_id` と `trip_id` はどちらか一方が設定され、もう一方はNULLになることを想定しています。アプリケーションロジックまたはデータベースのCHECK制約でこれを保証する必要があります。(例: `CHECK ((event_id IS NOT NULL AND trip_id IS NULL) OR (event_id IS NULL AND trip_id IS NOT NULL))`)
- 写真や動画は、別途 `memory_photos` や `memory_videos` といったテーブルを作成し、この `memories` テーブルと1対多の関係で紐付けるのが一般的です。各テーブルにはファイルパスやURL、順序などを格納します。今回はまず `memories` テーブルの基本構造を定義します。
- `updated_at` はトリガーで自動更新推奨。

---

## 7. favorite_places テーブル

ユーザーがお気に入りに登録した場所を管理するテーブル。

| カラム名        | データ型         | 制約                               | 説明                                     |
| --------------- | ---------------- | ---------------------------------- | ---------------------------------------- |
| id              | UUID             | PRIMARY KEY, DEFAULT gen_random_uuid() | お気に入りID (一意な識別子)              |
| user_id         | UUID             | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | ユーザーID (usersテーブル外部キー)         |
| place_id        | VARCHAR(255)     | NOT NULL                           | 場所の一意なID (例: Google Place ID)     |
| name            | VARCHAR(255)     |                                    | 場所の名称 (表示用、冗長データ)          |
| address         | TEXT             |                                    | 場所の住所 (表示用、冗長データ)          |
| category        | VARCHAR(100)     |                                    | 場所のカテゴリ (表示用、冗長データ)      |
| latitude        | DECIMAL(9,6)     |                                    | 場所の緯度 (表示用、冗長データ)          |
| longitude       | DECIMAL(9,6)     |                                    | 場所の経度 (表示用、冗長データ)          |
| created_at      | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | お気に入り登録日時                       |

**補足:**
- `user_id` と `place_id` の組み合わせでUNIQUE制約を設けることで、同じユーザーが同じ場所を複数回お気に入り登録することを防ぎます。
- `name`, `address`, `category`, `latitude`, `longitude` は、お気に入り一覧表示の際に外部APIへの問い合わせを減らすための冗長データです。外部APIから取得した情報を保存します。これらの情報が変更された場合に同期する仕組みも考慮が必要になる場合があります。

---

## 8. public_trip_settings テーブル

公開される旅行計画 (`trips` テーブル) に関する追加設定を格納するテーブル。`trips` テーブルと1対1で関連付けられる。

| カラム名             | データ型         | 制約                               | 説明                                     |
| -------------------- | ---------------- | ---------------------------------- | ---------------------------------------- |
| trip_id              | UUID             | PRIMARY KEY, REFERENCES trips(id) ON DELETE CASCADE | 旅行計画ID (tripsテーブルの外部キー)     |
| public_description   | TEXT             |                                    | 公開時の説明文                           |
| overall_author_comment | TEXT           |                                    | 作成者の総括コメント (公開用)            |
| publish_scope        | VARCHAR(50)      | DEFAULT 'public'                   | 公開範囲 (例: public, link_only)         |
| include_photos       | VARCHAR(50)      | DEFAULT 'all'                      | 写真の公開設定 (例: all, selected, none) |
| include_videos       | VARCHAR(50)      | DEFAULT 'all'                      | 動画の公開設定 (例: all, selected, none) |
| include_notes        | VARCHAR(50)      | DEFAULT 'anonymized'               | メモ・感想の公開設定 (例: all, anonymized, none) |
| allow_comments       | BOOLEAN          | NOT NULL, DEFAULT TRUE             | コメント投稿を許可するか                 |
| created_at           | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 設定作成日時                             |
| updated_at           | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 設定最終更新日時                         |

**補足:**
- このテーブルは、`trips.is_public` が `true` の場合にのみ関連レコードが存在することを想定します。
- `publish_scope`, `include_photos`, `include_videos`, `include_notes` は、フロントエンドの `TripPublishSettingsScreen.jsx` で定義した設定値に対応します。ENUM型として定義することも可能です。
- `updated_at` はトリガーで自動更新推奨。

---

## 9. tags テーブル

タグ情報を格納するマスターテーブル。

| カラム名     | データ型         | 制約                               | 説明                     |
| ------------ | ---------------- | ---------------------------------- | ------------------------ |
| id           | UUID             | PRIMARY KEY, DEFAULT gen_random_uuid() | タグID (一意な識別子)    |
| name         | VARCHAR(50)      | NOT NULL, UNIQUE                   | タグ名 (例: グルメ, 温泉) |
| created_at   | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 作成日時                 |

**補足:**
- `name` にUNIQUE制約を設けることで、同じ名前のタグが重複して作成されるのを防ぎます。

---

## 10. trip_tags テーブル

旅行計画 (`trips` テーブル) とタグ (`tags` テーブル) の関連を管理する中間テーブル (多対多)。

| カラム名     | データ型    | 制約                               | 説明                     |
| ------------ | ----------- | ---------------------------------- | ------------------------ |
| trip_id      | UUID        | NOT NULL, REFERENCES trips(id) ON DELETE CASCADE | 旅行計画ID (tripsテーブル外部キー) |
| tag_id       | UUID        | NOT NULL, REFERENCES tags(id) ON DELETE CASCADE  | タグID (tagsテーブル外部キー)   |
| PRIMARY KEY (trip_id, tag_id) |             |                                    | 複合主キー               |

**補足:**
- `trip_id` と `tag_id` の組み合わせが主キーとなることで、同じ旅行計画に同じタグが複数回関連付けられるのを防ぎます。

---

## 11. comments テーブル

公開された旅行計画などに対するコメントを格納するテーブル。

| カラム名        | データ型         | 制約                               | 説明                                     |
| --------------- | ---------------- | ---------------------------------- | ---------------------------------------- |
| id              | UUID             | PRIMARY KEY, DEFAULT gen_random_uuid() | コメントID (一意な識別子)                |
| user_id         | UUID             | NOT NULL, REFERENCES users(id) ON DELETE SET NULL | コメント投稿者のID (usersテーブル外部キー、ユーザー削除時はNULLに) |
| trip_id         | UUID             | NOT NULL, REFERENCES trips(id) ON DELETE CASCADE  | コメント対象の旅行計画ID (tripsテーブル外部キー) |
| parent_comment_id | UUID           | REFERENCES comments(id) ON DELETE CASCADE, NULLABLE | 親コメントのID (返信コメントの場合)      |
| body            | TEXT             | NOT NULL                           | コメント本文                             |
| created_at      | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | コメント投稿日時                         |
| updated_at      | TIMESTAMPTZ      | NOT NULL, DEFAULT CURRENT_TIMESTAMP | コメント最終更新日時                     |

**補足:**
- `user_id` の `ON DELETE SET NULL` は、ユーザーがアカウントを削除した場合でもコメント自体は残す（「削除されたユーザー」として表示するなど）ための設定です。`ON DELETE CASCADE` でコメントも一緒に削除する選択も可能です。
- `parent_comment_id` を使うことで、スレッド形式のコメント（返信）を実現できます。トップレベルのコメントはこのカラムがNULLになります。
- `updated_at` はトリガーで自動更新推奨。
