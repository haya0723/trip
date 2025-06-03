# API設計

このドキュメントは、旅行計画アプリケーションのバックエンドAPI仕様を定義します。

## 1. 認証 (Authentication)

### 1.1. ユーザー新規登録

*   **エンドポイント:** `POST /api/auth/signup`
*   **説明:** 新しいユーザーアカウントを作成します。
*   **リクエストボディ:**
    ```json
    {
      "nickname": "string (max 50, required)",
      "email": "string (email format, required, unique)",
      "password": "string (min 8 characters, required)"
    }
    ```
*   **レスポンス (成功時):** `201 Created`
    ```json
    {
      "message": "User created successfully. Please check your email to verify your account.",
      // 将来的にはユーザー情報やトークンを返すことも検討
    }
    ```
*   **レスポンス (エラー時):**
    *   `400 Bad Request`: バリデーションエラー (例: 必須項目不足、メール形式不正、パスワード長不足)
        ```json
        {
          "error": "Validation failed",
          "details": {
            "email": "Invalid email format" 
          }
        }
        ```
    *   `409 Conflict`: メールアドレスが既に登録済み
        ```json
        {
          "error": "Email already exists"
        }
        ```

### 1.2. ユーザーログイン

*   **エンドポイント:** `POST /api/auth/login`
*   **説明:** 既存のユーザーアカウントでログインし、アクセストークン（JWT）を取得します。
*   **リクエストボディ:**
    ```json
    {
      "email": "string (email format, required)",
      "password": "string (required)"
    }
    ```
*   **レスポンス (成功時):** `200 OK`
    ```json
    {
      "token": "string (JWT)",
      "user": {
        "id": "uuid",
        "nickname": "string",
        "email": "string"
      }
    }
    ```
*   **レスポンス (エラー時):**
    *   `400 Bad Request`: 必須項目不足
    *   `401 Unauthorized`: メールアドレスまたはパスワードが不正

## 2. ユーザープロフィール (User Profiles)

認証されたユーザーが自身のプロフィール情報を管理するためのAPI。

### 2.1. プロフィール取得

*   **エンドポイント:** `GET /api/profile`
*   **説明:** 現在認証されているユーザーのプロフィール情報を取得します。
*   **認証:** 要 (アクセストークン)
*   **レスポンス (成功時):** `200 OK`
    ```json
    {
      "user_id": "uuid", // usersテーブルのIDと同じ
      "nickname": "string", // usersテーブルから取得
      "email": "string",    // usersテーブルから取得
      "bio": "text (nullable)",
      "avatar_url": "string (url, nullable)",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
    ```
*   **レスポンス (エラー時):**
    *   `401 Unauthorized`: 認証されていない
    *   `404 Not Found`: プロフィール情報が存在しない (通常はユーザー作成時に空のプロフィールが作られる想定)

### 2.2. プロフィール更新

*   **エンドポイント:** `PUT /api/profile`
*   **説明:** 現在認証されているユーザーのプロフィール情報（ニックネーム、自己紹介、アバターURL）を更新します。メールアドレスの変更は別途専用APIを設けることを推奨。
*   **認証:** 要 (アクセストークン)
*   **リクエストボディ:**
    ```json
    {
      "nickname": "string (max 50, optional)",
      "bio": "text (optional, nullable)",
      "avatar_url": "string (url, optional, nullable)"
    }
    ```
*   **レスポンス (成功時):** `200 OK`
    ```json
    {
      "user_id": "uuid",
      "nickname": "string",
      "email": "string",
      "bio": "text (nullable)",
      "avatar_url": "string (url, nullable)",
      "created_at": "timestamp",
      "updated_at": "timestamp" // 更新後のタイムスタンプ
    }
    ```
*   **レスポンス (エラー時):**
    *   `400 Bad Request`: バリデーションエラー
    *   `401 Unauthorized`: 認証されていない

---

## 3. 旅程 (Trips)

認証されたユーザーが自身の旅行計画を管理するためのAPI。

### 3.1. 旅程一覧取得

*   **エンドポイント:** `GET /api/trips`
*   **説明:** 現在認証されているユーザーの旅行計画の一覧を取得します。
*   **認証:** 要 (アクセストークン)
*   **クエリパラメータ (任意):**
    *   `status` (string): ステータスでフィルタリング (例: `計画中`, `完了`)
    *   `sortBy` (string): ソート順 (例: `createdAt_desc`, `startDate_asc`)
    *   `limit` (integer):取得件数 (デフォルト: 20)
    *   `offset` (integer): スキップ件数 (ページネーション用, デフォルト: 0)
*   **レスポンス (成功時):** `200 OK`
    ```json
    {
      "trips": [
        {
          "id": "uuid",
          "user_id": "uuid",
          "name": "string",
          "period_summary": "string (nullable)",
          "start_date": "date (nullable)",
          "end_date": "date (nullable)",
          "destinations": "text (nullable)",
          "status": "string",
          "cover_image_url": "string (url, nullable)",
          "is_public": "boolean",
          "created_at": "timestamp",
          "updated_at": "timestamp"
        }
        // ... 他の旅程
      ],
      "total_count": "integer" // フィルタリング条件に合致する全件数
    }
    ```
*   **レスポンス (エラー時):**
    *   `401 Unauthorized`: 認証されていない

### 3.2. 旅程新規作成

*   **エンドポイント:** `POST /api/trips`
*   **説明:** 新しい旅行計画を作成します。
*   **認証:** 要 (アクセストークン)
*   **リクエストボディ:**
    ```json
    {
      "name": "string (required)",
      "period_summary": "string (optional, nullable)",
      "start_date": "date (optional, nullable)",
      "end_date": "date (optional, nullable)",
      "destinations": "text (optional, nullable)",
      "status": "string (optional, default: '計画中')",
      "cover_image_url": "string (url, optional, nullable)",
      "is_public": "boolean (optional, default: false)"
    }
    ```
*   **レスポンス (成功時):** `201 Created`
    ```json
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "string",
      "period_summary": "string (nullable)",
      "start_date": "date (nullable)",
      "end_date": "date (nullable)",
      "destinations": "text (nullable)",
      "status": "string",
      "cover_image_url": "string (url, nullable)",
      "is_public": "boolean",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
    ```
*   **レスポンス (エラー時):**
    *   `400 Bad Request`: バリデーションエラー
    *   `401 Unauthorized`: 認証されていない

### 3.3. 特定の旅程の詳細取得

*   **エンドポイント:** `GET /api/trips/{tripId}`
*   **説明:** 指定されたIDの旅行計画の詳細情報を取得します。スケジュールやイベント情報も含むことを検討。
*   **認証:** 要 (アクセストークン、ただし公開旅程の場合は不要または別エンドポイント)
*   **パスパラメータ:**
    *   `tripId` (uuid, required): 旅行計画ID
*   **レスポンス (成功時):** `200 OK` (内容は3.2.のレスポンスと同様、またはスケジュール等を含むより詳細な情報)
*   **レスポンス (エラー時):**
    *   `401 Unauthorized`: 認証されていない（非公開旅程の場合）
    *   `403 Forbidden`: アクセス権がない（他人の非公開旅程など）
    *   `404 Not Found`: 指定された旅程が見つからない

### 3.4. 旅程更新

*   **エンドポイント:** `PUT /api/trips/{tripId}`
*   **説明:** 指定されたIDの旅行計画を更新します。
*   **認証:** 要 (アクセストークン)
*   **パスパラメータ:**
    *   `tripId` (uuid, required): 旅行計画ID
*   **リクエストボディ:** (3.2.のリクエストボディと同様の項目、全て任意)
*   **レスポンス (成功時):** `200 OK` (更新後の旅程情報)
*   **レスポンス (エラー時):**
    *   `400 Bad Request`: バリデーションエラー
    *   `401 Unauthorized`: 認証されていない
    *   `403 Forbidden`: 更新権限がない
    *   `404 Not Found`: 指定された旅程が見つからない

### 3.5. 旅程削除

*   **エンドポイント:** `DELETE /api/trips/{tripId}`
*   **説明:** 指定されたIDの旅行計画を削除します。
*   **認証:** 要 (アクセストークン)
*   **パスパラメータ:**
    *   `tripId` (uuid, required): 旅行計画ID
*   **レスポンス (成功時):** `204 No Content`
*   **レスポンス (エラー時):**
    *   `401 Unauthorized`: 認証されていない
    *   `403 Forbidden`: 削除権限がない
    *   `404 Not Found`: 指定された旅程が見つからない

---

## 4. 日毎スケジュール (Schedules)

特定の旅程に紐づく日毎のスケジュールを管理するAPI。

### 4.1. スケジュール一覧取得

*   **エンドポイント:** `GET /api/trips/{tripId}/schedules`
*   **説明:** 指定された旅行計画の日毎スケジュールの一覧を取得します。
*   **認証:** 要 (アクセストークン、公開旅程の場合は不要または別エンドポイント)
*   **パスパラメータ:**
    *   `tripId` (uuid, required): 旅行計画ID
*   **レスポンス (成功時):** `200 OK`
    ```json
    {
      "schedules": [
        {
          "id": "uuid",
          "trip_id": "uuid",
          "date": "date",
          "day_description": "text (nullable)",
          "created_at": "timestamp",
          "updated_at": "timestamp"
          // "events": [] // イベント情報も一緒に返すか検討
        }
        // ... 他のスケジュール
      ]
    }
    ```
*   **レスポンス (エラー時):**
    *   `401 Unauthorized`
    *   `403 Forbidden`
    *   `404 Not Found` (指定された旅程が見つからない)

### 4.2. スケジュール新規作成

*   **エンドポイント:** `POST /api/trips/{tripId}/schedules`
*   **説明:** 指定された旅行計画に新しい日毎スケジュールを追加します。
*   **認証:** 要 (アクセストークン)
*   **パスパラメータ:**
    *   `tripId` (uuid, required): 旅行計画ID
*   **リクエストボディ:**
    ```json
    {
      "date": "date (required)",
      "day_description": "text (optional, nullable)"
    }
    ```
*   **レスポンス (成功時):** `201 Created` (作成されたスケジュール情報)
*   **レスポンス (エラー時):**
    *   `400 Bad Request` (バリデーションエラー、例: 日付重複など)
    *   `401 Unauthorized`
    *   `403 Forbidden`
    *   `404 Not Found` (指定された旅程が見つからない)

### 4.3. 特定のスケジュールの詳細取得

*   **エンドポイント:** `GET /api/schedules/{scheduleId}` (または `GET /api/trips/{tripId}/schedules/{scheduleDateOrId}`)
*   **説明:** 指定されたIDの日毎スケジュールの詳細情報を取得します。イベント情報も含む。
*   **認証:** 要 (アクセストークン、公開旅程の場合は不要または別エンドポイント)
*   **レスポンス (成功時):** `200 OK` (スケジュール情報と、それに紐づくイベント一覧)
*   **レスポンス (エラー時):** `401`, `403`, `404`

### 4.4. スケジュール更新

*   **エンドポイント:** `PUT /api/schedules/{scheduleId}`
*   **説明:** 指定されたIDの日毎スケジュールを更新します (例: `day_description`, ホテル情報など)。
*   **認証:** 要 (アクセストークン)
*   **リクエストボディ:** 更新するフィールド (例: `{"day_description": "新しい説明"}`)
*   **レスポンス (成功時):** `200 OK` (更新後のスケジュール情報)
*   **レスポンス (エラー時):** `400`, `401`, `403`, `404`

### 4.5. スケジュール削除

*   **エンドポイント:** `DELETE /api/schedules/{scheduleId}`
*   **説明:** 指定されたIDの日毎スケジュールを削除します (関連するイベントもカスケード削除される想定)。
*   **認証:** 要 (アクセストークン)
*   **レスポンス (成功時):** `204 No Content`
*   **レスポンス (エラー時):** `401`, `403`, `404`

---

## 5. イベント (Events)

特定の日毎スケジュールに紐づくイベントを管理するAPI。

### 5.1. イベント一覧取得 (特定スケジュール内の)

*   **エンドポイント:** `GET /api/schedules/{scheduleId}/events`
*   **説明:** 指定された日毎スケジュール内のイベント一覧を取得します。
*   **認証:** 要 (アクセストークン、公開旅程の場合は不要または別エンドポイント)
*   **パスパラメータ:**
    *   `scheduleId` (uuid, required): 日毎スケジュールID
*   **レスポンス (成功時):** `200 OK`
    ```json
    {
      "events": [
        {
          "id": "uuid",
          "schedule_id": "uuid",
          "time": "time (nullable)",
          "name": "string",
          "category": "string (nullable)",
          "description": "text (nullable)",
          "location_name": "string (nullable)",
          // ... eventsテーブルの他のカラム
          "created_at": "timestamp",
          "updated_at": "timestamp"
        }
      ]
    }
    ```
*   **レスポンス (エラー時):** `401`, `403`, `404`

### 5.2. イベント新規作成

*   **エンドポイント:** `POST /api/schedules/{scheduleId}/events`
*   **説明:** 指定された日毎スケジュールに新しいイベントを追加します。
*   **認証:** 要 (アクセストークン)
*   **パスパラメータ:**
    *   `scheduleId` (uuid, required): 日毎スケジュールID
*   **リクエストボディ:** (イベントの各情報、`name` は必須)
    ```json
    {
      "time": "time (optional)",
      "name": "string (required)",
      "category": "string (optional)",
      // ... その他イベント情報
    }
    ```
*   **レスポンス (成功時):** `201 Created` (作成されたイベント情報)
*   **レスポンス (エラー時):** `400`, `401`, `403`, `404`

### 5.3. 特定イベントの詳細取得

*   **エンドポイント:** `GET /api/events/{eventId}`
*   **説明:** 指定されたIDのイベント詳細を取得します。
*   **認証:** 要 (アクセストークン、公開旅程の場合は不要または別エンドポイント)
*   **レスポンス (成功時):** `200 OK` (イベント情報)
*   **レスポンス (エラー時):** `401`, `403`, `404`

### 5.4. イベント更新

*   **エンドポイント:** `PUT /api/events/{eventId}`
*   **説明:** 指定されたIDのイベントを更新します。
*   **認証:** 要 (アクセストークン)
*   **リクエストボディ:** 更新するフィールド
*   **レスポンス (成功時):** `200 OK` (更新後のイベント情報)
*   **レスポンス (エラー時):** `400`, `401`, `403`, `404`

### 5.5. イベント削除

*   **エンドポイント:** `DELETE /api/events/{eventId}`
*   **説明:** 指定されたIDのイベントを削除します。
*   **認証:** 要 (アクセストークン)
*   **レスポンス (成功時):** `204 No Content`
*   **レスポンス (エラー時):** `401`, `403`, `404`

---

## 6. 思い出 (Memories)

特定のイベントまたは旅行全体に紐づく思い出（ノート、評価、メディアファイル情報など）を管理するAPI。

### 6.1. 特定イベントの思い出取得/作成/更新/削除

*   **エンドポイント:**
    *   `GET /api/events/{eventId}/memory` (取得)
    *   `POST /api/events/{eventId}/memory` (新規作成)
    *   `PUT /api/events/{eventId}/memory` (更新)
    *   `DELETE /api/events/{eventId}/memory` (削除)
*   **説明:** 特定のイベントに紐づく思い出を取得、作成、更新、または削除します。イベントに対して思い出は1つのみ存在すると仮定し、POSTは存在しない場合に作成、PUTは存在する場合に更新（なければ作成も可：upsert）、DELETEは削除。
*   **認証:** 要 (アクセストークン)
*   **パスパラメータ:**
    *   `eventId` (uuid, required): イベントID
*   **リクエストボディ (POST, PUT):**
    ```json
    {
      "notes": "text (optional, nullable)",
      "rating": "integer (optional, nullable, 1-5)",
      "photo_urls": ["string (url)", "..."], // 写真ファイルのURLリスト (任意)
      "video_urls": ["string (url)", "..."]  // 動画ファイルのURLリスト (任意)
    }
    ```
*   **レスポンス (GET, POST, PUT 成功時):** `200 OK` または `201 Created`
    ```json
    {
      "id": "uuid", // memory_id
      "event_id": "uuid",
      "trip_id": null, // イベントの思い出なのでtrip_idはnull
      "notes": "text (nullable)",
      "rating": "integer (nullable)",
      "photo_urls": [],
      "video_urls": [],
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
    ```
*   **レスポンス (DELETE 成功時):** `204 No Content`
*   **レスポンス (エラー時):** `400`, `401`, `403`, `404`

### 6.2. 特定の旅全体の思い出取得/作成/更新/削除

*   **エンドポイント:**
    *   `GET /api/trips/{tripId}/memory` (取得)
    *   `POST /api/trips/{tripId}/memory` (新規作成)
    *   `PUT /api/trips/{tripId}/memory` (更新)
    *   `DELETE /api/trips/{tripId}/memory` (削除)
*   **説明:** 特定の旅行全体に紐づく思い出を取得、作成、更新、または削除します。旅全体に対して思い出は1つのみ存在すると仮定。
*   **認証:** 要 (アクセストークン)
*   **パスパラメータ:**
    *   `tripId` (uuid, required): 旅行計画ID
*   **リクエストボディ (POST, PUT):** (6.1と同様)
*   **レスポンス (GET, POST, PUT 成功時):** `200 OK` または `201 Created` (6.1と同様、ただし `event_id` が `null`)
    *   **レスポンス (DELETE 成功時):** `204 No Content`
    *   **レスポンス (エラー時):** `400`, `401`, `403`, `404`

---

## 7. お気に入り場所 (Favorite Places)

ユーザーがお気に入りに登録した場所を管理するAPI。

### 7.1. お気に入り場所一覧取得

*   **エンドポイント:** `GET /api/favorites`
*   **説明:** 現在認証されているユーザーのお気に入り場所一覧を取得します。
*   **認証:** 要 (アクセストークン)
*   **レスポンス (成功時):** `200 OK`
    ```json
    {
      "favorite_places": [
        {
          "id": "uuid", // favorite_placesテーブルのID
          "user_id": "uuid",
          "place_id": "string", // Google Place IDなど
          "name": "string",
          "address": "string (nullable)",
          "category": "string (nullable)",
          "latitude": "decimal (nullable)",
          "longitude": "decimal (nullable)",
          "created_at": "timestamp"
        }
      ]
    }
    ```
*   **レスポンス (エラー時):** `401 Unauthorized`

### 7.2. お気に入り場所追加

*   **エンドポイント:** `POST /api/favorites`
*   **説明:** 新しい場所をお気に入りに追加します。
*   **認証:** 要 (アクセストークン)
*   **リクエストボディ:**
    ```json
    {
      "place_id": "string (required)", // Google Place IDなど
      "name": "string (required)",
      "address": "string (optional, nullable)",
      "category": "string (optional, nullable)",
      "latitude": "decimal (optional, nullable)",
      "longitude": "decimal (optional, nullable)"
    }
    ```
*   **レスポンス (成功時):** `201 Created` (作成されたお気に入り場所情報)
*   **レスポンス (エラー時):**
    *   `400 Bad Request` (バリデーションエラー、必須項目不足など)
    *   `401 Unauthorized`
    *   `409 Conflict` (既にお気に入り登録済みの場合)

### 7.3. お気に入り場所削除

*   **エンドポイント:** `DELETE /api/favorites/{favoritePlaceIdOrPlaceId}`
*   **説明:** 指定されたIDのお気に入り場所を削除します。パスパラメータは `favorite_places` テーブルの `id` または `place_id` のどちらかを使用できるようにするか、あるいは `place_id` のみをクエリパラメータで指定する形も考えられます。ここでは `favorite_places` テーブルの `id` を使うと仮定します。
*   **認証:** 要 (アクセストークン)
*   **パスパラメータ:**
    *   `favoritePlaceIdOrPlaceId` (uuid or string, required): `favorite_places` テーブルの `id`
*   **レスポンス (成功時):** `204 No Content`
*   **レスポンス (エラー時):** `401`, `403`, `404`

---

## 8. 公開旅程設定 (Public Trip Settings)

特定の旅程の公開設定を管理するAPI。

### 8.1. 公開旅程設定の取得/更新

*   **エンドポイント:**
    *   `GET /api/trips/{tripId}/publish-settings` (取得)
    *   `PUT /api/trips/{tripId}/publish-settings` (更新)
*   **説明:** 指定された旅行計画の公開設定を取得または更新します。`trips` テーブルの `is_public` が `true` の場合に意味を持ちます。
*   **認証:** 要 (アクセストークン、旅程の所有者であること)
*   **パスパラメータ:**
    *   `tripId` (uuid, required): 旅行計画ID
*   **リクエストボディ (PUT):**
    ```json
    {
      "public_description": "text (optional, nullable)",
      "overall_author_comment": "text (optional, nullable)",
      "publish_scope": "string (optional, default: 'public', enum: ['public', 'link_only'])",
      "include_photos": "string (optional, default: 'all', enum: ['all', 'selected', 'none'])",
      "include_videos": "string (optional, default: 'all', enum: ['all', 'selected', 'none'])",
      "include_notes": "string (optional, default: 'anonymized', enum: ['all', 'anonymized', 'none'])",
      "allow_comments": "boolean (optional, default: true)"
    }
    ```
*   **レスポンス (GET, PUT 成功時):** `200 OK`
    ```json
    {
      "trip_id": "uuid",
      "public_description": "text (nullable)",
      "overall_author_comment": "text (nullable)",
      "publish_scope": "string",
      "include_photos": "string",
      "include_videos": "string",
      "include_notes": "string",
      "allow_comments": "boolean",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
    ```
    もし設定が存在しない場合、GETは404を返すか、デフォルト設定を返すか検討。PUTの場合はなければ作成(upsert)。
    *   **レスポンス (エラー時):** `400`, `401`, `403`, `404`

---

## 9. タグ (Tags)

旅程などに付与するタグを管理するAPI。

### 9.1. タグ一覧取得

*   **エンドポイント:** `GET /api/tags`
*   **説明:** 利用可能なタグの一覧を取得します。
*   **認証:** 不要 (または任意)
*   **クエリパラメータ (任意):**
    *   `q` (string): タグ名で部分一致検索
*   **レスポンス (成功時):** `200 OK`
    ```json
    {
      "tags": [
        {
          "id": "uuid",
          "name": "string"
        }
      ]
    }
    ```

### 9.2. タグ新規作成 (管理者用または自動生成)

*   **エンドポイント:** `POST /api/tags`
*   **説明:** 新しいタグを作成します。管理者用APIとするか、ユーザーが自由に入力したタグを自動的に登録する仕組みにするか検討。
*   **認証:** 要 (管理者権限など)
*   **リクエストボディ:**
    ```json
    {
      "name": "string (required, unique)"
    }
    ```
*   **レスポンス (成功時):** `201 Created` (作成されたタグ情報)
*   **レスポンス (エラー時):** `400`, `401`, `403`, `409` (既に存在するタグ名)

### 9.3. 特定の旅程にタグを追加

*   **エンドポイント:** `POST /api/trips/{tripId}/tags`
*   **説明:** 指定された旅行計画にタグを関連付けます。
*   **認証:** 要 (アクセストークン、旅程の所有者であること)
*   **パスパラメータ:**
    *   `tripId` (uuid, required): 旅行計画ID
*   **リクエストボディ:**
    ```json
    {
      "tag_id": "uuid (required, tagsテーブルのID)" 
      // または "tag_name": "string (required, 新規タグも許可する場合)"
    }
    ```
*   **レスポンス (成功時):** `201 Created` (または `200 OK` で更新後の旅程のタグ一覧)
*   **レスポンス (エラー時):** `400`, `401`, `403`, `404` (旅程またはタグが見つからない), `409` (既に紐付いている)

### 9.4. 特定の旅程からタグを削除

*   **エンドポイント:** `DELETE /api/trips/{tripId}/tags/{tagId}`
*   **説明:** 指定された旅行計画から特定のタグの関連付けを解除します。
*   **認証:** 要 (アクセストークン、旅程の所有者であること)
*   **パスパラメータ:**
    *   `tripId` (uuid, required): 旅行計画ID
    *   `tagId` (uuid, required): タグID
*   **レスポンス (成功時):** `204 No Content`
    *   **レスポンス (エラー時):** `401`, `403`, `404`

---

## 10. コメント (Comments)

公開された旅程などに対するコメントを管理するAPI。

### 10.1. 特定の旅程のコメント一覧取得

*   **エンドポイント:** `GET /api/trips/{tripId}/comments`
*   **説明:** 指定された旅行計画に投稿されたコメントの一覧を取得します。スレッド形式を考慮し、親コメントとそれに対する返信を構造化して返すことを検討。
*   **認証:** 不要 (公開旅程のコメントは誰でも閲覧可能とする想定)
*   **パスパラメータ:**
    *   `tripId` (uuid, required): 旅行計画ID
*   **クエリパラメータ (任意):**
    *   `sortBy` (string): ソート順 (例: `createdAt_desc`, `createdAt_asc`)
    *   `limit` (integer): 取得件数
    *   `offset` (integer): スキップ件数
*   **レスポンス (成功時):** `200 OK`
    ```json
    {
      "comments": [
        {
          "id": "uuid",
          "user": { // 投稿者情報
            "id": "uuid",
            "nickname": "string",
            "avatar_url": "string (nullable)"
          },
          "trip_id": "uuid",
          "parent_comment_id": "uuid (nullable)",
          "body": "text",
          "created_at": "timestamp",
          "updated_at": "timestamp",
          "replies": [ // 返信コメント (再帰的に同じ構造)
            // ...
          ]
        }
      ],
      "total_count": "integer"
    }
    ```
*   **レスポンス (エラー時):** `404 Not Found` (旅程が見つからない、またはコメント機能が無効)

### 10.2. コメント投稿

*   **エンドポイント:** `POST /api/trips/{tripId}/comments`
*   **説明:** 指定された旅行計画に新しいコメントを投稿します。返信の場合は `parent_comment_id` を指定。
*   **認証:** 要 (アクセストークン)
*   **パスパラメータ:**
    *   `tripId` (uuid, required): 旅行計画ID
*   **リクエストボディ:**
    ```json
    {
      "body": "text (required)",
      "parent_comment_id": "uuid (optional, nullable)"
    }
    ```
*   **レスポンス (成功時):** `201 Created` (作成されたコメント情報)
*   **レスポンス (エラー時):** `400`, `401`, `403` (コメント投稿が許可されていないなど), `404`

### 10.3. コメント更新

*   **エンドポイント:** `PUT /api/comments/{commentId}`
*   **説明:** 指定されたIDのコメントを更新します。
*   **認証:** 要 (アクセストークン、コメントの投稿者であること)
*   **パスパラメータ:**
    *   `commentId` (uuid, required): コメントID
*   **リクエストボディ:**
    ```json
    {
      "body": "text (required)"
    }
    ```
*   **レスポンス (成功時):** `200 OK` (更新後のコメント情報)
*   **レスポンス (エラー時):** `400`, `401`, `403`, `404`

### 10.4. コメント削除

*   **エンドポイント:** `DELETE /api/comments/{commentId}`
*   **説明:** 指定されたIDのコメントを削除します。
*   **認証:** 要 (アクセストークン、コメントの投稿者または管理者であること)
*   **パスパラメータ:**
    *   `commentId` (uuid, required): コメントID
*   **レスポンス (成功時):** `204 No Content`
    *   **レスポンス (エラー時):** `401`, `403`, `404`

---

## 10. コメント (Comments)

公開された旅程などに対するコメントを管理するAPI。

### 10.1. 特定の旅程のコメント一覧取得

*   **エンドポイント:** `GET /api/trips/{tripId}/comments`
*   **説明:** 指定された旅行計画に投稿されたコメントの一覧を取得します。スレッド形式を考慮し、親コメントとそれに対する返信を構造化して返すことを検討。
*   **認証:** 不要 (公開旅程のコメントは誰でも閲覧可能とする想定)
*   **パスパラメータ:**
    *   `tripId` (uuid, required): 旅行計画ID
*   **クエリパラメータ (任意):**
    *   `sortBy` (string): ソート順 (例: `createdAt_desc`, `createdAt_asc`)
    *   `limit` (integer): 取得件数
    *   `offset` (integer): スキップ件数
*   **レスポンス (成功時):** `200 OK`
    ```json
    {
      "comments": [
        {
          "id": "uuid",
          "user": { // 投稿者情報
            "id": "uuid",
            "nickname": "string",
            "avatar_url": "string (nullable)"
          },
          "trip_id": "uuid",
          "parent_comment_id": "uuid (nullable)",
          "body": "text",
          "created_at": "timestamp",
          "updated_at": "timestamp",
          "replies": [ // 返信コメント (再帰的に同じ構造)
            // ...
          ]
        }
      ],
      "total_count": "integer"
    }
    ```
*   **レスポンス (エラー時):** `404 Not Found` (旅程が見つからない、またはコメント機能が無効)

### 10.2. コメント投稿

*   **エンドポイント:** `POST /api/trips/{tripId}/comments`
*   **説明:** 指定された旅行計画に新しいコメントを投稿します。返信の場合は `parent_comment_id` を指定。
*   **認証:** 要 (アクセストークン)
*   **パスパラメータ:**
    *   `tripId` (uuid, required): 旅行計画ID
*   **リクエストボディ:**
    ```json
    {
      "body": "text (required)",
      "parent_comment_id": "uuid (optional, nullable)"
    }
    ```
*   **レスポンス (成功時):** `201 Created` (作成されたコメント情報)
*   **レスポンス (エラー時):** `400`, `401`, `403` (コメント投稿が許可されていないなど), `404`

### 10.3. コメント更新

*   **エンドポイント:** `PUT /api/comments/{commentId}`
*   **説明:** 指定されたIDのコメントを更新します。
*   **認証:** 要 (アクセストークン、コメントの投稿者であること)
*   **パスパラメータ:**
    *   `commentId` (uuid, required): コメントID
*   **リクエストボディ:**
    ```json
    {
      "body": "text (required)"
    }
    ```
*   **レスポンス (成功時):** `200 OK` (更新後のコメント情報)
*   **レスポンス (エラー時):** `400`, `401`, `403`, `404`

### 10.4. コメント削除

*   **エンドポイント:** `DELETE /api/comments/{commentId}`
*   **説明:** 指定されたIDのコメントを削除します。
*   **認証:** 要 (アクセストークン、コメントの投稿者または管理者であること)
*   **パスパラメータ:**
    *   `commentId` (uuid, required): コメントID
*   **レスポンス (成功時):** `204 No Content`
*   **レスポンス (エラー時):** `401`, `403`, `404`

*(ここに他のAPI定義を追加していく)*
