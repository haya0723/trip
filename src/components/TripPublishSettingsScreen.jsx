import React, { useState, useEffect } from 'react';

function TripPublishSettingsScreen({ trip, onSave, onCancel }) {
  const [publishSettings, setPublishSettings] = useState({
    publishScope: 'public', // 'public', 'link_only', 'private' (非公開はisPublic=falseで対応)
    includePhotos: 'all', // 'all', 'selected', 'none'
    includeVideos: 'all', // 'all', 'selected', 'none'
    includeNotes: 'anonymized', // 'all', 'anonymized', 'none' (anonymized: 個人情報マスク)
    // TODO: 将来的に公開する写真・動画を選択するUIが必要
  });

  useEffect(() => {
    if (trip && trip.publishSettings) {
      setPublishSettings(trip.publishSettings);
    } else if (trip) {
      // デフォルト設定を適用 (isPublicがtrueの場合)
      // isPublicがfalseの場合は、この画面は表示されないか、
      // isPublicをtrueにする操作と同時にこの設定を行うフローになる想定
      setPublishSettings({
        publishScope: 'public',
        includePhotos: 'all',
        includeVideos: 'all',
        includeNotes: 'anonymized',
      });
    }
  }, [trip]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPublishSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    onSave(trip.id, publishSettings);
  };

  if (!trip) {
    return <div>旅程情報がありません。</div>;
  }

  return (
    <div className="trip-publish-settings-screen modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '500px'}}>
        <h2>「{trip.name}」の公開設定</h2>
        
        <div className="form-group">
          <label htmlFor="publishScope">公開範囲:</label>
          <select name="publishScope" id="publishScope" value={publishSettings.publishScope} onChange={handleChange}>
            <option value="public">すべてのユーザーに公開</option>
            <option value="link_only">リンクを知っている人のみ</option>
            {/* <option value="private">非公開 (isPublicフラグで管理)</option> */}
          </select>
        </div>

        <div className="form-group">
          <label>公開する情報:</label>
          <div>
            <label htmlFor="includePhotos">写真:</label>
            <select name="includePhotos" id="includePhotos" value={publishSettings.includePhotos} onChange={handleChange}>
              <option value="all">すべて公開</option>
              <option value="selected">選択したもののみ公開 (未実装)</option>
              <option value="none">公開しない</option>
            </select>
          </div>
          <div>
            <label htmlFor="includeVideos">動画:</label>
            <select name="includeVideos" id="includeVideos" value={publishSettings.includeVideos} onChange={handleChange}>
              <option value="all">すべて公開</option>
              <option value="selected">選択したもののみ公開 (未実装)</option>
              <option value="none">公開しない</option>
            </select>
          </div>
          <div>
            <label htmlFor="includeNotes">メモ・感想:</label>
            <select name="includeNotes" id="includeNotes" value={publishSettings.includeNotes} onChange={handleChange}>
              <option value="all">すべて公開</option>
              <option value="anonymized">個人情報等をマスクして公開 (未実装)</option>
              <option value="none">公開しない</option>
            </select>
          </div>
          <p style={{fontSize: '0.8em', color: '#555'}}>
            注意: 個人を特定できる情報（予約番号、プライベートなメモなど）は、設定に関わらず自動的に非公開になります。
          </p>
        </div>

        {/* TODO: プレビュー機能のボタン */}
        {/* <button type="button" onClick={handlePreview} className="secondary-button">プレビュー</button> */}

        <div className="form-actions" style={{marginTop: '20px'}}>
          <button type="button" onClick={handleSave} className="primary-button">設定を保存して公開</button>
          <button type="button" onClick={onCancel} className="secondary-button" style={{marginLeft: '10px'}}>キャンセル</button>
        </div>
      </div>
    </div>
  );
}

export default TripPublishSettingsScreen;
