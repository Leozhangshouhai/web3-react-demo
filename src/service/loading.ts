const startLoading = () => {
  (document.getElementById('api-loading') as any).style.display = 'block';
};

const endLoading = () => {
  (document.getElementById('api-loading') as any).style.display = 'none';
};
let loadingCount = 0;
let timer: NodeJS.Timeout | null;
export const showLoading = () => {
  if (loadingCount === 0) {
    startLoading();
    timer && clearTimeout(timer);
  }
  loadingCount++;
};

export const hideLoading = () => {
  if (loadingCount <= 0) {
    return;
  }
  loadingCount--;
  if (loadingCount === 0) {
    timer = setTimeout(() => {
      endLoading();
      timer && clearTimeout(timer);
    }, 300);

  }
};