# 下載文件放置說明

1. 所有提供下載的文件請放在 `public/downloads`。
2. 檔名建議使用英文、數字和連字號，例如 `application-form.pdf`。
3. 不建議使用空格或特殊符號，避免不同瀏覽器或系統解析路徑時出錯。
4. 上傳檔案後，要在 `src/data/downloadFiles.js` 新增對應資料。
5. `fileName` 必須與實際檔名完全一致，包含副檔名大小寫。
6. GitHub Pages 需要正確處理 base path；頁面下載連結會使用 `import.meta.env.BASE_URL` 組出 `/mobile-office/downloads/檔名`。
