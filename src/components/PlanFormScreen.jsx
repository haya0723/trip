import React, { useState } from 'react';
// App.css は App.jsx でインポートされているので、ここでは不要か、
// もしコンポーネント固有のスタイルがあれば別途 PlanFormScreen.css を作成してインポート
// import './PlanFormScreen.css'; 

function PlanFormScreen({ currentPlan, onSave, onCancel, onShowPlaceSearch }) { // onShowPlaceSearch を props に追加
  const isEditMode = !!currentPlan;
  const [planName, setPlanName] = useState(isEditMode ? currentPlan.name : '');
  const [destinations, setDestinations] = useState(isEditMode ? currentPlan.destinations : '');
  const [startDate, setStartDate] = useState(isEditMode ? currentPlan.period?.split(' - ')[0] : '');
  const [endDate, setEndDate] = useState(isEditMode ? currentPlan.period?.split(' - ')[1]?.split(' (')[0] : '');
  // 他のフォーム要素のstateも同様に初期化

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: planName,
      destinations: destinations,
      period: `${startDate} - ${endDate}`, // 簡単な期間文字列生成
      // ... 他のフォームデータ
    };
    if (isEditMode) {
      onSave({ ...currentPlan, ...formData });
    } else {
      // 新規作成時はIDなどをバックエンドで採番想定だが、ここではダミーID
      onSave({ ...formData, id: Date.now(), status: '計画中' }); 
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
            <button type="button" onClick={onShowPlaceSearch} className="search-destination-button">検索</button>
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
        {/* 他のフォームセクション（参加者、予算、テーマなど）をここに追加 */}
        {isEditMode && (
          <button type="button" onClick={() => console.log('削除処理未実装')} className="delete-plan-button">この計画を削除</button>
        )}
      </form>
    </div>
  );
}

export default PlanFormScreen;
