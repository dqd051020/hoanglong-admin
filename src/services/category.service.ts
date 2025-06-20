import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { Category } from 'src/types/category.type';
import { API } from 'src/utils/API';
import { showToast, useGetParamsURL } from 'src/utils/helper';

export const useQueryCategoryList = () => {
  const paramsURL = useGetParamsURL();
  const { page } = paramsURL || {};

  const queryKey = ['GET_CATEGORY_LIST', page];

  return useQuery<Category[]>({
    queryKey,
    queryFn: () =>
      API.request({
        url: '/api/category/get-all',
        params: { pageSize: 10, pageNumber: page }
      })
  });
};

export const useCreateCategory = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (params: Record<string, unknown>) => {
      return API.request({
        url: '/api/category',
        method: 'POST',
        params
      })
        .then(() => {
          showToast({ type: 'success', message: 'Tạo danh mục thành công' });
          navigate(-1);
        })
        .catch((e) => {
          showToast({ type: 'error', message: `Thao tác thất bại. ${e?.message}` });
        });
    }
  });
};

export const useUpdateCategory = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (params: Record<string, unknown>) => {
      const { id, name, priority } = params;
      return API.request({
        url: `/api/category/${id}`,
        method: 'PATCH',
        params: { name, priority }
      })
        .then(() => {
          showToast({ type: 'success', message: 'Cập nhật danh mục thành công' });
          navigate(-1);
        })
        .catch((e) => {
          showToast({ type: 'error', message: `Thao tác thất bại. ${e?.message}` });
        });
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: Record<string, unknown>) => {
      const { id } = params;
      return API.request({
        url: `/api/category/${id}`,
        method: 'DELETE'
      })
        .then(() => {
          showToast({ type: 'success', message: 'Xoá danh mục thành công' });
          queryClient.resetQueries({ queryKey: ['GET_CATEGORY_LIST'] });
        })
        .catch((e) => {
          showToast({ type: 'error', message: `Thao tác thất bại. ${e.message}` });
        });
    }
  });
};

export const useQueryCategoryDetail = (id?: string) => {
  const queryKey = ['GET_CATEGORY_DETAIL', id];
  const queryClient = useQueryClient();
  const dataClient: Category | undefined = queryClient.getQueryData(queryKey);

  const { data, isLoading, error } = useQuery<Category>({
    queryKey,
    queryFn: () =>
      API.request({
        url: `/api/category/${id}`
      }),
    enabled: !!id
  });

  if (!isEmpty(dataClient)) {
    return { data: dataClient, isLoading: false, error: null };
  }
  return { data, isLoading, error };
};
