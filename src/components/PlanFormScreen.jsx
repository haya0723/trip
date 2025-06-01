import React, { useState, useEffect } from 'react';
// import './PlanFormScreen.css'; 

function PlanFormScreen({ currentPlan, onSave, onCancel, onShowPlaceSearch }) {
  const isEditMode = !!currentPlan;
  const [planName, setPlanName] = useState('');
  const [destinations, setDestinations] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('計画中'); 
  const [coverImageFile, setCoverImageFile] = useState(null); // ファイルオブジェクト用
  const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState(''); // プレビューURL用

  useEffect(() => {
    if (currentPlan) {
      setPlanName(currentPlan.name || '');
      const dates = currentPlan.period ? currentPlan.period.split(' - ') : ['', ''];
      setStartDate(dates[0].split(' (')[0]); 
      setEndDate(dates[1] ? dates[1].split(' (')[0] : ''); 
      setDestinations(currentPlan.destinations || '');
      setStatus(currentPlan.status || '計画中');
      setCoverImageFile(null); // 編集時はファイルをリセット
      setCoverImagePreviewUrl(currentPlan.coverImage || ''); // 既存の画像URLをプレビューに
    } else {
      setPlanName('');
      setStartDate('');
      setEndDate('');
      setDestinations('');
      setStatus('計画中');
      setCoverImageFile(null);
      setCoverImagePreviewUrl('');
    }
  }, [currentPlan]);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImageFile(null);
      setCoverImagePreviewUrl(currentPlan?.coverImage || ''); // ファイル選択がキャンセルされたら元の画像に戻す（または空に）
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 簡単な期間文字列生成ロジック（泊数計算は省略）
    let periodString = '';
    if (startDate && endDate) {
      periodString = `${startDate} - ${endDate}`;
      // 必要であれば泊数計算を追加
    } else if (startDate) {
      periodString = `${startDate} - (終了日未定)`;
    } else if (endDate) {
      periodString = `(開始日未定) - ${endDate}`;
    }

    const formData = {
      name: planName,
      destinations: destinations,
      period: periodString,
      status: status, 
      // coverImageFile があればそれ（のDataURL）、なければ既存のURL（編集時）または空文字
      coverImage: coverImagePreviewUrl, // DataURLまたは既存URLを渡す
    };
    // ファイル自体を渡す場合は別途処理が必要 (例: onSave({ ...formData, coverImageFile }) )
    // 今回はDataURLをcoverImageとして扱う
    if (isEditMode) {
      onSave({ ...currentPlan, ...formData }); // coverImageFile は渡さない
    } else {
      onSave({ ...formData, id: Date.now() }); // status は formData に含まれるので不要
    }
  };

  return (
    <div className="plan-form-screen">
      <header className="app-header">
        <h1>{isEditMode ? '計画を編集' : '新しい計画を作成'}</h1>
        <div>
          <button type="button" onClick={onCancel} className="cancel-button">キャンセル</button>
          <button type="submit" form="plan-form" className="save-button">保存</button>
        </div>
      </header>
      <form id="plan-form" onSubmit={handleSubmit} className="plan-form">
        <div className="form-section">
          <label htmlFor="planName">計画名</label>
          <input type="text" id="planName" value={planName} onChange={(e) => setPlanName(e.target.value)} required />
        </div>
        <div className="form-section">
          <label htmlFor="destinations">目的地</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input 
              type="text" 
              id="destinations" 
              value={destinations} 
              onChange={(e) => setDestinations(e.target.value)} 
              placeholder="例: 東京、京都" 
              style={{ flexGrow: 1, marginRight: '10px' }}
            />
            {/* onShowPlaceSearch が渡されていれば検索ボタンを表示 */}
            {onShowPlaceSearch && <button type="button" onClick={() => onShowPlaceSearch(setDestinations)} className="search-destination-button">検索</button>}
          </div>
        </div>
        <div className="form-section">
          <label htmlFor="startDate">開始日</label>
          <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="form-section">
          <label htmlFor="endDate">終了日</label>
          <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="form-section">
          <label htmlFor="coverImageFile">カバー画像</label>
          <input type="file" id="coverImageFile" accept="image/*" onChange={handleCoverImageChange} />
          {coverImagePreviewUrl && (
            <div style={{ marginTop: '10px' }}>
              <img src={coverImagePreviewUrl} alt="カバー画像プレビュー" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }} />
            </div>
          )}
        </div>
        <div className="form-section">
          <label htmlFor="status">ステータス</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="計画中">計画中</option>
            <option value="予約済み">予約済み</option>
            <option value="旅行中">旅行中</option>
            <option value="完了">完了</option>
            <option value="キャンセル">キャンセル</option>
          </select>
        </div>
        {isEditMode && (
          <button type="button" onClick={() => console.log('削除処理未実装')} className="delete-plan-button">この計画を削除</button>
        )}
      </form>
    </div>
  );
}

export default PlanFormScreen;
