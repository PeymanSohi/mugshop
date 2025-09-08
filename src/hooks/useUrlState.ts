import { useState, useEffect } from 'react';

interface UrlState {
  search?: string;
  category?: string;
  sort?: string;
  page?: string;
}

export function useUrlState() {
  const [urlState, setUrlState] = useState<UrlState>(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      search: params.get('search') || '',
      category: params.get('category') || 'همه',
      sort: params.get('sort') || 'popularity',
      page: params.get('page') || '1'
    };
  });

  const updateUrl = (newState: Partial<UrlState>) => {
    const updatedState = { ...urlState, ...newState };
    setUrlState(updatedState);

    const params = new URLSearchParams();
    if (updatedState.search) params.set('search', updatedState.search);
    if (updatedState.category && updatedState.category !== 'همه') params.set('category', updatedState.category);
    if (updatedState.sort && updatedState.sort !== 'popularity') params.set('sort', updatedState.sort);
    if (updatedState.page && updatedState.page !== '1') params.set('page', updatedState.page);

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.pushState({}, '', newUrl);
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setUrlState({
        search: params.get('search') || '',
        category: params.get('category') || 'همه',
        sort: params.get('sort') || 'popularity',
        page: params.get('page') || '1'
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return { urlState, updateUrl };
}
