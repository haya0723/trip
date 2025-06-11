import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios'; // axios をインポート
// import './PlanFormScreen.css'; 

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'; // 環境変数から読み込み、なければローカル

function PlanFormScreen({ currentPlan, onSave, onCancel, onShowPlaceSearch, currentUser }) { // currentUser を props に追加
  const isEditMode = !!currentPlan;
  const [planName, setPlanName] = useState('');
  const [destinations, setDestinations] = useState('');
  const [startDate, setStartDate] = useState(null); // Dateオブジェクトまたはnull
  const [endDate, setEndDate] = useState(null);   // Dateオブジェクトまたはnull
  const [status, setStatus] = useState('計画中'); 
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState('');

  useEffect(() => {
    if (currentPlan) {
      setPlanName(currentPlan.name || '');
      // period (YYYY-MM-DD - YYYY-MM-DD) から Date オブジェクトへ
      if (currentPlan.start_date) setStartDate(new Date(currentPlan.start_date));
      if (currentPlan.end_date) setEndDate(new Date(currentPlan.end_date));
      setDestinations(currentPlan.destinations || '');
      setStatus(currentPlan.status || '計画中');
      setCoverImageFile(null); 
      setCoverImagePreviewUrl(currentPlan.cover_image_url || ''); 
    } else {
      setPlanName('');
      setStartDate(null);
      setEndDate(null);
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
      setCoverImagePreviewUrl(currentPlan?.cover_image_url || ''); 
    }
  };

  const formatDateForBackend = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const handleSubmit = async (e) => { // async に変更
    e.preventDefault();

    let finalCoverImageUrl = coverImagePreviewUrl;

    if (coverImageFile) {
      // 新しいカバー画像ファイルが選択されている場合、アップロード処理を行う
      if (!currentUser || !currentUser.token) {
        alert('画像アップロードのためにはログインが必要です。');
        return;
      }
      const imageFormData = new FormData();
      imageFormData.append('mediaFile', coverImageFile);

      try {
        const uploadResponse = await axios.post(`${BACKEND_URL}/api/upload/media`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        finalCoverImageUrl = uploadResponse.data.fileUrl; // アップロードされたファイルのURLを使用
      } catch (uploadError) {
        console.error('カバー画像のアップロードに失敗しました:', uploadError);
        alert(`カバー画像のアップロードに失敗しました: ${uploadError.response?.data?.error || uploadError.message}`);
        return; // アップロード失敗時は保存処理を中断
      }
    } else if (!coverImagePreviewUrl && isEditMode && currentPlan?.cover_image_url) {
      // ファイルが選択されておらず、プレビューもなく、編集モードで元々URLがあったがクリアされた場合
      // (例えばユーザーが既存画像を「削除」したい意図の場合。UIが別途必要だが、ここではURLをnullにする)
      // ただし、現在のUIでは明示的な削除がないため、この分岐は現状あまり意味がないかもしれない。
      // もし既存画像を維持したい場合は、この分岐は不要で、useEffectでセットされた currentPlan.cover_image_url が使われる。
      // ここでは、もし coverImagePreviewUrl が意図的に空にされたら、それを反映する。
      finalCoverImageUrl = null; 
    }


    const planDataToSave = {
      name: planName,
      destinations: destinations,
      start_date: formatDateForBackend(startDate),
      end_date: formatDateForBackend(endDate),
      status: status,
      cover_image_url: finalCoverImageUrl,
    };

    if (isEditMode) {
      onSave({ ...currentPlan, ...planDataToSave });
    } else {
      onSave(planDataToSave);
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
            {onShowPlaceSearch && <button type="button" onClick={() => onShowPlaceSearch(setDestinations)} className="search-destination-button">検索</button>}
          </div>
        </div>
        <div className="form-section">
          <label htmlFor="startDate">開始日</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy/MM/dd"
            placeholderText="開始日を選択"
            className="date-picker-input"
          />
        </div>
        <div className="form-section">
          <label htmlFor="endDate">終了日</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy/MM/dd"
            placeholderText="終了日を選択"
            className="date-picker-input"
          />
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
