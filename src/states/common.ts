import Cookies from 'js-cookie';
import { DefaultValue, atom, selector } from 'recoil';
import { User } from 'src/types/user.type';

export const CK_JWT_TOKEN = 'token';

const tokenAtom = atom<string | undefined>({
  key: 'TOKEN_ATOM',
  default: new Promise((resolve) => {
    const token = Cookies.get(CK_JWT_TOKEN);
    resolve(token);
  })
});

export const tokenState = selector({
  key: 'TOKEN_SELECTOR',
  get: ({ get }) => get(tokenAtom),
  set: ({ set }, newValue) => {
    set(tokenAtom, newValue);
    if (!newValue || newValue instanceof DefaultValue) {//nếu sai token moí hoặc gia trị mặc dinh thi xóa
      Cookies.remove(CK_JWT_TOKEN);
      return;
    }
    Cookies.set(CK_JWT_TOKEN, newValue, { expires: 60, secure: true });// luu vào cooki trong 60ph và bao mật
  }
});

export const userInfoAtom = atom<User | undefined>({
  key: 'USER_INFO_ATOM',
  default: undefined
});
