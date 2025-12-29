import { useEffect, RefObject } from 'react';

/**
 * 외부 클릭을 감지하는 커스텀 훅
 * @param ref - 참조할 요소의 ref
 * @param isOpen - 드롭다운이 열려있는지 여부
 * @param onClose - 외부 클릭 시 호출할 콜백 함수
 */
export function useClickOutside(
  ref: RefObject<HTMLElement>,
  isOpen: boolean,
  onClose: () => void
) {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (ref.current && !ref.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, ref, onClose]);
}

/**
 * 여러 요소를 참조하는 외부 클릭 감지 훅
 * @param refs - 참조할 요소들의 ref 객체 (Record<string, HTMLElement | null>)
 * @param openId - 현재 열려있는 요소의 ID
 * @param onClose - 외부 클릭 시 호출할 콜백 함수
 */
export function useMultipleClickOutside(
  refs: RefObject<Record<string, HTMLElement | null>>,
  openId: string | null,
  onClose: () => void
) {
  useEffect(() => {
    if (!openId) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdownRef = refs.current?.[openId];

      if (dropdownRef && !dropdownRef.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openId, refs, onClose]);
}


