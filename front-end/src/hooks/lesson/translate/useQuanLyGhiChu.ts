import { useState } from "react";

// Hook quản lý ghi chú cá nhân cho mỗi câu
interface GhiChuState {
  [key: number]: string; // key: câu index, value: nội dung ghi chú
}

export const useQuanLyGhiChu = () => {
  const [ghiChuCacCau, setGhiChuCacCau] = useState<GhiChuState>({});

  // Lưu ghi chú
  const luuGhiChu = (index: number, noiDung: string) => {
    setGhiChuCacCau(prev => ({
      ...prev,
      [index]: noiDung
    }));
  };

  // Lấy ghi chú
  const layGhiChu = (index: number) => {
    return ghiChuCacCau[index] || "";
  };

  // Xóa ghi chú
  const xoaGhiChu = (index: number) => {
    setGhiChuCacCau(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  // Kiểm tra có ghi chú không
  const coGhiChu = (index: number) => {
    return !!ghiChuCacCau[index];
  };

  // Xóa tất cả ghi chú
  const xoaTatCaGhiChu = () => {
    setGhiChuCacCau({});
  };

  return {
    ghiChuCacCau,
    luuGhiChu,
    layGhiChu,
    xoaGhiChu,
    coGhiChu,
    xoaTatCaGhiChu
  };
};

export default useQuanLyGhiChu;